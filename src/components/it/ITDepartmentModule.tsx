import React, { useState, useMemo } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  ITTicket,
  ITTicketCategory,
  ITTicketPriority,
  ITTicketStatus,
  ITSystemHealth,
  ITDeviceInventory,
  ITSoftwareLicense
} from '../../types/erp';
import { NewTicketModal } from './NewTicketModal';
import { NewDeviceModal } from './NewDeviceModal';
import { NewLicenseModal } from './NewLicenseModal';
import { TicketDetailModal } from './TicketDetailModal';
import {
  Server,
  Laptop,
  Key,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  Search,
  Filter,
  Plus,
  RefreshCw,
  Zap,
  Wifi,
  HardDrive,
  Cpu,
  Lock,
  ArrowUpRight,
  User,
  Layers,
  ChevronRight,
  Download,
  Terminal,
  Radio,
  CheckCheck
} from 'lucide-react';

export const ITDepartmentModule: React.FC = () => {
  const {
    itTickets,
    itSystems,
    itDevices,
    itLicenses,
    updateSystemStatus,
    updateITTicket,
    resolveITTicket,
    logAudit
  } = useERP();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'tickets' | 'systems' | 'hardware' | 'licenses' | 'security'>('tickets');

  // Modals
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [isNewDeviceOpen, setIsNewDeviceOpen] = useState(false);
  const [isNewLicenseOpen, setIsNewLicenseOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<ITTicket | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  // Ping Diagnostic State
  const [isPinging, setIsPinging] = useState(false);
  const [lastPingReport, setLastPingReport] = useState<string | null>(null);

  // Security Simulation State
  const [isScanningEndpoints, setIsScanningEndpoints] = useState(false);
  const [scanResult, setScanResult] = useState<{ total: number; clean: number; issues: number } | null>(null);

  // Filtered Tickets
  const filteredTickets = useMemo(() => {
    return itTickets.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.affectedAssetTag && t.affectedAssetTag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
      const matchesCategory = categoryFilter === 'ALL' || t.category === categoryFilter;
      const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
    });
  }, [itTickets, searchQuery, statusFilter, categoryFilter, priorityFilter]);

  // Statistics & KPI Computations
  const openTicketsCount = itTickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;
  const criticalCount = itTickets.filter(t => t.priority === 'Critical' && t.status !== 'Resolved' && t.status !== 'Closed').length;
  const operationalSystems = itSystems.filter(s => s.status === 'Operational').length;
  const totalSystems = itSystems.length || 1;
  const systemHealthPct = Math.round((operationalSystems / totalSystems) * 100);
  const totalDevices = itDevices.length;
  const activeStaffDevices = itDevices.filter(d => !!d.assignedTo).length;
  const totalLicenseSpend = itLicenses.reduce((acc, lic) => acc + (lic.seatsAllocated * lic.costPerSeatAnnual), 0);

  // Run ping test across all enterprise endpoints
  const handleRunSystemPingTest = () => {
    setIsPinging(true);
    setTimeout(() => {
      itSystems.forEach((sys) => {
        // Randomly simulate jitter / low latency
        const jitter = Math.floor(Math.random() * 8) - 4;
        const newLatency = Math.max(8, sys.latencyMs + jitter);
        updateSystemStatus(sys.id, sys.status, newLatency);
      });
      setIsPinging(false);
      setLastPingReport(`All ${itSystems.length} enterprise endpoints tested. Network mean latency: 26.4ms. Zero packet loss.`);
      logAudit('IT_PING_TEST', 'IT Department', `Diagnostic ping check executed across ${itSystems.length} systems.`);
    }, 700);
  };

  // Run Endpoint Security Scan
  const handleRunSecurityScan = () => {
    setIsScanningEndpoints(true);
    setTimeout(() => {
      setIsScanningEndpoints(false);
      setScanResult({
        total: itDevices.length,
        clean: itDevices.filter(d => d.healthStatus === 'Healthy').length,
        issues: itDevices.filter(d => d.healthStatus !== 'Healthy').length
      });
      logAudit('SECURITY_SCAN', 'IT Department', `Zero-trust endpoint telemetry scan completed across ${itDevices.length} devices.`);
    }, 850);
  };

  return (
    <div className="p-3 sm:p-5 md:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto" id="it-department-module">
      
      {/* Module Title & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-900/90 border border-neutral-800 p-4 sm:p-5 rounded-2xl shadow-xl backdrop-blur-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">IT Department & Systems</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Tier-1 Ops
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Incident helpdesk, server topology, MDM hardware fleet, SaaS license keys & security telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={handleRunSystemPingTest}
            disabled={isPinging}
            className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700/80 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            title="Ping all systems to measure network latency and uptime"
            id="btn-it-ping-test"
          >
            <Activity className={`w-3.5 h-3.5 text-emerald-400 ${isPinging ? 'animate-spin' : ''}`} />
            <span>{isPinging ? 'Testing...' : 'Diagnostic Ping'}</span>
          </button>

          <button
            onClick={() => setIsNewTicketOpen(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/25 cursor-pointer"
            id="btn-create-it-ticket"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Incident Ticket</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Blocks - Compact & Responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
        
        {/* Metric 1: Open Incidents */}
        <div className="p-3.5 sm:p-4 bg-neutral-900/80 rounded-xl border border-neutral-800/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-neutral-400">Open Incidents</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Terminal className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-white">{openTicketsCount}</span>
            <span className="text-[10px] text-neutral-500">Active Queue</span>
          </div>
        </div>

        {/* Metric 2: Critical Alarms */}
        <div className="p-3.5 sm:p-4 bg-neutral-900/80 rounded-xl border border-neutral-800/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-neutral-400">Critical Alarms</span>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${criticalCount > 0 ? 'bg-rose-500/20 border border-rose-500/30 text-rose-400 animate-pulse' : 'bg-neutral-800 text-neutral-400'}`}>
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-xl sm:text-2xl font-bold ${criticalCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {criticalCount}
            </span>
            <span className="text-[10px] text-neutral-500">&lt; 2h SLA Target</span>
          </div>
        </div>

        {/* Metric 3: System Health */}
        <div className="p-3.5 sm:p-4 bg-neutral-900/80 rounded-xl border border-neutral-800/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-neutral-400">System Uptime</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Radio className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-white">{systemHealthPct}%</span>
            <span className="text-[10px] text-emerald-400 font-mono">99.98% SLA</span>
          </div>
        </div>

        {/* Metric 4: Hardware Fleet */}
        <div className="p-3.5 sm:p-4 bg-neutral-900/80 rounded-xl border border-neutral-800/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-neutral-400">MDM Fleet</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Laptop className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-white">{totalDevices}</span>
            <span className="text-[10px] text-purple-300 font-mono">{activeStaffDevices} in field</span>
          </div>
        </div>

        {/* Metric 5: SaaS Licenses */}
        <div className="col-span-2 sm:col-span-1 p-3.5 sm:p-4 bg-neutral-900/80 rounded-xl border border-neutral-800/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-neutral-400">Annual SaaS</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Key className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-white">${Math.round(totalLicenseSpend / 1000)}k</span>
            <span className="text-[10px] text-neutral-500">{itLicenses.length} subscriptions</span>
          </div>
        </div>

      </div>

      {/* Diagnostic Alert Banner if active */}
      {lastPingReport && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs text-emerald-300 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            <span>{lastPingReport}</span>
          </div>
          <button
            onClick={() => setLastPingReport(null)}
            className="text-emerald-400/60 hover:text-emerald-300 text-xs px-2 py-0.5"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 border-b border-neutral-800 pb-2 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'tickets'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
          id="tab-it-tickets"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Incident Helpdesk</span>
          {openTicketsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-blue-900/80 text-blue-200 border border-blue-400/30">
              {openTicketsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('systems')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'systems'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
          id="tab-it-systems"
        >
          <Server className="w-3.5 h-3.5" />
          <span>Servers & Cloud Health</span>
        </button>

        <button
          onClick={() => setActiveTab('hardware')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'hardware'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
          id="tab-it-hardware"
        >
          <Laptop className="w-3.5 h-3.5" />
          <span>Hardware Fleet (MDM)</span>
        </button>

        <button
          onClick={() => setActiveTab('licenses')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'licenses'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
          id="tab-it-licenses"
        >
          <Key className="w-3.5 h-3.5" />
          <span>Software Licenses</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'security'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
          id="tab-it-security"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Security & Zero-Trust</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: INCIDENT & HELPDESK TICKETS                                        */}
      {/* ========================================================================= */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          
          {/* Filter & Search Bar */}
          <div className="bg-neutral-900/90 border border-neutral-800 p-3 rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticket #, title, requester, or asset tag..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="flex items-center flex-wrap gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 focus:outline-hidden"
              >
                <option value="ALL">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Waiting On Vendor">Waiting On Vendor</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 focus:outline-hidden"
              >
                <option value="ALL">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 focus:outline-hidden"
              >
                <option value="ALL">All Categories</option>
                <option value="Hardware">Hardware</option>
                <option value="Network">Network</option>
                <option value="Cloud/Server">Cloud / Server</option>
                <option value="Software/Access">Software / Access</option>
                <option value="Security">Security</option>
                <option value="Printer/Peripheral">Printer / Periph</option>
              </select>
            </div>
          </div>

          {/* Ticket Queue List */}
          <div className="space-y-2.5">
            {filteredTickets.length === 0 ? (
              <div className="p-12 text-center bg-neutral-900/40 rounded-2xl border border-neutral-800">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-60" />
                <h3 className="text-sm font-bold text-white">No Tickets Match Your Filter</h3>
                <p className="text-xs text-neutral-400 mt-1">All IT issues resolved or match query criteria.</p>
              </div>
            ) : (
              filteredTickets.map((t) => {
                const priorityBadgeClass = {
                  Critical: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
                  High: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                  Medium: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                  Low: 'bg-neutral-800 text-neutral-400 border-neutral-700'
                }[t.priority];

                const statusBadgeClass = {
                  Open: 'bg-red-500/20 text-red-400 border-red-500/30',
                  'In Progress': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                  'Waiting On Vendor': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
                  Resolved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                  Closed: 'bg-neutral-800 text-neutral-500 border-neutral-700'
                }[t.status];

                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className="p-3.5 sm:p-4 bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer group shadow-xs"
                    id={`ticket-card-${t.id}`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700/80 flex items-center justify-center text-neutral-300 shrink-0 mt-0.5 group-hover:border-blue-500/40 transition-colors">
                        {t.category === 'Hardware' && <Laptop className="w-4 h-4 text-purple-400" />}
                        {t.category === 'Network' && <Wifi className="w-4 h-4 text-cyan-400" />}
                        {t.category === 'Cloud/Server' && <Server className="w-4 h-4 text-blue-400" />}
                        {t.category === 'Software/Access' && <Key className="w-4 h-4 text-emerald-400" />}
                        {t.category === 'Security' && <Shield className="w-4 h-4 text-rose-400" />}
                        {['Printer/Peripheral', 'Email/Domain', 'Other'].includes(t.category) && <Cpu className="w-4 h-4 text-amber-400" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2">
                          <span className="font-mono text-xs font-bold text-blue-400">{t.ticketNumber}</span>
                          <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold border ${priorityBadgeClass}`}>
                            {t.priority}
                          </span>
                          <span className={`px-2 py-0.2 rounded-full text-[10px] font-medium border ${statusBadgeClass}`}>
                            {t.status}
                          </span>
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {t.category}
                          </span>
                        </div>

                        <h4 className="text-sm font-semibold text-white mt-1 group-hover:text-blue-300 transition-colors truncate">
                          {t.title}
                        </h4>

                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-neutral-400">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3 text-neutral-500" />
                            <span>{t.requesterName} ({t.department})</span>
                          </div>
                          {t.assignedToEngineer && (
                            <div className="flex items-center gap-1">
                              <span className="text-neutral-500">Tech:</span>
                              <span className="text-neutral-300">{t.assignedToEngineer}</span>
                            </div>
                          )}
                          {t.affectedAssetTag && (
                            <span className="font-mono text-[10px] text-purple-400 bg-purple-950/40 px-1.5 py-0.2 rounded border border-purple-800/40">
                              Tag: {t.affectedAssetTag}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-800 shrink-0">
                      <div className="text-right">
                        <div className="text-[10px] text-neutral-500 flex items-center gap-1 justify-end">
                          <Clock className="w-3 h-3" />
                          <span>SLA Target</span>
                        </div>
                        <span className="text-xs font-mono font-semibold text-neutral-300">{t.slaTargetHours}h SLA</span>
                      </div>

                      <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SERVERS & CLOUD HEALTH                                             */}
      {/* ========================================================================= */}
      {activeTab === 'systems' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-neutral-900/90 border border-neutral-800 p-3.5 rounded-xl">
            <div>
              <h3 className="text-sm font-bold text-white">Enterprise Infrastructure & Topology</h3>
              <p className="text-xs text-neutral-400">Microservice clusters, VPN edge points, databases & load balancers</p>
            </div>
            <button
              onClick={handleRunSystemPingTest}
              disabled={isPinging}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 rounded-lg border border-neutral-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isPinging ? 'animate-spin' : ''}`} />
              <span>Poll System Status</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {itSystems.map((sys) => {
              const statusConfig = {
                Operational: { badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', label: 'Operational' },
                Degraded: { badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30', label: 'Degraded Jitter' },
                Outage: { badge: 'bg-rose-500/20 text-rose-400 border-rose-500/30', label: 'Outage Detected' },
                Maintenance: { badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30', label: 'Maintenance Window' }
              }[sys.status];

              return (
                <div
                  key={sys.id}
                  className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-blue-400">
                        {sys.category === 'Database' && <HardDrive className="w-4 h-4 text-amber-400" />}
                        {sys.category === 'Network' && <Wifi className="w-4 h-4 text-cyan-400" />}
                        {sys.category === 'Security' && <Shield className="w-4 h-4 text-rose-400" />}
                        {sys.category === 'Cloud' && <Server className="w-4 h-4 text-blue-400" />}
                        {['Voice/VoIP', 'Storage', 'ERP Backend'].includes(sys.category) && <Cpu className="w-4 h-4 text-purple-400" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{sys.name}</h4>
                        <span className="text-[10px] text-neutral-400">{sys.category} • {sys.hostOrIp}</span>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusConfig.badge}`}>
                      {statusConfig.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-neutral-950 p-2.5 rounded-lg border border-neutral-800/80 text-center">
                    <div>
                      <span className="text-[9px] text-neutral-500 uppercase block">Uptime</span>
                      <span className="text-xs font-mono font-bold text-white">{sys.uptimePercent}%</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-500 uppercase block">Latency</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">{sys.latencyMs}ms</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-500 uppercase block">Load</span>
                      <span className="text-xs font-mono font-bold text-neutral-300">{sys.cpuLoadPercent}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1 border-t border-neutral-800/60">
                    <span>Last checked: {sys.lastPing}</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          const nextStatus: ITSystemHealth['status'] =
                            sys.status === 'Operational' ? 'Degraded' : 'Operational';
                          updateSystemStatus(sys.id, nextStatus);
                        }}
                        className="text-neutral-400 hover:text-white underline cursor-pointer"
                      >
                        Toggle Health
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: HARDWARE FLEET (MDM)                                               */}
      {/* ========================================================================= */}
      {activeTab === 'hardware' && (
        <div className="space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-900/90 border border-neutral-800 p-3.5 rounded-xl">
            <div>
              <h3 className="text-sm font-bold text-white">Mobile Device Management (MDM) & Fleet</h3>
              <p className="text-xs text-neutral-400">Enrolled laptops, BitLocker encryption, OS compliance & asset tags</p>
            </div>
            <button
              onClick={() => setIsNewDeviceOpen(true)}
              className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-purple-600/25 cursor-pointer"
              id="btn-register-device"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Enroll Hardware Device</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {itDevices.map((dev) => {
              const healthBadge = {
                Healthy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                'Needs Maintenance': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                'Battery Degraded': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
                'Pending Replacement': 'bg-neutral-800 text-neutral-400 border-neutral-700'
              }[dev.healthStatus];

              return (
                <div
                  key={dev.id}
                  className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                        <Laptop className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-white">{dev.assetTag}</span>
                          {dev.encryptionEnabled && (
                            <Lock className="w-3 h-3 text-emerald-400" title="Disk Encryption Enabled" />
                          )}
                        </div>
                        <span className="text-[10px] text-neutral-400">{dev.brand} {dev.model}</span>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${healthBadge}`}>
                      {dev.healthStatus}
                    </span>
                  </div>

                  <div className="p-2.5 bg-neutral-950 rounded-lg border border-neutral-800/80 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Assigned User:</span>
                      <span className="font-semibold text-neutral-200">{dev.assignedTo || 'Unassigned / Spare'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">OS Version:</span>
                      <span className="font-mono text-neutral-300">{dev.osVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Serial No:</span>
                      <span className="font-mono text-neutral-400 text-[11px]">{dev.serialNumber}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1 border-t border-neutral-800/60">
                    <span>MDM check-in: {dev.lastMdmCheckIn || 'Active'}</span>
                    <span className="font-mono text-neutral-400">${dev.purchaseCost}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SOFTWARE LICENSES                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'licenses' && (
        <div className="space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-900/90 border border-neutral-800 p-3.5 rounded-xl">
            <div>
              <h3 className="text-sm font-bold text-white">SaaS Subscriptions & License Keys</h3>
              <p className="text-xs text-neutral-400">Track seat capacity limits, annual renewals and developer licensing</p>
            </div>
            <button
              onClick={() => setIsNewLicenseOpen(true)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/25 cursor-pointer"
              id="btn-add-license"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add SaaS Subscription</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {itLicenses.map((lic) => {
              const seatPercent = Math.round((lic.seatsAllocated / lic.seatsTotal) * 100);
              const isNearCap = seatPercent >= 90;

              return (
                <div
                  key={lic.id}
                  className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Key className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{lic.softwareName}</h4>
                        <span className="text-[10px] text-neutral-400">{lic.vendor} • {lic.category}</span>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold text-emerald-400">
                      ${(lic.seatsAllocated * lic.costPerSeatAnnual).toLocaleString()}/yr
                    </span>
                  </div>

                  {/* Seat Allocation Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-neutral-400">Seats In Use:</span>
                      <span className="font-mono font-bold text-neutral-200">
                        {lic.seatsAllocated} / {lic.seatsTotal} ({seatPercent}%)
                      </span>
                    </div>
                    <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-800">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isNearCap ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, seatPercent)}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-2 bg-neutral-950 rounded-lg border border-neutral-800/80 text-[11px] space-y-1 text-neutral-400">
                    <div className="flex justify-between">
                      <span>License Key:</span>
                      <span className="font-mono text-neutral-300">{lic.licenseKeyMasked}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Renewal:</span>
                      <span className="font-mono text-amber-300">{lic.renewalDate}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: SECURITY & ZERO-TRUST TELEMETRY                                     */}
      {/* ========================================================================= */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-900/90 border border-neutral-800 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Zero-Trust Network Access & Threat Intelligence</h3>
                <p className="text-xs text-neutral-400">Firewall rules, WireGuard tunnels, SSL cert renewals and endpoint malware audit</p>
              </div>
            </div>

            <button
              onClick={handleRunSecurityScan}
              disabled={isScanningEndpoints}
              className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Activity className={`w-3.5 h-3.5 ${isScanningEndpoints ? 'animate-spin' : ''}`} />
              <span>{isScanningEndpoints ? 'Scanning Fleet...' : 'Run Security Fleet Audit'}</span>
            </button>
          </div>

          {scanResult && (
            <div className="p-3.5 bg-neutral-900 border border-rose-500/30 rounded-xl grid grid-cols-3 gap-3 text-center animate-in fade-in duration-200">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase block">Scanned Fleet</span>
                <span className="text-base font-bold text-white">{scanResult.total} Devices</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase block">100% Clean / Encrypted</span>
                <span className="text-base font-bold text-emerald-400">{scanResult.clean}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase block">Policy Warnings</span>
                <span className={`text-base font-bold ${scanResult.issues > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {scanResult.issues}
                </span>
              </div>
            </div>
          )}

          {/* Security Telemetry Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Telemetry 1: Active WireGuard VPN Tunnels */}
            <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-blue-400" />
                  Active Zero-Trust WireGuard Tunnels
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  94 Connected
                </span>
              </div>
              <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800/80 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-400">US-East Gateway (Virginia)</span>
                  <span className="font-mono text-emerald-400">42 Tunnels (12ms)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">EU-Central Gateway (Frankfurt)</span>
                  <span className="font-mono text-emerald-400">31 Tunnels (18ms)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">AP-East Gateway (Tokyo)</span>
                  <span className="font-mono text-emerald-400">21 Tunnels (34ms)</span>
                </div>
              </div>
            </div>

            {/* Telemetry 2: SSL / TLS Certificate Validity */}
            <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Wildcard SSL / TLS Certificates
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Auto-Renewing
                </span>
              </div>
              <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800/80 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-400">*.bizflow.io (Let's Encrypt RSA)</span>
                  <span className="font-mono text-neutral-300">Expires in 68 Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">api.bizflow.internal (DigiCert EV)</span>
                  <span className="font-mono text-neutral-300">Expires in 214 Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">sso.bizflow.io (Okta SAML 2.0)</span>
                  <span className="font-mono text-neutral-300">Expires in 340 Days</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Modals */}
      <NewTicketModal isOpen={isNewTicketOpen} onClose={() => setIsNewTicketOpen(false)} />
      <NewDeviceModal isOpen={isNewDeviceOpen} onClose={() => setIsNewDeviceOpen(false)} />
      <NewLicenseModal isOpen={isNewLicenseOpen} onClose={() => setIsNewLicenseOpen(false)} />
      <TicketDetailModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />

    </div>
  );
};
