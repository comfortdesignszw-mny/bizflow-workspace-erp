import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Cpu,
  Server,
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Zap,
  RefreshCw,
  Workflow,
  Wrench,
  Plus,
  Filter,
  DollarSign,
  User,
  Calendar,
  Tag,
  ArrowRight,
  ShieldAlert,
  Trash2,
  Edit3,
  Check,
  ChevronRight,
  Sparkles,
  Search,
  Building,
  CheckCheck
} from 'lucide-react';
import {
  Microservice,
  DeployPipeline,
  EngineeringJobCard,
  JobCardPriority,
  JobCardStatus,
  EngineeringSubDepartment
} from '../../types/erp';
import { EmptyState } from '../common/EmptyState';

const ENGINEERING_SUB_DEPARTMENTS: { id: EngineeringSubDepartment; label: string; desc: string; icon: string }[] = [
  {
    id: 'Mechanical Engineering',
    label: 'Mechanical',
    desc: 'HVAC, heavy turbines, centrifugal pumps, hydraulics & plant machinery',
    icon: '⚙️'
  },
  {
    id: 'Electrical Engineering',
    label: 'Electrical',
    desc: 'Substations, transformers, high-voltage switchgear & PLC control panels',
    icon: '⚡'
  },
  {
    id: 'Civil & Structural',
    label: 'Civil & Structural',
    desc: 'Structural foundations, load-bearing frameworks, drainage & site facilities',
    icon: '🏗️'
  },
  {
    id: 'Automation & Instrumentation',
    label: 'Automation & Instruments',
    desc: 'SCADA telemetry, robotic cells, industrial sensors & process calibrators',
    icon: '🤖'
  },
  {
    id: 'Software & Systems',
    label: 'Software & Systems',
    desc: 'Enterprise firmware, distributed microservices, network telemetry & APIs',
    icon: '💻'
  },
  {
    id: 'Chemical & Process',
    label: 'Chemical & Process',
    desc: 'Chemical reactors, distillation columns, fluid filtration & heat exchangers',
    icon: '🧪'
  }
];

