import React, { useState, useEffect } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  LayoutDashboard,
  Users,
  ScanLine,
  Banknote,
  Briefcase,
  KanbanSquare,
  Package,
  Receipt,
  FileBarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Truck,
  Cpu,
  TrendingUp,
  ArrowRightLeft,
  FileText,
  CheckSquare,
  FolderKanban,
  Building,
  Wrench,
  Layers
} from 'lucide-react';

interface SubNavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    badgeColor?: string;
    subItems?: SubNavItem[];
  }[];
}

export const Sidebar: React.FC<{ isCollapsed: boolean; setIsCollapsed: (c: boolean) => void }> = ({
  isCollapsed,
  setIsCollapsed
}) => {
  const {
    activeModule,
    setActiveModule,
    currentlyInsideCount,
    payrollRuns,
    applicants,
    tasks,
    purchaseOrders,
    deals
  } = useERP();

  const [hrExpanded, setHrExpanded] = useState(true);

  // If active module is an HR subitem, make sure HR accordion is open
  useEffect(() => {
    if (['recruitment', 'payroll', 'employees', 'access'].includes(activeModule)) {
      setHrExpanded(true);
    }
  }, [activeModule]);

  const openApplicantsCount = applicants.filter(a => a.stage !== 'HIRED' && a.stage !== 'REJECTED').length;
  const draftPayrollCount = payrollRuns.filter(p => p.status === 'draft').length;
  const pendingTasksCount = tasks.filter(t => t.status !== 'Done').length;
  const pendingPOCount = purchaseOrders.filter(po => po.status === 'Requested' || po.status === 'Ordered').length;

  const hrSubItems: SubNavItem[] = [
    {
      id: 'recruitment',
      label: 'Recruitment and ATS',
      icon: Briefcase,
      badge: openApplicantsCount > 0 ? openApplicantsCount : undefined,
      badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
    },
    {
      id: 'payroll',
      label: 'Payroll and Compensation',
      icon: Banknote,
      badge: draftPayrollCount > 0 ? `${draftPayrollCount} Draft` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
    },
    {
      id: 'employees',
      label: 'Employees Directory',
      icon: Users
    },
    {
      id: 'access',
      label: 'Biometric Access & Logs',
      icon: ScanLine,
      badge: currentlyInsideCount,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
    }
  ];

  return (
    <aside
      className={`fixed md:sticky top-0 left-0 z-40 h-screen bg-neutral-950 border-r border-neutral-800 flex flex-col justify-between transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      id="main-app-sidebar"
    >
      {/* Brand & Logo Section */}
      <div className="flex flex-col h-full overflow-hidden">
        <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-800 shrink-0">
          <div
            onClick={() => setActiveModule('dashboard')}
            className="flex items-center gap-3 cursor-pointer overflow-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-base shadow-lg shadow-blue-500/25 shrink-0">
              BF
            </div>
            {!isCollapsed && (
              <div className="leading-tight truncate">
                <span className="font-bold text-sm text-white tracking-wide block">BizFlow ERP</span>
                <span className="text-[10px] text-neutral-400 block font-mono">Workplace Enterprise</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors hidden md:block cursor-pointer"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            id="btn-toggle-sidebar"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Scrollable Area */}
        <nav className="p-3 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* SECTION: OVERVIEW */}
          <div className="space-y-1">
            <button
              onClick={() => setActiveModule('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                activeModule === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900'
              }`}
              title={isCollapsed ? 'Operations Dashboard' : undefined}
              id="nav-dashboard"
            >
              <LayoutDashboard className={`w-4 h-4 shrink-0 ${activeModule === 'dashboard' ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-200'}`} />
              {!isCollapsed && <span className="truncate flex-1 text-left">Operations Dashboard</span>}
              {isCollapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-neutral-900 text-white text-xs rounded-lg shadow-xl border border-neutral-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  Operations Dashboard
                </span>
              )}
            </button>
          </div>

          {/* SECTION: DEPARTMENTS */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wider">
                Departments
              </div>
            )}

            {/* HR Accordion with Sub-navs */}
            <div className="space-y-0.5">
              <button
                onClick={() => {
                  if (isCollapsed) {
                    setIsCollapsed(false);
                    setHrExpanded(true);
                  } else {
                    setHrExpanded(!hrExpanded);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                  ['recruitment', 'payroll', 'employees', 'access'].includes(activeModule)
                    ? 'text-blue-400 bg-blue-500/10'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
                id="nav-hr-accordion"
              >
                <div className="flex items-center gap-3 truncate">
                  <Users className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span className="font-semibold text-white">HR</span>}
                </div>
                {!isCollapsed && (
                  <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform ${hrExpanded ? 'rotate-180' : ''}`} />
                )}
              </button>

              {/* Sub-nav items for HR */}
              {hrExpanded && !isCollapsed && (
                <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-neutral-800 ml-4">
                  {hrSubItems.map((sub) => {
                    const SubIcon = sub.icon;
                    const isSubActive = activeModule === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => setActiveModule(sub.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                          isSubActive
                            ? 'bg-blue-600 text-white font-medium shadow-xs shadow-blue-600/20'
                            : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900/60'
                        }`}
                        id={`nav-sub-${sub.id}`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <SubIcon className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{sub.label}</span>
                        </div>
                        {sub.badge !== undefined && (
                          <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${sub.badgeColor || 'bg-neutral-800 text-neutral-300'}`}>
                            {sub.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Accounting and Finance */}
            <button
              onClick={() => setActiveModule('finance')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                activeModule === 'finance'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900'
              }`}
              title={isCollapsed ? 'Accounting & Finance' : undefined}
              id="nav-finance"
            >
              <Receipt className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate flex-1 text-left">Accounting and Finance</span>}
              {isCollapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-neutral-900 text-white text-xs rounded-lg shadow-xl border border-neutral-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  Accounting and Finance
                </span>
              )}
            </button>

            {/* Procurement and Logistics */}
            <button
              onClick={() => setActiveModule('procurement')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                activeModule === 'procurement'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900'
              }`}
              title={isCollapsed ? 'Procurement & Logistics' : undefined}
              id="nav-procurement"
            >
              <Truck className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate flex-1 text-left">Procurement and Logistics</span>}
              {!isCollapsed && pendingPOCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {pendingPOCount}
                </span>
              )}
              {isCollapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-neutral-900 text-white text-xs rounded-lg shadow-xl border border-neutral-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  Procurement and Logistics
                </span>
              )}
            </button>

            {/* Project Management */}
            <button
              onClick={() => setActiveModule('projects')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                activeModule === 'projects'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900'
              }`}
              title={isCollapsed ? 'Project Management' : undefined}
              id="nav-projects"
            >
              <FolderKanban className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate flex-1 text-left">Project Management</span>}
              {isCollapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-neutral-900 text-white text-xs rounded-lg shadow-xl border border-neutral-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  Project Management
                </span>
              )}
            </button>

            {/* Engineering */}
            <button
              onClick={() => setActiveModule('engineering')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                activeModule === 'engineering'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900'
              }`}
              title={isCollapsed ? 'Engineering' : undefined}
              id="nav-engineering"
            >
              <Cpu className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate flex-1 text-left">Engineering</span>}
              {isCollapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-neutral-900 text-white text-xs rounded-lg shadow-xl border border-neutral-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  Engineering
                </span>
              )}
            </button>

            {/* Sales and CRM */}
            <button
              onClick={() => setActiveModule('sales-crm')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                activeModule === 'sales-crm'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900'
              }`}
              title={isCollapsed ? 'Sales and CRM' : undefined}
              id="nav-sales-crm"
            >
              <TrendingUp className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate flex-1 text-left">Sales and CRM</span>}
              {!isCollapsed && deals.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {deals.length}
                </span>
              )}
              {isCollapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-neutral-900 text-white text-xs rounded-lg shadow-xl border border-neutral-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  Sales and CRM
                </span>
              )}
            </button>
          </div>

          {/* SECTION: TOOLS & INTELLIGENCE */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wider">
                Tools & Intelligence
              </div>
            )}

            {/* Projects and Tasks */}
            <button
              onClick={() => setActiveModule('tasks')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                activeModule === 'tasks'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900'
              }`}
              title={isCollapsed ? 'Projects and Tasks' : undefined}
              id="nav-tasks"
            >
              <CheckSquare className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate flex-1 text-left">Projects and Tasks</span>}
              {!isCollapsed && pendingTasksCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-indigo-500/20 text-indigo-300">
                  {pendingTasksCount}
                </span>
              )}
              {isCollapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-neutral-900 text-white text-xs rounded-lg shadow-xl border border-neutral-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  Projects and Tasks
                </span>
              )}
            </button>

            {/* Reports and Intelligence */}
            <button
              onClick={() => setActiveModule('reports')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                activeModule === 'reports'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900'
              }`}
              title={isCollapsed ? 'Reports and Intelligence' : undefined}
              id="nav-reports"
            >
              <FileBarChart2 className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate flex-1 text-left">Reports and Intelligence</span>}
              {isCollapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-neutral-900 text-white text-xs rounded-lg shadow-xl border border-neutral-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  Reports and Intelligence
                </span>
              )}
            </button>

            {/* Assets and Inventory */}
            <button
              onClick={() => setActiveModule('inventory')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                activeModule === 'inventory'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900'
              }`}
              title={isCollapsed ? 'Assets and Inventory' : undefined}
              id="nav-inventory"
            >
              <Package className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate flex-1 text-left">Assets and Inventory</span>}
              {isCollapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-neutral-900 text-white text-xs rounded-lg shadow-xl border border-neutral-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  Assets and Inventory
                </span>
              )}
            </button>

            {/* Currency Exchange Tool */}
            <button
              onClick={() => setActiveModule('currency-exchange')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                activeModule === 'currency-exchange'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900'
              }`}
              title={isCollapsed ? 'Currency Exchange Tool' : undefined}
              id="nav-currency-exchange"
            >
              <ArrowRightLeft className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate flex-1 text-left">Currency Exchange Tool</span>}
              {isCollapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-neutral-900 text-white text-xs rounded-lg shadow-xl border border-neutral-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  Currency Exchange Tool
                </span>
              )}
            </button>

            {/* Notes and Text Pad */}
            <button
              onClick={() => setActiveModule('notes-pad')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                activeModule === 'notes-pad'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900'
              }`}
              title={isCollapsed ? 'Notes and Text Pad' : undefined}
              id="nav-notes-pad"
            >
              <FileText className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate flex-1 text-left">Notes and Text Pad</span>}
              {isCollapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-neutral-900 text-white text-xs rounded-lg shadow-xl border border-neutral-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  Notes and Text Pad
                </span>
              )}
            </button>

            {/* Settings and Audit Logs */}
            <button
              onClick={() => setActiveModule('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                activeModule === 'settings'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900'
              }`}
              title={isCollapsed ? 'Settings and Audit Logs' : undefined}
              id="nav-settings"
            >
              <Settings className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate flex-1 text-left">Settings and Audit Logs</span>}
              {isCollapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-neutral-900 text-white text-xs rounded-lg shadow-xl border border-neutral-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  Settings and Audit Logs
                </span>
              )}
            </button>
          </div>

        </nav>
      </div>

      {/* Footer / System Status */}
      <div className="p-3 border-t border-neutral-800/80 bg-neutral-950/60 shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-900/80 border border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-neutral-300 font-medium truncate">System All Operational</span>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="System Online" />
          </div>
        )}
      </div>
    </aside>
  );
};
