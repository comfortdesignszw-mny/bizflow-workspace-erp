import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { ITTicket, ITTicketPriority, ITTicketStatus } from '../../types/erp';
import {
  X,
  CheckCircle2,
  Clock,
  User,
  AlertTriangle,
  Server,
  Sparkles,
  Shield,
  Laptop,
  MessageSquare,
  Send,
  Trash2,
  Activity
} from 'lucide-react';

interface TicketDetailModalProps {
  ticket: ITTicket | null;
  onClose: () => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({ ticket, onClose }) => {
  const { updateITTicket, resolveITTicket, deleteITTicket } = useERP();

  const [status, setStatus] = useState<ITTicketStatus>(ticket?.status || 'Open');
  const [priority, setPriority] = useState<ITTicketPriority>(ticket?.priority || 'Medium');
  const [assignedToEngineer, setAssignedToEngineer] = useState(ticket?.assignedToEngineer || '');
  const [resolutionNotes, setResolutionNotes] = useState(ticket?.resolutionNotes || '');
  const [newLogNote, setNewLogNote] = useState('');
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [aiDiagnosis, setAiDiagnosis] = useState<string | null>(null);

  if (!ticket) return null;

  const handleStatusChange = (newStatus: ITTicketStatus) => {
    setStatus(newStatus);
    if (newStatus === 'Resolved') {
      resolveITTicket(ticket.id, resolutionNotes || 'Resolved during IT engineer triage.');
    } else {
      updateITTicket(ticket.id, { status: newStatus });
    }
  };

  const handlePriorityUpdate = (newPriority: ITTicketPriority) => {
    setPriority(newPriority);
    updateITTicket(ticket.id, { priority: newPriority });
  };

  const handleAssigneeUpdate = (newAssignee: string) => {
    setAssignedToEngineer(newAssignee);
    updateITTicket(ticket.id, { assignedToEngineer: newAssignee });
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogNote.trim()) return;

    const timeStamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedEntry = `[${timeStamp}] ${newLogNote.trim()}`;
    const updatedNotes = ticket.resolutionNotes
      ? `${ticket.resolutionNotes}\n${formattedEntry}`
      : formattedEntry;

    setResolutionNotes(updatedNotes);
    updateITTicket(ticket.id, { resolutionNotes: updatedNotes });
    setNewLogNote('');
  };

