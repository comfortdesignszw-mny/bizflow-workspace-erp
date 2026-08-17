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
  AlertCircle
} from 'lucide-react';
import { EmptyState } from '../common/EmptyState';
import { Task, TaskPriority } from '../../types/erp';

export const TasksModule: React.FC = () => {
  const {
    tasks,
    projects,
    employees,
    addTask,
    updateTaskStatus,
    updateTask,
    currentUser
  } = useERP();

  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [projectFilter, setProjectFilter] = useState<string>('ALL');
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  // New task state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    projectId: projects[0]?.id || '',
    assigneeId: employees[0]?.id || '',
    priority: 'Medium' as TaskPriority,
    dueDate: '2026-08-30',
    tags: ['Feature', 'Sprint-34']
  });

  const columns: { status: Task['status']; label: string; color: string }[] = [
    { status: 'Backlog', label: 'Backlog', color: 'border-neutral-700 bg-neutral-900/40' },
    { status: 'Todo', label: 'To Do', color: 'border-blue-500/30 bg-blue-950/20' },
    { status: 'In Progress', label: 'In Progress', color: 'border-amber-500/30 bg-amber-950/20' },
    { status: 'Review', label: 'In Review', color: 'border-purple-500/30 bg-purple-950/20' },
    { status: 'Done', label: 'Done & Verified', color: 'border-emerald-500/30 bg-emerald-950/20' }
  ];

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    const matchesProject = projectFilter === 'ALL' || t.projectId === projectFilter;
    return matchesSearch && matchesPriority && matchesProject;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;
    const project = projects.find(p => p.id === newTask.projectId);
    const assignee = employees.find(e => e.id === newTask.assigneeId);

    addTask({
      ...newTask,
      projectName: project?.name || 'Enterprise System',
      assigneeName: assignee ? `${assignee.firstName} ${assignee.lastName}` : 'Unassigned',
      status: 'Todo'
    });
    setIsAddTaskModalOpen(false);
    setNewTask({
      title: '',
      description: '',
      projectId: projects[0]?.id || '',
      assigneeId: employees[0]?.id || '',
      priority: 'Medium',
      dueDate: '2026-08-30',
      tags: ['Feature', 'Sprint-34']
    });
  };

  const completedCount = tasks.filter(t => t.status === 'Done').length;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress' || t.status === 'Review').length;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto" id="tasks-module-root">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 backdrop-blur-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Agile & Workflow Operations
            </span>
            <span className="text-xs text-neutral-400 font-mono">Sprint 34 Velocity Board</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Projects & Sprint Tasks</h1>
          <p className="text-sm text-neutral-400">Collaborative kanban task execution, milestone deliverables, and developer velocity tracking</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddTaskModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
            id="btn-create-task"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-medium">Total Backlog & Tasks</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">
              {tasks.length} Items
            </div>
            <span className="text-[10px] text-blue-400 font-medium">{projects.length} Active initiatives</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-medium">Active In-Flight</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">
              {inProgressCount} Tasks
            </div>
            <span className="text-[10px] text-amber-400 font-medium">Currently in dev/review</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-medium">Completed (Sprint)</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">
              {completedCount} Finished
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">
              {Math.round((completedCount / (tasks.length || 1)) * 100)}% Sprint Completion
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-medium">Assignee Allocation</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">
              {employees.length} Engineers
            </div>
            <span className="text-[10px] text-purple-400 font-medium">Balanced workload</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search task titles, descriptions, tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-hidden"
          >
            <option value="ALL">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-hidden"
          >
            <option value="ALL">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Kanban Board */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title={tasks.length === 0 ? "No Active Tasks in Sprint" : "No Matching Tasks"}
          description={tasks.length === 0 ? "Create sprint backlog tasks, set priority SLAs, and assign enterprise tickets across engineering staff." : "No tasks matched your search or project filters."}
          actionText={tasks.length === 0 ? "+ Create Sprint Task" : "Clear Filter"}
          onAction={tasks.length === 0 ? () => setIsAddTaskModalOpen(true) : () => { setSearchTerm(''); setPriorityFilter('ALL'); setProjectFilter('ALL'); }}
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
                        <span className="text-[10px] font-mono text-blue-400 font-semibold">{task.projectName}</span>
                        <h4 className="text-xs font-bold text-white mt-0.5">{task.title}</h4>
                        {task.description && (
                          <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1">{task.description}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono pt-1">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          task.priority === 'Critical' ? 'bg-rose-500/20 text-rose-300' :
                          task.priority === 'High' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-neutral-800 text-neutral-300'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="text-neutral-400">{task.dueDate}</span>
                      </div>

                      <div className="text-[10px] text-neutral-400 border-t border-neutral-800/60 pt-1.5 flex justify-between items-center">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-neutral-500" />
                          <span>{(task.assigneeName || 'Unassigned').split(' ')[0]}</span>
                        </span>

                        {/* Quick move button */}
                        {status !== 'Done' && (
                          <button
                            onClick={() => {
                              const nextStatus: Task['status'] =
                                status === 'Backlog' ? 'Todo' :
                                status === 'Todo' ? 'In Progress' :
                                status === 'In Progress' ? 'Review' : 'Done';
                              updateTaskStatus(task.id, nextStatus);
                            }}
                            className="text-blue-400 hover:text-blue-300 flex items-center gap-0.5 text-[10px] font-semibold"
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

      {/* MODAL: CREATE TASK */}
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Create Sprint Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="text-neutral-400 block mb-1">Task Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="e.g. Implement biometric QR code encryption layer"
                  className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Parent Project</label>
                <select
                  value={newTask.projectId}
                  onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.department})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Assignee</label>
                <select
                  value={newTask.assigneeId}
                  onChange={(e) => setNewTask({ ...newTask, assigneeId: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.designation})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as TaskPriority })}
                    className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Task Details</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white h-20"
                  placeholder="Acceptance criteria and technical specifications..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
