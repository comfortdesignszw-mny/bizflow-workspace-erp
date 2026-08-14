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
  Sliders
} from 'lucide-react';
import { CompanySettings } from '../../types/erp';

export const SettingsModule: React.FC = () => {
  const {
    settings,
    updateSettings,
    auditLogs,
    resetAllDataToDefault,
    currentUser
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
            <span className="text-xs text-neutral-400 font-mono">Security & Audit Trails</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">System Configuration & Audit Logs</h1>
          <p className="text-xs text-neutral-400">
            Workforce shift parameters, payroll calculation constants, and append-only governance logs.
          </p>
        </div>

        {saveNotice && (
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30 animate-in fade-in">
            {saveNotice}
          </span>
        )}
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
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">System Governance & Audit Trail</h3>
            <p className="text-xs text-neutral-400">Append-only chronological log of all administrative actions and security events.</p>
          </div>
          <button
            onClick={resetAllDataToDefault}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 text-xs font-medium border border-red-800/80 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo DB</span>
          </button>
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
