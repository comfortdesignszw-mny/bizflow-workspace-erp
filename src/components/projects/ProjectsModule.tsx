import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  KanbanSquare,
  Plus,
  Clock,
  DollarSign,
  Users,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Layers,
  Sparkles,
  X,
  ChevronRight,
  TrendingUp,
  Building2,
  PlayCircle,
  PauseCircle,
  CheckCircle,
  HelpCircle,
  BarChart3,
  Filter,
  Search,
  ArrowRight,
  Edit2,
  Trash2,
  Briefcase,
  Target,
  FileText,
  PieChart,
  Sliders,
  CheckSquare,
  Square
} from 'lucide-react';
import { Project, ProjectStage, ProjectPriority, Task, TaskPriority } from '../../types/erp';

const STAGE_CONFIG: Record<ProjectStage, { label: string; color: string; bg: string; border: string; icon: any }> = {
  'Planning': {
    label: 'Planning',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    icon: HelpCircle
  },
  'In Progress': {
    label: 'In Progress',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: PlayCircle
  },
  'Paused': {
    label: 'Paused',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    icon: PauseCircle
  },
  'Finished': {
    label: 'Finished',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    icon: CheckCircle
  }
};

const TASK_COLUMNS = [
  { status: 'Backlog' as const, label: 'Backlog', color: 'bg-neutral-800 text-neutral-300' },
  { status: 'Todo' as const, label: 'To Do', color: 'bg-blue-500/20 text-blue-300 border border-blue-500/30' },
  { status: 'In Progress' as const, label: 'In Progress', color: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' },
  { status: 'Review' as const, label: 'Code Review', color: 'bg-purple-500/20 text-purple-300 border border-purple-500/30' },
  { status: 'Done' as const, label: 'Completed', color: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' }
];

export const ProjectsModule: React.FC = () => {
  const {
    projects,
    tasks,
    employees,
    addProject,
    updateProject,
    updateProjectStage,
    deleteProject,
    addTask,
    updateTaskStatus
  } = useERP();

  const [activeTab, setActiveTab] = useState<'projects' | 'kanban'>('projects');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('ALL');
  const [detailProject, setDetailProject] = useState<Project | null>(null);

  // Add / Edit Project Modal State
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  // New/Edit Project Form
  const [projForm, setProjForm] = useState({
    title: '',
    department: 'Engineering',
    description: '',
    client: 'Internal Enterprise',
    leadId: employees[0]?.id || '',
    leadName: employees[0] ? `${employees[0].firstName} ${employees[0].lastName}` : 'Lead Architect',
    budget: 85000,
    budgetReceived: 60000,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Planning' as ProjectStage,
    priority: 'HIGH' as ProjectPriority,
    progressPercent: 15,
    milestones: [
      { id: 'm1', title: 'Architecture & Schema Signoff', completed: true, dueDate: '2026-08-30' },
      { id: 'm2', title: 'Core Implementation Sprint', completed: false, dueDate: '2026-09-30' },
      { id: 'm3', title: 'QA Security & Enterprise Delivery', completed: false, dueDate: '2026-10-31' }
    ]
  });

  // New Task Form
  const [newTask, setNewTask] = useState({
    projectId: projects[0]?.id || '',
    title: '',
    description: '',
    assigneeId: employees[0]?.id || '',
    assigneeName: employees[0] ? `${employees[0].firstName} ${employees[0].lastName}` : '',
    priority: 'MEDIUM' as TaskPriority,
    status: 'Todo' as Task['status'],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    estimatedHours: 16
  });

  // Department List
  const departments = ['ALL', 'Engineering', 'Human Resources', 'Finance & Accounting', 'Product & Design', 'Sales & Growth', 'Operations & Logistics', 'Quality & Compliance'];

  // Open modal for new project
  const handleOpenNewProjectModal = () => {
    setEditingProject(null);
    setProjForm({
      title: '',
      department: 'Engineering',
      description: '',
      client: 'Internal Enterprise',
      leadId: employees[0]?.id || '',
      leadName: employees[0] ? `${employees[0].firstName} ${employees[0].lastName}` : 'Lead Architect',
      budget: 85000,
      budgetReceived: 60000,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Planning',
      priority: 'HIGH',
      progressPercent: 15,
      milestones: [
        { id: 'm1', title: 'Requirements & Scope Finalization', completed: true, dueDate: '2026-08-30' },
        { id: 'm2', title: 'Sprint Delivery & Core Build', completed: false, dueDate: '2026-09-30' },
        { id: 'm3', title: 'User Acceptance Testing & Go-Live', completed: false, dueDate: '2026-10-31' }
      ]
    });
    setIsAddProjectModalOpen(true);
  };

  // Open modal for editing existing project
  const handleOpenEditProjectModal = (proj: Project) => {
    setEditingProject(proj);
    setProjForm({
      title: proj.title,
      department: proj.department || 'Engineering',
      description: proj.description || '',
      client: proj.client || 'Internal Enterprise',
      leadId: proj.leadId || (employees[0]?.id || ''),
      leadName: proj.leadName || '',
      budget: proj.budget || 0,
      budgetReceived: proj.budgetReceived || 0,
      startDate: proj.startDate || '',
      endDate: proj.endDate || proj.dueDate || '',
      status: proj.status,
      priority: proj.priority || 'MEDIUM',
      progressPercent: proj.progressPercent || 0,
      milestones: proj.milestones || []
    });
    setIsAddProjectModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projForm.title) return;

    const lead = employees.find(e => e.id === projForm.leadId);
    const leadName = lead ? `${lead.firstName} ${lead.lastName}` : projForm.leadName;

    if (editingProject) {
      updateProject(editingProject.id, {
        ...projForm,
        leadName,
        dueDate: projForm.endDate
      });
      if (detailProject && detailProject.id === editingProject.id) {
        setDetailProject({
          ...detailProject,
          ...projForm,
          leadName,
          dueDate: projForm.endDate
        });
      }
    } else {
      addProject({
        ...projForm,
        leadName,
        dueDate: projForm.endDate
      });
    }

    setIsAddProjectModalOpen(false);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;
    const assignee = employees.find(e => e.id === newTask.assigneeId);
    addTask({
      ...newTask,
      assigneeName: assignee ? `${assignee.firstName} ${assignee.lastName}` : newTask.assigneeName
    });
    setIsAddTaskModalOpen(false);
  };

  const toggleMilestone = (project: Project, milestoneId: string) => {
    const updatedMilestones = (project.milestones || []).map(m =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    const completedCount = updatedMilestones.filter(m => m.completed).length;
    const newProgress = updatedMilestones.length > 0 ? Math.round((completedCount / updatedMilestones.length) * 100) : project.progressPercent;
    
    updateProject(project.id, {
      milestones: updatedMilestones,
      progressPercent: newProgress,
      status: newProgress === 100 ? 'Finished' : (project.status === 'Finished' ? 'In Progress' : project.status)
    });

    if (detailProject && detailProject.id === project.id) {
      setDetailProject({
        ...detailProject,
        milestones: updatedMilestones,
        progressPercent: newProgress
      });
    }
  };

  // Filtered Projects
  const filteredProjects = projects.filter(proj => {
    const matchesSearch = `${proj.title} ${proj.code} ${proj.department || ''} ${proj.leadName} ${proj.description || ''}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === 'ALL' || proj.status === stageFilter;
    const matchesDept = deptFilter === 'ALL' || (proj.department || 'Engineering') === deptFilter;
    return matchesSearch && matchesStage && matchesDept;
  });

  // Calculate Metrics
  const totalAllocatedBudget = projects.reduce((acc, p) => acc + (p.budget || 0), 0);
  const totalBudgetReceived = projects.reduce((acc, p) => acc + (p.budgetReceived || 0), 0);
  const totalSpentBudget = projects.reduce((acc, p) => acc + (p.spent || 0), 0);
  const stageCounts = {
    Planning: projects.filter(p => p.status === 'Planning').length,
    'In Progress': projects.filter(p => p.status === 'In Progress').length,
    Paused: projects.filter(p => p.status === 'Paused').length,
    Finished: projects.filter(p => p.status === 'Finished').length
  };

  const filteredTasks = tasks.filter(t => selectedProjectId === 'ALL' || t.projectId === selectedProjectId);

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto" id="projects-module-view">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-900/80 p-6 rounded-2xl border border-neutral-800 backdrop-blur-xs shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <KanbanSquare className="w-6 h-6 text-blue-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">Project Management & Stage Tracking</h1>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Department-linked project lifecycle governance, budget allocation vs received, deliverable milestones, and sprint execution.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Module View Toggle */}
          <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'projects' ? 'bg-blue-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Projects Portfolio
            </button>
            <button
              onClick={() => setActiveTab('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'kanban' ? 'bg-blue-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Sprint Kanban
            </button>
          </div>

          <button
            onClick={() => setIsAddTaskModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-all cursor-pointer"
            id="btn-create-task"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Task</span>
          </button>
          <button
            onClick={handleOpenNewProjectModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer"
            id="btn-new-project"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects & Stages Breakdown */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="font-semibold">Projects Portfolio</span>
            <Briefcase className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{projects.length}</span>
            <span className="text-xs text-neutral-400">Total Initiatives</span>
          </div>
          <div className="flex items-center gap-1.5 pt-1 text-[11px] font-mono">
            <span className="text-amber-400">{stageCounts.Planning} Plan</span> •
            <span className="text-blue-400">{stageCounts['In Progress']} Active</span> •
            <span className="text-emerald-400">{stageCounts.Finished} Done</span>
          </div>
        </div>

        {/* Budget Allocation */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="font-semibold">Total Budget Allocated</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">${totalAllocatedBudget.toLocaleString()}</span>
          </div>
          <p className="text-[11px] text-neutral-400">Authorized project ceilings</p>
        </div>

        {/* Budget Received */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="font-semibold">Budget Received (Funded)</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-300 font-mono">${totalBudgetReceived.toLocaleString()}</span>
            <span className="text-[10px] text-emerald-400 font-mono">
              ({totalAllocatedBudget > 0 ? Math.round((totalBudgetReceived / totalAllocatedBudget) * 100) : 0}% funded)
            </span>
          </div>
          <p className="text-[11px] text-neutral-400">Disbursed cash to project accounts</p>
        </div>

        {/* Actual Spent & Burn */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="font-semibold">Actual Burn / Spent</span>
            <PieChart className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-300 font-mono">${totalSpentBudget.toLocaleString()}</span>
            <span className="text-[10px] text-neutral-400 font-mono">
              ({totalBudgetReceived > 0 ? Math.round((totalSpentBudget / totalBudgetReceived) * 100) : 0}% consumed)
            </span>
          </div>
          <p className="text-[11px] text-neutral-400">Cumulative resource burn</p>
        </div>
      </div>

      {/* Main View Area */}
      {activeTab === 'projects' ? (
        <div className="space-y-6">
          
          {/* Filters & Stage Selector Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-neutral-900 p-4 rounded-2xl border border-neutral-800 text-xs">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects by title, ID (PRJ-801), department, lead..."
                className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl pl-9 pr-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                id="input-project-search"
              />
            </div>

            {/* Stage Filter */}
            <div>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                id="select-project-stage-filter"
              >
                <option value="ALL">All Project Stages</option>
                <option value="Planning">Stage: Planning</option>
                <option value="In Progress">Stage: In Progress</option>
                <option value="Paused">Stage: Paused</option>
                <option value="Finished">Stage: Finished</option>
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                id="select-project-dept-filter"
              >
                {departments.map(d => (
                  <option key={d} value={d}>{d === 'ALL' ? 'All Linked Departments' : `Dept: ${d}`}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Projects Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((proj) => {
              const stageInfo = STAGE_CONFIG[proj.status] || STAGE_CONFIG['Planning'];
              const StageIcon = stageInfo.icon;
              const fundingPct = Math.round(((proj.budgetReceived || 0) / (proj.budget || 1)) * 100);
              const burnPct = Math.round(((proj.spent || 0) / (proj.budget || 1)) * 100);

              return (
                <div
                  key={proj.id}
                  className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4 shadow-sm group"
                  id={`project-card-${proj.code}`}
                >
                  {/* Top Bar: Code, Dept Badge & Stage Dropdown */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950/60 border border-blue-800/40 px-2 py-0.5 rounded">
                          {proj.code}
                        </span>
                        <span className="text-[10px] text-neutral-300 bg-neutral-800 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                          <Building2 className="w-3 h-3 text-neutral-400" />
                          <span>{proj.department || 'Engineering'}</span>
                        </span>
                      </div>

                      {/* Interactive Stage Badge & Stepper */}
                      <div className="relative">
                        <select
                          value={proj.status}
                          onChange={(e) => updateProjectStage(proj.id, e.target.value as ProjectStage)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border appearance-none pr-6 cursor-pointer focus:outline-none ${stageInfo.bg} ${stageInfo.color} ${stageInfo.border}`}
                          title="Change Project Stage"
                        >
                          <option value="Planning" className="bg-neutral-900 text-amber-400">Planning</option>
                          <option value="In Progress" className="bg-neutral-900 text-blue-400">In Progress</option>
                          <option value="Paused" className="bg-neutral-900 text-rose-400">Paused</option>
                          <option value="Finished" className="bg-neutral-900 text-emerald-400">Finished</option>
                        </select>
                        <ChevronRight className="w-3.5 h-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none rotate-90 text-neutral-400" />
                      </div>
                    </div>

                    {/* Project Title & Description */}
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors leading-snug">
                        {proj.title}
                      </h3>
                      {proj.description && (
                        <p className="text-xs text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                          {proj.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Dates & Timeline */}
                  <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800/60 text-[11px] text-neutral-300 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-blue-400" />
                        <span>Start Date:</span>
                      </span>
                      <span className="font-mono text-white font-medium">{proj.startDate || '2026-08-01'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>End Date:</span>
                      </span>
                      <span className="font-mono text-white font-medium">{proj.endDate || proj.dueDate || '2026-11-30'}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-neutral-800/60">
                      <span className="text-neutral-500">Project Lead:</span>
                      <span className="font-semibold text-neutral-200">{proj.leadName}</span>
                    </div>
                  </div>

                  {/* Financial Tracker: Allocation vs Received */}
                  <div className="space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800">
                        <span className="text-neutral-500 block text-[10px] uppercase">Allocated:</span>
                        <span className="text-white font-bold">${(proj.budget || 0).toLocaleString()}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800">
                        <span className="text-neutral-500 block text-[10px] uppercase">Received:</span>
                        <span className="text-emerald-400 font-bold">${(proj.budgetReceived || 0).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-neutral-400 font-mono">
                        <span>Progress: {proj.progressPercent}%</span>
                        <span>Burn: ${(proj.spent || 0).toLocaleString()}</span>
                      </div>
                      <div className="h-2 w-full bg-neutral-950 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            proj.status === 'Finished' ? 'bg-emerald-500' :
                            proj.status === 'Paused' ? 'bg-rose-500' :
                            'bg-gradient-to-r from-blue-500 to-indigo-500'
                          }`}
                          style={{ width: `${proj.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions & Detail CTA */}
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-800/80 text-xs">
                    <button
                      onClick={() => setDetailProject(proj)}
                      className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Project Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditProjectModal(proj)}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete project ${proj.title}?`)) {
                            deleteProject(proj.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-900/40 text-neutral-400 hover:text-rose-300 transition-colors cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Task Kanban Board */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-neutral-900 p-4 rounded-2xl border border-neutral-800">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-bold text-white">Sprint Deliverable Tasks</h3>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white"
              >
                <option value="ALL">All Projects Tasks</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.code} - {p.title}</option>
                ))}
              </select>
            </div>
            <span className="text-xs text-neutral-400 font-mono">{filteredTasks.length} tasks in active backlog</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
            {TASK_COLUMNS.map(col => {
              const colTasks = filteredTasks.filter(t => t.status === col.status);

              return (
                <div key={col.status} className="bg-neutral-950/80 rounded-2xl border border-neutral-800/80 p-3 space-y-3 min-w-[220px]">
                  <div className="flex justify-between items-center px-1 pb-2 border-b border-neutral-800">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${col.color}`}>
                      {col.label}
                    </span>
                    <span className="text-xs font-mono text-neutral-500 font-semibold">{colTasks.length}</span>
                  </div>

                  <div className="space-y-2.5 min-h-[300px]">
                    {colTasks.map(task => {
                      const parentProject = projects.find(p => p.id === task.projectId);

                      return (
                        <div
                          key={task.id}
                          className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all space-y-2 text-xs shadow-sm"
                        >
                          {parentProject && (
                            <span className="text-[10px] font-mono text-blue-400 bg-blue-950/50 px-1.5 py-0.5 rounded">
                              {parentProject.code}
                            </span>
                          )}

                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-white leading-tight">{task.title}</h4>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                              task.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                              task.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-400' :
                              'bg-neutral-800 text-neutral-400'
                            }`}>
                              {task.priority}
                            </span>
                          </div>

                          <p className="text-[11px] text-neutral-400 line-clamp-2">{task.description}</p>

                          <div className="flex justify-between items-center pt-2 border-t border-neutral-800 text-[10px] text-neutral-500">
                            <span className="text-neutral-300 font-medium">{task.assigneeName.split(' ')[0]}</span>
                            <span className="font-mono">{task.estimatedHours}h est</span>
                          </div>

                          {/* Quick status transition dropdown */}
                          <select
                            value={task.status}
                            onChange={(e) => updateTaskStatus(task.id, e.target.value as any)}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-[10px] text-neutral-300"
                          >
                            <option value="Backlog">Backlog</option>
                            <option value="Todo">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Review">Code Review</option>
                            <option value="Done">Done</option>
                          </select>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Project Details Modal / Drawer */}
      {detailProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto" id="modal-project-details">
          <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700 text-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-blue-400 bg-blue-950 border border-blue-800 px-2.5 py-1 rounded-lg">
                  {detailProject.code}
                </span>
                <div>
                  <h2 className="text-base font-bold text-white">{detailProject.title}</h2>
                  <p className="text-xs text-neutral-400">Department: {detailProject.department || 'Engineering'} • Lead: {detailProject.leadName}</p>
                </div>
              </div>
              <button
                onClick={() => setDetailProject(null)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
              
              {/* Stage & Progress Banner */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Current Execution Stage</span>
                  <div className="flex items-center gap-2 mt-1">
                    <select
                      value={detailProject.status}
                      onChange={(e) => {
                        const newStage = e.target.value as ProjectStage;
                        updateProjectStage(detailProject.id, newStage);
                        setDetailProject({ ...detailProject, status: newStage });
                      }}
                      className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-white font-bold text-xs"
                    >
                      <option value="Planning">Planning</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Paused">Paused</option>
                      <option value="Finished">Finished</option>
                    </select>
                    <span className="text-xs text-neutral-400 font-mono">Progress: {detailProject.progressPercent}%</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleOpenEditProjectModal(detailProject);
                    setDetailProject(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Project</span>
                </button>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Project Description & Scope</h4>
                <p className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 text-neutral-300 leading-relaxed">
                  {detailProject.description || 'No detailed scope notes provided for this project.'}
                </p>
              </div>

              {/* Financial Breakdown */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Budget & Financial Allocations</h4>
                <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block">Total Allocated</span>
                    <span className="text-base font-bold text-white font-mono">${(detailProject.budget || 0).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block">Budget Received</span>
                    <span className="text-base font-bold text-emerald-400 font-mono">${(detailProject.budgetReceived || 0).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block">Actual Spent</span>
                    <span className="text-base font-bold text-amber-400 font-mono">${(detailProject.spent || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Milestones Checklist */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Deliverable Milestones</h4>
                <div className="space-y-2">
                  {(detailProject.milestones || []).map((m) => (
                    <div
                      key={m.id}
                      onClick={() => toggleMilestone(detailProject, m.id)}
                      className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between cursor-pointer hover:border-neutral-700 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        {m.completed ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-neutral-500 shrink-0" />
                        )}
                        <span className={`font-medium ${m.completed ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>
                          {m.title}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-neutral-400">{m.dueDate}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => setDetailProject(null)}
                className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Project Modal */}
      {isAddProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto" id="modal-project-form">
          <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700 text-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <KanbanSquare className="w-4 h-4 text-blue-400" />
                <span>{editingProject ? `Edit Project: ${editingProject.code}` : 'Create Strategic Project'}</span>
              </h3>
              <button onClick={() => setIsAddProjectModalOpen(false)} className="text-neutral-400 hover:text-white rounded-lg p-1 hover:bg-neutral-800 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              
              {/* Title & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-neutral-300 font-semibold mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={projForm.title}
                    onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                    placeholder="e.g. NextGen Microservices & Cloud Platform"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                    id="input-project-title"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Linked Department *</label>
                  <select
                    value={projForm.department}
                    onChange={(e) => setProjForm({ ...projForm, department: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    id="select-project-department"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance & Accounting">Finance & Accounting</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Sales & Growth">Sales & Growth</option>
                    <option value="Operations & Logistics">Operations & Logistics</option>
                    <option value="Quality & Compliance">Quality & Compliance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Project Stage / Status *</label>
                  <select
                    value={projForm.status}
                    onChange={(e) => setProjForm({ ...projForm, status: e.target.value as ProjectStage })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    id="select-project-stage"
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Paused">Paused</option>
                    <option value="Finished">Finished</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Project Description & Deliverables Scope *</label>
                <textarea
                  rows={3}
                  required
                  value={projForm.description}
                  onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
                  placeholder="Provide comprehensive details on scope, business requirements, target milestones, and key technical objectives..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 leading-relaxed"
                  id="textarea-project-description"
                />
              </div>

              {/* Dates & Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Project Start Date *</label>
                  <input
                    type="date"
                    required
                    value={projForm.startDate}
                    onChange={(e) => setProjForm({ ...projForm, startDate: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                    id="input-project-start-date"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Project End Date (Target Due) *</label>
                  <input
                    type="date"
                    required
                    value={projForm.endDate}
                    onChange={(e) => setProjForm({ ...projForm, endDate: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                    id="input-project-end-date"
                  />
                </div>
              </div>

              {/* Budget Allocation & Budget Received */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Budget Allocation ($) *</label>
                  <input
                    type="number"
                    required
                    value={projForm.budget}
                    onChange={(e) => setProjForm({ ...projForm, budget: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold focus:outline-none focus:border-blue-500"
                    id="input-project-budget"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Budget Received ($) *</label>
                  <input
                    type="number"
                    required
                    value={projForm.budgetReceived}
                    onChange={(e) => setProjForm({ ...projForm, budgetReceived: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-indigo-300 font-mono font-bold focus:outline-none focus:border-blue-500"
                    id="input-project-budget-received"
                  />
                </div>
              </div>

              {/* Lead & Stakeholder */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Project Lead / Manager</label>
                  <select
                    value={projForm.leadId}
                    onChange={(e) => setProjForm({ ...projForm, leadId: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {employees.map(e => (
                      <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.position})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Priority</label>
                  <select
                    value={projForm.priority}
                    onChange={(e) => setProjForm({ ...projForm, priority: e.target.value as ProjectPriority })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProjectModalOpen(false)}
                  className="px-4 py-2 bg-neutral-800 rounded-xl text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-white shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer"
                  id="btn-save-project-submit"
                >
                  {editingProject ? 'Update Project' : 'Launch Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-700 text-white rounded-2xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-white text-sm">Create Sprint Task</h3>
              <button onClick={() => setIsAddTaskModalOpen(false)} className="text-neutral-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-neutral-400 mb-1">Target Project</label>
                <select
                  value={newTask.projectId}
                  onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                >
                  {projects.map(p => <option key={p.id} value={p.id}>{p.code} - {p.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Assignee</label>
                <select
                  value={newTask.assigneeId}
                  onChange={(e) => setNewTask({ ...newTask, assigneeId: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                >
                  {employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.department})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Estimated Hours</label>
                  <input
                    type="number"
                    value={newTask.estimatedHours}
                    onChange={(e) => setNewTask({ ...newTask, estimatedHours: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddTaskModalOpen(false)} className="px-4 py-1.5 bg-neutral-800 rounded-xl text-neutral-300 hover:text-white cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-white cursor-pointer">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
