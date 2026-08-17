import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Scan,
  Clock,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Filter,
  Search,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  Award,
  Lock
} from 'lucide-react';
import { EmptyState } from '../common/EmptyState';
import { ScanType, AttendanceStatus } from '../../types/erp';

export const AccessAndAttendanceModule: React.FC = () => {
  const {
    accessLogs,
    attendanceRollups,
    employees,
    currentlyInsideEmployees,
    currentlyInsideCount,
    todayPresentCount,
    todayLateCount,
    recordScan,
    recomputeAttendanceRollup,
    setIsQRScannerOpen,
    setSelectedEmployeeForBadge,
    settings
  } = useERP();

  const [activeTab, setActiveTab] = useState<'rollups' | 'raw_logs' | 'presence'>('rollups');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [gateFilter, setGateFilter] = useState<string>('ALL');

  // Quick Ingest State for in-page simulation
  const [quickEmpId, setQuickEmpId] = useState<string>(employees[0]?.id || '');
  const [quickScanType, setQuickScanType] = useState<ScanType | 'AUTO'>('AUTO');
  const [quickGate, setQuickGate] = useState<string>('Main Lobby Turnstile 01');
  const [quickNotice, setQuickNotice] = useState<string | null>(null);

  const handleQuickScan = () => {
    if (!quickEmpId) return;
    const res = recordScan({
      employeeId: quickEmpId,
      scanType: quickScanType === 'AUTO' ? undefined : quickScanType,
      gate: quickGate,
      method: 'TERMINAL_PIN'
    });
    setQuickNotice(res.message);
    setTimeout(() => setQuickNotice(null), 4000);
  };

  // Filtered rollups for selected date
  const filteredRollups = attendanceRollups.filter(r => {
    const matchesDate = r.date === selectedDate;
    const matchesQuery = `${r.employeeName} ${r.employeeCode} ${r.department}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesDate && matchesQuery && matchesStatus;
  });

  // Filtered raw logs
  const filteredLogs = accessLogs.filter(l => {
    const matchesQuery = `${l.employeeName} ${l.employeeCode} ${l.gate}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGate = gateFilter === 'ALL' || l.gate === gateFilter;
    return matchesQuery && matchesGate;
  });

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto" id="access-attendance-module-view">
      
      {/* Top Banner & Telemetry summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 backdrop-blur-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Biometric & Attendance Gateway
            </span>
            <span className="text-xs text-neutral-400 font-mono">Real-time Turnstiles</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Access Control & Attendance Engine</h1>
          <p className="text-xs text-neutral-400">
            Raw append-only event stream (`access_logs`) and derived daily calculations (`attendance_rollups`).
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => recomputeAttendanceRollup(selectedDate)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-all cursor-pointer"
            title="Recalculate first IN, last OUT, overtime, and punctuality"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
            <span>Recompute Rollup</span>
          </button>

          <button
            onClick={() => setIsQRScannerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Scan className="w-4 h-4" />
            <span>Open Camera Scanner</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-neutral-400 font-medium">Currently In-Building</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-400 font-mono">{currentlyInsideCount}</span>
              <span className="text-xs text-neutral-500">/ {employees.length} enrolled</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-neutral-400 font-medium">Today's Present & Punctual</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-blue-400 font-mono">{todayPresentCount - todayLateCount}</span>
              <span className="text-xs text-amber-400">({todayLateCount} late arrivals)</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-neutral-400 font-medium">Total Ingested Scan Events</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-purple-400 font-mono">{accessLogs.length}</span>
              <span className="text-xs text-neutral-500">raw logs</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Quick Terminal Ingest Station */}
      <div className="p-4 rounded-2xl bg-neutral-950 border border-blue-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scan className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Fast Turnstile Badge Simulator</h3>
          </div>
          {quickNotice && (
            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/30 animate-pulse">
              {quickNotice}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="sm:col-span-2">
            <select
              value={quickEmpId}
              onChange={(e) => setQuickEmpId(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white"
              id="select-quick-employee"
            >
              {employees.map(emp => {
                const isInside = currentlyInsideEmployees.some(e => e.id === emp.id);
                return (
                  <option key={emp.id} value={emp.id}>
                    {emp.code} • {emp.firstName} {emp.lastName} [{isInside ? '🟢 INSIDE' : '⚪ OUTSIDE'}]
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <select
              value={quickGate}
              onChange={(e) => setQuickGate(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white"
            >
              <option value="Main Lobby Turnstile 01">Main Lobby Turnstile 01</option>
              <option value="Main Lobby Turnstile 02">Main Lobby Turnstile 02</option>
              <option value="Executive East Gate">Executive East Gate</option>
              <option value="R&D Innovation Lab Gate">R&D Innovation Lab Gate</option>
            </select>
          </div>

          <button
            onClick={handleQuickScan}
            className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer"
            id="btn-fast-scan-trigger"
          >
            <Scan className="w-3.5 h-3.5" />
            <span>Clock In / Out</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-neutral-800 space-x-4">
        <button
          onClick={() => setActiveTab('rollups')}
          className={`pb-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'rollups' ? 'border-blue-500 text-blue-400' : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
          id="tab-attendance-rollups"
        >
          <Clock className="w-4 h-4" />
          <span>Daily Attendance Rollups (Derived Ledger)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-neutral-800 text-neutral-300">
            {filteredRollups.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('raw_logs')}
          className={`pb-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'raw_logs' ? 'border-blue-500 text-blue-400' : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
          id="tab-raw-access-logs"
        >
          <Layers className="w-4 h-4" />
          <span>Append-Only Raw Logs (`access_logs`)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-neutral-800 text-neutral-300">
            {filteredLogs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('presence')}
          className={`pb-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'presence' ? 'border-blue-500 text-blue-400' : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
          id="tab-live-presence-room"
        >
          <Building2 className="w-4 h-4" />
          <span>Live In-Building Presence ({currentlyInsideCount})</span>
        </button>
      </div>

      {/* Tab 1: Daily Attendance Rollup View */}
      {activeTab === 'rollups' && (
        <div className="space-y-4">
          {/* Rollup Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-neutral-900 p-3.5 rounded-xl border border-neutral-800 text-xs">
            <div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by employee name..."
                className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl px-3 py-2 text-white placeholder-neutral-500"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl px-3 py-2 text-white"
              >
                <option value="ALL">All Statuses</option>
                <option value="ON_TIME">ON_TIME</option>
                <option value="LATE">LATE</option>
                <option value="OVERTIME">OVERTIME</option>
                <option value="ON_LEAVE">ON_LEAVE</option>
                <option value="ABSENT">ABSENT</option>
              </select>
            </div>
          </div>

          {/* Table */}
          {filteredRollups.length > 0 ? (
            <div className="overflow-x-auto rounded-2xl bg-neutral-900 border border-neutral-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-950/60 text-neutral-400 font-semibold uppercase text-[10px]">
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-3">First In</th>
                    <th className="py-3 px-3">Last Out</th>
                    <th className="py-3 px-3">Logged Hours</th>
                    <th className="py-3 px-3">Lateness</th>
                    <th className="py-3 px-3">Overtime</th>
                    <th className="py-3 px-3">Attendance Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {filteredRollups.map((r) => (
                    <tr key={r.id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img src={r.avatar} alt={r.employeeName} className="w-8 h-8 rounded-full object-cover border border-neutral-700" />
                          <div>
                            <p className="font-semibold text-white">{r.employeeName}</p>
                            <p className="text-[10px] text-neutral-400 font-mono">{r.employeeCode} • {r.department}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-neutral-300">
                        {r.firstIn ? new Date(r.firstIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-neutral-300">
                        {r.lastOut ? new Date(r.lastOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (r.firstIn ? <span className="text-emerald-400 font-medium">Inside Now</span> : '—')}
                      </td>
                      <td className="py-3.5 px-3 font-mono font-medium text-white">
                        {r.totalHours} hrs <span className="text-neutral-500 font-normal">/ {r.expectedHours}h</span>
                      </td>
                      <td className="py-3.5 px-3 font-mono">
                        {r.lateMinutes > 0 ? (
                          <span className="text-amber-400 font-bold">+{r.lateMinutes} min late</span>
                        ) : (
                          <span className="text-emerald-400">Punctual</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 font-mono">
                        {r.overtimeHours > 0 ? (
                          <span className="text-indigo-400 font-bold">+{r.overtimeHours}h OT</span>
                        ) : (
                          <span className="text-neutral-500">0h</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.status === 'ON_TIME' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          r.status === 'LATE' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          r.status === 'OVERTIME' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                          r.status === 'ON_LEAVE' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          'bg-neutral-800 text-neutral-400'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            const emp = employees.find(e => e.id === r.employeeId);
                            if (emp) setSelectedEmployeeForBadge(emp);
                          }}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                          title="View Badge"
                        >
                          <Award className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={Scan}
              title="No Attendance Rollups"
              description="Attendance rollups are automatically compiled from gate access scans, recording arrival times, lateness, and overtime."
              actionText="Open QR Badge Scanner"
              onAction={() => setIsQRScannerOpen(true)}
            />
          )}
        </div>
      )}

      {/* Tab 2: Append-Only Raw Access Logs View */}
      {activeTab === 'raw_logs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-neutral-900 p-3.5 rounded-xl border border-neutral-800 text-xs">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search raw scan entries by name or gate..."
              className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl px-3 py-2 text-white"
            />
            <select
              value={gateFilter}
              onChange={(e) => setGateFilter(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl px-3 py-2 text-white"
            >
              <option value="ALL">All Gates & Turnstiles</option>
              <option value="Main Lobby Turnstile 01">Main Lobby Turnstile 01</option>
              <option value="Main Lobby Turnstile 02">Main Lobby Turnstile 02</option>
              <option value="Executive East Gate">Executive East Gate</option>
              <option value="R&D Innovation Lab Gate">R&D Innovation Lab Gate</option>
            </select>
          </div>

          {filteredLogs.length > 0 ? (
            <div className="overflow-x-auto rounded-2xl bg-neutral-900 border border-neutral-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-950/60 text-neutral-400 font-semibold uppercase text-[10px]">
                    <th className="py-3 px-4">Event ID / Hash</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-3">Direction</th>
                    <th className="py-3 px-4">Access Gate</th>
                    <th className="py-3 px-3">Method</th>
                    <th className="py-3 px-4">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-mono">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="py-3.5 px-4 text-neutral-400 text-[11px]">
                        {log.id.slice(0, 14)}...
                      </td>
                      <td className="py-3.5 px-4 text-white text-xs">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-sans">
                        <div className="flex items-center gap-2.5">
                          <img src={log.avatar} alt={log.employeeName} className="w-6 h-6 rounded-full object-cover" />
                          <div>
                            <p className="font-semibold text-white">{log.employeeName}</p>
                            <p className="text-[10px] text-neutral-400 font-mono">{log.employeeCode}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.scanType === 'IN' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {log.scanType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-sans text-neutral-300">
                        {log.gate}
                      </td>
                      <td className="py-3.5 px-3 text-neutral-400 text-[11px]">
                        {log.method}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Signed & Verified
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={Scan}
              title="No Access Event Logs"
              description="Cryptographic NFC badges, turnstile QR gates, and simulator scan events will stream here live."
              actionText="Trigger Simulation Scan"
              onAction={() => setIsQRScannerOpen(true)}
            />
          )}
        </div>
      )}

      {/* Tab 3: Live Presence Room View */}
      {activeTab === 'presence' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-white">Active Workforce Inside Premise</h3>
              <p className="text-xs text-neutral-400">
                Calculated dynamically from: <code className="text-blue-400 font-mono">COUNT(last scan per employee today = IN)</code>
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              {currentlyInsideCount} On Site
            </span>
          </div>

          {currentlyInsideEmployees.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentlyInsideEmployees.map((emp) => (
                <div key={emp.id} className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={emp.avatar} alt={emp.firstName} className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{emp.firstName} {emp.lastName}</h4>
                      <p className="text-[11px] text-neutral-400">{emp.position}</p>
                      <p className="text-[10px] text-indigo-400 font-mono">{emp.code} • {emp.department}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Inside
                    </span>
                    <button
                      onClick={() => {
                        recordScan({ employeeId: emp.id, scanType: 'OUT', gate: 'Main Lobby Turnstile 01' });
                      }}
                      className="block mt-2 text-[10px] text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
                    >
                      Clock OUT &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Building2}
              title="Premises Currently Cleared"
              description="No personnel are currently detected inside the facility. When employees tap IN at entry turnstiles, they will appear here in real-time."
              actionText="Open QR Scanner"
              onAction={() => setIsQRScannerOpen(true)}
            />
          )}
        </div>
      )}

    </div>
  );
};
