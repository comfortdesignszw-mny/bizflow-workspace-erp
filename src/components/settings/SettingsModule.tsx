import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Settings,
  Shield,
  Clock,
  DollarSign,
  Building2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sliders,
  Database,
  Wifi,
  WifiOff,
  Download,
  HardDrive,
  Layers,
  Smartphone,
  Sun,
  Moon,
  Check
} from 'lucide-react';
import { CompanySettings } from '../../types/erp';

export const SettingsModule: React.FC = () => {
  const {
    settings,
    updateSettings,
    theme,
    setTheme,
    auditLogs,
    resetAllDataToDefault,
    cleanProductionDatabase,
    currentUser,
    isOnline,
    syncStatus,
    lastSyncTime,
    triggerManualSync,
    isInstallPromptAvailable,
    installPWA,
    isStandaloneMode,
    offlineStorageEngine,
    employees,
    accessLogs,
    tasks,
    projects,
    invoices,
    notes,
    payrollRuns
  } = useERP();

  const [formSettings, setFormSettings] = useState<CompanySettings>(settings);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formSettings);
    setSaveNotice('Settings updated successfully!');
    setTimeout(() => setSaveNotice(null), 3500);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto" id="settings-module-view">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 backdrop-blur-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-800 text-neutral-300 border border-neutral-700">
              System Administration
            </span>
            <span className="text-xs text-blue-400 font-mono">Offline-First PWA & Dexie.JS</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">System Configuration & Storage Engine</h1>
          <p className="text-xs text-neutral-400">
            Workforce shift parameters, Dexie.JS IndexedDB local sandbox, offline sync, and governance audit trails.
          </p>
        </div>

        {saveNotice && (
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30 animate-in fade-in">
            {saveNotice}
          </span>
        )}
      </div>

      {/* PWA & Dexie Offline-First Architecture Panel */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-neutral-700 p-1 flex items-center justify-center shrink-0">
              <img
                src="/web-app-manifest-192x192.png"
                alt="App Icon"
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes('favicon-96x96')) {
                    target.src = '/favicon-96x96.png';
                  }
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm">Offline-First PWA Engine & Dexie.JS Sandbox</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Active
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Source of Truth: Browser Sandbox (Dexie IndexedDB) &rarr; LocalStorage &rarr; Online Datastore Sync
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={triggerManualSync}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-colors cursor-pointer"
              id="btn-settings-manual-sync"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === 'syncing' ? 'animate-spin text-blue-400' : ''}`} />
              <span>{syncStatus === 'syncing' ? 'Syncing...' : 'Sync Dexie to Remote'}</span>
            </button>

            {!isStandaloneMode && (
              <button
                onClick={installPWA}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-900/30 transition-all cursor-pointer"
                id="btn-settings-install-pwa"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install Native App</span>
              </button>
            )}
          </div>
        </div>

        {/* Database & Sync Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1">
            <div className="flex items-center justify-between text-neutral-400">
              <span>Database Engine</span>
              <Database className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <p className="text-sm font-bold text-white font-mono">Dexie.JS v4 (IndexedDB)</p>
            <p className="text-[10px] text-emerald-400">Browser Sandbox First</p>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1">
            <div className="flex items-center justify-between text-neutral-400">
              <span>Connection Status</span>
              {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-amber-400" />}
            </div>
            <p className="text-sm font-bold text-white">{isOnline ? 'Online (Realtime)' : 'Offline (Local Safe)'}</p>
            <p className="text-[10px] text-neutral-400">Last Synced: {lastSyncTime}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1">
            <div className="flex items-center justify-between text-neutral-400">
              <span>Local Entities Indexed</span>
              <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <p className="text-sm font-bold text-white font-mono">
              {employees.length + accessLogs.length + tasks.length + projects.length + invoices.length + notes.length} Records
            </p>
            <p className="text-[10px] text-neutral-400">19 Tables in Dexie Schema</p>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1">
            <div className="flex items-center justify-between text-neutral-400">
              <span>PWA Native App</span>
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <p className="text-sm font-bold text-white">Standalone Capable</p>
            <p className="text-[10px] text-blue-400">Service Worker v1 Cached</p>
          </div>
        </div>
      </div>

      {/* Appearance & Color Themes */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-white text-sm">Theme & Visual Experience</h3>
          </div>
          <span className="text-xs text-neutral-400">Instant synchronized mode switch</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Dark Theme Option */}
          <div
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              theme === 'dark'
                ? 'bg-neutral-850 border-blue-500 shadow-md shadow-blue-900/20 ring-1 ring-blue-500/50'
                : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-neutral-900 text-blue-400 border border-neutral-700">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Dark Theme (Default)</h4>
                  <p className="text-[11px] text-neutral-400">Deep neutral palette, low-light optimized</p>
                </div>
              </div>
              {theme === 'dark' && (
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </div>

            <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-[11px] text-neutral-300 font-mono">#0a0a0a onyx background</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400">Active</span>
            </div>
          </div>

          {/* Light Theme Option */}
          <div
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              theme === 'light'
                ? 'bg-neutral-850 border-amber-500 shadow-md shadow-amber-900/20 ring-1 ring-amber-500/50'
                : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-400/20 text-amber-500 border border-amber-400/30">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Light Theme</h4>
                  <p className="text-[11px] text-neutral-400">White background, high contrast, clean slate</p>
                </div>
              </div>
              {theme === 'light' && (
                <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </div>

            <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-[11px] text-slate-800 font-mono">#f8fafc slate background</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">High Contrast</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* Company Identity */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Building2 className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-white text-sm">Enterprise Identity & Localization</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-neutral-400 mb-1">Company Legal Name</label>
              <input
                type="text"
                value={formSettings.companyName}
                onChange={(e) => setFormSettings({ ...formSettings, companyName: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-400 mb-1">Registered Address</label>
              <input
                type="text"
                value={formSettings.address}
                onChange={(e) => setFormSettings({ ...formSettings, address: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-400 mb-1">Tax Registration Number</label>
                <input
                  type="text"
                  value={formSettings.taxNumber}
                  onChange={(e) => setFormSettings({ ...formSettings, taxNumber: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Operating Currency</label>
                <input
                  type="text"
                  value={formSettings.currency}
                  onChange={(e) => setFormSettings({ ...formSettings, currency: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Attendance & Payroll Calculation Parameters */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">Attendance & Payroll Constants</h3>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-400 mb-1">Standard Daily Shift (Hours)</label>
                <input
                  type="number"
                  value={formSettings.standardDailyHours}
                  onChange={(e) => setFormSettings({ ...formSettings, standardDailyHours: Number(e.target.value) })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Late Grace Window (Minutes)</label>
                <input
                  type="number"
                  value={formSettings.lateGracePeriodMinutes}
                  onChange={(e) => setFormSettings({ ...formSettings, lateGracePeriodMinutes: Number(e.target.value) })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-400 mb-1">Overtime Multiplier (e.g. 1.5x)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formSettings.overtimeMultiplier}
                  onChange={(e) => setFormSettings({ ...formSettings, overtimeMultiplier: Number(e.target.value) })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Statutory Withholding Tax (%)</label>
                <input
                  type="number"
                  value={formSettings.defaultTaxRate}
                  onChange={(e) => setFormSettings({ ...formSettings, defaultTaxRate: Number(e.target.value) })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Governance & Audit Log Stream */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white">System Governance & Audit Trail</h3>
            <p className="text-xs text-neutral-400">Append-only chronological log of all administrative actions and security events.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={cleanProductionDatabase}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 text-xs font-semibold border border-red-500/40 transition-colors cursor-pointer"
              title="Purge all sample data and initialize clean database for production"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Clean DB (Production)</span>
            </button>
            <button
              onClick={resetAllDataToDefault}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium border border-neutral-700 transition-colors cursor-pointer"
              title="Reload sample demonstration records"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Seed Demo DB</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-neutral-800 text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950 text-neutral-400 uppercase text-[10px] font-semibold">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Action</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono">
              {auditLogs.slice(0, 15).map((log) => (
                <tr key={log.id} className="hover:bg-neutral-800/40">
                  <td className="py-3 px-4 text-neutral-400">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="py-3 px-4 font-sans font-semibold text-white">{log.userName}</td>
                  <td className="py-3 px-3 text-blue-400 text-[11px]">{log.role}</td>
                  <td className="py-3 px-3 font-bold text-neutral-200">{log.action}</td>
                  <td className="py-3 px-4 font-sans text-neutral-300">{log.module}</td>
                  <td className="py-3 px-4 font-sans text-neutral-400 text-[11px] truncate max-w-xs">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
