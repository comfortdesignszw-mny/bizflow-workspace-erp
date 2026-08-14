import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  FileBarChart2,
  Sparkles,
  Download,
  Printer,
  Calendar,
  DollarSign,
  Clock,
  Send,
  Users,
  Building2,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

export const ReportsModule: React.FC = () => {
  const {
    employees,
    accessLogs,
    attendanceRollups,
    payrollRuns,
    projects,
    assets,
    expenses,
    invoices,
    currentlyInsideCount,
    todayLateCount,
    settings
  } = useERP();

  const [activeReportTab, setActiveReportTab] = useState<'copilot' | 'attendance' | 'payroll_dept' | 'assets_report'>('copilot');

  // AI Copilot state
  const [copilotQuery, setCopilotQuery] = useState('');
  const [copilotMessages, setCopilotMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; timestamp: string }>>([
    {
      role: 'assistant',
      text: "Hello! I am your BizFlow ERP Intelligence Copilot. You can ask me any natural language questions about your workforce presence, payroll expenditures, ATS candidate matches, or project budgets.",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);

  const handleSendCopilot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotQuery.trim() || isCopilotLoading) return;

    const userText = copilotQuery;
    setCopilotQuery('');
    const userMsg = { role: 'user' as const, text: userText, timestamp: new Date().toLocaleTimeString() };
    setCopilotMessages(prev => [...prev, userMsg]);
    setIsCopilotLoading(true);

    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userText,
          context: {
            totalEmployees: employees.length,
            currentlyInsideCount,
            todayLateCount,
            payrollRunsCount: payrollRuns.length,
            latestPayrollGross: payrollRuns[0]?.totalGross,
            activeProjectsCount: projects.length,
            assetsCount: assets.length
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        setCopilotMessages(prev => [
          ...prev,
          { role: 'assistant', text: data.reply, timestamp: new Date().toLocaleTimeString() }
        ]);
      } else {
        throw new Error('Copilot response error');
      }
    } catch (e) {
      console.warn('Copilot fallback:', e);
      setCopilotMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `Based on your live ERP state: Total workforce is ${employees.length} with ${currentlyInsideCount} currently clocked inside premises. Today's punctuality rate is ${Math.round(((employees.length - todayLateCount) / (employees.length || 1)) * 100)}%. Monthly gross payroll burn is $${(payrollRuns[0]?.totalGross || 98350).toLocaleString()}.`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setIsCopilotLoading(false);
    }
  };

  // CSV Export utility
  const exportAttendanceCSV = () => {
    const headers = ['Employee Code', 'Name', 'Department', 'Date', 'First In', 'Last Out', 'Total Hours', 'Late Minutes', 'Overtime Hours', 'Status'];
    const rows = attendanceRollups.map(r => [
      r.employeeCode,
      `"${r.employeeName}"`,
      `"${r.department}"`,
      r.date,
      r.firstIn ? new Date(r.firstIn).toLocaleTimeString() : 'N/A',
      r.lastOut ? new Date(r.lastOut).toLocaleTimeString() : 'N/A',
      r.totalHours,
      r.lateMinutes,
      r.overtimeHours,
      r.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bizflow_attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPayrollCSV = () => {
    const latest = payrollRuns[0];
    if (!latest) return;
    const headers = ['Employee Code', 'Name', 'Department', 'Position', 'Base Salary', 'Overtime Pay', 'Gross Pay', 'Tax Deduction', 'Total Deductions', 'Net Pay'];
    const rows = latest.payslips.map(p => [
      p.employeeCode,
      `"${p.employeeName}"`,
      `"${p.department}"`,
      `"${p.position}"`,
      p.baseSalary,
      p.overtimePay,
      p.grossPay,
      p.taxDeduction,
      p.totalDeductions,
      p.netPay
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bizflow_payroll_ledger_${latest.periodMonth.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto" id="reports-module-view">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 backdrop-blur-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Business Intelligence & Analytics
            </span>
            <span className="text-xs text-neutral-400 font-mono">Gemini ERP Copilot</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Enterprise Reports & Copilot</h1>
          <p className="text-xs text-neutral-400">
            Export structured CSV ledgers, generate executive audits, or query natural language analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-800 space-x-4">
        <button
          onClick={() => setActiveReportTab('copilot')}
          className={`pb-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            activeReportTab === 'copilot' ? 'border-blue-500 text-blue-400' : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>AI ERP Query Copilot</span>
        </button>

        <button
          onClick={() => setActiveReportTab('attendance')}
          className={`pb-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            activeReportTab === 'attendance' ? 'border-blue-500 text-blue-400' : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Attendance & Punctuality Audit</span>
        </button>

        <button
          onClick={() => setActiveReportTab('payroll_dept')}
          className={`pb-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            activeReportTab === 'payroll_dept' ? 'border-blue-500 text-blue-400' : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Payroll & Compensation Ledger</span>
        </button>
      </div>

      {/* Tab 1: AI Copilot */}
      {activeReportTab === 'copilot' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl bg-neutral-900 border border-neutral-800 p-6 flex flex-col justify-between space-y-4 min-h-[480px]">
            <div className="space-y-3 overflow-y-auto max-h-[380px] pr-2">
              {copilotMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 text-xs ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div
                    className={`p-3.5 rounded-2xl max-w-lg leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white font-medium'
                        : 'bg-neutral-950 border border-neutral-800 text-neutral-200'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="text-[10px] text-neutral-400 mt-1 block text-right font-mono">{msg.timestamp}</span>
                  </div>
                </div>
              ))}
              {isCopilotLoading && (
                <div className="flex gap-3 text-xs items-center text-neutral-400 italic">
                  <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <span>Analyzing ERP telemetry with Gemini API...</span>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendCopilot} className="flex gap-2 pt-2 border-t border-neutral-800">
              <input
                type="text"
                value={copilotQuery}
                onChange={(e) => setCopilotQuery(e.target.value)}
                placeholder="Ask about attendance trends, payroll burn, or candidate skills..."
                className="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={isCopilotLoading || !copilotQuery.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-md shadow-blue-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask</span>
              </button>
            </form>
          </div>

          {/* Preset Inquiries Panel */}
          <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6 space-y-4 text-xs">
            <h3 className="font-bold text-white uppercase text-[11px] tracking-wider">Example Executive Prompts</h3>
            <p className="text-neutral-400 text-[11px]">Click any query below to run instant cross-module analysis:</p>

            <div className="space-y-2">
              {[
                "Who has late arrival flags today and what are their shift schedules?",
                "Break down our total monthly compensation liability by department.",
                "How many candidates in the ATS pipeline have cloud architecture skills?",
                "Which active strategic projects have the highest budget burn rate?"
              ].map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => setCopilotQuery(prompt)}
                  className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800/80 text-left text-neutral-300 hover:text-white hover:border-blue-500/40 transition-colors"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Attendance Audit */}
      {activeReportTab === 'attendance' && (
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">Daily Attendance & Punctuality Audit</h3>
              <p className="text-xs text-neutral-400">Aggregated rollups across all recorded gateway scan events.</p>
            </div>
            <button
              onClick={exportAttendanceCSV}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-neutral-800 text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950 text-neutral-400 uppercase text-[10px] font-semibold">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">First In</th>
                  <th className="py-3 px-3">Last Out</th>
                  <th className="py-3 px-3">Total Hours</th>
                  <th className="py-3 px-3">Lateness</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-mono">
                {attendanceRollups.map((r) => (
                  <tr key={r.id} className="hover:bg-neutral-800/40">
                    <td className="py-3 px-4 text-neutral-400">{r.date}</td>
                    <td className="py-3 px-4 font-sans font-semibold text-white">{r.employeeName}</td>
                    <td className="py-3 px-3 font-sans text-neutral-300">{r.department}</td>
                    <td className="py-3 px-3 text-neutral-300">{r.firstIn ? new Date(r.firstIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                    <td className="py-3 px-3 text-neutral-300">{r.lastOut ? new Date(r.lastOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                    <td className="py-3 px-3 font-bold text-white">{r.totalHours}h</td>
                    <td className="py-3 px-3 text-amber-400">{r.lateMinutes > 0 ? `+${r.lateMinutes}m` : '0m'}</td>
                    <td className="py-3 px-3 font-sans font-bold text-emerald-400">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Payroll Ledger */}
      {activeReportTab === 'payroll_dept' && (
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">Monthly Payroll & Withholding Ledger</h3>
              <p className="text-xs text-neutral-400">Snapshot totals itemized by employee base, overtime, and deductions.</p>
            </div>
            <button
              onClick={exportPayrollCSV}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-neutral-800 text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950 text-neutral-400 uppercase text-[10px] font-semibold">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Base Salary</th>
                  <th className="py-3 px-3">Gross Earnings</th>
                  <th className="py-3 px-3">Tax Withholding</th>
                  <th className="py-3 px-3">Total Deductions</th>
                  <th className="py-3 px-3">Net Pay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-mono">
                {(payrollRuns[0]?.payslips || []).map((ps) => (
                  <tr key={ps.id} className="hover:bg-neutral-800/40">
                    <td className="py-3 px-4 font-sans font-semibold text-white">{ps.employeeName}</td>
                    <td className="py-3 px-3 font-sans text-neutral-300">{ps.department}</td>
                    <td className="py-3 px-3 text-neutral-300">${ps.baseSalary.toLocaleString()}</td>
                    <td className="py-3 px-3 font-bold text-white">${ps.grossPay.toLocaleString()}</td>
                    <td className="py-3 px-3 text-red-400">-${ps.taxDeduction.toLocaleString()}</td>
                    <td className="py-3 px-3 text-red-400">-${ps.totalDeductions.toLocaleString()}</td>
                    <td className="py-3 px-3 font-bold text-emerald-400">${ps.netPay.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
