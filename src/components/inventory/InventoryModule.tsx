import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Package,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Laptop,
  Shield,
  User,
  Calendar,
  DollarSign,
  X,
  RefreshCw
} from 'lucide-react';
import { Asset, AssetStatus } from '../../types/erp';

export const InventoryModule: React.FC = () => {
  const {
    assets,
    employees,
    addAsset,
    updateAsset,
    assignAsset
  } = useERP();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [targetAsset, setTargetAsset] = useState<Asset | null>(null);
  const [assignEmpId, setAssignEmpId] = useState('');

  // Add Asset form state
  const [newAsset, setNewAsset] = useState({
    name: '',
    category: 'Workstation Laptop' as Asset['category'],
    serialNumber: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    purchaseCost: 2400,
    status: 'Available' as AssetStatus,
    location: 'Building A, Level 4'
  });

  const categories = ['ALL', 'Workstation Laptop', 'Desktop & Display', 'Mobile & Tablet', 'Server & Networking', 'Office Equipment'];

  const filteredAssets = assets.filter(a => {
    const matchesCat = selectedCategory === 'ALL' || a.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || a.status === selectedStatus;
    const matchesQuery = `${a.name} ${a.code} ${a.serialNumber} ${a.assignedToName || ''}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesStatus && matchesQuery;
  });

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.name || !newAsset.serialNumber) return;
    addAsset(newAsset);
    setIsAddModalOpen(false);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAsset) return;
    assignAsset(targetAsset.id, assignEmpId ? assignEmpId : undefined);
    setIsAssignModalOpen(false);
    setTargetAsset(null);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto" id="inventory-module-view">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 backdrop-blur-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              Hardware & Asset Inventory
            </span>
            <span className="text-xs text-neutral-400 font-mono">Chain of Custody Ledger</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Enterprise Assets & Equipment</h1>
          <p className="text-xs text-neutral-400">
            Track hardware assignments, serial numbers, warranty lifecycles, and custody audit trails.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Asset</span>
        </button>
      </div>

      {/* Filter Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-neutral-900 p-4 rounded-2xl border border-neutral-800 text-xs">
        <div className="sm:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by asset tag, name, serial number, or employee..."
            className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl pl-9 pr-4 py-2 text-white placeholder-neutral-500"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl px-3 py-2 text-white"
          >
            {categories.map(c => <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>)}
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl px-3 py-2 text-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="Assigned">Assigned</option>
            <option value="Available">Available</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Asset Table */}
      <div className="overflow-x-auto rounded-2xl bg-neutral-900 border border-neutral-800">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-950/60 text-neutral-400 font-semibold uppercase text-[10px]">
              <th className="py-3 px-4">Asset Tag</th>
              <th className="py-3 px-4">Equipment Name</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Serial Number</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-4">Assigned Custody</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60 font-mono">
            {filteredAssets.map((ast) => (
              <tr key={ast.id} className="hover:bg-neutral-800/40 transition-colors">
                <td className="py-3.5 px-4 font-bold text-cyan-400 text-xs">
                  {ast.code}
                </td>
                <td className="py-3.5 px-4 font-sans font-medium text-white">
                  {ast.name}
                  <span className="block text-[10px] text-neutral-500 font-mono">{ast.location}</span>
                </td>
                <td className="py-3.5 px-3 font-sans text-neutral-300">
                  {ast.category}
                </td>
                <td className="py-3.5 px-3 text-neutral-400">
                  {ast.serialNumber}
                </td>
                <td className="py-3.5 px-3 font-sans">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                    ast.status === 'Assigned' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                    ast.status === 'Available' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {ast.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-sans">
                  {ast.assignedToName ? (
                    <div>
                      <p className="font-semibold text-white">{ast.assignedToName}</p>
                      <p className="text-[10px] text-neutral-500 font-mono">Since {ast.assignedDate}</p>
                    </div>
                  ) : (
                    <span className="text-neutral-500 italic">In Storage Locker</span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right font-sans">
                  <button
                    onClick={() => {
                      setTargetAsset(ast);
                      setAssignEmpId(ast.assignedToId || '');
                      setIsAssignModalOpen(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-cyan-400 hover:text-cyan-300 font-medium text-xs ml-auto"
                  >
                    {ast.assignedToId ? 'Reassign' : 'Assign'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Assign Modal */}
      {isAssignModalOpen && targetAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-700 text-white rounded-2xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-white text-sm">Assign Equipment Custody</h3>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-neutral-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAssignSubmit} className="space-y-3">
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <p className="font-bold text-white">{targetAsset.name}</p>
                <p className="text-neutral-400 font-mono">Tag: {targetAsset.code} • SN: {targetAsset.serialNumber}</p>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Assign to Employee Personnel</label>
                <select
                  value={assignEmpId}
                  onChange={(e) => setAssignEmpId(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="">-- Return to Central Inventory (Unassign) --</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.code} - {e.firstName} {e.lastName} ({e.department})</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAssignModalOpen(false)} className="px-4 py-1.5 bg-neutral-800 rounded-xl text-neutral-300">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-semibold text-white">Save Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Asset Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-700 text-white rounded-2xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-white text-sm">Register Enterprise Asset</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-neutral-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateAsset} className="space-y-3">
              <div>
                <label className="block text-neutral-400 mb-1">Asset / Model Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MacBook Pro 16 M3 Max"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Category</label>
                  <select
                    value={newAsset.category}
                    onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Workstation Laptop">Workstation Laptop</option>
                    <option value="Desktop & Display">Desktop & Display</option>
                    <option value="Mobile & Tablet">Mobile & Tablet</option>
                    <option value="Server & Networking">Server & Networking</option>
                    <option value="Office Equipment">Office Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Serial Number *</label>
                  <input
                    type="text"
                    required
                    value={newAsset.serialNumber}
                    onChange={(e) => setNewAsset({ ...newAsset, serialNumber: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Purchase Cost ($)</label>
                  <input
                    type="number"
                    value={newAsset.purchaseCost}
                    onChange={(e) => setNewAsset({ ...newAsset, purchaseCost: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Storage Location</label>
                  <input
                    type="text"
                    value={newAsset.location}
                    onChange={(e) => setNewAsset({ ...newAsset, location: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-1.5 bg-neutral-800 rounded-xl text-neutral-300">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-semibold text-white">Save Equipment</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
