import React from 'react';
import { useERP } from '../../context/ERPContext';
import { X, Printer, FileText, CheckCircle, Building, Mail, Calendar } from 'lucide-react';

export const InvoiceModal: React.FC = () => {
  const {
    selectedInvoiceForModal,
    setSelectedInvoiceForModal,
    settings
  } = useERP();

  if (!selectedInvoiceForModal) return null;
  const inv = selectedInvoiceForModal;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto" id="invoice-modal-backdrop">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700 text-white rounded-2xl shadow-2xl overflow-hidden" id="invoice-modal-container">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Client Tax Invoice — {inv.invoiceNumber}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors flex items-center gap-1.5 text-xs"
              id="btn-print-invoice"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={() => setSelectedInvoiceForModal(null)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Printable View */}
        <div className="p-6 md:p-8 space-y-6 bg-neutral-900 print:bg-white print:text-black text-xs">
          {/* Top Banner */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b border-neutral-800 pb-6 gap-4 print:border-neutral-200">
            <div>
              <h2 className="text-xl font-bold text-white print:text-black">{settings.companyName}</h2>
              <p className="text-neutral-400 print:text-neutral-600">{settings.address}</p>
              <p className="text-neutral-400 print:text-neutral-600">{settings.email} • {settings.phone}</p>
              <p className="text-neutral-400 print:text-neutral-600">Tax ID: {settings.taxNumber}</p>
            </div>
            <div className="sm:text-right">
              <h1 className="text-2xl font-black text-neutral-200 tracking-wider">INVOICE</h1>
              <p className="font-mono text-sm font-bold text-blue-400 print:text-blue-700">{inv.invoiceNumber}</p>
              <span className={`inline-block mt-1 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase ${
                inv.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                inv.status === 'Sent' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                'bg-amber-500/20 text-amber-300'
              }`}>
                Status: {inv.status}
              </span>
            </div>
          </div>

          {/* Bill To & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-neutral-950 border border-neutral-800 print:bg-neutral-50 print:border-neutral-200">
            <div>
              <span className="text-neutral-500 font-semibold block uppercase text-[10px]">Billed To:</span>
              <p className="font-bold text-sm text-white print:text-black mt-0.5">{inv.clientName}</p>
              <p className="text-neutral-400 print:text-neutral-600">{inv.clientAddress}</p>
              <p className="text-neutral-400 print:text-neutral-600">{inv.clientEmail}</p>
            </div>
            <div className="space-y-1 sm:text-right">
              <div>
                <span className="text-neutral-500">Issue Date: </span>
                <span className="font-mono font-medium text-white print:text-black">{inv.issueDate}</span>
              </div>
              <div>
                <span className="text-neutral-500">Payment Due: </span>
                <span className="font-mono font-medium text-white print:text-black">{inv.dueDate}</span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] print:border-neutral-200">
                  <th className="py-2.5 px-2">Item Description</th>
                  <th className="py-2.5 px-2 text-center">Qty</th>
                  <th className="py-2.5 px-2 text-right">Unit Price</th>
                  <th className="py-2.5 px-2 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 print:divide-neutral-100">
                {inv.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-2 font-medium text-white print:text-black">{item.description}</td>
                    <td className="py-3 px-2 text-center text-neutral-300 print:text-neutral-700 font-mono">{item.quantity}</td>
                    <td className="py-3 px-2 text-right text-neutral-300 print:text-neutral-700 font-mono">${item.unitPrice.toLocaleString()}</td>
                    <td className="py-3 px-2 text-right font-mono font-semibold text-white print:text-black">${item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Calculation */}
          <div className="flex justify-end pt-4 border-t border-neutral-800 print:border-neutral-200">
            <div className="w-full max-w-xs space-y-2 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal</span>
                <span className="font-mono text-white print:text-black">${inv.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Sales Tax ({(inv.taxRate * 100).toFixed(0)}%)</span>
                <span className="font-mono text-white print:text-black">+${inv.taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-emerald-400 pt-2 border-t border-neutral-800 print:border-neutral-200 print:text-emerald-700">
                <span>Total Amount Due</span>
                <span className="font-mono">${inv.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {inv.notes && (
            <div className="p-3 bg-neutral-950 rounded-lg text-neutral-400 print:bg-neutral-50">
              <span className="font-semibold text-neutral-300 block mb-0.5">Notes:</span>
              <p>{inv.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex justify-between items-center text-xs text-neutral-400">
          <span>Thank you for partnering with Comfort BizFlow Enterprise.</span>
          <button
            onClick={() => setSelectedInvoiceForModal(null)}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
