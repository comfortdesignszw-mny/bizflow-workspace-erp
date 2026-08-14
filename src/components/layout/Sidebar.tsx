import React, { useState, useEffect } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  LayoutDashboard,
  Users,
  ScanLine,
  Banknote,
  Briefcase,
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
  Download,
  Server,
  Terminal,
  Shield,
  Activity
} from 'lucide-react';

interface SubNavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
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
    deals,
    itTickets,
    isOnline,
    syncStatus,
    isInstallPromptAvailable,
    installPWA
  } = useERP();

  const [hrExpanded, setHrExpanded] = useState(false);

  // If active module is an HR subitem, keep HR accordion open when expanded
  useEffect(() => {
    if (['recruitment', 'payroll', 'employees', 'access'].includes(activeModule)) {
      setHrExpanded(true);
    }
  }, [activeModule]);

  const openApplicantsCount = applicants.filter(a => a.stage !== 'HIRED' && a.stage !== 'REJECTED').length;
  const draftPayrollCount = payrollRuns.filter(p => p.status === 'draft').length;
  const pendingTasksCount = tasks.filter(t => t.status !== 'Done').length;
  const pendingPOCount = purchaseOrders.filter(po => po.status === 'Requested' || po.status === 'Ordered').length;
  const openITTicketsCount = itTickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed').length;

  const handleNavClick = (moduleId: string) => {
    setActiveModule(moduleId);
    // Auto-collapse on selection to leave only nav icons for maximum UI view space
    setIsCollapsed(true);
  };

  const hrSubItems: SubNavItem[] = [
    {
      id: 'recruitment',
      label: 'Recruitment & ATS',
      icon: Briefcase,
      badge: openApplicantsCount > 0 ? openApplicantsCount : undefined,
      badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
    },
    {
      id: 'payroll',
      label: 'Payroll & Comp',
      icon: Banknote,
      badge: draftPayrollCount > 0 ? `${draftPayrollCount} Draft` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
    },
    {
      id: 'employees',
      label: 'Staff Directory',
      icon: Users
    },
    {
      id: 'access',
      label: 'Biometric Access',
      icon: ScanLine,
      badge: currentlyInsideCount,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
    }
  ];

  return (
    <aside
      className={`fixed md:sticky top-0 left-0 z-40 h-screen bg-neutral-950 border-r border-neutral-800 flex flex-col justify-between transition-all duration-300 ${
        isCollapsed ? 'w-16 md:w-20' : 'w-64'
      }`}
      id="main-app-sidebar"
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Brand & Logo Section */}
        <div className="h-14 md:h-16 flex items-center justify-between px-3 md:px-4 border-b border-neutral-800 shrink-0">
          <div
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer overflow-hidden group"
          >
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-neutral-900 border border-neutral-700/80 p-0.5 overflow-hidden flex items-center justify-center shrink-0 shadow-lg shadow-blue-950/40 group-hover:border-blue-500/50 transition-colors">
              <img
                src="/icons/icon-192x192.png"
                alt="BizFlow ERP Logo"
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            {!isCollapsed && (
              <div className="leading-tight truncate">
                <span className="font-bold text-sm text-white tracking-wide block">BizFlow ERP</span>
                <span className="text-[10px] text-blue-400 block font-mono font-medium">Offline Engine</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse to Icons'}
            id="btn-toggle-sidebar"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Scrollable Area */}
        <nav className="p-2 md:p-3 space-y-2.5 md:space-y-3.5 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* SECTION: OVERVIEW */}
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
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
              <div className="px-2.5 text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wider">
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
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                  ['recruitment', 'payroll', 'employees', 'access'].includes(activeModule)
                    ? 'text-blue-400 bg-blue-500/10'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
                title={isCollapsed ? 'HR Department' : undefined}
                id="nav-hr-accordion"
              >
                <div className="flex items-center gap-3 truncate">
                  <Users className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span className="font-semibold text-white">HR Department</span>}
                </div>
                {!isCollapsed && (
                  <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform ${hrExpanded ? 'rotate-180' : ''}`} />
                )}
                {isCollapsed && (
                  <span className="absolute left-full ml-3 px-2.5 py-1 bg-neutral-900 text-white text-xs rounded-lg shadow-xl border border-neutral-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    HR Department
                  </span>
                )}
              </button>

              {/* Sub-nav items for HR */}
              {hrExpanded && !isCollapsed && (
                <div className="pl-3 pr-1 py-1 space-y-1 border-l-2 border-neutral-800 ml-3.5">
                  {hrSubItems.map((sub) => {
                    const SubIcon = sub.icon;
                    const isSubActive = activeModule === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => handleNavClick(sub.id)}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
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
              onClick={() => handleNavClick('finance')}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                activeModule === 'finance'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900'
              }`}
              title={isCollapsed ? 'Accounting & Finance' : undefined}
              id="nav-finance"
            >
              <Receipt className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate flex-1 text-left">Finance & Accounting</span>}
              {isCollapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-neutral-900 text-white text-xs rounded-lg shadow-xl border border-neutral-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  Finance & Accounting
                </span>
              )}
            </button>

            {/* Procurement and Logistics */}
            <button
              onClick={() => handleNavClick('procurement')}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                activeModule === 'procurement'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900'
              }`}
              title={isCollapsed ? 'Procurement & Logistics' : undefined}
              id="nav-procurement"
            >
              <Truck className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate flex-1 text-left">Procurement & Logistics</span>}
              {!isCollapsed && pendingPOCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {pendingPOCount}
                </span>
              )}
              {isCollapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-neutral-900 text-white text-xs rounded-lg shadow-xl border border-neutral-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  Procurement & Logistics
                </span>
              )}
            </button>

            {/* IT Department (Customized for IT Issues, Server Health, Helpdesk & MDM) */}
            <button
              onClick={() => handleNavClick('it-department')}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                activeModule === 'it-department' || activeModule === 'projects'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900'
              }`}
              title={isCollapsed ? 'IT Department & Systems' : undefined}
              id="nav-it-department"
            >
              <Server className="w-4 h-4 shrink-0 text-blue-400 group-hover:text-blue-300" />
              {!isCollapsed && <span className="truncate flex-1 text-left">IT Department</span>}
              {!isCollapsed && openITTicketsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {openITTicketsCount}
                </span>
              )}
              {isCollapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-neutral-900 text-white text-xs rounded-lg shadow-xl border border-neutral-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  IT Department & Systems
                </span>
              )}
            </button>

            {/* Engineering */}
            <button
              onClick={() => handleNavClick('engineering')}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
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
              onClick={() => handleNavClick('sales-crm')}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                activeModule === 'sales-crm'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900'
              }`}
              title={isCollapsed ? 'Sales and CRM' : undefined}
              id="nav-sales-crm"
            >
              <TrendingUp className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate flex-1 text-left">Sales & CRM</span>}
              {!isCollapsed && deals.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {deals.length}
                </span>
              )}
              {isCollapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-neutral-900 text-white text-xs rounded-lg shadow-xl border border-neutral-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  Sales & CRM
                </span>
              )}
            </button>
          </div>

          {/* SECTION: TOOLS & INTELLIGENCE */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="px-2.5 text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wider">
                Tools & Intelligence
              </div>
            )}

            {/* Tasks and Sprints */}
            <button
              onClick={() => handleNavClick('tasks')}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                activeModule === 'tasks'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900'
              }`}
              title={isCollapsed ? 'Tasks & Sprints' : undefined}
              id="nav-tasks"
            >
              <CheckSquare className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate flex-1 text-left">Tasks & Sprints</span>}
              {!isCollapsed && pendingTasksCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-indigo-500/20 text-indigo-300">
                  {pendingTasksCount}
                </span>
              )}
              {isCollapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-neutral-900 text-white text-xs rounded-lg shadow-xl border border-neutral-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  Tasks & Sprints
                </span>
              )}
            </button>

            {/* Reports and Intelligence */}
            <button
              onClick={() => handleNavClick('reports')}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                activeModule === 'reports'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900'
              }`}
              title={isCollapsed ? 'Reports & BI' : undefined}
              id="nav-reports"
            >
              <FileBarChart2 className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate flex-1 text-left">Reports & Analytics</span>}
              {isCollapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-neutral-900 text-white text-xs rounded-lg shadow-xl border border-neutral-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  Reports & Analytics
                </span>
              )}
            </button>

            {/* Assets and Inventory */}
            <button
              onClick={() => handleNavClick('inventory')}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                activeModule === 'inventory'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900'
              }`}
              title={isCollapsed ? 'Assets & Inventory' : undefined}
              id="nav-inventory"
            >
              <Package className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate flex-1 text-left">Assets & Inventory</span>}
              {isCollapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-neutral-900 text-white text-xs rounded-lg shadow-xl border border-neutral-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  Assets & Inventory
                </span>
              )}
            </button>

            {/* Currency Exchange Tool */}
            <button
              onClick={() => handleNavClick('currency-exchange')}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                activeModule === 'currency-exchange'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900'
              }`}
              title={isCollapsed ? 'Currency Exchange' : undefined}
              id="nav-currency-exchange"
            >
              <ArrowRightLeft className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate flex-1 text-left">Currency Exchange</span>}
              {isCollapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-neutral-900 text-white text-xs rounded-lg shadow-xl border border-neutral-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  Currency Exchange
                </span>
              )}
            </button>

            {/* Notes and Text Pad */}
            <button
              onClick={() => handleNavClick('notes-pad')}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                activeModule === 'notes-pad'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900'
              }`}
              title={isCollapsed ? 'Notes & Scratchpad' : undefined}
              id="nav-notes-pad"
            >
              <FileText className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate flex-1 text-left">Notes & Scratchpad</span>}
              {isCollapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-neutral-900 text-white text-xs rounded-lg shadow-xl border border-neutral-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  Notes & Scratchpad
                </span>
              )}
            </button>

            {/* Settings and Audit Logs */}
            <button
              onClick={() => handleNavClick('settings')}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                activeModule === 'settings'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900'
              }`}
              title={isCollapsed ? 'Settings & Security Audit' : undefined}
              id="nav-settings"
            >
              <Settings className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate flex-1 text-left">Settings & Audit</span>}
              {isCollapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-neutral-900 text-white text-xs rounded-lg shadow-xl border border-neutral-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  Settings & Audit
                </span>
              )}
            </button>
          </div>

        </nav>
      </div>

      {/* Footer / System Status */}
      <div className="p-2.5 md:p-3 border-t border-neutral-800/80 bg-neutral-950/60 shrink-0 space-y-2">
        {isInstallPromptAvailable && !isCollapsed && (
          <button
            onClick={installPWA}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-900/30 transition-all cursor-pointer"
            id="btn-sidebar-install-pwa"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install Native App</span>
          </button>
        )}

        {!isCollapsed ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-900/80 border border-neutral-800">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className={`w-2 h-2 rounded-full shrink-0 ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <div className="leading-tight truncate">
                <span className="text-[11px] text-neutral-300 font-medium block truncate">
                  {isOnline ? (syncStatus === 'syncing' ? 'Syncing DB...' : 'Dexie DB Synced') : 'Offline Mode (Local)'}
                </span>
              </div>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <div
              className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}
              title={isOnline ? 'Dexie IndexedDB Online' : 'Offline Mode (Local Sandbox)'}
            />
          </div>
        )}
      </div>
    </aside>
  );
};
