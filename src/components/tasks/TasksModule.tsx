import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  CheckSquare,
  Square,
  Plus,
  Search,
  Filter,
  Clock,
  User,
  Tag,
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FolderKanban,
  DollarSign,
  Briefcase,
  TrendingUp,
  LayoutGrid,
  KanbanSquare,
  Edit2,
  Trash2,
  X,
  Building,
  UserCheck,
  Flag,
  FileText,
  ChevronDown,
  ChevronUp,
  ListTodo
} from 'lucide-react';
import { EmptyState } from '../common/EmptyState';
import { Task, TaskPriority, TaskStatus, Project, ProjectStatus, ProjectPriority, ProjectType } from '../../types/erp';

export const TasksModule: React.FC = () => {
  const {
    tasks,
    projects,
    employees,
    addTask,
    updateTaskStatus,
    updateTask,
    deleteTask,
    addProject,
    updateProject,
    deleteProject,
    currentUser,
    settings
  } = useERP();

  const [activeTab, setActiveTab] = useState<'projects' | 'kanban' | 'list'>('projects');
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [projectFilter, setProjectFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals state
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // New Project Form State
  const [newProject, setNewProject] = useState({
    title: '',
    startDate: new Date().toISOString().split('T')[0],
    expectedFinishDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    leadId: employees[0]?.id || '',
    projectType: 'Client' as ProjectType,
    amountRequired: 25000,
    amountDisbursed: 10000,
    priority: 'Medium' as ProjectPriority,
    status: 'Planning' as ProjectStatus,
    details: ''
  });

  // New Task Form State
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    projectId: projects[0]?.id || '',
    assigneeId: employees[0]?.id || '',
    priority: 'Medium' as TaskPriority,
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tags: ['Deliverable', 'Milestone']
  });

  const columns: { status: TaskStatus; label: string; color: string }[] = [
    { status: 'Backlog', label: 'Backlog', color: 'border-neutral-700 bg-neutral-900/40' },
    { status: 'Todo', label: 'To Do', color: 'border-blue-500/30 bg-blue-950/20' },
    { status: 'In Progress', label: 'In Progress', color: 'border-amber-500/30 bg-amber-950/20' },
    { status: 'Review', label: 'In Review', color: 'border-purple-500/30 bg-purple-950/20' },
    { status: 'Done', label: 'Done & Verified', color: 'border-emerald-500/30 bg-emerald-950/20' }
  ];

  // Open Task Modal pre-selected for a specific project
  const handleOpenAddTaskForProject = (projectId: string) => {
    setNewTask(prev => ({
      ...prev,
      projectId: projectId || projects[0]?.id || '',
      title: '',
      description: '',
      assigneeId: employees[0]?.id || '',
      priority: 'Medium',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));
    setIsAddTaskModalOpen(true);
  };

  // Open Project Modal
  const handleOpenCreateProject = () => {
    setEditingProject(null);
    setNewProject({
      title: '',
      startDate: new Date().toISOString().split('T')[0],
      expectedFinishDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      leadId: employees[0]?.id || '',
      projectType: 'Client',
      amountRequired: 25000,
      amountDisbursed: 10000,
      priority: 'Medium',
      status: 'Planning',
      details: ''
    });
    setIsAddProjectModalOpen(true);
  };

  const handleEditProject = (proj: Project) => {
    setEditingProject(proj);
    setNewProject({
      title: proj.title || proj.name || '',
      startDate: proj.startDate || new Date().toISOString().split('T')[0],
      expectedFinishDate: proj.expectedFinishDate || proj.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      leadId: proj.leadId || employees[0]?.id || '',
      projectType: proj.projectType || 'Client',
      amountRequired: proj.amountRequired ?? proj.budget ?? 0,
      amountDisbursed: proj.amountDisbursed ?? proj.budgetReceived ?? 0,
      priority: (proj.priority as ProjectPriority) || 'Medium',
      status: proj.status || 'Planning',
      details: proj.details || proj.description || ''
    });
    setIsAddProjectModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;

    const leadEmployee = employees.find(emp => emp.id === newProject.leadId);
    const leadName = leadEmployee ? `${leadEmployee.firstName} ${leadEmployee.lastName}` : 'Unassigned Lead';
    const leadAvatar = leadEmployee?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

    if (editingProject) {
      updateProject(editingProject.id, {
        title: newProject.title.trim(),
        name: newProject.title.trim(),
        startDate: newProject.startDate,
        endDate: newProject.expectedFinishDate,
        expectedFinishDate: newProject.expectedFinishDate,
        leadId: newProject.leadId,
        leadName,
        leadAssigneeName: leadName,
        leadAvatar,
        projectType: newProject.projectType,
        budget: newProject.amountRequired,
        amountRequired: newProject.amountRequired,
        budgetReceived: newProject.amountDisbursed,
        amountDisbursed: newProject.amountDisbursed,
        priority: newProject.priority,
        status: newProject.status,
        description: newProject.details,
        details: newProject.details
      });
    } else {
      addProject({
        title: newProject.title.trim(),
        name: newProject.title.trim(),
        startDate: newProject.startDate,
        endDate: newProject.expectedFinishDate,
        expectedFinishDate: newProject.expectedFinishDate,
        leadId: newProject.leadId,
        leadName,
        leadAssigneeName: leadName,
        leadAvatar,
        projectType: newProject.projectType,
        budget: newProject.amountRequired,
        amountRequired: newProject.amountRequired,
        budgetReceived: newProject.amountDisbursed,
        amountDisbursed: newProject.amountDisbursed,
        priority: newProject.priority,
        status: newProject.status,
        description: newProject.details,
        details: newProject.details,
        department: newProject.projectType === 'Client' ? 'Client Services' : 'Operations'
      });
    }

    setIsAddProjectModalOpen(false);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const parentProject = projects.find(p => p.id === newTask.projectId);
    const assignee = employees.find(e => e.id === newTask.assigneeId);
    const assigneeName = assignee ? `${assignee.firstName} ${assignee.lastName}` : 'Unassigned';

    addTask({
      title: newTask.title.trim(),
      description: newTask.description,
      projectId: newTask.projectId,
      projectCode: parentProject?.code || 'PRJ-GEN',
      projectTitle: parentProject?.title || parentProject?.name || 'General Project',
      projectName: parentProject?.title || parentProject?.name || 'General Project',
      assignedToId: newTask.assigneeId,
      assignedToName: assigneeName,
      assignedToAvatar: assignee?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      assigneeName,
      priority: newTask.priority,
      status: 'Todo',
      dueDate: newTask.dueDate,
      tags: newTask.tags
    });

    setIsAddTaskModalOpen(false);
    setNewTask({
      title: '',
      description: '',
      projectId: projects[0]?.id || '',
      assigneeId: employees[0]?.id || '',
      priority: 'Medium',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tags: ['Deliverable', 'Milestone']
    });
  };

  // Filtered Projects
  const filteredProjects = projects.filter(p => {
    const title = (p.title || p.name || '').toLowerCase();
    const desc = (p.description || p.details || '').toLowerCase();
    const lead = (p.leadName || p.leadAssigneeName || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    const matchesSearch = title.includes(query) || desc.includes(query) || lead.includes(query);
    const matchesType = typeFilter === 'ALL' || p.projectType === typeFilter;
    const matchesPriority = priorityFilter === 'ALL' || p.priority === priorityFilter;
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesType && matchesPriority && matchesStatus;
  });

  // Filtered Tasks
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    const matchesProject = projectFilter === 'ALL' || t.projectId === projectFilter;
    return matchesSearch && matchesPriority && matchesProject;
  });

  const totalProjectsCount = projects.length;
  const activeProjectsCount = projects.filter(p => p.status === 'Started' || p.status === 'Ongoing' || p.status === 'In Progress').length;
  const completedTasksCount = tasks.filter(t => t.status === 'Done').length;
  const totalAmountRequired = projects.reduce((sum, p) => sum + (p.amountRequired ?? p.budget ?? 0), 0);
  const totalAmountDisbursed = projects.reduce((sum, p) => sum + (p.amountDisbursed ?? p.budgetReceived ?? 0), 0);

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto" id="projects-tasks-root">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-900/80 p-6 rounded-2xl border border-neutral-800 backdrop-blur-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
              <FolderKanban className="w-3.5 h-3.5" />
              <span>Project & Sprint Management</span>
            </span>
            <span className="text-xs text-neutral-400 font-mono">Enterprise Velocity</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Projects and Tasks</h1>
          <p className="text-sm text-neutral-400">
            Create client or in-house projects, manage budget requirements & disbursements, and coordinate linked sprint deliverables.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleOpenCreateProject}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/20 active:scale-95 transition-all cursor-pointer"
            id="btn-create-project"
          >
            <Plus className="w-4 h-4" />
            <span>Create a Project</span>
          </button>

          <button
            onClick={() => {
              if (projects.length === 0) {
                alert('Please create a project first before adding tasks.');
                handleOpenCreateProject();
                return;
              }
              handleOpenAddTaskForProject(projects[0]?.id || '');
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white rounded-xl text-xs font-semibold border border-neutral-700 shadow-md active:scale-95 transition-all cursor-pointer"
            id="btn-create-task"
          >
            <CheckSquare className="w-4 h-4 text-blue-400" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-medium">Total Initiatives</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">
              {totalProjectsCount} Projects
            </div>
            <span className="text-[10px] text-blue-400 font-medium">{activeProjectsCount} Ongoing & Started</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-medium">Budget Required</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">
              ${totalAmountRequired.toLocaleString()}
            </div>
            <span className="text-[10px] text-purple-400 font-medium">${totalAmountDisbursed.toLocaleString()} Disbursed</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-medium">Linked Sprint Tasks</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">
              {tasks.length} Deliverables
            </div>
            <span className="text-[10px] text-amber-400 font-medium">{tasks.length - completedTasksCount} In Progress</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-medium">Task Velocity</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">
              {completedTasksCount} Done
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">
              {Math.round((completedTasksCount / (tasks.length || 1)) * 100)}% Overall Progress
            </span>
          </div>
        </div>
      </div>

      {/* Tabs & Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-neutral-900 p-4 rounded-2xl border border-neutral-800 text-xs">
        
        {/* Navigation Tabs */}
        <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'projects' ? 'bg-blue-600 text-white font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
            id="tab-projects-cards"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Projects & Linked Tasks</span>
          </button>
          <button
            onClick={() => setActiveTab('kanban')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'kanban' ? 'bg-blue-600 text-white font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
            id="tab-sprint-kanban"
          >
            <KanbanSquare className="w-3.5 h-3.5" />
            <span>Sprint Board</span>
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'list' ? 'bg-blue-600 text-white font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
            id="tab-all-tasks"
          >
            <ListTodo className="w-3.5 h-3.5" />
            <span>All Tasks List</span>
          </button>
        </div>

        {/* Search & Select Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search projects, tasks, leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {activeTab === 'projects' ? (
            <>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-hidden"
              >
                <option value="ALL">All Types</option>
                <option value="Client">Client</option>
                <option value="Inhouse">Inhouse</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-hidden"
              >
                <option value="ALL">All Statuses</option>
                <option value="Planning">Planning</option>
                <option value="Started">Started</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Paused">Paused</option>
                <option value="Finished">Finished</option>
              </select>
            </>
          ) : (
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-hidden"
            >
              <option value="ALL">All Projects</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.title || p.name}</option>
              ))}
            </select>
          )}

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-hidden"
          >
            <option value="ALL">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* TAB CONTENT 1: PROJECTS & LINKED TASKS CARDS */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          {filteredProjects.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              title={projects.length === 0 ? "No Projects Created Yet" : "No Matching Projects"}
              description={
                projects.length === 0
                  ? "Start by creating your first client or in-house project, defining budgets, timelines, and linking sprint tasks."
                  : "No projects match your current filters. Try changing or resetting your search."
              }
              actionText="+ Create a Project"
              onAction={handleOpenCreateProject}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProjects.map((project) => {
                const projectTasks = tasks.filter(t => t.projectId === project.id);
                const doneCount = projectTasks.filter(t => t.status === 'Done').length;
                const progress = projectTasks.length > 0
                  ? Math.round((doneCount / projectTasks.length) * 100)
                  : (project.status === 'Finished' ? 100 : (project.progressPercent || 0));

                const reqAmount = project.amountRequired ?? project.budget ?? 0;
                const disbAmount = project.amountDisbursed ?? project.budgetReceived ?? 0;
                const disbPercent = reqAmount > 0 ? Math.min(100, Math.round((disbAmount / reqAmount) * 100)) : 0;

                return (
                  <div
                    key={project.id}
                    className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-5 shadow-lg relative group"
                    id={`project-card-${project.id}`}
                  >
                    {/* Project Card Header */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                              {project.code || 'PRJ-PRO'}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                              project.projectType === 'Client'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                            }`}>
                              {project.projectType || 'Client'} Project
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                              project.priority === 'High' || project.priority === 'Critical'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : project.priority === 'Low'
                                ? 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>
                              {project.priority || 'Medium'} Priority
                            </span>
                          </div>
                          <h2 className="text-lg font-bold text-white mt-1.5 group-hover:text-blue-400 transition-colors">
                            {project.title || project.name}
                          </h2>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            project.status === 'Finished'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : project.status === 'Ongoing' || project.status === 'Started' || project.status === 'In Progress'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse'
                              : project.status === 'Paused'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {project.status || 'Planning'}
                          </span>

                          <button
                            onClick={() => handleEditProject(project)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                            title="Edit Project"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete project "${project.title || project.name}" and all its linked tasks?`)) {
                                deleteProject(project.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-950 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Project Details Description */}
                      {(project.description || project.details) && (
                        <p className="text-xs text-neutral-300 leading-relaxed line-clamp-2">
                          {project.description || project.details}
                        </p>
                      )}

                      {/* Meta Grid: Leader, Dates, Financials */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs">
                        {/* Leader */}
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-neutral-500 font-mono block">PROJECT LEADER</span>
                          <div className="flex items-center gap-1.5">
                            <img
                              src={project.leadAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                              alt={project.leadName || 'Lead'}
                              className="w-5 h-5 rounded-full object-cover border border-neutral-700"
                            />
                            <span className="font-semibold text-neutral-200 truncate">{project.leadName || project.leadAssigneeName || 'Unassigned'}</span>
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-neutral-500 font-mono block">TIMELINE</span>
                          <div className="text-neutral-300 font-mono text-[11px]">
                            {project.startDate} → {project.expectedFinishDate || project.endDate}
                          </div>
                        </div>

                        {/* Financials: Amount Required & Disbursed */}
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-neutral-500 font-mono block">BUDGET & DISBURSED</span>
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-purple-300 font-bold">${disbAmount.toLocaleString()}</span>
                            <span className="text-neutral-500">/ ${reqAmount.toLocaleString()}</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden mt-1">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
                              style={{ width: `${disbPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DEDICATED SPACE FOR TASKS LINKED TO THIS PROJECT */}
                    <div className="pt-3 border-t border-neutral-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckSquare className="w-4 h-4 text-blue-400" />
                          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                            Linked Project Tasks
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-800 text-neutral-300 font-mono">
                            {doneCount}/{projectTasks.length} Completed
                          </span>
                        </div>

                        <button
                          onClick={() => handleOpenAddTaskForProject(project.id)}
                          className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-[11px] font-semibold border border-blue-500/30 flex items-center gap-1 transition-all cursor-pointer"
                          id={`btn-add-task-to-${project.id}`}
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Task</span>
                        </button>
                      </div>

                      {/* Tasks List in this Space */}
                      {projectTasks.length > 0 ? (
                        <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                          {projectTasks.map((t) => {
                            const isDone = t.status === 'Done';
                            return (
                              <div
                                key={t.id}
                                className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs ${
                                  isDone
                                    ? 'bg-neutral-950/60 border-neutral-800/60 opacity-75'
                                    : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                  <button
                                    onClick={() => {
                                      const nextStatus: TaskStatus = isDone ? 'Todo' : 'Done';
                                      updateTaskStatus(t.id, nextStatus);
                                    }}
                                    className="text-neutral-400 hover:text-emerald-400 cursor-pointer shrink-0"
                                    title={isDone ? 'Mark as Incomplete' : 'Mark as Completed'}
                                  >
                                    {isDone ? (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    ) : (
                                      <Square className="w-4 h-4 text-neutral-500 hover:text-white" />
                                    )}
                                  </button>

                                  <div className="min-w-0 flex-1">
                                    <p className={`font-semibold truncate ${isDone ? 'line-through text-neutral-500' : 'text-white'}`}>
                                      {t.title}
                                    </p>
                                    <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-0.5">
                                      <span className="text-neutral-400 flex items-center gap-1">
                                        <User className="w-2.5 h-2.5" />
                                        <span>{(t.assignedToName || t.assigneeName || 'Unassigned').split(' ')[0]}</span>
                                      </span>
                                      <span>•</span>
                                      <span>Due {t.dueDate}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                    t.priority === 'Critical' || t.priority === 'High'
                                      ? 'bg-rose-500/20 text-rose-300'
                                      : t.priority === 'Low'
                                      ? 'bg-neutral-800 text-neutral-400'
                                      : 'bg-amber-500/20 text-amber-300'
                                  }`}>
                                    {t.priority}
                                  </span>

                                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                                    t.status === 'Done'
                                      ? 'bg-emerald-500/20 text-emerald-300'
                                      : t.status === 'In Progress'
                                      ? 'bg-amber-500/20 text-amber-300'
                                      : t.status === 'Review'
                                      ? 'bg-purple-500/20 text-purple-300'
                                      : 'bg-neutral-800 text-neutral-300'
                                  }`}>
                                    {t.status}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div
                          onClick={() => handleOpenAddTaskForProject(project.id)}
                          className="p-4 rounded-xl border border-dashed border-neutral-800 hover:border-blue-500/50 bg-neutral-950/40 text-center cursor-pointer transition-colors group/empty"
                        >
                          <p className="text-xs text-neutral-400 group-hover/empty:text-blue-300 font-medium">
                            + No tasks linked yet. Click to add the first task to this project.
                          </p>
                          <p className="text-[10px] text-neutral-500 mt-0.5">
                            Deliverables assigned to this project will appear right here.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 2: SPRINT KANBAN BOARD */}
      {activeTab === 'kanban' && (
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <EmptyState
              icon={CheckSquare}
              title="No Tasks in Current Filter"
              description="Create tasks and assign them to your created projects to organize deliverables across kanban columns."
              actionText="+ Create Task"
              onAction={() => handleOpenAddTaskForProject(projects[0]?.id || '')}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {columns.map(({ status, label, color }) => {
                const columnTasks = filteredTasks.filter(t => t.status === status);

                return (
                  <div key={status} className={`p-4 rounded-2xl border ${color} space-y-3 flex flex-col min-h-[520px]`}>
                    <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">{label}</h3>
                      <span className="w-5 h-5 rounded-full bg-neutral-800 text-neutral-300 text-[10px] font-bold flex items-center justify-center">
                        {columnTasks.length}
                      </span>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto">
                      {columnTasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2.5 shadow-md hover:border-neutral-700 transition-all"
                        >
                          <div>
                            <span className="text-[10px] font-mono text-blue-400 font-semibold block truncate">
                              {task.projectName || task.projectTitle || 'Project'}
                            </span>
                            <h4 className="text-xs font-bold text-white mt-0.5">{task.title}</h4>
                            {task.description && (
                              <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1">{task.description}</p>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-[10px] font-mono pt-1">
                            <span className={`px-2 py-0.5 rounded font-bold ${
                              task.priority === 'Critical' || task.priority === 'High' ? 'bg-rose-500/20 text-rose-300' :
                              task.priority === 'Medium' ? 'bg-amber-500/20 text-amber-300' :
                              'bg-neutral-800 text-neutral-300'
                            }`}>
                              {task.priority}
                            </span>
                            <span className="text-neutral-400">{task.dueDate}</span>
                          </div>

                          <div className="text-[10px] text-neutral-400 border-t border-neutral-800/60 pt-1.5 flex justify-between items-center">
                            <span className="flex items-center gap-1 truncate max-w-[100px]">
                              <User className="w-3 h-3 text-neutral-500" />
                              <span className="truncate">{(task.assignedToName || task.assigneeName || 'Unassigned').split(' ')[0]}</span>
                            </span>

                            {/* Quick status advance */}
                            {status !== 'Done' && (
                              <button
                                onClick={() => {
                                  const nextStatus: TaskStatus =
                                    status === 'Backlog' ? 'Todo' :
                                    status === 'Todo' ? 'In Progress' :
                                    status === 'In Progress' ? 'Review' : 'Done';
                                  updateTaskStatus(task.id, nextStatus);
                                }}
                                className="text-blue-400 hover:text-blue-300 flex items-center gap-0.5 text-[10px] font-semibold cursor-pointer"
                              >
                                Next <ArrowRight className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      {columnTasks.length === 0 && (
                        <div className="h-28 flex flex-col items-center justify-center text-center p-3 rounded-xl border border-dashed border-neutral-800/80 text-neutral-500 text-xs">
                          <p className="font-medium text-[11px] text-neutral-400">Empty Stage</p>
                          <p className="text-[10px] text-neutral-600 mt-0.5">No tasks in this lane</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 3: ALL TASKS LIST TABLE */}
      {activeTab === 'list' && (
        <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-neutral-950 text-neutral-400 uppercase font-mono text-[10px] border-b border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Task</th>
                  <th className="py-3 px-4">Parent Project</th>
                  <th className="py-3 px-4">Assignee</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filteredTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-bold text-white">{t.title}</p>
                        {t.description && (
                          <p className="text-[11px] text-neutral-400 truncate max-w-xs">{t.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-blue-400">
                      {t.projectName || t.projectTitle || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <img
                          src={t.assignedToAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={t.assignedToName || 'Assignee'}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span>{t.assignedToName || t.assigneeName || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.priority === 'Critical' || t.priority === 'High'
                          ? 'bg-rose-500/20 text-rose-300'
                          : t.priority === 'Low'
                          ? 'bg-neutral-800 text-neutral-400'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-400">{t.dueDate}</td>
                    <td className="py-3 px-4">
                      <select
                        value={t.status}
                        onChange={(e) => updateTaskStatus(t.id, e.target.value as TaskStatus)}
                        className="bg-neutral-950 border border-neutral-700 rounded-lg px-2 py-1 text-xs text-white"
                      >
                        <option value="Backlog">Backlog</option>
                        <option value="Todo">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Review">Review</option>
                        <option value="Done">Done</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteTask(t.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: CREATE / EDIT PROJECT */}
      {isAddProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto" id="modal-create-project">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FolderKanban className="w-5 h-5 text-blue-400" />
                  <span>{editingProject ? 'Edit Project' : 'Create a Project'}</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Specify project classification, budgets, team leadership, and timeline milestones.
                </p>
              </div>
              <button
                onClick={() => setIsAddProjectModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs max-h-[75vh] overflow-y-auto pr-1 custom-scrollbar">
              {/* Project Name */}
              <div>
                <label className="text-neutral-300 font-semibold block mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="e.g. NextGen Biometric Access Cloud Gateway"
                  className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-hidden focus:border-blue-500"
                  id="input-project-name"
                />
              </div>

              {/* Start Date & Expected Finish Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">Start Date *</label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="date"
                      required
                      value={newProject.startDate}
                      onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white font-mono focus:outline-hidden focus:border-blue-500"
                      id="input-project-start-date"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">Expected Finish Date *</label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="date"
                      required
                      value={newProject.expectedFinishDate}
                      onChange={(e) => setNewProject({ ...newProject, expectedFinishDate: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white font-mono focus:outline-hidden focus:border-blue-500"
                      id="input-project-finish-date"
                    />
                  </div>
                </div>
              </div>

              {/* Project Leader/Assignee & Project Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">Project Leader / Assignee *</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <select
                      value={newProject.leadId}
                      onChange={(e) => setNewProject({ ...newProject, leadId: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-hidden focus:border-blue-500"
                      id="select-project-leader"
                    >
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>
                          {emp.firstName} {emp.lastName} ({emp.position})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">Project Type *</label>
                  <div className="relative">
                    <Briefcase className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <select
                      value={newProject.projectType}
                      onChange={(e) => setNewProject({ ...newProject, projectType: e.target.value as ProjectType })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-hidden focus:border-blue-500"
                      id="select-project-type"
                    >
                      <option value="Client">Client</option>
                      <option value="Inhouse">Inhouse</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Financials: Project Amount Required & Amount Disbursed */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">Project Amount Required ($) *</label>
                  <div className="relative">
                    <DollarSign className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                    <input
                      type="number"
                      min={0}
                      required
                      value={newProject.amountRequired}
                      onChange={(e) => setNewProject({ ...newProject, amountRequired: Number(e.target.value) })}
                      placeholder="e.g. 50000"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white font-mono focus:outline-hidden focus:border-blue-500"
                      id="input-project-amount-required"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">Amount Disbursed ($) *</label>
                  <div className="relative">
                    <DollarSign className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                    <input
                      type="number"
                      min={0}
                      required
                      value={newProject.amountDisbursed}
                      onChange={(e) => setNewProject({ ...newProject, amountDisbursed: Number(e.target.value) })}
                      placeholder="e.g. 20000"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white font-mono focus:outline-hidden focus:border-blue-500"
                      id="input-project-amount-disbursed"
                    />
                  </div>
                </div>
              </div>

              {/* Priority & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">Project Priority *</label>
                  <select
                    value={newProject.priority}
                    onChange={(e) => setNewProject({ ...newProject, priority: e.target.value as ProjectPriority })}
                    className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-hidden focus:border-blue-500"
                    id="select-project-priority"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">Project Status *</label>
                  <select
                    value={newProject.status}
                    onChange={(e) => setNewProject({ ...newProject, status: e.target.value as ProjectStatus })}
                    className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-hidden focus:border-blue-500"
                    id="select-project-status"
                  >
                    <option value="Planning">Planning</option>
                    <option value="Started">Started</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Paused">Paused</option>
                    <option value="Finished">Finished</option>
                  </select>
                </div>
              </div>

              {/* Project Details */}
              <div>
                <label className="text-neutral-300 font-semibold block mb-1">Project Details *</label>
                <textarea
                  rows={3}
                  value={newProject.details}
                  onChange={(e) => setNewProject({ ...newProject, details: e.target.value })}
                  placeholder="Outline key deliverables, architectural objectives, milestones, and client/internal scope..."
                  className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-hidden focus:border-blue-500 leading-relaxed"
                  id="textarea-project-details"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
                  id="btn-save-project"
                >
                  {editingProject ? 'Save Changes' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE SPRINT TASK */}
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto" id="modal-create-task">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-blue-400" />
                  <span>Create Task</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Link deliverable to a parent project and assign to engineering personnel.
                </p>
              </div>
              <button
                onClick={() => setIsAddTaskModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs max-h-[75vh] overflow-y-auto pr-1 custom-scrollbar">
              {/* Task Title */}
              <div>
                <label className="text-neutral-300 font-semibold block mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="e.g. Implement biometric QR key encryption layer"
                  className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-hidden focus:border-blue-500"
                  id="input-task-title"
                />
              </div>

              {/* Parent Project (Options are the created projects) */}
              <div>
                <label className="text-neutral-300 font-semibold block mb-1">
                  Parent Project * <span className="text-[10px] text-blue-400 font-normal">(Created Projects)</span>
                </label>
                <div className="relative">
                  <FolderKanban className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
                  <select
                    required
                    value={newTask.projectId}
                    onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white font-medium focus:outline-hidden focus:border-blue-500"
                    id="select-parent-project"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title || p.name} [{p.projectType || 'Project'}] - {p.code || 'PRJ'}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-[10px] text-neutral-400 mt-1">
                  This task will automatically display on this project's card space upon saving.
                </p>
              </div>

              {/* Assignee */}
              <div>
                <label className="text-neutral-300 font-semibold block mb-1">Assignee *</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <select
                    value={newTask.assigneeId}
                    onChange={(e) => setNewTask({ ...newTask, assigneeId: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-hidden focus:border-blue-500"
                    id="select-task-assignee"
                  >
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName} ({emp.position})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Priority & Due Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as TaskPriority })}
                    className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-hidden focus:border-blue-500"
                    id="select-task-priority"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white font-mono focus:outline-hidden focus:border-blue-500"
                    id="input-task-due-date"
                  />
                </div>
              </div>

              {/* Task Description */}
              <div>
                <label className="text-neutral-300 font-semibold block mb-1">Task Details & Criteria</label>
                <textarea
                  rows={3}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-hidden focus:border-blue-500"
                  placeholder="Acceptance criteria, test scope, and engineering deliverables..."
                  id="textarea-task-description"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
                  id="btn-save-task"
                >
                  Create & Link Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
