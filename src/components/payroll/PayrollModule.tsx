import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Banknote,
  Plus,
  CheckCircle2,
  Lock,
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  ShieldCheck,
  Printer,
  ChevronRight,
  Eye,
  AlertCircle,
  X,
  Users
} from 'lucide-react';
import { PayrollRun, PayslipItem } from '../../types/erp';

export const PayrollModule: React.FC = () => {
  const {
    payrollRuns,
    generatePayrollRun,
    updatePayrollStatus,
    setSelectedPayslipForModal,
    employees,
    settings,
    currentUser,
    hasRole
  } = useERP();

  const [selectedRunId, setSelectedRunId] = useState<string>(payrollRuns[0]?.id || '');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [newRunMonth, setNewRunMonth] = useState('September 2026');
  const [newRunStart, setNewRunStart] = useState('2026-09-01');
  const [newRunEnd, setNewRunEnd] = useState('2026-09-30');
  const [searchPayslip, setSearchPayslip] = useState('');

  const selectedRun = payrollRuns.find(r => r.id === selectedRunId) || payrollRuns[0];

  const handleCreateRun = (e: React.FormEvent) => {
    e.preventDefault();
    const newRun = generatePayrollRun(newRunMonth, newRunStart, newRunEnd);
    setSelectedRunId(newRun.id);
    setIsGenerateModalOpen(false);
  };

  const filteredPayslips = (selectedRun?.payslips || []).filter(ps =>
    `${ps.employeeName} ${ps.employeeCode} ${ps.department}`.toLowerCase().includes(searchPayslip.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto" id="payroll-module-view">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 backdrop-blur-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Compensation & Payroll Snapshots
            </span>
            <span className="text-xs text-neutral-400 font-mono">Statutory Deductions Engine</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Workforce Payroll Cycles</h1>
          <p className="text-xs text-neutral-400">
            Immutable snapshots frozen upon approval. Automated tax withholding, pension calculation, and payslip generation.
          </p>
        </div>

        <button
          onClick={() => setIsGenerateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer"
          id="btn-generate-payroll-cycle"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Payroll Run</span>
        </button>
      </div>

      {/* Cycle Selector Strip & KPI Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Run Selector Card */}
        <div className="lg:col-span-1 p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Select Payroll Run</label>
          <div className="space-y-2">
            {payrollRuns.map(run => {
              const isSelected = run.id === selectedRun?.id;
              return (
                <button
                  key={run.id}
                  onClick={() => setSelectedRunId(run.id)}
                  className={`w-full p-3 rounded-xl text-left border transition-all ${
                    isSelected ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md' : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{run.periodMonth}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      run.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' :
                      run.status === 'approved' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {run.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] mt-1 font-mono text-neutral-400">
                    <span>{run.employeeCount} staff</span>
                    <span className="text-emerald-400 font-bold">${run.totalNet.toLocaleString()}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Run Details & Financial Overview */}
        {selectedRun && (
          <div className="lg:col-span-3 p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-neutral-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{selectedRun.title}</h3>
                  <span className="font-mono text-xs text-blue-400 bg-neutral-950 px-2 py-0.5 rounded">
                    {selectedRun.code}
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  Period: <span className="font-mono text-neutral-300">{selectedRun.periodStart}</span> to <span className="font-mono text-neutral-300">{selectedRun.periodEnd}</span>
                </p>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-2">
                {selectedRun.status === 'draft' && (
                  <button
                    onClick={() => updatePayrollStatus(selectedRun.id, 'approved')}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-blue-500/20"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Run (Freeze Snapshot)</span>
                  </button>
                )}

                {selectedRun.status === 'approved' && (
                  <button
                    onClick={() => updatePayrollStatus(selectedRun.id, 'paid')}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-500/20"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Mark as Disbursed / Paid</span>
                  </button>
                )}

                {selectedRun.status === 'paid' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Snapshot Frozen & Disbursed ({selectedRun.paidAt ? selectedRun.paidAt.split('T')[0] : 'Frozen'})</span>
                  </span>
                )}
              </div>
            </div>

            {/* Financial Ledger Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 font-medium">Total Gross Earnings</span>
                <p className="text-xl font-black text-white font-mono mt-0.5">${selectedRun.totalGross.toLocaleString()}</p>
                <span className="text-[10px] text-neutral-500">Base salary + overtime pay</span>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-[11px] text-red-400 font-medium">Total Withholdings & Deductions</span>
                <p className="text-xl font-black text-red-400 font-mono mt-0.5">-${selectedRun.totalDeductions.toLocaleString()}</p>
                <span className="text-[10px] text-neutral-500">Tax ({settings.defaultTaxRate}%) + Pension + Health</span>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-emerald-500/30">
                <span className="text-[11px] text-emerald-400 font-medium">Net Disbursed Take-Home</span>
                <p className="text-xl font-black text-emerald-400 font-mono mt-0.5">${selectedRun.totalNet.toLocaleString()}</p>
                <span className="text-[10px] text-emerald-500/80">Direct ACH payment total</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Itemized Payslips Table */}
      {selectedRun && (
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">Itemized Employee Payslip Ledger</h3>
              <p className="text-xs text-neutral-400">Click any row or print button to generate the official employee voucher.</p>
            </div>
            <input
              type="text"
              value={searchPayslip}
              onChange={(e) => setSearchPayslip(e.target.value)}
              placeholder="Search payslips..."
              className="bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-500"
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-neutral-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950 text-neutral-400 uppercase text-[10px] font-semibold">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-3">Base Salary</th>
                  <th className="py-3 px-3">Overtime</th>
                  <th className="py-3 px-3">Gross Pay</th>
                  <th className="py-3 px-3">Tax Withholding</th>
                  <th className="py-3 px-3">Total Deductions</th>
                  <th className="py-3 px-3">Net Take-Home</th>
                  <th className="py-3 px-4 text-right">Voucher</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-mono">
                {filteredPayslips.map((ps) => (
                  <tr key={ps.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-sans">
                      <p className="font-semibold text-white">{ps.employeeName}</p>
                      <p className="text-[10px] text-neutral-400 font-mono">{ps.employeeCode} • {ps.department}</p>
                    </td>
                    <td className="py-3.5 px-3 text-neutral-300">
                      ${ps.baseSalary.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-neutral-300">
                      {ps.overtimeHours > 0 ? (
                        <span className="text-indigo-400 font-medium">+${ps.overtimePay} ({ps.overtimeHours}h)</span>
                      ) : (
                        <span className="text-neutral-500">$0</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-white">
                      ${ps.grossPay.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-red-400">
                      -${ps.taxDeduction.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-red-400 font-medium">
                      -${ps.totalDeductions.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-emerald-400">
                      ${ps.netPay.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-sans">
                      <button
                        onClick={() => setSelectedPayslipForModal(ps)}
                        className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-blue-400 hover:text-blue-300 font-medium text-xs flex items-center gap-1 ml-auto cursor-pointer"
                        title="View Official Payslip Document"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Payslip</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Generate Payroll Modal */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto" id="modal-generate-payroll">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-700 text-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
              <h3 className="text-base font-bold text-white">Generate Workforce Payroll Snapshot</h3>
              <button onClick={() => setIsGenerateModalOpen(false)} className="p-1.5 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRun} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Payroll Cycle Month *</label>
                <input
                  type="text"
                  required
                  value={newRunMonth}
                  onChange={(e) => setNewRunMonth(e.target.value)}
                  placeholder="e.g. September 2026"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Period Start *</label>
                  <input
                    type="date"
                    required
                    value={newRunStart}
                    onChange={(e) => setNewRunStart(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Period End *</label>
                  <input
                    type="date"
                    required
                    value={newRunEnd}
                    onChange={(e) => setNewRunEnd(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400 space-y-1">
                <p className="font-semibold text-neutral-300">Automatic Snapshot Calculation Rules:</p>
                <p>• {employees.filter(e => e.status === 'Active').length} active employees will be enrolled.</p>
                <p>• Statutory tax rate will apply ({settings.defaultTaxRate}% standard bracket).</p>
                <p>• Pension 5% + Health Insurance will be itemized automatically.</p>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Calculate & Create Draft Run
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
