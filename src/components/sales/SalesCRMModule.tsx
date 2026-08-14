import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  TrendingUp,
  Users,
  DollarSign,
  Briefcase,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  Phone,
  Mail,
  Building,
  Target,
  Sparkles,
  Award
} from 'lucide-react';
import { Deal, DealStage, ClientAccount } from '../../types/erp';

export const SalesCRMModule: React.FC = () => {
  const {
    deals,
    clientAccounts,
    addDeal,
    updateDealStage,
    currentUser,
    settings
  } = useERP();

  const [activeTab, setActiveTab] = useState<'pipeline' | 'accounts'>('pipeline');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDealModalOpen, setIsAddDealModalOpen] = useState(false);

  // New Deal form state
  const [newDeal, setNewDeal] = useState({
    title: '',
    clientCompany: clientAccounts[0]?.name || '',
    contactName: clientAccounts[0]?.primaryContact || '',
    contactEmail: clientAccounts[0]?.email || '',
    value: 50000,
    currency: 'USD',
    stage: 'Lead' as DealStage,
    probability: 20,
    ownerName: currentUser.name,
    expectedCloseDate: '2026-09-30',
    tags: ['Enterprise', 'Q3']
  });

  const stages: { stage: DealStage; label: string; color: string }[] = [
    { stage: 'Lead', label: 'Inbound Leads', color: 'border-neutral-700 bg-neutral-900/50' },
    { stage: 'Qualified', label: 'Discovery & Qualified', color: 'border-blue-500/30 bg-blue-950/20' },
    { stage: 'Proposal', label: 'Proposal & Demo', color: 'border-indigo-500/30 bg-indigo-950/20' },
    { stage: 'Negotiation', label: 'Contract Negotiation', color: 'border-amber-500/30 bg-amber-950/20' },
    { stage: 'Won', label: 'Closed Won', color: 'border-emerald-500/30 bg-emerald-950/20' }
  ];

  const totalPipelineValue = deals
    .filter(d => d.stage !== 'Lost')
    .reduce((sum, d) => sum + d.value, 0);

  const weightedPipeline = deals
    .filter(d => d.stage !== 'Lost')
    .reduce((sum, d) => sum + (d.value * (d.probability / 100)), 0);

  const wonDealsValue = deals
    .filter(d => d.stage === 'Won')
    .reduce((sum, d) => sum + d.value, 0);

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeal.title || !newDeal.clientCompany) return;
    addDeal(newDeal);
    setIsAddDealModalOpen(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto" id="sales-crm-module-root">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 backdrop-blur-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Revenue & Client CRM
            </span>
            <span className="text-xs text-neutral-400 font-mono">Q3 Pipeline</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Sales & CRM Operations</h1>
          <p className="text-sm text-neutral-400">Track client opportunities, sales quotas, customer accounts, and weighted pipeline velocity</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddDealModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
            id="btn-create-deal"
          >
            <Plus className="w-4 h-4" />
            <span>New Opportunity</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-medium">Total Active Pipeline</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">
              ${totalPipelineValue.toLocaleString()}
            </div>
            <span className="text-[10px] text-rose-400 font-medium">{deals.length} deals in flight</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-medium">Closed Won ARR</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">
              ${wonDealsValue.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">Contracted bookings</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-medium">Weighted Forecast</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">
              ${Math.round(weightedPipeline).toLocaleString()}
            </div>
            <span className="text-[10px] text-indigo-400 font-medium">Probability adjusted</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-medium">Client Accounts</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">
              {clientAccounts.length} Enterprise
            </div>
            <span className="text-[10px] text-amber-400 font-medium">Active CRM directory</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'pipeline'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Opportunity Pipeline</span>
        </button>
        <button
          onClick={() => setActiveTab('accounts')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'accounts'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Client Accounts & Contacts</span>
        </button>
      </div>

      {/* TAB 1: KANBAN DEALS PIPELINE */}
      {activeTab === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {stages.map(({ stage, label, color }) => {
            const stageDeals = deals.filter(d => d.stage === stage);
            const stageSum = stageDeals.reduce((sum, d) => sum + d.value, 0);

            return (
              <div key={stage} className={`p-4 rounded-2xl border ${color} space-y-3 flex flex-col min-h-[500px]`}>
                <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">{label}</h3>
                    <span className="text-[10px] font-mono text-neutral-400">${stageSum.toLocaleString()}</span>
                  </div>
                  <span className="w-5 h-5 rounded-full bg-neutral-800 text-neutral-300 text-[10px] font-bold flex items-center justify-center">
                    {stageDeals.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2.5 shadow-md hover:border-neutral-700 transition-all"
                    >
                      <div>
                        <div className="text-[10px] text-rose-400 font-semibold">{deal.clientCompany}</div>
                        <h4 className="text-xs font-bold text-white mt-0.5">{deal.title}</h4>
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-white font-bold">${deal.value.toLocaleString()}</span>
                        <span className="text-[10px] text-neutral-400">{deal.probability}% Prob</span>
                      </div>

                      <div className="text-[10px] text-neutral-400 border-t border-neutral-800/60 pt-1.5 flex justify-between items-center">
                        <span>Owner: {(deal.ownerName || 'Staff').split(' ')[0]}</span>
                        <span>{deal.expectedCloseDate}</span>
                      </div>

                      {/* Stage transition controls */}
                      <div className="flex items-center justify-end gap-1 pt-1">
                        {stage === 'Lead' && (
                          <button
                            onClick={() => updateDealStage(deal.id, 'Qualified')}
                            className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-[10px] text-blue-300 flex items-center gap-1"
                          >
                            Qualify <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        )}
                        {stage === 'Qualified' && (
                          <button
                            onClick={() => updateDealStage(deal.id, 'Proposal')}
                            className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-[10px] text-indigo-300 flex items-center gap-1"
                          >
                            Proposal <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        )}
                        {stage === 'Proposal' && (
                          <button
                            onClick={() => updateDealStage(deal.id, 'Negotiation')}
                            className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-[10px] text-amber-300 flex items-center gap-1"
                          >
                            Negotiate <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        )}
                        {stage === 'Negotiation' && (
                          <button
                            onClick={() => updateDealStage(deal.id, 'Won')}
                            className="px-2 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-[10px] text-emerald-300 font-bold flex items-center gap-1"
                          >
                            Close Won <CheckCircle2 className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: CLIENT ACCOUNTS */}
      {activeTab === 'accounts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clientAccounts.map((acc) => (
            <div key={acc.id} className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-rose-300 border border-neutral-700">
                    {acc.tier} • {acc.industry}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5">{acc.name}</h3>
                  <p className="text-xs text-neutral-400">Primary Contact: <strong className="text-white">{acc.primaryContact}</strong></p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {acc.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-neutral-800/80">
                <div className="space-y-1">
                  <div className="text-neutral-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{acc.email}</span>
                  </div>
                  <div className="text-neutral-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{acc.phone}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-neutral-500 block text-[11px]">Lifetime Value (LTV)</span>
                  <span className="font-mono font-bold text-white text-sm">
                    ${acc.lifetimeValue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: CREATE DEAL */}
      {isAddDealModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Create Sales Opportunity</h3>
            <form onSubmit={handleCreateDeal} className="space-y-3 text-xs">
              <div>
                <label className="text-neutral-400 block mb-1">Opportunity Title</label>
                <input
                  type="text"
                  value={newDeal.title}
                  onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                  placeholder="e.g. Enterprise License Expansion"
                  className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Client Company</label>
                <select
                  value={newDeal.clientCompany}
                  onChange={(e) => {
                    const acc = clientAccounts.find(a => a.name === e.target.value);
                    setNewDeal({
                      ...newDeal,
                      clientCompany: e.target.value,
                      contactName: acc?.primaryContact || '',
                      contactEmail: acc?.email || ''
                    });
                  }}
                  className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                >
                  {clientAccounts.map(acc => (
                    <option key={acc.id} value={acc.name}>{acc.name} ({acc.industry})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">Deal Value ($)</label>
                  <input
                    type="number"
                    value={newDeal.value}
                    onChange={(e) => setNewDeal({ ...newDeal, value: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Expected Close Date</label>
                  <input
                    type="date"
                    value={newDeal.expectedCloseDate}
                    onChange={(e) => setNewDeal({ ...newDeal, expectedCloseDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddDealModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-500"
                >
                  Create Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
