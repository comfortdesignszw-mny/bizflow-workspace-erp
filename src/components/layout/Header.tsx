import React, { useState, useMemo } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Scan,
  Users,
  Search,
  Bell,
  Shield,
  ChevronDown,
  Building2,
  Sparkles,
  RefreshCw,
  LogOut,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Briefcase,
  KanbanSquare,
  ArrowRight,
  X,
  Zap,
  Info,
  Wifi,
  WifiOff,
  Download,
  Menu
} from 'lucide-react';
import { UserPersona } from '../../types/erp';

export const Header: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    availablePersonas,
    currentlyInsideCount,
    employees,
    projects,
    tasks,
    payrollRuns,
    itTickets,
    todayLateCount,
    setIsQRScannerOpen,
    resetAllDataToDefault,
    setActiveModule,
    isOnline,
    syncStatus,
    lastSyncTime,
    triggerManualSync,
    isInstallPromptAvailable,
    installPWA,
    isMobileNavOpen,
    setIsMobileNavOpen,
    activeModule
  } = useERP();

  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<{ id: string; title: string; desc: string; type: 'urgent' | 'warning' | 'info'; targetModule?: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dismissedNotificationIds, setDismissedNotificationIds] = useState<string[]>([]);

  const totalEmployees = employees.length;

  // Derive urgent notifications from IT Incidents, Projects, Tasks, Attendance, and Payroll
  const notifications = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      description: string;
      time: string;
      priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
      type: 'project' | 'task' | 'attendance' | 'payroll' | 'it';
      targetModule: string;
      badgeText: string;
    }> = [];

    // 1. IT Incident Tickets (Critical / High)
    (itTickets || []).forEach((t) => {
      if (t.status !== 'Resolved' && t.status !== 'Closed') {
        const isUrgent = t.priority === 'Critical' || t.priority === 'High';
        list.push({
          id: `it-${t.id}`,
          title: `IT Incident ${t.ticketNumber}: ${t.title}`,
          description: `Category: ${t.category}. Requester: ${t.requesterName} (${t.department}). SLA: ${t.slaTargetHours}h target.`,
          time: 'Active IT Ticket',
          priority: t.priority === 'Critical' ? 'CRITICAL' : 'HIGH',
          type: 'it',
          targetModule: 'it-department',
          badgeText: `${t.ticketNumber} • ${t.category}`
        });
      }
    });

    // 2. Urgent / Approaching Project Deadlines
    projects.forEach((p) => {
      if (p.status !== 'Finished') {
        const hasPendingMilestone = (p.milestones || []).some(m => !m.completed);
        const isCriticalOrHigh = p.spent > p.budget * 0.75 || (p.progressPercent < 50 && p.spent > p.budget * 0.5);
        if (isCriticalOrHigh || hasPendingMilestone) {
          list.push({
            id: `proj-${p.id}`,
            title: `Urgent Milestone: ${p.code} (${p.title})`,
            description: `Progress at ${p.progressPercent}%, Budget burn at $${p.spent.toLocaleString()} / $${p.budget.toLocaleString()}. Milestone deliverable pending review.`,
            time: 'Due Soon',
            priority: isCriticalOrHigh ? 'CRITICAL' : 'HIGH',
            type: 'project',
            targetModule: 'projects',
            badgeText: `${p.code} • ${p.status}`
          });
        }
      }
    });

    // 2. Pending Critical / High Priority Tasks
    tasks.forEach((t) => {
      const isUrgent = t.priority === 'CRITICAL' || t.priority === 'HIGH' || t.priority === 'Urgent';
      const isPending = t.status !== 'Done';
      if (isUrgent && isPending) {
        list.push({
          id: `task-${t.id}`,
          title: `Action Required: ${t.title}`,
          description: `Assigned to ${t.assignedToName} for ${t.projectTitle}. Current status: ${t.status} (Due: ${t.dueDate || 'Today'}).`,
          time: 'Sprint Task',
          priority: t.priority === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
          type: 'task',
          targetModule: 'projects',
          badgeText: `${t.priority} Priority`
        });
      }
    });

    // 3. Telemetry / Attendance Anomaly
    if (todayLateCount > 0) {
      list.push({
        id: 'att-late-flag',
        title: `Attendance Anomaly: ${todayLateCount} Late Arrival Flagged`,
        description: `Derivation algorithm detected ${todayLateCount} check-in past shift start time. Overtime and penalty calculation pending 17:30 rollup.`,
        time: 'Today',
        priority: 'MEDIUM',
        type: 'attendance',
        targetModule: 'access',
        badgeText: 'Biometric Gate'
      });
    }

    // 4. Payroll Draft Review
    const draftPayroll = payrollRuns.find(r => r.status === 'draft');
    if (draftPayroll) {
      list.push({
        id: `payroll-${draftPayroll.id}`,
        title: `Payroll Authorization Pending: ${draftPayroll.month}`,
        description: `Draft run with total gross $${draftPayroll.totalGross.toLocaleString()} across ${draftPayroll.payslips.length} payslips awaits Finance sign-off.`,
        time: 'Pending Sign-off',
        priority: 'HIGH',
        type: 'payroll',
        targetModule: 'payroll',
        badgeText: `$${(draftPayroll.totalGross / 1000).toFixed(1)}k Gross`
      });
    }

    return list.filter(n => !dismissedNotificationIds.includes(n.id));
  }, [projects, tasks, todayLateCount, payrollRuns, dismissedNotificationIds]);

  const urgentCount = notifications.length;

  const handleSelectPersona = (p: UserPersona) => {
    setCurrentUser(p);
    setIsPersonaMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('it') || q.includes('ticket') || q.includes('server') || q.includes('laptop') || q.includes('wifi') || q.includes('vpn') || q.includes('mdm') || q.includes('license')) setActiveModule('it-department');
    else if (q.includes('pay') || q.includes('salary')) setActiveModule('payroll');
    else if (q.includes('att') || q.includes('scan') || q.includes('gate') || q.includes('time')) setActiveModule('access');
    else if (q.includes('rec') || q.includes('job') || q.includes('hire') || q.includes('cv')) setActiveModule('recruitment');
    else if (q.includes('task')) setActiveModule('tasks');
    else if (q.includes('proj')) setActiveModule('it-department');
    else if (q.includes('inv') || q.includes('bill') || q.includes('exp')) setActiveModule('finance');
    else if (q.includes('asset') || q.includes('equ')) setActiveModule('inventory');
    else setActiveModule('employees');
    setSearchQuery('');
  };

  const handleNotificationClick = (targetModule: string, notif: typeof notifications[0]) => {
    setActiveModule(targetModule as any);
    setIsNotificationsOpen(false);
    setActiveToast({
      id: notif.id,
      title: notif.title,
      desc: notif.description,
      type: notif.priority === 'CRITICAL' ? 'urgent' : 'warning',
      targetModule
    });
    setTimeout(() => {
      setActiveToast((curr) => (curr?.id === notif.id ? null : curr));
    }, 6000);
  };

  const handleDismissAll = () => {
    setDismissedNotificationIds(notifications.map(n => n.id));
    setIsNotificationsOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-3 md:px-6 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 text-white" id="main-app-header">
        
        {/* Left: Mobile Nav Toggle, Search & Workplace Presence status */}
        <div className="flex items-center gap-2.5 md:gap-4 flex-1 max-w-xl">
          {/* Mobile Navigation Drawer Toggle */}
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="md:hidden p-2 rounded-xl bg-neutral-800/90 border border-neutral-700/80 text-neutral-200 hover:text-white hover:bg-neutral-700 active:scale-95 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Open Module Navigation"
            id="btn-mobile-menu-toggle"
          >
            <Menu className="w-5 h-5 text-blue-400" />
            <span className="text-[11px] font-bold text-neutral-300 hidden xs:inline tracking-wide">Menu</span>
          </button>

          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xs sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search employees, payroll, jobs, projects..."
              className="w-full bg-neutral-800/80 border border-neutral-700/80 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
              id="input-global-search"
            />
          </form>

          {/* Live Presence Quick Badge */}
          <div
            onClick={() => setActiveModule('access')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium cursor-pointer hover:bg-emerald-500/20 transition-all"
            title="Live count computed from last scan today = IN"
            id="badge-live-presence"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold">{currentlyInsideCount}/{totalEmployees}</span>
            <span className="text-neutral-300 font-normal">Inside Building</span>
          </div>

          {/* Offline-First & Dexie Sync Status Indicator */}
          <div
            onClick={triggerManualSync}
            className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
              isOnline
                ? syncStatus === 'syncing'
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20'
                  : 'bg-neutral-900 border-neutral-700/80 text-neutral-300 hover:border-neutral-600'
                : 'bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20'
            }`}
            title={`Source of truth: Dexie.JS IndexedDB (Sandbox-First). Click to re-sync. Last sync: ${lastSyncTime}`}
            id="badge-offline-sync"
          >
            {isOnline ? (
              syncStatus === 'syncing' ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
              ) : (
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              )
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span className="font-semibold">
              {isOnline ? (syncStatus === 'syncing' ? 'Syncing...' : 'Offline-Ready') : 'Offline (Local Sandbox)'}
            </span>
          </div>
        </div>

        {/* Right Controls: Install PWA, Scan Terminal trigger, Notifications, Role Switcher */}
        <div className="flex items-center gap-3">
          {/* PWA Install Button when prompt is available */}
          {isInstallPromptAvailable && (
            <button
              onClick={installPWA}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-900/30 transition-all active:scale-[0.98] cursor-pointer"
              title="Install BizFlow ERP as a native standalone application on your device"
              id="btn-header-install-app"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install App</span>
            </button>
          )}

          {/* Quick QR Scanner CTA */}
          <button
            onClick={() => setIsQRScannerOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all active:scale-[0.98] cursor-pointer"
            id="btn-header-qr-scan"
          >
            <Scan className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Scan QR Badge</span>
            <span className="md:hidden">Scan</span>
          </button>

          {/* Notifications Bell with Dynamic Badge & Drawer */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 text-neutral-300 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Urgent project deadlines and pending tasks"
              id="btn-notifications"
            >
              <Bell className="w-4 h-4" />
              {urgentCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-neutral-900 animate-pulse shadow-md shadow-red-500/40">
                  {urgentCount}
                </span>
              )}
            </button>

            {/* Notification Drawer Overlay */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-88 sm:w-96 rounded-2xl bg-neutral-900 border border-neutral-700 shadow-2xl p-4 text-xs space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150" id="notification-drawer-overlay">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">System & Project Alerts</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {urgentCount} Active
                    </span>
                  </div>
                  <button
                    onClick={() => setIsNotificationsOpen(false)}
                    className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-neutral-400 space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <p className="font-semibold text-white">All Clear & Reconciled</p>
                    <p className="text-[11px]">No urgent task bottlenecks or pending project deadlines detected.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                    {notifications.map((notif) => {
                      const isCrit = notif.priority === 'CRITICAL';
                      const isHigh = notif.priority === 'HIGH';
                      return (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif.targetModule, notif)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                            isCrit
                              ? 'bg-red-500/10 border-red-500/40 hover:bg-red-500/20'
                              : isHigh
                              ? 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20'
                              : 'bg-neutral-800/80 border-neutral-700/60 hover:bg-neutral-800'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              {isCrit ? (
                                <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                              ) : isHigh ? (
                                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              ) : (
                                <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                              )}
                              <span className={`font-bold text-xs truncate max-w-[200px] ${isCrit ? 'text-red-300' : isHigh ? 'text-amber-300' : 'text-white'}`}>
                                {notif.title}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-neutral-400 shrink-0">{notif.time}</span>
                          </div>

                          <p className="text-neutral-300 text-[11px] mt-1 line-clamp-2 leading-relaxed">
                            {notif.description}
                          </p>

                          <div className="mt-2 flex items-center justify-between pt-1 border-t border-neutral-700/40">
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-neutral-950/60 text-neutral-300 font-mono">
                              {notif.badgeText}
                            </span>
                            <span className="text-[10px] text-blue-400 group-hover:text-blue-300 font-semibold flex items-center gap-1">
                              Jump to Module <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-800">
                  <button
                    onClick={handleDismissAll}
                    className="py-1.5 px-3 text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg text-[11px] transition-colors"
                  >
                    Clear All Alerts
                  </button>
                  <button
                    onClick={() => {
                      setActiveModule('projects');
                      setIsNotificationsOpen(false);
                    }}
                    className="py-1.5 px-3 text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1"
                  >
                    <KanbanSquare className="w-3 h-3" />
                    Open Projects Kanban
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Role & Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 pl-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/80 text-left transition-all cursor-pointer"
              id="btn-persona-menu"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-neutral-600"
              />
              <div className="hidden lg:block text-left pr-1">
                <p className="text-xs font-semibold text-white leading-tight">{currentUser.name}</p>
                <p className="text-[10px] text-blue-400 font-medium leading-tight">{(currentUser.roleTitle || currentUser.role || 'Staff').split(' ')[0]} ({currentUser.role || 'Staff'})</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {/* Persona Menu Dropdown */}
            {isPersonaMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-neutral-900 border border-neutral-700 shadow-2xl p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-neutral-800">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Switch ERP Persona / RBAC View</span>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Test permissions & dashboard layouts across organizational roles</p>
                </div>

                <div className="py-1 space-y-1 max-h-64 overflow-y-auto">
                  {availablePersonas.map((p) => {
                    const isActive = p.id === currentUser.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleSelectPersona(p)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl transition-colors text-left ${
                          isActive ? 'bg-blue-600/20 border border-blue-500/40 text-white' : 'hover:bg-neutral-800 text-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={p.avatar} alt={p.name} className="w-7 h-7 rounded-full object-cover" />
                          <div>
                            <p className="text-xs font-semibold">{p.name}</p>
                            <p className="text-[10px] text-neutral-400">{p.roleTitle}</p>
                          </div>
                        </div>
                        {isActive && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 mt-1 border-t border-neutral-800 flex items-center justify-between px-2">
                  <button
                    onClick={() => { resetAllDataToDefault(); setIsPersonaMenuOpen(false); }}
                    className="flex items-center gap-1.5 text-[11px] text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Reset Demo DB
                  </button>
                  <span className="text-[10px] text-neutral-500">v2.4 Production</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Floating Active Toast Overlay */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm p-4 rounded-2xl bg-neutral-900/95 border border-neutral-700 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className={`p-1.5 rounded-lg ${activeToast.type === 'urgent' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                <Zap className="w-4 h-4" />
              </span>
              <div>
                <p className="text-xs font-bold text-white">{activeToast.title}</p>
                <p className="text-[11px] text-neutral-300 mt-0.5">{activeToast.desc}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveToast(null)}
              className="text-neutral-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