export const EngineeringModule: React.FC = () => {
  const {
    engineeringJobCards,
    addEngineeringJobCard,
    updateEngineeringJobCard,
    updateEngineeringJobCardStatus,
    deleteEngineeringJobCard,
    employees,
    expenses,
    microservices,
    deployPipelines,
    addMicroservice,
    triggerPipelineDeploy,
    currentUser,
    settings
  } = useERP();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'job-cards' | 'services' | 'pipelines' | 'architecture'>('job-cards');
  
  // Job Cards Sub-Department Filter
  const [selectedSubDept, setSelectedSubDept] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [editingJobCard, setEditingJobCard] = useState<EngineeringJobCard | null>(null);
  const [deletingJobCard, setDeletingJobCard] = useState<EngineeringJobCard | null>(null);
  const [selectedService, setSelectedService] = useState<Microservice | null>(null);
  
  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Clean initial new job card state
  const [newJobData, setNewJobData] = useState({
    jobName: '',
    department: 'Mechanical Engineering' as EngineeringSubDepartment,
    priority: 'medium' as JobCardPriority,
    details: '',
    status: 'raised' as JobCardStatus,
    estimatedExpense: 0,
    assignedEngineer: '',
    equipmentName: '',
    targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  // Calculate Metrics
  const totalJobCards = engineeringJobCards.length;
  const raisedCount = engineeringJobCards.filter(j => j.status === 'raised').length;
  const approvedCount = engineeringJobCards.filter(j => j.status === 'approved').length;
  const inProgressCount = engineeringJobCards.filter(j => j.status === 'in progress').length;
  const doneCount = engineeringJobCards.filter(j => j.status === 'done').length;

  // Synced deductions to Accounts
  const totalAccountsDeductions = engineeringJobCards
    .filter(j => j.status === 'approved' || j.status === 'in progress' || j.status === 'done')
    .reduce((sum, j) => sum + (j.approvedExpense || j.estimatedExpense || 0), 0);

  // Filtered Job Cards
  const filteredJobCards = engineeringJobCards.filter(card => {
    const matchesDept = selectedSubDept === 'ALL' || card.department === selectedSubDept;
    const matchesStatus = selectedStatus === 'ALL' || card.status === selectedStatus;
    const matchesPriority = selectedPriority === 'ALL' || card.priority === selectedPriority;
    const matchesQuery = `${card.jobName} ${card.code} ${card.details} ${card.assignedEngineer || ''} ${card.equipmentName || ''} ${card.department}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesDept && matchesStatus && matchesPriority && matchesQuery;
  });

  const handleCreateJobCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobData.jobName.trim()) return;

    addEngineeringJobCard({
      jobName: newJobData.jobName.trim(),
      department: newJobData.department,
      priority: newJobData.priority,
      details: newJobData.details.trim(),
      status: newJobData.status,
      estimatedExpense: Number(newJobData.estimatedExpense) || 0,
      approvedExpense: (newJobData.status === 'approved' || newJobData.status === 'in progress' || newJobData.status === 'done')
        ? (Number(newJobData.estimatedExpense) || 0)
        : 0,
      assignedEngineer: newJobData.assignedEngineer || (currentUser ? currentUser.name : 'Engineering Lead'),
      equipmentName: newJobData.equipmentName.trim() || undefined,
      targetDate: newJobData.targetDate
    });

    setIsAddJobModalOpen(false);
    showToast(`Job card "${newJobData.jobName}" successfully created for ${newJobData.department}.`);
    
    // Reset form
    setNewJobData({
      jobName: '',
      department: (selectedSubDept !== 'ALL' ? selectedSubDept as EngineeringSubDepartment : 'Mechanical Engineering'),
      priority: 'medium',
      details: '',
      status: 'raised',
      estimatedExpense: 0,
      assignedEngineer: '',
      equipmentName: '',
      targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  };

  const handleUpdateJobCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJobCard) return;

    updateEngineeringJobCard(editingJobCard.id, editingJobCard);
    setEditingJobCard(null);
    showToast(`Job Card ${editingJobCard.code} updated successfully.`);
  };

  const handleApproveAndSync = (card: EngineeringJobCard) => {
    updateEngineeringJobCardStatus(card.id, 'approved');
    showToast(`Job Card ${card.code} APPROVED: Deduction record of $${(card.estimatedExpense || 0).toLocaleString()} synced to Accounts!`);
  };

  const handleDeleteConfirm = () => {
    if (!deletingJobCard) return;
    deleteEngineeringJobCard(deletingJobCard.id);
    showToast(`Job card ${deletingJobCard.code} deleted.`);
    setDeletingJobCard(null);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto" id="engineering-module-root">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-400/40 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <Check className="w-5 h-5 shrink-0 text-white" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-900/80 p-6 rounded-2xl border border-neutral-800 backdrop-blur-xs shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Department Operations & Engineering Mesh
            </span>
            <span className="text-xs text-neutral-400 font-mono">Accounts Integrated</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Engineering & Infrastructure</h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            Sub-departments (Mechanical, Electrical, Civil, Automation), Job Cards with automated Accounts expense deductions, and microservice topologies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setNewJobData(prev => ({
                ...prev,
                department: selectedSubDept !== 'ALL' ? selectedSubDept as EngineeringSubDepartment : 'Mechanical Engineering'
              }));
              setIsAddJobModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-cyan-600/20 transition-all cursor-pointer"
            id="btn-raise-job-card"
          >
            <Plus className="w-4 h-4" />
            <span>Raise Job Card</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Job Cards */}
        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center gap-4 shadow-sm">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-medium">Active Job Cards</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">
              {totalJobCards} Tasks
            </div>
            <span className="text-[10px] text-cyan-400 font-medium">
              {raisedCount} Raised • {approvedCount + inProgressCount} Active
            </span>
          </div>
        </div>

        {/* Accounts Synced Deductions */}
        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center gap-4 shadow-sm">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-medium">Accounts Synced Deductions</div>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">
              ${totalAccountsDeductions.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Auto-debited in Accounts
            </span>
          </div>
        </div>

        {/* Sub-Departments */}
        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center gap-4 shadow-sm">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-medium">Engineering Sections</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">
              6 Sub-Depts
            </div>
            <span className="text-[10px] text-neutral-400 font-medium">Mechanical, Electrical, etc.</span>
          </div>
        </div>

        {/* Completed Jobs */}
        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center gap-4 shadow-sm">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <CheckCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-medium">Completed Jobs</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">
              {doneCount} Finalized
            </div>
            <span className="text-[10px] text-indigo-300 font-medium">Verified & Archived</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
        <button
          onClick={() => setActiveTab('job-cards')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'job-cards'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
          id="tab-job-cards"
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Sub-Departments & Job Cards</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'services'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
          id="tab-services"
        >
          <Server className="w-3.5 h-3.5" />
          <span>Microservices Mesh ({microservices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pipelines')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'pipelines'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
          id="tab-pipelines"
        >
          <GitBranch className="w-3.5 h-3.5" />
          <span>CI/CD Deploy Pipelines ({deployPipelines.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'architecture'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
          id="tab-architecture"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Architecture & Stack</span>
        </button>
      </div>

      {/* TAB 1: SUB-DEPARTMENTS & JOB CARDS */}
      {activeTab === 'job-cards' && (
        <div className="space-y-6" id="engineering-sub-departments-view">
          
          {/* Sub-Department Selector Ribbon */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-neutral-400 tracking-wider">
                Engineering Sub-Departments
              </span>
              <span className="text-[11px] text-neutral-500">
                Filter or create job cards specifically for each engineering discipline
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
              <button
                onClick={() => setSelectedSubDept('ALL')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedSubDept === 'ALL'
                    ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-sm'
                    : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">🏢</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-bold">
                    {engineeringJobCards.length}
                  </span>
                </div>
                <h4 className="font-bold text-xs mt-2 text-white">All Sub-Depts</h4>
                <p className="text-[10px] text-neutral-400 truncate">Entire Plant</p>
              </button>

              {ENGINEERING_SUB_DEPARTMENTS.map((dept) => {
                const count = engineeringJobCards.filter(j => j.department === dept.id).length;
                const isSelected = selectedSubDept === dept.id;

                return (
                  <button
                    key={dept.id}
                    onClick={() => setSelectedSubDept(dept.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-sm ring-1 ring-cyan-500/40'
                        : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base">{dept.icon}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        count > 0 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-neutral-800 text-neutral-500'
                      }`}>
                        {count}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs mt-2 text-white truncate" title={dept.label}>{dept.label}</h4>
                    <p className="text-[10px] text-neutral-500 truncate" title={dept.desc}>{dept.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search and Secondary Filters */}
          <div className="flex flex-col md:flex-row gap-3 bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Search job cards by name, code, scope, engineer, equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                id="input-search-job-cards"
              />
            </div>

            <div className="flex items-center gap-2">
              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="raised">Raised</option>
                <option value="approved">Approved</option>
                <option value="in progress">In Progress</option>
                <option value="done">Done</option>
              </select>

              {/* Priority Filter */}
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">All Priorities</option>
                <option value="low">Low Priority</option>
                <option value="medium">Medium</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent Critical</option>
              </select>

              <button
                onClick={() => {
                  setNewJobData(prev => ({
                    ...prev,
                    department: selectedSubDept !== 'ALL' ? selectedSubDept as EngineeringSubDepartment : 'Mechanical Engineering'
                  }));
                  setIsAddJobModalOpen(true);
                }}
                className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Job Card</span>
              </button>
            </div>
          </div>

          {/* Job Cards Grid */}
          {filteredJobCards.length === 0 ? (
            <div className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800">
              <EmptyState
                icon={Wrench}
                title={
                  selectedSubDept === 'ALL'
                    ? 'No Job Cards Found'
                    : `No Job Cards for ${selectedSubDept}`
                }
                description={
                  engineeringJobCards.length === 0
                    ? 'No job cards created yet. Create job cards for Mechanical, Electrical, Civil, or Automation departments. Approved job expenses automatically sync to Accounts.'
                    : 'No job cards match your filter criteria. Try adjusting the search query or status filters.'
                }
                actionText="+ Raise First Job Card"
                onAction={() => {
                  setNewJobData(prev => ({
                    ...prev,
                    department: selectedSubDept !== 'ALL' ? selectedSubDept as EngineeringSubDepartment : 'Mechanical Engineering'
                  }));
                  setIsAddJobModalOpen(true);
                }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="engineering-job-cards-list">
              {filteredJobCards.map((card) => {
                const isApprovedOrActive = card.status === 'approved' || card.status === 'in progress' || card.status === 'done';

                return (
                  <div
                    key={card.id}
                    className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between gap-4 shadow-sm"
                    id={`job-card-${card.id}`}
                  >
                    {/* Card Top: Code, Dept, Priority */}
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-2 py-0.5 rounded">
                              {card.code}
                            </span>
                            <span className="text-[11px] text-neutral-400 font-semibold truncate max-w-[150px]">
                              {card.department}
                            </span>
                          </div>
                          <h3 className="font-bold text-white text-sm mt-1.5 line-clamp-2">
                            {card.jobName}
                          </h3>
                        </div>

                        {/* Priority Badge */}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                          card.priority === 'urgent' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                          card.priority === 'high' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          card.priority === 'medium' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          'bg-neutral-800 text-neutral-400'
                        }`}>
                          {card.priority}
                        </span>
                      </div>

                      {/* Details / Scope of Work */}
                      <p className="text-xs text-neutral-400 mt-2 line-clamp-3 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800/80">
                        {card.details || 'No technical scope specified.'}
                      </p>
                    </div>

                    {/* Middle: Equipment, Engineer, Target Date */}
                    <div className="space-y-2 text-xs border-t border-neutral-800/80 pt-2">
                      <div className="flex items-center justify-between text-neutral-400">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-neutral-500" />
                          <span className="truncate max-w-[120px]">{card.assignedEngineer || 'Unassigned'}</span>
                        </span>
                        <span className="flex items-center gap-1 font-mono text-[11px] text-neutral-400">
                          <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                          <span>{card.targetDate || card.createdAt}</span>
                        </span>
                      </div>

                      {card.equipmentName && (
                        <div className="flex items-center gap-1 text-[11px] text-neutral-400 truncate">
                          <Tag className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span className="text-neutral-500">Asset:</span>
                          <span className="text-neutral-300 truncate">{card.equipmentName}</span>
                        </div>
                      )}

                      {/* ACCOUNTS DEDUCTION SYNC STATUS */}
                      <div className={`p-2 rounded-xl border text-[11px] flex items-center justify-between gap-2 ${
                        isApprovedOrActive
                          ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                          : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
                      }`}>
                        <div className="flex items-center gap-1.5 truncate">
                          {isApprovedOrActive ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          )}
                          <span className="font-semibold truncate">
                            {isApprovedOrActive ? 'Synced to Accounts' : 'Pending Expense Approval'}
                          </span>
                        </div>
                        <span className="font-mono font-bold shrink-0">
                          ${(card.approvedExpense || card.estimatedExpense || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Status Stage Controls & Actions */}
                    <div className="border-t border-neutral-800/80 pt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-neutral-500 font-mono">Stage:</span>
                        
                        {/* Status badge */}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                          card.status === 'raised' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          card.status === 'approved' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                          card.status === 'in progress' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                          'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {card.status}
                        </span>
                      </div>

                      {/* Stage Progression Action Buttons */}
                      <div className="flex items-center gap-1.5">
                        {card.status === 'raised' && (
                          <button
                            onClick={() => handleApproveAndSync(card)}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-colors cursor-pointer"
                            title="Approve Job & Sync Deduction to Accounts"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Approve & Sync to Accounts</span>
                          </button>
                        )}

                        {card.status === 'approved' && (
                          <button
                            onClick={() => updateEngineeringJobCardStatus(card.id, 'in progress')}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-colors cursor-pointer"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                            <span>Set In Progress</span>
                          </button>
                        )}

                        {card.status === 'in progress' && (
                          <button
                            onClick={() => updateEngineeringJobCardStatus(card.id, 'done')}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-colors cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark Done</span>
                          </button>
                        )}

                        {card.status === 'done' && (
                          <span className="flex-1 py-1 text-center text-emerald-400 font-bold text-[11px] bg-emerald-950/40 rounded-lg border border-emerald-500/20">
                            ✓ Job Card Completed
                          </span>
                        )}

                        {/* Edit & Delete Action Buttons */}
                        <button
                          onClick={() => setEditingJobCard(card)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit Job Card"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                        </button>
                        <button
                          onClick={() => setDeletingJobCard(card)}
                          className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40 transition-colors cursor-pointer"
                          title="Delete Job Card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MICROSERVICES */}
      {activeTab === 'services' && (
        microservices.length === 0 ? (
          <div className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
            <EmptyState
              icon={Server}
              title="No Microservices Registered"
              description="Register microservice clusters, gateway endpoints, and background worker topologies to monitor real-time uptime, latency, and deployments."
              actionText="+ Register Service"
              onAction={() => addMicroservice({
                name: 'Identity & Access Gateway',
                code: 'SRV-AUTH',
                status: 'Healthy',
                uptimePercent: 99.98,
                latencyMs: 24,
                version: 'v2.4.0',
                techStack: ['Go', 'gRPC', 'Redis'],
                leadEngineer: currentUser ? currentUser.name : 'Engineering Lead',
                repository: 'github.com/enterprise/auth-gateway',
                lastDeployed: new Date().toISOString().split('T')[0]
              })}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {microservices.map((svc) => (
              <div
                key={svc.id}
                className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-4 hover:border-cyan-500/40 transition-all cursor-pointer"
                onClick={() => setSelectedService(svc)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">{svc.code}</span>
                      <span className="text-[10px] font-mono text-neutral-400">({svc.version})</span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1">{svc.name}</h3>
                    <p className="text-xs text-neutral-400 font-mono mt-0.5">{svc.repository}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {svc.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                    <div className="text-neutral-500 text-[10px]">Uptime</div>
                    <div className="font-mono font-bold text-white mt-0.5">{svc.uptimePercent}%</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                    <div className="text-neutral-500 text-[10px]">Latency</div>
                    <div className="font-mono font-bold text-white mt-0.5">{svc.latencyMs} ms</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                    <div className="text-neutral-500 text-[10px]">Lead</div>
                    <div className="font-medium text-white truncate mt-0.5">{svc.leadEngineer}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs">
                  <div className="flex items-center gap-1.5">
                    {svc.techStack.map((tech) => (
                      <span key={tech} className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono text-[10px]">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <span className="text-neutral-500 font-mono text-[10px]">
                    Deployed: {svc.lastDeployed}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* TAB 3: CI/CD PIPELINES */}
      {activeTab === 'pipelines' && (
        <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
            <div>
              <h3 className="text-sm font-bold text-white">Automated CI/CD Delivery Pipelines</h3>
              <p className="text-xs text-neutral-400">Continuous integration tests, container builds, and blue-green deployments</p>
            </div>
            <button
              onClick={() => {
                if (deployPipelines[0]) {
                  triggerPipelineDeploy(deployPipelines[0].id);
                  showToast('Production deployment pipeline triggered.');
                }
              }}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Trigger Pipeline Run</span>
            </button>
          </div>

          <div className="divide-y divide-neutral-800">
            {deployPipelines.map((pipe) => (
              <div key={pipe.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-neutral-800/30 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{pipe.name}</span>
                    <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800/50">
                      {pipe.branch}
                    </span>
                    <span className="font-mono text-[10px] text-neutral-500">{pipe.commitHash}</span>
                  </div>
                  <p className="text-xs text-neutral-400">{pipe.commitMessage}</p>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="text-right">
                    <div className="text-neutral-400 text-[10px]">Duration: {pipe.durationSec}s</div>
                    <div className="text-neutral-500 text-[10px]">{pipe.triggeredAt}</div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    pipe.status === 'Success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    pipe.status === 'Running' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 animate-pulse' :
                    'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {pipe.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ARCHITECTURE */}
      {activeTab === 'architecture' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Core Stack Specification</span>
            </h3>
            <div className="space-y-2 text-xs text-neutral-300">
              <div className="flex justify-between p-2 rounded-lg bg-neutral-950">
                <span className="text-neutral-400">Application Framework</span>
                <span className="font-mono text-cyan-400 font-bold">React 18 + Vite (TypeScript)</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-neutral-950">
                <span className="text-neutral-400">Offline State Engine</span>
                <span className="font-mono text-emerald-400 font-bold">Dexie IndexedDB (Zero Sample Data)</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-neutral-950">
                <span className="text-neutral-400">Styling & Design System</span>
                <span className="font-mono text-neutral-200">Tailwind CSS 3.4 (Sophisticated Dark)</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-neutral-950">
                <span className="text-neutral-400">Finance Ledger Hook</span>
                <span className="font-mono text-cyan-300 font-bold">Automated Job Card Deduction Sync</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Engineering Department Topology</span>
            </h3>
            <p className="text-xs text-neutral-400">
              Each engineering sub-section (Mechanical, Electrical, Civil, Automation, Software, Chemical) operates with dedicated Job Cards. When a Job Card's budget or expense is approved, the ERP system posts an immediate debit deduction in the Accounts & Finance ledger.
            </p>
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 space-y-1 font-mono">
              <div className="text-emerald-400 font-bold">✓ Direct Accounts Synchronization: Active</div>
              <div className="text-neutral-400">✓ Purchase Orders Linkage: Supported</div>
              <div className="text-neutral-400">✓ Multi-Section Routing: Configured</div>
            </div>
          </div>
        </div>
      )}

      {/* RAISE JOB CARD MODAL */}
      {isAddJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto" id="modal-raise-job-card">
          <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700 text-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-cyan-400" />
                  <span>Raise Engineering Job Card</span>
                </h2>
                <p className="text-[11px] text-neutral-400">
                  Assign technical scope to sub-departments. Approved expenses immediately create a deduction record in Accounts.
                </p>
              </div>
              <button onClick={() => setIsAddJobModalOpen(false)} className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateJobCard} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              
              {/* Job Name */}
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Job Name / Work Order Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Centrifugal Slurry Pump Bearing & Seal Overhaul"
                  value={newJobData.jobName}
                  onChange={(e) => setNewJobData({ ...newJobData, jobName: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-medium"
                  id="input-job-name"
                />
              </div>

              {/* Sub-Department & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Assigned Sub-Department *</label>
                  <select
                    value={newJobData.department}
                    onChange={(e) => setNewJobData({ ...newJobData, department: e.target.value as EngineeringSubDepartment })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-semibold"
                    id="select-job-department"
                  >
                    {ENGINEERING_SUB_DEPARTMENTS.map(d => (
                      <option key={d.id} value={d.id}>{d.label} Engineering ({d.id})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Priority Level *</label>
                  <select
                    value={newJobData.priority}
                    onChange={(e) => setNewJobData({ ...newJobData, priority: e.target.value as JobCardPriority })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-semibold"
                    id="select-job-priority"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent Critical</option>
                  </select>
                </div>
              </div>

              {/* Initial Status & Estimated Expense */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Job Status *</label>
                  <select
                    value={newJobData.status}
                    onChange={(e) => setNewJobData({ ...newJobData, status: e.target.value as JobCardStatus })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-semibold"
                    id="select-job-status"
                  >
                    <option value="raised">Raised (Draft Requisition)</option>
                    <option value="approved">Approved (Instantly creates deduction in Accounts!)</option>
                    <option value="in progress">In Progress</option>
                    <option value="done">Done (Completed)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-emerald-400 font-semibold mb-1">Estimated Expense Amount ($)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 1850"
                    value={newJobData.estimatedExpense || ''}
                    onChange={(e) => setNewJobData({ ...newJobData, estimatedExpense: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                    id="input-job-expense"
                  />
                  <span className="text-[10px] text-neutral-400 mt-0.5 block">
                    {newJobData.status === 'approved' || newJobData.status === 'in progress'
                      ? '✓ Will automatically create a deduction in Accounts & Finance.'
                      : 'Will be deducted from Accounts once approved.'}
                  </span>
                </div>
              </div>

              {/* Details & Scope of Work */}
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Details & Technical Scope of Work *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide precise details of the job, required replacement components, safety protocols, and acceptance criteria..."
                  value={newJobData.details}
                  onChange={(e) => setNewJobData({ ...newJobData, details: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
                  id="textarea-job-details"
                />
              </div>

              {/* Assigned Engineer, Equipment & Target Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Assigned Lead Engineer</label>
                  <input
                    type="text"
                    placeholder="e.g. Marcus Vance"
                    value={newJobData.assignedEngineer}
                    onChange={(e) => setNewJobData({ ...newJobData, assignedEngineer: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Equipment / Asset Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. PUMP-SL-04B"
                    value={newJobData.equipmentName}
                    onChange={(e) => setNewJobData({ ...newJobData, equipmentName: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Target Completion Date</label>
                  <input
                    type="date"
                    value={newJobData.targetDate}
                    onChange={(e) => setNewJobData({ ...newJobData, targetDate: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddJobModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-md shadow-cyan-600/20 active:scale-[0.98] transition-all cursor-pointer"
                  id="btn-submit-job-card"
                >
                  Create & Route to Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT JOB CARD MODAL */}
      {editingJobCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto" id="modal-edit-job-card">
          <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700 text-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  <span>Edit Job Card: {editingJobCard.code}</span>
                </h2>
                <p className="text-[11px] text-neutral-400">Modify job details, priority, department routing, and expense allocations.</p>
              </div>
              <button onClick={() => setEditingJobCard(null)} className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateJobCard} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Job Name *</label>
                <input
                  type="text"
                  required
                  value={editingJobCard.jobName}
                  onChange={(e) => setEditingJobCard({ ...editingJobCard, jobName: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Department</label>
                  <select
                    value={editingJobCard.department}
                    onChange={(e) => setEditingJobCard({ ...editingJobCard, department: e.target.value as EngineeringSubDepartment })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    {ENGINEERING_SUB_DEPARTMENTS.map(d => (
                      <option key={d.id} value={d.id}>{d.label} ({d.id})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Priority</label>
                  <select
                    value={editingJobCard.priority}
                    onChange={(e) => setEditingJobCard({ ...editingJobCard, priority: e.target.value as JobCardPriority })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Status</label>
                  <select
                    value={editingJobCard.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as JobCardStatus;
                      setEditingJobCard({
                        ...editingJobCard,
                        status: newStatus,
                        approvedExpense: (newStatus === 'approved' || newStatus === 'in progress' || newStatus === 'done')
                          ? (editingJobCard.approvedExpense || editingJobCard.estimatedExpense || 0)
                          : editingJobCard.approvedExpense
                      });
                    }}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-semibold"
                  >
                    <option value="raised">Raised</option>
                    <option value="approved">Approved</option>
                    <option value="in progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-emerald-400 font-semibold mb-1">Expense Amount ($)</label>
                  <input
                    type="number"
                    value={editingJobCard.estimatedExpense}
                    onChange={(e) => setEditingJobCard({
                      ...editingJobCard,
                      estimatedExpense: Number(e.target.value),
                      approvedExpense: editingJobCard.status !== 'raised' ? Number(e.target.value) : editingJobCard.approvedExpense
                    })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Details & Technical Scope</label>
                <textarea
                  rows={3}
                  value={editingJobCard.details}
                  onChange={(e) => setEditingJobCard({ ...editingJobCard, details: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Assigned Lead Engineer</label>
                  <input
                    type="text"
                    value={editingJobCard.assignedEngineer || ''}
                    onChange={(e) => setEditingJobCard({ ...editingJobCard, assignedEngineer: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={editingJobCard.targetDate || ''}
                    onChange={(e) => setEditingJobCard({ ...editingJobCard, targetDate: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingJobCard(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingJobCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-neutral-900 border border-rose-800/60 text-white rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Job Card?</h3>
                <p className="text-xs text-neutral-400 mt-0.5">{deletingJobCard.code} - {deletingJobCard.jobName}</p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 bg-neutral-950 p-3 rounded-xl border border-neutral-800">
              Are you sure you want to delete this job card? If expenses were approved and synced into Accounts, this will archive the work record.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingJobCard(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/20 cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
