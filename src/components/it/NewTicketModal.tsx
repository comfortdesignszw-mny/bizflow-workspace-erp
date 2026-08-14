import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { ITTicketCategory, ITTicketPriority, ITTicket } from '../../types/erp';
import {
  X,
  AlertTriangle,
  Server,
  Laptop,
  Wifi,
  Shield,
  Key,
  Layers,
  Sparkles,
  User,
  CheckCircle2
} from 'lucide-react';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewTicketModal: React.FC<NewTicketModalProps> = ({ isOpen, onClose }) => {
  const { addITTicket, employees, itDevices, currentUser } = useERP();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ITTicketCategory>('Hardware');
  const [priority, setPriority] = useState<ITTicketPriority>('Medium');
  const [requesterName, setRequesterName] = useState(currentUser?.name || 'Alice Zhang');
  const [requesterEmail, setRequesterEmail] = useState(currentUser?.email || 'alice@bizflow.io');
  const [department, setDepartment] = useState('Engineering');
  const [assignedToEngineer, setAssignedToEngineer] = useState('Alex Rivera (Lead DevOps)');
  const [affectedAssetTag, setAffectedAssetTag] = useState('');
  const [slaTargetHours, setSlaTargetHours] = useState(12);

  if (!isOpen) return null;

  const handlePriorityChange = (p: ITTicketPriority) => {
    setPriority(p);
    if (p === 'Critical') setSlaTargetHours(2);
    else if (p === 'High') setSlaTargetHours(6);
    else if (p === 'Medium') setSlaTargetHours(24);
    else setSlaTargetHours(48);
  };

  const handleRequesterChange = (empName: string) => {
    setRequesterName(empName);
    const found = employees.find(e => `${e.firstName} ${e.lastName}` === empName);
    if (found) {
      setRequesterEmail(found.email);
      setDepartment(found.department);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please provide a title and detailed description of the IT issue.');
      return;
    }

    addITTicket({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      status: 'Open',
      requesterName,
      requesterEmail,
      department,
      assignedToEngineer,
      affectedAssetTag: affectedAssetTag.trim() || undefined,
      slaTargetHours,
      resolutionNotes: ''
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto" id="modal-new-it-ticket">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">Log New IT Incident / Service Request</h2>
              <p className="text-xs text-neutral-400">Issue tracking, hardware trouble, access permissions & network dispatch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            id="btn-close-new-ticket"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          {/* Issue Title */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Incident Summary / Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Primary Gateway Packet Loss on Floor 3 or Docker Daemon OOM Crash"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-blue-500 placeholder-neutral-600 transition-colors"
              id="input-ticket-title"
            />
          </div>

          {/* Category & Priority Selector Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Incident Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ITTicketCategory)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-hidden focus:border-blue-500"
                id="select-ticket-category"
              >
                <option value="Hardware">Hardware (Laptop, Monitor, Dock)</option>
                <option value="Network">Network & Wi-Fi (VLAN, Gateway, Switch)</option>
                <option value="Cloud/Server">Cloud & Infrastructure (AWS, Kubernetes)</option>
                <option value="Software/Access">Software & SSO (Okta, JetBrains, Figma)</option>
                <option value="Security">Security & Threat Incident</option>
                <option value="Printer/Peripheral">Printer & Peripherals</option>
                <option value="Email/Domain">Email & DNS Record</option>
                <option value="Other">Other Miscellaneous</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Severity / Priority</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['Low', 'Medium', 'High', 'Critical'] as ITTicketPriority[]).map((p) => {
                  const isSelected = priority === p;
                  const colorMap = {
                    Low: isSelected ? 'bg-neutral-800 text-neutral-200 border-neutral-600' : 'bg-neutral-950 text-neutral-500 border-neutral-800',
                    Medium: isSelected ? 'bg-blue-600/30 text-blue-300 border-blue-500' : 'bg-neutral-950 text-neutral-500 border-neutral-800',
                    High: isSelected ? 'bg-amber-600/30 text-amber-300 border-amber-500' : 'bg-neutral-950 text-neutral-500 border-neutral-800',
                    Critical: isSelected ? 'bg-rose-600/30 text-rose-300 border-rose-500' : 'bg-neutral-950 text-neutral-500 border-neutral-800'
                  };
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handlePriorityChange(p)}
                      className={`px-2 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${colorMap[p]}`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Requester & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Requester</label>
              <select
                value={requesterName}
                onChange={(e) => handleRequesterChange(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-hidden focus:border-blue-500"
                id="select-ticket-requester"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={`${emp.firstName} ${emp.lastName}`}>
                    {emp.firstName} {emp.lastName} ({emp.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Affected Asset Tag (Opt.)</label>
              <select
                value={affectedAssetTag}
                onChange={(e) => setAffectedAssetTag(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-hidden focus:border-blue-500"
                id="select-ticket-asset"
              >
                <option value="">-- None / General --</option>
                {itDevices.map((dev) => (
                  <option key={dev.id} value={dev.assetTag}>
                    {dev.assetTag} ({dev.brand} {dev.model})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Assigned Engineer & SLA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Assigned IT Specialist</label>
              <select
                value={assignedToEngineer}
                onChange={(e) => setAssignedToEngineer(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-hidden focus:border-blue-500"
                id="select-ticket-assignee"
              >
                <option value="Alex Rivera (Lead DevOps)">Alex Rivera (Lead DevOps)</option>
                <option value="Sarah Jenkins (SecOps)">Sarah Jenkins (SecOps)</option>
                <option value="Marcus Brody (Helpdesk Specialist)">Marcus Brody (Helpdesk Specialist)</option>
                <option value="David Miller (Network Architect)">David Miller (Network Architect)</option>
                <option value="Unassigned (IT Triage Pool)">Unassigned (IT Triage Pool)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">SLA Target Resolution (Hours)</label>
              <input
                type="number"
                min="1"
                max="168"
                value={slaTargetHours}
                onChange={(e) => setSlaTargetHours(parseInt(e.target.value) || 24)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          {/* Description & Repro Steps */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Detailed Description / Error Logs / Repro Steps <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what occurred, any error codes received, logs, or troubleshooting already attempted..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-blue-500 placeholder-neutral-600 transition-colors"
              id="textarea-ticket-description"
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
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer"
              id="btn-submit-new-ticket"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Dispatch Ticket to IT Queue</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