  const handleRunAiDiagnostics = () => {
    setIsDiagnosing(true);
    setAiDiagnosis(null);
    setTimeout(() => {
      setIsDiagnosing(false);
      let diagnosisText = '';
      if (ticket.category === 'Hardware') {
        diagnosisText = 'Hardware Telemetry Analysis: Battery cycle count is within acceptable threshold (214 cycles). Thermal sensors suggest dust accumulation on heat pipes or pending firmware SMC/NVRAM reset. Recommend applying Apple Configurator DFU firmware refresh or fan replacement.';
      } else if (ticket.category === 'Network') {
        diagnosisText = 'Network Traceroute Analysis: Packet loss is occurring at Hop 4 (Core Switch 10.0.0.1) due to ARP table saturation on VLAN 40. Recommended Fix: Flush ARP cache on Core Switch and adjust DHCP lease TTL from 2 hours to 8 hours.';
      } else if (ticket.category === 'Cloud/Server') {
        diagnosisText = 'Cloud Metrics: Memory consumption spiked to 94.2% prior to OOM Killer signal on pod replica-3. Recommended Fix: Increase pod memory limit in values.yaml from 2Gi to 4Gi and enable garbage collection optimization flag.';
      } else {
        diagnosisText = 'System Analysis: Single Sign-On token assertion expired prematurely due to SAML certificate mismatch. Recommended Fix: Re-sync metadata XML in Okta Admin console and renew SCIM provisioning bearer key.';
      }
      setAiDiagnosis(diagnosisText);
    }, 900);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ticket ${ticket.ticketNumber}?`)) {
      deleteITTicket(ticket.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto" id="modal-ticket-detail">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-400">{ticket.ticketNumber}</span>
                <span className="text-xs text-neutral-500">•</span>
                <span className="text-xs text-neutral-400">{ticket.category}</span>
              </div>
              <h2 className="text-base font-bold text-white tracking-wide truncate max-w-md">{ticket.title}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="p-2 text-neutral-500 hover:text-rose-400 rounded-lg hover:bg-neutral-800 transition-colors"
              title="Delete Ticket"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          {/* Status & Priority Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800/80">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1.5">Ticket Status</label>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value as ITTicketStatus)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-hidden focus:border-blue-500"
              >
                <option value="Open">🔴 Open (Pending Triage)</option>
                <option value="In Progress">🟡 In Progress (Engineer Active)</option>
                <option value="Waiting On Vendor">🟣 Waiting On Vendor / Hardware</option>
                <option value="Resolved">🟢 Resolved (Fix Deployed)</option>
                <option value="Closed">⚪ Closed (Archived)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1.5">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => handlePriorityUpdate(e.target.value as ITTicketPriority)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-hidden focus:border-blue-500"
              >
                <option value="Low">Low Priority (48h SLA)</option>
                <option value="Medium">Medium Priority (24h SLA)</option>
                <option value="High">High Priority (6h SLA)</option>
                <option value="Critical">Critical Priority (2h SLA)</option>
              </select>
            </div>
          </div>

          {/* Issue Description */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Issue Description</h3>
            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 text-sm text-neutral-200 whitespace-pre-wrap leading-relaxed">
              {ticket.description}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800/80">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Requester</span>
              <span className="text-xs font-semibold text-white truncate block">{ticket.requesterName}</span>
              <span className="text-[10px] text-neutral-400 block">{ticket.department}</span>
            </div>

            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800/80">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Assigned Specialist</span>
              <select
                value={assignedToEngineer}
                onChange={(e) => handleAssigneeUpdate(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-blue-400 border-none p-0 focus:outline-hidden"
              >
                <option value="Alex Rivera (Lead DevOps)">Alex Rivera</option>
                <option value="Sarah Jenkins (SecOps)">Sarah Jenkins</option>
                <option value="Marcus Brody (Helpdesk Specialist)">Marcus Brody</option>
                <option value="David Miller (Network Architect)">David Miller</option>
                <option value="Unassigned">Unassigned</option>
              </select>
            </div>

            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800/80">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Asset Tag</span>
              <span className="text-xs font-mono font-semibold text-purple-400">{ticket.affectedAssetTag || 'N/A'}</span>
            </div>

            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800/80">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">SLA Target</span>
              <span className="text-xs font-semibold text-emerald-400">{ticket.slaTargetHours} Hours</span>
            </div>
          </div>

          {/* AI Root Cause Diagnostics Assistant */}
          <div className="p-4 bg-gradient-to-r from-blue-950/40 via-purple-950/20 to-neutral-950 rounded-xl border border-blue-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold">
                <Sparkles className="w-4 h-4" />
                <span>AI Root Cause Diagnostics Engine</span>
              </div>
              <button
                type="button"
                onClick={handleRunAiDiagnostics}
                disabled={isDiagnosing}
                className="px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Activity className={`w-3.5 h-3.5 ${isDiagnosing ? 'animate-spin' : ''}`} />
                <span>{isDiagnosing ? 'Running Diagnostics...' : 'Run Automated Diagnostic'}</span>
              </button>
            </div>

            {aiDiagnosis && (
              <div className="p-3 bg-neutral-900/90 rounded-lg border border-blue-500/40 text-xs text-blue-100 leading-relaxed animate-in fade-in duration-200">
                {aiDiagnosis}
              </div>
            )}
          </div>

          {/* Resolution Log & Engineer Comments */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Resolution Logs & Troubleshooting History</span>
            </h3>

            {ticket.resolutionNotes ? (
              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs font-mono text-neutral-300 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                {ticket.resolutionNotes}
              </div>
            ) : (
              <div className="p-3 bg-neutral-950/50 rounded-xl border border-dashed border-neutral-800 text-xs text-neutral-500 italic">
                No resolution notes logged yet. Use the input below to add work log entries.
              </div>
            )}

            <form onSubmit={handleAddLog} className="flex gap-2">
              <input
                type="text"
                value={newLogNote}
                onChange={(e) => setNewLogNote(e.target.value)}
                placeholder="Add technician work log note (e.g., Flushed DNS cache, replaced power supply)..."
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-hidden focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Append Log</span>
              </button>
            </form>
          </div>

          {/* Quick Resolve Button */}
          {ticket.status !== 'Resolved' && (
            <div className="pt-2 border-t border-neutral-800 flex justify-end">
              <button
                type="button"
                onClick={() => handleStatusChange('Resolved')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Ticket as Resolved</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
