import React from 'react';
import { useERP } from '../../context/ERPContext';
import { X, Printer, CheckCircle2, ShieldAlert, Building, DollarSign, Download } from 'lucide-react';

export const PayslipModal: React.FC = () => {
  const {
    selectedPayslipForModal,
    setSelectedPayslipForModal,
    settings
  } = useERP();

  if (!selectedPayslipForModal) return null;
  const ps = selectedPayslipForModal;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto" id="payslip-modal-backdrop">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700 text-white rounded-2xl shadow-2xl overflow-hidden" id="payslip-modal-container">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-semibold text-white">Itemized Payslip Statement</h3>
              <p className="text-xs text-neutral-400">Official Compensation & Deduction Voucher</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors flex items-center gap-1.5 text-xs"
              id="btn-print-payslip"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={() => setSelectedPayslipForModal(null)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Payslip Document Body */}
        <div className="p-6 md:p-8 space-y-6 bg-neutral-900 print:bg-white print:text-black">
          {/* Header section with company and employee metadata */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b border-neutral-800 pb-6 gap-4 print:border-neutral-200">
            <div>
              <h2 className="text-lg font-bold text-white print:text-black">{settings.companyName}</h2>
              <p className="text-xs text-neutral-400 print:text-neutral-600">{settings.address}</p>
              <p className="text-xs text-neutral-400 print:text-neutral-600">Tax ID: {settings.taxNumber}</p>
            </div>
            <div className="sm:text-right">
              <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold uppercase ${
                ps.status === 'paid' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                ps.status === 'approved' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {ps.status} SNAPSHOT
              </span>
              <p className="text-xs text-neutral-400 mt-1">Generated: {ps.generatedDate}</p>
              <p className="text-xs font-mono text-neutral-300 print:text-neutral-700">Voucher: {ps.id.slice(0, 16)}</p>
            </div>
          </div>

          {/* Employee Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs print:bg-neutral-50 print:border-neutral-200">
            <div>
              <span className="text-neutral-500 block">Employee Name:</span>
              <span className="font-semibold text-white print:text-black">{ps.employeeName}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Employee ID:</span>
              <span className="font-mono text-white print:text-black">{ps.employeeCode}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Department:</span>
              <span className="text-neutral-200 print:text-neutral-800">{ps.department}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Role Position:</span>
              <span className="text-neutral-200 print:text-neutral-800">{ps.position}</span>
            </div>
          </div>

          {/* Dual Ledger: Earnings vs Deductions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Earnings Column */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-neutral-800 pb-1.5 print:border-neutral-200">
                Earnings Breakdown
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-neutral-800/60 print:border-neutral-100">
                  <span className="text-neutral-300 print:text-neutral-700">Base Monthly Salary</span>
                  <span className="font-mono font-medium">${ps.baseSalary.toLocaleString()}</span>
                </div>
                {ps.overtimeHours > 0 && (
                  <div className="flex justify-between py-1 border-b border-neutral-800/60 print:border-neutral-100">
                    <span className="text-neutral-300 print:text-neutral-700">Overtime ({ps.overtimeHours} hrs @ ${ps.overtimeRate}/hr)</span>
                    <span className="font-mono font-medium text-emerald-400">+${ps.overtimePay.toLocaleString()}</span>
                  </div>
                )}
                {ps.allowances.map((al, idx) => (
                  <div key={idx} className="flex justify-between py-1 border-b border-neutral-800/60 print:border-neutral-100">
                    <span className="text-neutral-300 print:text-neutral-700">{al.name}</span>
                    <span className="font-mono font-medium text-emerald-400">+${al.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 text-sm font-semibold text-white print:text-black">
                  <span>Gross Earnings</span>
                  <span className="font-mono">${ps.grossPay.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Deductions Column */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 border-b border-neutral-800 pb-1.5 print:border-neutral-200">
                Statutory & Tax Deductions
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-neutral-800/60 print:border-neutral-100">
                  <span className="text-neutral-300 print:text-neutral-700">Federal & State Withholding Tax</span>
                  <span className="font-mono font-medium text-red-400">-${ps.taxDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-800/60 print:border-neutral-100">
                  <span className="text-neutral-300 print:text-neutral-700">Retirement Pension Contribution (5%)</span>
                  <span className="font-mono font-medium text-red-400">-${ps.pensionDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-800/60 print:border-neutral-100">
                  <span className="text-neutral-300 print:text-neutral-700">Corporate Health Insurance</span>
                  <span className="font-mono font-medium text-red-400">-${ps.healthInsuranceDeduction.toLocaleString()}</span>
                </div>
                {ps.deductions.map((d, idx) => (
                  <div key={idx} className="flex justify-between py-1 border-b border-neutral-800/60 print:border-neutral-100">
                    <span className="text-neutral-300 print:text-neutral-700">{d.name}</span>
                    <span className="font-mono font-medium text-red-400">-${d.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 text-sm font-semibold text-red-400">
                  <span>Total Deductions</span>
                  <span className="font-mono">-${ps.totalDeductions.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Pay Callout Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-emerald-500/30 flex flex-col sm:flex-row justify-between items-center gap-3 print:bg-neutral-100 print:border-neutral-300">
            <div>
              <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Net Take-Home Pay</span>
              <p className="text-xs text-neutral-500">Disbursed via {ps.paymentMethod} • {ps.bankDetails.bankName} ({ps.bankDetails.accountNumber})</p>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono print:text-emerald-700">
              ${ps.netPay.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex justify-between items-center text-xs text-neutral-400">
          <span>Comfort BizFlow Automated Payroll Snapshot</span>
          <button
            onClick={() => setSelectedPayslipForModal(null)}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
