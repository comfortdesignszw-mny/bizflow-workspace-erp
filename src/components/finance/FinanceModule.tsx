import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Receipt,
  Plus,
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Building,
  Calendar,
  Eye,
  Printer,
  X,
  CreditCard
} from 'lucide-react';
import { ExpenseClaim, Invoice } from '../../types/erp';

export const FinanceModule: React.FC = () => {
  const {
    expenses,
    invoices,
    employees,
    addExpense,
    updateExpenseStatus,
    addInvoice,
    updateInvoiceStatus,
    setSelectedInvoiceForModal,
    settings,
    currentUser
  } = useERP();

  const [activeTab, setActiveTab] = useState<'invoices' | 'expenses'>('invoices');
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddInvoiceOpen, setIsAddInvoiceOpen] = useState(false);

  // New Expense state
  const [newExp, setNewExp] = useState({
    employeeId: employees[0]?.id || '',
    employeeName: `${employees[0]?.firstName} ${employees[0]?.lastName}`,
    department: employees[0]?.department || 'Engineering',
    category: 'Travel & Lodging' as ExpenseClaim['category'],
    amount: 350,
    currency: 'USD',
    description: '',
    merchant: ''
  });

  // New Invoice state
  const [newInv, setNewInv] = useState({
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '2026-09-15',
    status: 'Sent' as Invoice['status'],
    items: [
      { description: 'Workforce ERP System Implementation', quantity: 1, unitPrice: 38000, total: 38000 }
    ],
    subtotal: 38000,
    taxRate: 0.08,
    taxAmount: 3040,
    totalAmount: 41040,
    currency: 'USD',
    notes: 'Payment terms net 30 days.'
  });

  const totalInvoiced = invoices.reduce((s, i) => s + i.totalAmount, 0);
  const totalPaidInvoices = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.totalAmount, 0);
  const totalExpenses = expenses.filter(e => e.status === 'Approved').reduce((s, e) => s + e.amount, 0);

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExp.description || !newExp.merchant) return;
    const emp = employees.find(e => e.id === newExp.employeeId);
    addExpense({
      ...newExp,
      employeeName: emp ? `${emp.firstName} ${emp.lastName}` : newExp.employeeName,
      department: emp ? emp.department : newExp.department
    });
    setIsAddExpenseOpen(false);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInv.clientName) return;
    addInvoice(newInv);
    setIsAddInvoiceOpen(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto" id="finance-module-view">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 backdrop-blur-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Corporate Finance & Accounts
            </span>
            <span className="text-xs text-neutral-400 font-mono">General Ledger & Billing</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Billing, Invoices & Expense Approvals</h1>
          <p className="text-xs text-neutral-400">
            Client accounts receivable, billable milestones, and employee disbursement reimbursements.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Submit Expense</span>
          </button>
          <button
            onClick={() => setIsAddInvoiceOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* KPI Financial Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <span className="text-xs text-neutral-400 font-medium">Total Billed Revenue</span>
          <p className="text-2xl font-black text-white font-mono mt-1">${totalInvoiced.toLocaleString()}</p>
          <span className="text-[11px] text-neutral-500">{invoices.length} active invoices</span>
        </div>
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <span className="text-xs text-emerald-400 font-medium">Collected Cash Flow</span>
          <p className="text-2xl font-black text-emerald-400 font-mono mt-1">${totalPaidInvoices.toLocaleString()}</p>
          <span className="text-[11px] text-neutral-500">Paid and settled invoices</span>
        </div>
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <span className="text-xs text-amber-400 font-medium">Approved Reimbursements</span>
          <p className="text-2xl font-black text-amber-400 font-mono mt-1">${totalExpenses.toLocaleString()}</p>
          <span className="text-[11px] text-neutral-500">Employee expense claims</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-800 space-x-4">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`pb-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'invoices' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Client Tax Invoices ({invoices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className={`pb-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'expenses' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Employee Expense Claims ({expenses.length})</span>
        </button>
      </div>

      {/* Tab 1: Invoices */}
      {activeTab === 'invoices' && (
        <div className="overflow-x-auto rounded-2xl bg-neutral-900 border border-neutral-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/60 text-neutral-400 font-semibold uppercase text-[10px]">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-3">Issue Date</th>
                <th className="py-3 px-3">Due Date</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-blue-400 text-xs">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-4 font-sans font-medium text-white">
                    {inv.clientName}
                    <span className="block text-[10px] text-neutral-500 font-mono">{inv.clientEmail}</span>
                  </td>
                  <td className="py-3.5 px-3 text-neutral-400">
                    {inv.issueDate}
                  </td>
                  <td className="py-3.5 px-3 text-neutral-400">
                    {inv.dueDate}
                  </td>
                  <td className="py-3.5 px-3 font-bold text-white">
                    ${inv.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 font-sans">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      inv.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      inv.status === 'Sent' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-sans">
                    <div className="flex items-center justify-end gap-2">
                      {inv.status !== 'Paid' && (
                        <button
                          onClick={() => updateInvoiceStatus(inv.id, 'Paid')}
                          className="px-2 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30"
                        >
                          Mark Paid
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedInvoiceForModal(inv)}
                        className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-blue-400 hover:text-blue-300 font-medium text-xs flex items-center gap-1"
                        title="Print / View Invoice"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Expense Claims */}
      {activeTab === 'expenses' && (
        <div className="overflow-x-auto rounded-2xl bg-neutral-900 border border-neutral-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/60 text-neutral-400 font-semibold uppercase text-[10px]">
                <th className="py-3 px-4">Claim ID</th>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-4">Merchant & Description</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Approval Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-amber-400 text-xs">
                    {exp.code}
                  </td>
                  <td className="py-3.5 px-4 font-sans font-medium text-white">
                    {exp.employeeName}
                    <span className="block text-[10px] text-neutral-500 font-mono">{exp.department}</span>
                  </td>
                  <td className="py-3.5 px-3 font-sans text-neutral-300">
                    {exp.category}
                  </td>
                  <td className="py-3.5 px-4 font-sans text-neutral-300">
                    <span className="font-semibold text-white block">{exp.merchant}</span>
                    <span className="text-[11px] text-neutral-400">{exp.description}</span>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-white">
                    ${exp.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 font-sans">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      exp.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      exp.status === 'Pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {exp.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-sans">
                    {exp.status === 'Pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => updateExpenseStatus(exp.id, 'Approved')}
                          className="p-1 rounded bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30"
                          title="Approve Reimbursement"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => updateExpenseStatus(exp.id, 'Rejected')}
                          className="p-1 rounded bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30"
                          title="Reject Claim"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-neutral-500 font-mono">Reviewed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Submit Expense Modal */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-700 text-white rounded-2xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-white text-sm">Submit Expense Claim</h3>
              <button onClick={() => setIsAddExpenseOpen(false)} className="text-neutral-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateExpense} className="space-y-3">
              <div>
                <label className="block text-neutral-400 mb-1">Employee Personnel</label>
                <select
                  value={newExp.employeeId}
                  onChange={(e) => setNewExp({ ...newExp, employeeId: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                >
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.department})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Category</label>
                  <select
                    value={newExp.category}
                    onChange={(e) => setNewExp({ ...newExp, category: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Travel & Lodging">Travel & Lodging</option>
                    <option value="Client Entertainment">Client Entertainment</option>
                    <option value="Software & Cloud">Software & Cloud</option>
                    <option value="Hardware & Equipment">Hardware & Equipment</option>
                    <option value="Office Supplies">Office Supplies</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    required
                    value={newExp.amount}
                    onChange={(e) => setNewExp({ ...newExp, amount: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Merchant / Vendor *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Cloud Services, Delta Airlines"
                  value={newExp.merchant}
                  onChange={(e) => setNewExp({ ...newExp, merchant: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Business Purpose *</label>
                <textarea
                  rows={2}
                  required
                  value={newExp.description}
                  onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                  placeholder="Explanation of expenditure..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddExpenseOpen(false)} className="px-4 py-1.5 bg-neutral-800 rounded-xl text-neutral-300">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold text-white">Submit for Sign-off</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
