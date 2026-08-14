import React, { useState } from 'react';
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
  ShieldCheck,
  Building2,
  Sparkles
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
  roles?: string[];
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
    settings,
    currentUser
  } = useERP();

  const openApplicantsCount = applicants.filter(a => a.stage !== 'HIRED' && a.stage !== 'REJECTED').length;
  const draftPayrollCount = payrollRuns.filter(p => p.status === 'draft').length;
  const pendingTasksCount = tasks.filter(t => t.status !== 'Done').length;

  const NAV_ITEMS: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Operations Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'employees',
      label: 'Employee Directory',
      icon: Users
    },
    {
      id: 'access',
      label: 'Access Logs & QR Terminal',
      icon: ScanLine,
      badge: currentlyInsideCount,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
    },
    {
      id: 'payroll',
      label: 'Payroll & Compensation',
      icon: Banknote,
      badge: draftPayrollCount > 0 ? `${draftPayrollCount} Draft` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
    },
    {
      id: 'recruitment',
      label: 'Recruitment & ATS',
      icon: Briefcase,
      badge: openApplicantsCount > 0 ? openApplicantsCount : undefined,
      badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
    },
    {
      id: 'projects',
      label: 'Projects & Tasks',
      icon: KanbanSquare,
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
      badgeColor: 'bg-indigo-500/20 text-indigo-300'
    },
    {
      id: 'inventory',
      label: 'Assets & Inventory',
      icon: Package
    },
    {
      id: 'finance',
      label: 'Finance & Invoicing',
      icon: Receipt
    },
    {
      id: 'reports',
      label: 'Reports & Intelligence',
      icon: FileBarChart2
    },
    {
      id: 'settings',
      label: 'Settings & Audit Logs',
      icon: Settings
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
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-800">
          <div
            onClick={() => setActiveModule('dashboard')}
            className="flex items-center gap-3 cursor-pointer overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/25 shrink-0">
              BF
            </div>
            {!isCollapsed && (
              <div className="leading-tight truncate">
                <span className="font-bold text-sm text-white tracking-wide block">Comfort BizFlow</span>
                <span className="text-[10px] text-neutral-400 block font-mono">Workforce ERP v2.4</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors hidden md:block"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            id="btn-toggle-sidebar"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Item List */}
        <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-140px)]">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold'
                    : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900'
                }`}
                title={isCollapsed ? item.label : undefined}
                id={`nav-${item.id}`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-200'}`} />
                
                {!isCollapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}

                {!isCollapsed && item.badge !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor || 'bg-neutral-800 text-neutral-300'}`}>
                    {item.badge}
                  </span>
                )}

                {/* Tooltip on collapsed state */}
                {isCollapsed && (
                  <span className="absolute left-full ml-3 px-2.5 py-1 bg-neutral-900 text-white text-xs rounded-lg shadow-xl border border-neutral-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / System Status */}
      <div className="p-3 border-t border-neutral-800/80 bg-neutral-950/60">
        {!isCollapsed ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-900/80 border border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-neutral-300 font-medium truncate">Event Bus & AI Online</span>
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
