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
  Users,
  Download,
  Trash2,
  Edit3,
  UserCheck,
  Filter,
  Check,
  Calendar,
  Building
} from 'lucide-react';
import { PayrollRun, PayslipItem, PayrollStatus, AllowanceItem, DeductionItem } from '../../types/erp';
import { exportPayrollRunPDF, exportIndividualPayslipPDF } from '../../utils/pdfExport';

export const PayrollModule: React.FC = () => {
  const {
    payrollRuns,
    generatePayrollRun,
    updatePayrollStatus,
    deletePayrollRun,
    createIndividualPayroll,
    updateIndividualPayroll,
    deleteIndividualPayroll,
    updateIndividualPayrollStatus,
    setSelectedPayslipForModal,
    employees,
    settings,
    currentUser,
    hasRole
  } = useERP();

  const [selectedRunId, setSelectedRunId] = useState<string>(payrollRuns[0]?.id || '');
  const [statusFilter, setStatusFilter] = useState<'ALL' | PayrollStatus>('ALL');
  const [searchPayslip, setSearchPayslip] = useState('');

  // Modals state
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isIndividualModalOpen, setIsIndividualModalOpen] = useState(false);
  const [editingPayslip, setEditingPayslip] = useState<{ runId: string; payslip: PayslipItem } | null>(null);

  // Form state for batch generation
  const [newRunMonth, setNewRunMonth] = useState('September 2026');
  const [newRunStart, setNewRunStart] = useState('2026-09-01');
  const [newRunEnd, setNewRunEnd] = useState('2026-09-30');

  // Form state for individual payroll creation
  const [indivForm, setIndivForm] = useState({
    employeeId: employees[0]?.id || '',
    periodMonth: 'September 2026',
    periodStart: '2026-09-01',
    periodEnd: '2026-09-30',
    baseSalary: employees[0]?.baseSalary || 5000,
    workingDays: 22,
    presentDays: 21,
    absentDays: 1,
    overtimeHours: 0,
    overtimeRate: 45,
    allowances: [{ id: '1', name: 'Workplace Connectivity & Travel', amount: 250 }],
    deductions: [] as DeductionItem[],
    status: 'pending' as PayrollStatus
  });

  const selectedRun = payrollRuns.find(r => r.id === selectedRunId) || payrollRuns[0];

  // Auto-update base salary and overtime rate when employee changes in individual payroll form
  const handleEmployeeSelect = (empId: string) => {
    const emp = employees.find(e => e.id === empId);
    if (emp) {
      const otRate = Math.round(emp.hourlyRate * settings.overtimeMultiplier);
      setIndivForm(prev => ({
        ...prev,
        employeeId: empId,
        baseSalary: emp.baseSalary,
        overtimeRate: otRate
      }));
    }
  };

  const handleCreateRun = (e: React.FormEvent) => {
    e.preventDefault();
    const newRun = generatePayrollRun(newRunMonth, newRunStart, newRunEnd);
    setSelectedRunId(newRun.id);
    setIsGenerateModalOpen(false);
  };

  const handleCreateIndividualPayroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!indivForm.employeeId) return;

    createIndividualPayroll({
      employeeId: indivForm.employeeId,
      periodMonth: indivForm.periodMonth,
      periodStart: indivForm.periodStart,
      periodEnd: indivForm.periodEnd,
      baseSalary: Number(indivForm.baseSalary),
      workingDays: Number(indivForm.workingDays),
      presentDays: Number(indivForm.presentDays),
      absentDays: Number(indivForm.absentDays),
      overtimeHours: Number(indivForm.overtimeHours),
      overtimeRate: Number(indivForm.overtimeRate),
      allowances: indivForm.allowances,
      deductions: indivForm.deductions,
      status: indivForm.status
    });

    setIsIndividualModalOpen(false);
  };

  const handleSaveEditPayslip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPayslip) return;

    updateIndividualPayroll(editingPayslip.runId, editingPayslip.payslip.id, {
      baseSalary: Number(editingPayslip.payslip.baseSalary),
      overtimeHours: Number(editingPayslip.payslip.overtimeHours),
      overtimeRate: Number(editingPayslip.payslip.overtimeRate),
      overtimePay: Number(editingPayslip.payslip.overtimeHours) * Number(editingPayslip.payslip.overtimeRate),
      status: editingPayslip.payslip.status
    });

    setEditingPayslip(null);
  };

  const filteredRuns = payrollRuns.filter(r => {
    if (statusFilter === 'ALL') return true;
    return r.status === statusFilter;
  });

  const filteredPayslips = (selectedRun?.payslips || []).filter(ps => {
    const matchesSearch = `${ps.employeeName} ${ps.employeeCode} ${ps.department} ${ps.position}`
      .toLowerCase()
      .includes(searchPayslip.toLowerCase());
    return matchesSearch;
  });

  // Calculate live preview totals for individual creation modal
  const indivOvertimePay = Number(indivForm.overtimeHours) * Number(indivForm.overtimeRate);
  const indivAllowancesTotal = indivForm.allowances.reduce((acc, a) => acc + Number(a.amount || 0), 0);
  const indivGross = Number(indivForm.baseSalary) + indivOvertimePay + indivAllowancesTotal;
  const indivTax = Math.round(indivGross * (settings.defaultTaxRate / 100));
  const indivPension = Math.round(indivGross * 0.05);
  const indivHealth = 220;
  const indivDeductionsTotal = indivTax + indivPension + indivHealth + indivForm.deductions.reduce((acc, d) => acc + Number(d.amount || 0), 0);
  const indivNet = indivGross - indivDeductionsTotal;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto" id="payroll-module-view">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 backdrop-blur-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Compensation & Payroll Snapshots
            </span>
            <span className="text-xs text-neutral-400 font-mono">Tax & Statutory Compliance</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Workforce Compensation & Payroll</h1>
          <p className="text-xs text-neutral-400">
            Automated statutory tax withholding, pension calculations, payslip PDF vouchers, and individual employee payroll processing.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsIndividualModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700 transition-all cursor-pointer shadow-xs"
            id="btn-create-individual-payroll"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Create Individual Payroll</span>
          </button>
          
          <button
            onClick={() => setIsGenerateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer"
            id="btn-generate-payroll-cycle"
          >
            <Plus className="w-4 h-4" />
            <span>Batch Workforce Payroll Run</span>
          </button>
        </div>
      </div>

      {/* Cycle Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-neutral-800 text-xs">
        <span className="text-neutral-500 font-semibold uppercase text-[10px] mr-2">Filter Payroll Logs:</span>
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
            statusFilter === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-neutral-900 text-neutral-400 hover:text-white'
          }`}
        >
          All Runs ({payrollRuns.length})
        </button>
        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
            statusFilter === 'pending' ? 'bg-amber-500 text-white' : 'bg-neutral-900 text-neutral-400 hover:text-white'
          }`}
        >
          Pending / Draft ({payrollRuns.filter(r => r.status === 'pending' || r.status === 'draft').length})
        </button>
        <button
          onClick={() => setStatusFilter('approved')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
            statusFilter === 'approved' ? 'bg-blue-600 text-white' : 'bg-neutral-900 text-neutral-400 hover:text-white'
          }`}
        >
          Approved ({payrollRuns.filter(r => r.status === 'approved').length})
        </button>
        <button
          onClick={() => setStatusFilter('paid')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
            statusFilter === 'paid' ? 'bg-emerald-600 text-white' : 'bg-neutral-900 text-neutral-400 hover:text-white'
          }`}
        >
          Disbursed / Paid ({payrollRuns.filter(r => r.status === 'paid').length})
        </button>
      </div>

      {/* Cycle Selector Strip & KPI Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* Run Selector Card */}
        <div className="lg:col-span-1 p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Payroll Cycle Logs</label>
            <span className="text-[10px] text-neutral-500 font-mono">{filteredRuns.length} recorded</span>
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {filteredRuns.map(run => {
              const isSelected = run.id === selectedRun?.id;
              return (
                <div
                  key={run.id}
                  onClick={() => setSelectedRunId(run.id)}
                  className={`w-full p-3 rounded-xl text-left border transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">{run.periodMonth}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      run.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      run.status === 'approved' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {run.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] mt-1 font-mono text-neutral-400">
                    <span>{run.employeeCount} staff</span>
                    <span className="text-emerald-400 font-bold">${run.totalNet.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}

            {filteredRuns.length === 0 && (
              <div className="p-6 text-center text-xs text-neutral-500 italic">
                No payroll runs match this filter.
              </div>
            )}
          </div>
        </div>

        {/* Selected Run Details & Financial Overview */}
        {selectedRun ? (
          <div className="lg:col-span-3 p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-neutral-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{selectedRun.title}</h3>
                  <span className="font-mono text-xs text-blue-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                    {selectedRun.code}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Period: <span className="font-mono text-neutral-300">{selectedRun.periodStart}</span> to <span className="font-mono text-neutral-300">{selectedRun.periodEnd}</span> • {selectedRun.employeeCount} Employees
                </p>
              </div>

              {/* Status Action Buttons & Export PDF */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => exportPayrollRunPDF(selectedRun, settings)}
                  className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-700"
                  title="Export Complete Run Summary to PDF"
                  id="btn-export-run-pdf"
                >
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                  <span>Export PDF</span>
                </button>

                {(selectedRun.status === 'draft' || selectedRun.status === 'pending') && (
                  <button
                    onClick={() => updatePayrollStatus(selectedRun.id, 'approved')}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-blue-500/20"
                    id="btn-approve-run"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Run</span>
                  </button>
                )}

                {selectedRun.status === 'approved' && (
                  <button
                    onClick={() => updatePayrollStatus(selectedRun.id, 'paid')}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-500/20"
                    id="btn-disburse-run"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Mark as Disbursed / Paid</span>
                  </button>
                )}

                {selectedRun.status === 'paid' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Frozen & Paid ({selectedRun.paidAt ? selectedRun.paidAt.split('T')[0] : 'Disbursed'})</span>
                  </span>
                )}

                <button
                  onClick={() => {
                    if (confirm(`Delete payroll cycle "${selectedRun.title}"?`)) {
                      deletePayrollRun(selectedRun.id);
                    }
                  }}
                  className="p-1.5 rounded-xl bg-neutral-950 hover:bg-red-950/40 text-neutral-400 hover:text-red-400 border border-neutral-800 transition-colors cursor-pointer"
                  title="Delete Run"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
                <span className="text-[10px] text-neutral-500">Tax ({settings.defaultTaxRate}%) + Pension (5%) + Health</span>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-emerald-500/30">
                <span className="text-[11px] text-emerald-400 font-medium">Net Disbursed Take-Home</span>
                <p className="text-xl font-black text-emerald-400 font-mono mt-0.5">${selectedRun.totalNet.toLocaleString()}</p>
                <span className="text-[10px] text-emerald-500/80">Direct ACH payment total</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-3 p-8 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 text-xs italic">
            Select a payroll run from the left panel or generate a new cycle.
          </div>
        )}
      </div>

      {/* Itemized Payslips Table */}
      {selectedRun && (
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">Itemized Employee Payslip Ledger ({filteredPayslips.length})</h3>
              <p className="text-xs text-neutral-400">View voucher, download official PDF payslips, or adjust itemized deductions.</p>
            </div>
            <input
              type="text"
              value={searchPayslip}
              onChange={(e) => setSearchPayslip(e.target.value)}
              placeholder="Search employee or ID..."
              className="bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-500 w-full sm:w-64"
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
                  <th className="py-3 px-3">Total Deduct.</th>
                  <th className="py-3 px-3">Net Take-Home</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Management</th>
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
                    <td className="py-3.5 px-3 font-sans">
                      <select
                        value={ps.status}
                        onChange={(e) => updateIndividualPayrollStatus(selectedRun.id, ps.id, e.target.value as PayrollStatus)}
                        className={`text-[10px] font-bold rounded-lg px-2 py-1 bg-neutral-950 border cursor-pointer ${
                          ps.status === 'paid' ? 'text-emerald-400 border-emerald-500/40' :
                          ps.status === 'approved' ? 'text-blue-400 border-blue-500/40' :
                          'text-amber-400 border-amber-500/40'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="draft">Draft</option>
                        <option value="approved">Approved</option>
                        <option value="paid">Paid</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right font-sans">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => exportIndividualPayslipPDF(ps, settings)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-emerald-900/40 text-neutral-300 hover:text-emerald-400 transition-colors cursor-pointer"
                          title="Download PDF Voucher"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedPayslipForModal(ps)}
                          className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-blue-400 hover:text-blue-300 font-medium text-xs flex items-center gap-1 cursor-pointer"
                          title="View Official Payslip Document"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => setEditingPayslip({ runId: selectedRun.id, payslip: { ...ps } })}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit / Override Calculations"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove payslip for ${ps.employeeName}?`)) {
                              deleteIndividualPayroll(selectedRun.id, ps.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-900/40 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete Payslip"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: Individual Payroll Creation */}
      {isIndividualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto" id="modal-individual-payroll">
          <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700 text-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Create Individual Employee Payroll</h3>
              </div>
              <button onClick={() => setIsIndividualModalOpen(false)} className="p-1.5 text-neutral-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateIndividualPayroll} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              {/* Employee Selection */}
              <div>
                <label className="block text-neutral-400 mb-1 font-semibold">Select Employee from Directory *</label>
                <select
                  value={indivForm.employeeId}
                  onChange={(e) => handleEmployeeSelect(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  required
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.code} — {emp.firstName} {emp.lastName} ({emp.department} • {emp.position}) — Base: ${emp.baseSalary.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cycle Period */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Payroll Cycle Month *</label>
                  <input
                    type="text"
                    required
                    value={indivForm.periodMonth}
                    onChange={(e) => setIndivForm({ ...indivForm, periodMonth: e.target.value })}
                    placeholder="e.g. September 2026"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Period Start</label>
                  <input
                    type="date"
                    required
                    value={indivForm.periodStart}
                    onChange={(e) => setIndivForm({ ...indivForm, periodStart: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Period End</label>
                  <input
                    type="date"
                    required
                    value={indivForm.periodEnd}
                    onChange={(e) => setIndivForm({ ...indivForm, periodEnd: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              {/* Salary & Attendance Parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Base Monthly Salary ($) *</label>
                  <input
                    type="number"
                    required
                    value={indivForm.baseSalary}
                    onChange={(e) => setIndivForm({ ...indivForm, baseSalary: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Overtime Hours</label>
                  <input
                    type="number"
                    value={indivForm.overtimeHours}
                    onChange={(e) => setIndivForm({ ...indivForm, overtimeHours: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Overtime Hourly Rate ($)</label>
                  <input
                    type="number"
                    value={indivForm.overtimeRate}
                    onChange={(e) => setIndivForm({ ...indivForm, overtimeRate: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-neutral-400 mb-1">Initial Status</label>
                <select
                  value={indivForm.status}
                  onChange={(e) => setIndivForm({ ...indivForm, status: e.target.value as PayrollStatus })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-semibold"
                >
                  <option value="pending">Pending</option>
                  <option value="draft">Draft</option>
                  <option value="approved">Approved</option>
                  <option value="paid">Paid & Disbursed</option>
                </select>
              </div>

              {/* Automatic Statutory Breakdown Live Preview */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                  <span className="font-semibold text-neutral-300">Live Compensation Computation</span>
                  <span className="text-emerald-400 font-mono font-bold text-sm">Net: ${indivNet.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div>
                    <span className="text-neutral-500 block">Gross Earnings:</span>
                    <span className="font-mono text-white font-semibold">${indivGross.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Tax ({settings.defaultTaxRate}%):</span>
                    <span className="font-mono text-red-400">-${indivTax.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Pension (5%):</span>
                    <span className="font-mono text-red-400">-${indivPension.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Health Ins.:</span>
                    <span className="font-mono text-red-400">-${indivHealth}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsIndividualModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Create & Issue Payroll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Batch Generation */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto" id="modal-generate-payroll">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-700 text-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
              <h3 className="text-base font-bold text-white">Generate Workforce Payroll Run</h3>
              <button onClick={() => setIsGenerateModalOpen(false)} className="p-1.5 text-neutral-400 hover:text-white cursor-pointer">
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
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer shadow-md shadow-indigo-600/20"
                >
                  Calculate & Create Draft Run
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Edit / Override Single Payslip */}
      {editingPayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-700 text-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
              <h3 className="text-base font-bold text-white">Adjust Compensation: {editingPayslip.payslip.employeeName}</h3>
              <button onClick={() => setEditingPayslip(null)} className="p-1.5 text-neutral-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditPayslip} className="p-6 space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Base Monthly Salary ($)</label>
                <input
                  type="number"
                  required
                  value={editingPayslip.payslip.baseSalary}
                  onChange={(e) => setEditingPayslip({
                    ...editingPayslip,
                    payslip: { ...editingPayslip.payslip, baseSalary: Number(e.target.value) }
                  })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Overtime Hours</label>
                  <input
                    type="number"
                    value={editingPayslip.payslip.overtimeHours}
                    onChange={(e) => setEditingPayslip({
                      ...editingPayslip,
                      payslip: { ...editingPayslip.payslip, overtimeHours: Number(e.target.value) }
                    })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Overtime Rate ($/hr)</label>
                  <input
                    type="number"
                    value={editingPayslip.payslip.overtimeRate}
                    onChange={(e) => setEditingPayslip({
                      ...editingPayslip,
                      payslip: { ...editingPayslip.payslip, overtimeRate: Number(e.target.value) }
                    })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Status</label>
                <select
                  value={editingPayslip.payslip.status}
                  onChange={(e) => setEditingPayslip({
                    ...editingPayslip,
                    payslip: { ...editingPayslip.payslip, status: e.target.value as PayrollStatus }
                  })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="draft">Draft</option>
                  <option value="approved">Approved</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPayslip(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold cursor-pointer"
                >
                  Save Overrides
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
