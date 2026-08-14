import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { ITSoftwareLicense } from '../../types/erp';
import {
  X,
  Key,
  CheckCircle2,
  Calendar,
  DollarSign,
  Users
} from 'lucide-react';

interface NewLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewLicenseModal: React.FC<NewLicenseModalProps> = ({ isOpen, onClose }) => {
  const { addITLicense } = useERP();

  const [softwareName, setSoftwareName] = useState('');
  const [vendor, setVendor] = useState('');
  const [category, setCategory] = useState<ITSoftwareLicense['category']>('Developer Tools');
  const [seatsAllocated, setSeatsAllocated] = useState(25);
  const [seatsTotal, setSeatsTotal] = useState(30);
  const [costPerSeatAnnual, setCostPerSeatAnnual] = useState(240);
  const [renewalDate, setRenewalDate] = useState('2026-12-31');
  const [contactPerson, setContactPerson] = useState('licensing@vendor.com');
  const [licenseKeyMasked, setLicenseKeyMasked] = useState('XXXX-XXXX-XXXX-XXXX');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!softwareName.trim() || !vendor.trim()) {
      alert('Please provide software product name and vendor.');
      return;
    }

    addITLicense({
      softwareName: softwareName.trim(),
      vendor: vendor.trim(),
      category,
      seatsAllocated: Number(seatsAllocated) || 0,
      seatsTotal: Number(seatsTotal) || 1,
      costPerSeatAnnual: Number(costPerSeatAnnual) || 0,
      renewalDate: renewalDate || '2026-12-31',
      contactPerson: contactPerson.trim(),
      licenseKeyMasked: licenseKeyMasked.trim() || '****-****-****-****',
      autoRenew: true
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto" id="modal-new-it-license">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl my-8">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">Add SaaS License / Subscription</h2>
              <p className="text-xs text-neutral-400">Track seat limits, compliance, renewals and developer toolchains</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Software / SaaS Name</label>
            <input
              type="text"
              required
              value={softwareName}
              onChange={(e) => setSoftwareName(e.target.value)}
              placeholder="e.g., JetBrains All Products Pack, Slack Enterprise, Sentry"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Vendor / Publisher</label>
              <input
                type="text"
                required
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                placeholder="e.g., JetBrains s.r.o., Salesforce, AWS"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ITSoftwareLicense['category'])}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-hidden focus:border-emerald-500"
              >
                <option value="Developer Tools">Developer Tools & IDEs</option>
                <option value="Security/VPN">Security, Antivirus & VPN</option>
                <option value="Cloud/DevOps">Cloud & Observability</option>
                <option value="Productivity/Office">Productivity & Office</option>
                <option value="Design/Media">Design & Creative Suite</option>
                <option value="Infrastructure">Database & Infrastructure</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Seats In Use</label>
              <input
                type="number"
                min="0"
                value={seatsAllocated}
                onChange={(e) => setSeatsAllocated(parseInt(e.target.value) || 0)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Total Capacity</label>
              <input
                type="number"
                min="1"
                value={seatsTotal}
                onChange={(e) => setSeatsTotal(parseInt(e.target.value) || 1)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Cost/Seat ($/yr)</label>
              <input
                type="number"
                min="0"
                value={costPerSeatAnnual}
                onChange={(e) => setCostPerSeatAnnual(parseInt(e.target.value) || 0)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Next Renewal Date</label>
              <input
                type="date"
                value={renewalDate}
                onChange={(e) => setRenewalDate(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Account Manager / Contact</label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="vendor-rep@domain.com"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">License Key (Masked/Stored Securely)</label>
            <input
              type="text"
              value={licenseKeyMasked}
              onChange={(e) => setLicenseKeyMasked(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Register License Key</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
