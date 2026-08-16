import React, { useState, useEffect } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Truck,
  Package,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Phone,
  Mail,
  DollarSign,
  Calendar,
  Building,
  ChevronRight,
  ShieldCheck,
  Send,
  Boxes,
  FileCheck,
  Car
} from 'lucide-react';
import { PurchaseOrder, PurchaseOrderStatus, Vendor } from '../../types/erp';
import { FleetManagement } from './FleetManagement';

export const ProcurementModule: React.FC = () => {
  const {
    vendors,
    purchaseOrders,
    addPurchaseOrder,
    updatePurchaseOrderStatus,
    settings,
    currentUser,
    activeModule,
    procurementTab,
    setProcurementTab
  } = useERP();

  const [activeTab, setActiveTab] = useState<'orders' | 'vendors' | 'logistics' | 'fleet'>(() => {
    if (activeModule === 'fleet') return 'fleet';
    return procurementTab || 'orders';
  });

  useEffect(() => {
    if (activeModule === 'fleet') {
      setActiveTab('fleet');
    } else if (procurementTab && procurementTab !== activeTab) {
      setActiveTab(procurementTab);
    }
  }, [activeModule, procurementTab]);

  const handleTabChange = (tab: 'orders' | 'vendors' | 'logistics' | 'fleet') => {
    setActiveTab(tab);
    setProcurementTab(tab);
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isAddPOModalOpen, setIsAddPOModalOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

  // New Purchase Order form state
  const [newPO, setNewPO] = useState({
    vendorId: vendors[0]?.id || '',
    vendorName: vendors[0]?.name || '',
    requestedBy: currentUser.name,
    department: 'Engineering',
    items: [
      { id: '1', name: 'High-Density Rack Server Rails', sku: 'RACK-SRV-01', quantity: 4, unitPrice: 450, total: 1800 }
    ],
    totalAmount: 1800,
    currency: 'USD',
    expectedDelivery: '2026-08-28',
    notes: 'Urgent server room upgrade.'
  });

  const filteredPOs = purchaseOrders.filter(po => {
    const matchesSearch = po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalProcurementSpend = purchaseOrders
    .filter(po => po.status !== 'Cancelled')
    .reduce((sum, po) => sum + po.totalAmount, 0);

  const pendingDeliveryCount = purchaseOrders.filter(po => po.status === 'Ordered' || po.status === 'Requested').length;
  const deliveredCount = purchaseOrders.filter(po => po.status === 'Delivered').length;

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    const vendor = vendors.find(v => v.id === newPO.vendorId);
    addPurchaseOrder({
      ...newPO,
      vendorName: vendor ? vendor.name : newPO.vendorName,
      status: 'Requested'
    });
    setIsAddPOModalOpen(false);
  };

  const getStatusBadge = (status: PurchaseOrderStatus) => {
    switch (status) {
      case 'Delivered':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
      case 'Ordered':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1"><Truck className="w-3 h-3" /> In Transit / Ordered</span>;
      case 'Requested':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1"><Clock className="w-3 h-3" /> Requisition Pending</span>;
      case 'Approved':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1"><FileCheck className="w-3 h-3" /> Approved</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-800 text-neutral-400">{status}</span>;
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto" id="procurement-module-root">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 backdrop-blur-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Supply Chain & Logistics
            </span>
            <span className="text-xs text-neutral-400 font-mono">ERP Enterprise v2.4</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Procurement & Logistics</h1>
          <p className="text-sm text-neutral-400">Manage vendor purchase requisitions, freight shipments, and supply chain commitments</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddPOModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-purple-600/20 transition-all cursor-pointer"
            id="btn-create-po"
          >
            <Plus className="w-4 h-4" />
            <span>Create Requisition</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-medium">Committed Spend</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">
              ${totalProcurementSpend.toLocaleString()}
            </div>
            <span className="text-[10px] text-purple-400 font-medium">Across all approved POs</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-medium">In Transit / Pending</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">
              {pendingDeliveryCount} Orders
            </div>
            <span className="text-[10px] text-blue-400 font-medium">Scheduled this month</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-medium">Completed Receipts</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">
              {deliveredCount} Delivered
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">Goods received & verified</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-medium">Active Key Vendors</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">
              {vendors.length} Partners
            </div>
            <span className="text-[10px] text-amber-400 font-medium">Tier-1 certified suppliers</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 border-b border-neutral-800 pb-3 w-full">
        <button
          onClick={() => handleTabChange('orders')}
          className={`px-3 sm:px-4 py-2.5 sm:py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center sm:justify-start gap-2 cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900 bg-neutral-900/60 sm:bg-transparent'
          }`}
          id="tab-procurement-orders"
        >
          <Package className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" />
          <span className="truncate">Orders & POs</span>
        </button>
        <button
          onClick={() => handleTabChange('vendors')}
          className={`px-3 sm:px-4 py-2.5 sm:py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center sm:justify-start gap-2 cursor-pointer ${
            activeTab === 'vendors'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900 bg-neutral-900/60 sm:bg-transparent'
          }`}
          id="tab-procurement-vendors"
        >
          <Building className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" />
          <span className="truncate">Vendors</span>
        </button>
        <button
          onClick={() => handleTabChange('logistics')}
          className={`px-3 sm:px-4 py-2.5 sm:py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center sm:justify-start gap-2 cursor-pointer ${
            activeTab === 'logistics'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900 bg-neutral-900/60 sm:bg-transparent'
          }`}
          id="tab-procurement-logistics"
        >
          <Truck className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" />
          <span className="truncate">Freight Tracking</span>
        </button>
        <button
          onClick={() => handleTabChange('fleet')}
          className={`px-3 sm:px-4 py-2.5 sm:py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center sm:justify-start gap-2 cursor-pointer ${
            activeTab === 'fleet'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900 bg-neutral-900/60 sm:bg-transparent'
          }`}
          id="tab-procurement-fleet"
        >
          <Car className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" />
          <span className="truncate">Fleet & Vehicles</span>
        </button>
      </div>

      {/* TAB 1: PURCHASE ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Search PO #, vendor, or dept..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-neutral-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-hidden"
              >
                <option value="ALL">All PO Statuses</option>
                <option value="Requested">Requested</option>
                <option value="Ordered">Ordered / In Transit</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-950/80 text-neutral-400 uppercase tracking-wider font-mono text-[11px] border-b border-neutral-800">
                  <tr>
                    <th className="p-4">PO Number</th>
                    <th className="p-4">Vendor & Department</th>
                    <th className="p-4">Order Date</th>
                    <th className="p-4">Delivery Window</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {filteredPOs.map((po) => (
                    <tr key={po.id} className="hover:bg-neutral-900/80 transition-colors">
                      <td className="p-4 font-mono font-bold text-purple-400">
                        {po.poNumber}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-white">{po.vendorName}</div>
                        <div className="text-[11px] text-neutral-400">Dept: {po.department} • Req: {po.requestedBy}</div>
                      </td>
                      <td className="p-4 font-mono text-neutral-300">
                        {po.orderDate}
                      </td>
                      <td className="p-4">
                        <div className="font-mono text-xs text-neutral-300">Exp: {po.expectedDelivery}</div>
                        {po.trackingNumber && (
                          <div className="text-[10px] text-purple-400 font-mono flex items-center gap-1">
                            <Truck className="w-3 h-3" /> {po.carrier}: {po.trackingNumber}
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-mono font-bold text-white">
                        ${po.totalAmount.toLocaleString()} {po.currency}
                      </td>
                      <td className="p-4">
                        {getStatusBadge(po.status)}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {po.status === 'Requested' && (
                            <button
                              onClick={() => updatePurchaseOrderStatus(po.id, 'Ordered')}
                              className="px-2.5 py-1 bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 rounded-lg text-[11px] font-medium border border-blue-500/30"
                            >
                              Dispatch Order
                            </button>
                          )}
                          {po.status === 'Ordered' && (
                            <button
                              onClick={() => updatePurchaseOrderStatus(po.id, 'Delivered')}
                              className="px-2.5 py-1 bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 rounded-lg text-[11px] font-medium border border-emerald-500/30"
                            >
                              Confirm Receipt
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedPO(po)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                            title="View Items"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VENDOR DIRECTORY */}
      {activeTab === 'vendors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-purple-300 border border-neutral-700">
                    {vendor.category}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5">{vendor.name}</h3>
                  <p className="text-xs text-neutral-400">Payment Terms: {vendor.paymentTerms}</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {vendor.status}
                  </span>
                  <div className="text-xs font-mono text-neutral-400 mt-1">
                    Rating: <strong className="text-amber-400">★ {vendor.rating}</strong>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-neutral-800/80">
                <div className="space-y-1">
                  <div className="text-neutral-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{vendor.email}</span>
                  </div>
                  <div className="text-neutral-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{vendor.phone}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-neutral-500 block text-[11px]">Total YTD Spend</span>
                  <span className="font-mono font-bold text-white text-sm">
                    ${vendor.totalSpend.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: LOGISTICS & SHIPMENTS */}
      {activeTab === 'logistics' && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-purple-400" />
              Active Inbound Freight Shipments
            </h3>
            <div className="space-y-3">
              {purchaseOrders.filter(po => po.trackingNumber).map(po => (
                <div key={po.id} className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-purple-400 font-bold">{po.poNumber}</span>
                    <h4 className="text-sm font-bold text-white">{po.vendorName}</h4>
                    <p className="text-xs text-neutral-400">Items: {po.items.map(i => i.name).join(', ')}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="text-right">
                      <span className="text-neutral-400 block text-[10px]">Carrier & Tracking</span>
                      <span className="text-white font-bold">{po.carrier} ({po.trackingNumber})</span>
                    </div>
                    {getStatusBadge(po.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FLEET & VEHICLE LOGISTICS */}
      {activeTab === 'fleet' && (
        <FleetManagement />
      )}

      {/* MODAL: CREATE REQUISITION */}
      {isAddPOModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Create Purchase Requisition</h3>
            <form onSubmit={handleCreatePO} className="space-y-3 text-xs">
              <div>
                <label className="text-neutral-400 block mb-1">Target Vendor</label>
                <select
                  value={newPO.vendorId}
                  onChange={(e) => {
                    const v = vendors.find(item => item.id === e.target.value);
                    setNewPO({ ...newPO, vendorId: e.target.value, vendorName: v?.name || '' });
                  }}
                  className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                >
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Item Description</label>
                <input
                  type="text"
                  value={newPO.items[0].name}
                  onChange={(e) => {
                    const itm = { ...newPO.items[0], name: e.target.value };
                    setNewPO({ ...newPO, items: [itm] });
                  }}
                  placeholder="e.g. 10x Enterprise SSD Storage Arrays"
                  className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">Total Estimated Amount ($)</label>
                  <input
                    type="number"
                    value={newPO.totalAmount}
                    onChange={(e) => {
                      const amt = Number(e.target.value);
                      const itm = { ...newPO.items[0], unitPrice: amt, total: amt };
                      setNewPO({ ...newPO, totalAmount: amt, items: [itm] });
                    }}
                    className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Expected Delivery Date</label>
                  <input
                    type="date"
                    value={newPO.expectedDelivery}
                    onChange={(e) => setNewPO({ ...newPO, expectedDelivery: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Internal Notes & Justification</label>
                <textarea
                  value={newPO.notes}
                  onChange={(e) => setNewPO({ ...newPO, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white h-20"
                  placeholder="Reason for purchase requisition..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddPOModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-500"
                >
                  Submit PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL DRAWER FOR SELECTED PO */}
      {selectedPO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-purple-400 font-bold">{selectedPO.poNumber}</span>
                <h3 className="text-lg font-bold text-white">{selectedPO.vendorName}</h3>
              </div>
              <button
                onClick={() => setSelectedPO(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <div className="text-neutral-400">Order Items:</div>
                {selectedPO.items.map((item) => (
                  <div key={item.id} className="flex justify-between font-mono text-white pt-1">
                    <span>{item.quantity}x {item.name}</span>
                    <span>${item.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 text-neutral-400">
                <div>Requested By: <strong className="text-white">{selectedPO.requestedBy}</strong></div>
                <div>Department: <strong className="text-white">{selectedPO.department}</strong></div>
                <div>Order Date: <strong className="text-white">{selectedPO.orderDate}</strong></div>
                <div>Expected: <strong className="text-white">{selectedPO.expectedDelivery}</strong></div>
              </div>

              {selectedPO.notes && (
                <div className="text-neutral-400 pt-2">
                  Notes: <p className="text-neutral-200 italic">{selectedPO.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedPO(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-200 hover:bg-neutral-700 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
