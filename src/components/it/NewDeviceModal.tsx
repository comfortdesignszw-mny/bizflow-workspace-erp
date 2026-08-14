import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { ITDeviceInventory, ITDeviceHealth } from '../../types/erp';
import {
  X,
  Laptop,
  CheckCircle2,
  Cpu,
  HardDrive,
  ShieldCheck,
  Calendar,
  DollarSign
} from 'lucide-react';

interface NewDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewDeviceModal: React.FC<NewDeviceModalProps> = ({ isOpen, onClose }) => {
  const { addITDevice, employees } = useERP();

  const [assetTag, setAssetTag] = useState(`HW-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [type, setType] = useState<ITDeviceInventory['type']>('Laptop');
  const [brand, setBrand] = useState('Apple');
  const [model, setModel] = useState('MacBook Pro 16" M3 Max');
  const [serialNumber, setSerialNumber] = useState(`SN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`);
  const [assignedTo, setAssignedTo] = useState('');
  const [healthStatus, setHealthStatus] = useState<ITDeviceHealth>('Healthy');
  const [osVersion, setOsVersion] = useState('macOS Sequoia 15.3');
  const [ipAddress, setIpAddress] = useState('192.168.10.142');
  const [macAddress, setMacAddress] = useState('A4:83:E7:29:41:BC');
  const [purchaseCost, setPurchaseCost] = useState(3499);
  const [warrantyExpiry, setWarrantyExpiry] = useState('2028-12-31');

  if (!isOpen) return null;

  const handleAssigneeChange = (empName: string) => {
    setAssignedTo(empName);
    const found = employees.find(e => `${e.firstName} ${e.lastName}` === empName);
    if (found) {
      // Auto adjust default specs based on department
      if (found.department === 'Engineering') {
        setBrand('Apple');
        setModel('MacBook Pro 16" M3 Max (64GB RAM)');
        setOsVersion('macOS Sequoia 15.3');
      } else if (found.department === 'Design') {
        setBrand('Apple');
        setModel('MacBook Pro 14" M3 Pro');
        setOsVersion('macOS Sequoia 15.3');
      } else {
        setBrand('Dell');
        setModel('XPS 15 9530 (32GB RAM)');
        setOsVersion('Windows 11 Enterprise 23H2');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetTag.trim() || !brand.trim() || !model.trim()) {
      alert('Please fill out all required device hardware specifications.');
      return;
    }

    const assignedEmp = employees.find(e => `${e.firstName} ${e.lastName}` === assignedTo);

    addITDevice({
      assetTag: assetTag.trim(),
      type,
      brand: brand.trim(),
      model: model.trim(),
      serialNumber: serialNumber.trim(),
      assignedTo: assignedTo.trim() || undefined,
      assignedEmployeeId: assignedEmp?.id,
      healthStatus,
      osVersion: osVersion.trim(),
      ipAddress: ipAddress.trim() || undefined,
      macAddress: macAddress.trim() || undefined,
      purchaseCost: Number(purchaseCost) || 0,
      purchaseDate: new Date().toISOString().split('T')[0],
      warrantyExpiry: warrantyExpiry || '2028-12-31',
      lastMdmCheckIn: 'Just now',
      encryptionEnabled: true
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto" id="modal-new-it-device">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl my-8">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">Register IT Hardware Asset</h2>
              <p className="text-xs text-neutral-400">Add workstation, network gateway, mobile unit or server to MDM fleet</p>
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Asset Tag Code</label>
              <input
                type="text"
                required
                value={assetTag}
                onChange={(e) => setAssetTag(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-hidden focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Device Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ITDeviceInventory['type'])}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-hidden focus:border-purple-500"
              >
                <option value="Laptop">Laptop (MacBook / ThinkPad)</option>
                <option value="Desktop">Desktop / Workstation</option>
                <option value="Server">Rackmount Server / Node</option>
                <option value="Router/Switch">Network Router / Switch</option>
                <option value="Monitor">Display / 4K Monitor</option>
                <option value="Mobile/Tablet">Mobile / Testing Tablet</option>
                <option value="Peripheral">Peripheral / YubiKey / Dock</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Brand / Manufacturer</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g., Apple, Dell, Lenovo, Cisco, Ubiquiti"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-hidden focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Model Specification</label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g., MacBook Pro 16 M3 Max or ThinkPad X1 Carbon"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-hidden focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Serial Number</label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-hidden focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Assign to Staff Member</label>
              <select
                value={assignedTo}
                onChange={(e) => handleAssigneeChange(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-hidden focus:border-purple-500"
              >
                <option value="">-- Unassigned (Inventory Spare Pool) --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={`${emp.firstName} ${emp.lastName}`}>
                    {emp.firstName} {emp.lastName} ({emp.department})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">OS / Firmware Version</label>
              <input
                type="text"
                value={osVersion}
                onChange={(e) => setOsVersion(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-hidden focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Initial Health State</label>
              <select
                value={healthStatus}
                onChange={(e) => setHealthStatus(e.target.value as ITDeviceHealth)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-hidden focus:border-purple-500"
              >
                <option value="Healthy">Healthy / Fully Operational</option>
                <option value="Needs Maintenance">Needs Maintenance / Patch</option>
                <option value="Battery Degraded">Battery / Thermal Degraded</option>
                <option value="Pending Replacement">Pending Replacement</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Purchase Cost ($)</label>
              <input
                type="number"
                value={purchaseCost}
                onChange={(e) => setPurchaseCost(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-hidden focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Warranty Expiration</label>
              <input
                type="date"
                value={warrantyExpiry}
                onChange={(e) => setWarrantyExpiry(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-hidden focus:border-purple-500"
              />
            </div>
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
              className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-purple-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Enroll Device in MDM</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
