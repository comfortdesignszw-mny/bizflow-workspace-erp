import React, { useState, useEffect } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Users,
  Search,
  Filter,
  Plus,
  QrCode,
  Mail,
  Phone,
  Building2,
  Calendar,
  DollarSign,
  Briefcase,
  Shield,
  Eye,
  Edit2,
  Trash2,
  Award,
  Clock,
  Package,
  FileText,
  X,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Sparkles,
  RefreshCw,
  Upload,
  User,
  LayoutGrid,
  Table
} from 'lucide-react';
import { Employee, EmployeeStatus, EmploymentType, Gender } from '../../types/erp';

// Curated avatar presets for quick selection
const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
];

export const EmployeesModule: React.FC = () => {
  const {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getNextEmployeeCode,
    setSelectedEmployeeForBadge,
    currentlyInsideEmployees,
    assets,
    tasks,
    accessLogs,
    settings
  } = useERP();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Selected employee for profile drawer
  const [activeProfileEmp, setActiveProfileEmp] = useState<Employee | null>(null);

  // Add Employee Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [autoCodeGenerated, setAutoCodeGenerated] = useState('');

  const [newEmpData, setNewEmpData] = useState({
    code: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '+1 (555) ',
    avatar: AVATAR_PRESETS[0],
    sex: 'Female' as Gender,
    dateOfEngagement: new Date().toISOString().split('T')[0],
    physicalAddress: '742 Evergreen Terrace, Seattle, WA 98101',
    department: 'Engineering',
    position: '',
    employmentType: 'Full-time' as EmploymentType,
    status: 'Active' as EmployeeStatus,
    joinDate: new Date().toISOString().split('T')[0],
    baseSalary: 8500,
    hourlyRate: 50,
    currency: 'USD',
    shiftStart: '08:30',
    shiftEnd: '17:30',
    address: '742 Evergreen Terrace, Seattle, WA 98101',
    nationalId: 'SSN-9980-0011',
    emergencyContact: {
      name: '',
      relationship: 'Spouse',
      phone: ''
    },
    bankDetails: {
      bankName: 'JPMorgan Chase',
      accountNumber: '•••• 7712',
      accountName: '',
      routingNumber: '021000021'
    },
    notes: ''
  });

  // When modal opens, initialize auto-generated employee ID
  useEffect(() => {
    if (isAddModalOpen) {
      const nextCode = getNextEmployeeCode();
      setAutoCodeGenerated(nextCode);
      setNewEmpData(prev => ({
        ...prev,
        code: nextCode,
        dateOfEngagement: new Date().toISOString().split('T')[0],
        joinDate: new Date().toISOString().split('T')[0]
      }));
    }
  }, [isAddModalOpen, getNextEmployeeCode]);

  const handleRegenerateCode = () => {
    const nextCode = getNextEmployeeCode();
    setAutoCodeGenerated(nextCode);
    setNewEmpData(prev => ({ ...prev, code: nextCode }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewEmpData(prev => ({ ...prev, avatar: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const departments = ['ALL', ...Array.from(new Set(employees.map(e => e.department)))];

  const filteredEmployees = employees.filter(emp => {
    const matchesQuery = `${emp.firstName} ${emp.lastName} ${emp.code} ${emp.position} ${emp.email} ${emp.physicalAddress || ''} ${emp.sex || ''}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || emp.department === selectedDept;
    const matchesStatus = selectedStatus === 'ALL' || emp.status === selectedStatus;
    return matchesQuery && matchesDept && matchesStatus;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpData.firstName || !newEmpData.lastName || !newEmpData.position) return;

    addEmployee({
      ...newEmpData,
      code: newEmpData.code.trim() || autoCodeGenerated,
      address: newEmpData.physicalAddress,
      bankDetails: {
        ...newEmpData.bankDetails,
        accountName: `${newEmpData.firstName} ${newEmpData.lastName}`
      }
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto" id="employees-module-view">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-900/80 p-6 rounded-2xl border border-neutral-800 shadow-sm backdrop-blur-xs">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">Workforce & Employee Directory</h1>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Total {employees.length} personnel enrolled • Real-time presence tracking, digital badges, physical address records, and role governance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'}`}
              title="Table View"
            >
              <Table className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer"
            id="btn-add-employee-modal"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll New Employee</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-neutral-900 p-4 rounded-2xl border border-neutral-800 text-xs">
        <div className="sm:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID (EMP-1001), position, sex, physical address..."
            className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl pl-9 pr-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
            id="input-employee-search"
          />
        </div>

        <div>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            id="select-dept-filter"
          >
            {departments.map(d => (
              <option key={d} value={d}>{d === 'ALL' ? 'All Departments' : d}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            id="select-status-filter"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Probation">Probation</option>
          </select>
        </div>
      </div>

      {/* View Mode: Grid vs Table */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((emp) => {
            const isInside = currentlyInsideEmployees.some(e => e.id === emp.id);

            return (
              <div
                key={emp.id}
                className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4 group relative"
                id={`emp-card-${emp.code}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={emp.avatar}
                        alt={emp.firstName}
                        className="w-12 h-12 rounded-xl object-cover border border-neutral-700 shadow-sm"
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-neutral-900 ${
                          isInside ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-500'
                        }`}
                        title={isInside ? 'Currently Inside' : 'Not on premises'}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                          {emp.firstName} {emp.lastName}
                        </h3>
                        <span className="text-[10px] font-mono text-blue-300 bg-blue-950/60 border border-blue-800/40 px-1.5 py-0.5 rounded">
                          {emp.code}
                        </span>
                      </div>
                      <p className="text-xs text-indigo-300 font-medium">{emp.position}</p>
                      <p className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-neutral-500" />
                        <span>{emp.department}</span>
                        {emp.sex && (
                          <span className="text-[10px] bg-neutral-800 px-1.5 py-0.2 rounded text-neutral-300 ml-1">
                            {emp.sex}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedEmployeeForBadge(emp)}
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                    title="Generate Digital ID QR Badge"
                  >
                    <QrCode className="w-4 h-4 text-blue-400" />
                  </button>
                </div>

                {/* Address & Engagement Date Badge */}
                {(emp.physicalAddress || emp.dateOfEngagement || emp.joinDate) && (
                  <div className="space-y-1 bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800/60 text-[11px]">
                    {emp.physicalAddress && (
                      <div className="flex items-center gap-1.5 text-neutral-300 truncate">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span className="truncate">{emp.physicalAddress}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-neutral-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-neutral-500" />
                        <span>Engaged: {emp.dateOfEngagement || emp.joinDate}</span>
                      </div>
                      <span className="text-[10px] text-neutral-500 font-mono">{emp.employmentType}</span>
                    </div>
                  </div>
                )}

                {/* Meta details */}
                <div className="grid grid-cols-2 gap-2 text-xs text-neutral-400 pt-1 border-t border-neutral-800/80">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-neutral-500" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{emp.shiftStart} - {emp.shiftEnd}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="font-mono text-white">${emp.baseSalary.toLocaleString()}/mo</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      emp.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      emp.status === 'On Leave' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-neutral-800 text-neutral-400'
                    }`}>
                      {emp.status}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-neutral-800/60">
                  <button
                    onClick={() => setActiveProfileEmp(emp)}
                    className="flex-1 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-400" />
                    <span>View Profile</span>
                  </button>
                  <button
                    onClick={() => setSelectedEmployeeForBadge(emp)}
                    className="px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-medium border border-blue-500/30 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Badge</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-neutral-950 text-neutral-400 uppercase font-mono text-[10px] border-b border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">ID Code</th>
                  <th className="py-3 px-4">Sex</th>
                  <th className="py-3 px-4">Department & Role</th>
                  <th className="py-3 px-4">Engagement Date</th>
                  <th className="py-3 px-4">Physical Address</th>
                  <th className="py-3 px-4">Salary</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img src={emp.avatar} alt={emp.firstName} className="w-8 h-8 rounded-lg object-cover border border-neutral-700" />
                        <div>
                          <p className="font-bold text-white">{emp.firstName} {emp.lastName}</p>
                          <p className="text-[10px] text-neutral-400 truncate max-w-[150px]">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-300">{emp.code}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-neutral-800 text-neutral-300 font-medium">
                        {emp.sex || 'Not specified'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-neutral-200">{emp.position}</p>
                      <p className="text-[10px] text-neutral-400">{emp.department}</p>
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-300">
                      {emp.dateOfEngagement || emp.joinDate}
                    </td>
                    <td className="py-3 px-4 max-w-[200px] truncate text-neutral-300" title={emp.physicalAddress || emp.address}>
                      {emp.physicalAddress || emp.address || '—'}
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-400 font-semibold">
                      ${emp.baseSalary.toLocaleString()}/mo
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        emp.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        emp.status === 'On Leave' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-neutral-800 text-neutral-400'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActiveProfileEmp(emp)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                          title="View Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedEmployeeForBadge(emp)}
                          className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300"
                          title="View Badge"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detailed Employee Profile Drawer / Modal */}
      {activeProfileEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto" id="employee-profile-drawer">
          <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700 text-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
              <div className="flex items-center gap-3">
                <img
                  src={activeProfileEmp.avatar}
                  alt={activeProfileEmp.firstName}
                  className="w-12 h-12 rounded-xl object-cover border border-neutral-700 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">{activeProfileEmp.firstName} {activeProfileEmp.lastName}</h2>
                    <span className="font-mono text-xs bg-blue-950 text-blue-300 border border-blue-800/50 px-2 py-0.5 rounded">
                      {activeProfileEmp.code}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">{activeProfileEmp.position} • {activeProfileEmp.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedEmployeeForBadge(activeProfileEmp)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>ID Badge</span>
                </button>
                <button
                  onClick={() => setActiveProfileEmp(null)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
              {/* Core Information Grid */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Employment Details</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                  <div>
                    <span className="text-neutral-500 block">Department:</span>
                    <span className="font-semibold text-neutral-200">{activeProfileEmp.department}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Employment Type:</span>
                    <span className="font-semibold text-neutral-200">{activeProfileEmp.employmentType}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Sex / Gender:</span>
                    <span className="font-semibold text-neutral-200">{activeProfileEmp.sex || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Date of Engagement:</span>
                    <span className="font-mono text-neutral-200">{activeProfileEmp.dateOfEngagement || activeProfileEmp.joinDate}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Base Salary:</span>
                    <span className="font-mono text-emerald-400 font-bold">${activeProfileEmp.baseSalary.toLocaleString()}/mo</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Shift Timing:</span>
                    <span className="font-mono text-neutral-200">{activeProfileEmp.shiftStart} - {activeProfileEmp.shiftEnd}</span>
                  </div>
                </div>
              </div>

              {/* Physical Address & Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <h4 className="font-bold text-neutral-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>Physical Address & Location</span>
                  </h4>
                  <p><span className="text-neutral-500">Address:</span> <span className="text-white font-medium">{activeProfileEmp.physicalAddress || activeProfileEmp.address || '—'}</span></p>
                  <p><span className="text-neutral-500">Email:</span> {activeProfileEmp.email}</p>
                  <p><span className="text-neutral-500">Phone:</span> {activeProfileEmp.phone}</p>
                  <p><span className="text-neutral-500">National ID:</span> <span className="font-mono">{activeProfileEmp.nationalId}</span></p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <h4 className="font-bold text-neutral-300 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Bank Disbursement Data</span>
                  </h4>
                  <p><span className="text-neutral-500">Bank Name:</span> {activeProfileEmp.bankDetails.bankName}</p>
                  <p><span className="text-neutral-500">Account:</span> <span className="font-mono">{activeProfileEmp.bankDetails.accountNumber}</span></p>
                  <p><span className="text-neutral-500">Routing:</span> <span className="font-mono">{activeProfileEmp.bankDetails.routingNumber}</span></p>
                  <p><span className="text-neutral-500">Emergency:</span> {activeProfileEmp.emergencyContact.name} ({activeProfileEmp.emergencyContact.relationship}) - {activeProfileEmp.emergencyContact.phone}</p>
                </div>
              </div>

              {/* Assigned Hardware Assets */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Assigned Company Assets</h4>
                <div className="space-y-2">
                  {assets.filter(a => a.assignedToId === activeProfileEmp.id).length > 0 ? (
                    assets.filter(a => a.assignedToId === activeProfileEmp.id).map(a => (
                      <div key={a.id} className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-blue-400" />
                          <div>
                            <p className="font-semibold text-white">{a.name}</p>
                            <p className="text-[10px] text-neutral-500 font-mono">SN: {a.serialNumber} • {a.category}</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">
                          Assigned
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-neutral-500 italic p-3 bg-neutral-950 rounded-lg">No equipment currently assigned.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => setActiveProfileEmp(null)}
                className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enroll New Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto" id="modal-add-employee">
          <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-700 text-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-400" />
                  <span>Enroll New Workforce Member</span>
                </h2>
                <p className="text-[11px] text-neutral-400">Complete personal, contact, departmental, and biometric profile fields.</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
              
              {/* Employee ID & Photo Section */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Employee ID & Profile Picture</span>
                  </h3>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full font-medium">
                    Auto-ID Active
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  {/* Left: Avatar Preview & Quick Presets */}
                  <div className="flex flex-col items-center gap-3 p-3 bg-neutral-900 rounded-xl border border-neutral-800">
                    <div className="relative group">
                      <img
                        src={newEmpData.avatar}
                        alt="Preview"
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-500/60 shadow-lg shadow-blue-500/10"
                      />
                      <label className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                        <Upload className="w-4 h-4 mb-0.5" />
                        <span className="text-[9px] font-bold">Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <span className="text-[10px] text-neutral-400 text-center">Click image or choose preset avatar below</span>

                    {/* Quick Avatar Presets */}
                    <div className="grid grid-cols-5 gap-1.5 w-full pt-1 border-t border-neutral-800">
                      {AVATAR_PRESETS.slice(0, 10).map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setNewEmpData(prev => ({ ...prev, avatar: url }))}
                          className={`w-7 h-7 rounded-lg overflow-hidden border transition-all cursor-pointer ${newEmpData.avatar === url ? 'border-blue-400 ring-2 ring-blue-500/50 scale-105' : 'border-neutral-700 opacity-70 hover:opacity-100'}`}
                        >
                          <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right: Employee Number & Avatar URL */}
                  <div className="md:col-span-2 space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-neutral-300 font-semibold flex items-center gap-1.5">
                          <span>Employee Number / ID *</span>
                          <span className="text-[10px] text-blue-400 font-normal">(Editable Automatic ID)</span>
                        </label>
                        <button
                          type="button"
                          onClick={handleRegenerateCode}
                          className="text-[10px] text-neutral-400 hover:text-blue-400 flex items-center gap-1 cursor-pointer transition-colors"
                          title="Reset to Next Available System ID"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Reset Auto ID</span>
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={newEmpData.code}
                          onChange={(e) => setNewEmpData({ ...newEmpData, code: e.target.value })}
                          placeholder="e.g. EMP-1011"
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-blue-300 font-mono font-bold tracking-wider focus:outline-none focus:border-blue-500"
                          id="input-employee-code"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-neutral-500">
                          SYSTEM ISSUED
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-300 mb-1">Profile Photo URL</label>
                      <input
                        type="url"
                        value={newEmpData.avatar}
                        onChange={(e) => setNewEmpData({ ...newEmpData, avatar: e.target.value })}
                        placeholder="https://..."
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono text-[11px] focus:outline-none focus:border-blue-500"
                        id="input-employee-avatar"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Personal & Identity Information</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah"
                      value={newEmpData.firstName}
                      onChange={(e) => setNewEmpData({ ...newEmpData, firstName: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                      id="input-emp-first-name"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jenkins"
                      value={newEmpData.lastName}
                      onChange={(e) => setNewEmpData({ ...newEmpData, lastName: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                      id="input-emp-last-name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">Sex / Gender *</label>
                    <select
                      value={newEmpData.sex}
                      onChange={(e) => setNewEmpData({ ...newEmpData, sex: e.target.value as Gender })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                      id="select-emp-sex"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">Date of Engagement (Hire Date) *</label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={newEmpData.dateOfEngagement}
                        onChange={(e) => setNewEmpData({
                          ...newEmpData,
                          dateOfEngagement: e.target.value,
                          joinDate: e.target.value
                        })}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                        id="input-emp-engagement-date"
                      />
                    </div>
                  </div>
                </div>

                {/* Physical Address */}
                <div>
                  <label className="block text-neutral-400 mb-1">Physical Address *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1420 5th Avenue, Suite 2100, Seattle, WA 98101"
                      value={newEmpData.physicalAddress}
                      onChange={(e) => setNewEmpData({ ...newEmpData, physicalAddress: e.target.value, address: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-blue-500"
                      id="input-emp-physical-address"
                    />
                  </div>
                </div>
              </div>

              {/* Departmental & Role Assignment */}
              <div className="space-y-3 pt-3 border-t border-neutral-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Department & Corporate Role</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">Department *</label>
                    <select
                      value={newEmpData.department}
                      onChange={(e) => setNewEmpData({ ...newEmpData, department: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Finance & Accounting">Finance & Accounting</option>
                      <option value="Product & Design">Product & Design</option>
                      <option value="Sales & Growth">Sales & Growth</option>
                      <option value="Operations & Logistics">Operations & Logistics</option>
                      <option value="Quality & Compliance">Quality & Compliance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Position / Job Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Principal Cloud Architect"
                      value={newEmpData.position}
                      onChange={(e) => setNewEmpData({ ...newEmpData, position: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">Corporate Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@comfortbizflow.io"
                      value={newEmpData.email}
                      onChange={(e) => setNewEmpData({ ...newEmpData, email: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      value={newEmpData.phone}
                      onChange={(e) => setNewEmpData({ ...newEmpData, phone: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Compensation & Shift Schedule */}
              <div className="space-y-3 pt-3 border-t border-neutral-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Compensation & Working Schedule</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">Base Monthly Salary ($)</label>
                    <input
                      type="number"
                      value={newEmpData.baseSalary}
                      onChange={(e) => setNewEmpData({ ...newEmpData, baseSalary: Number(e.target.value) })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Shift Start</label>
                    <input
                      type="text"
                      value={newEmpData.shiftStart}
                      onChange={(e) => setNewEmpData({ ...newEmpData, shiftStart: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Shift End</label>
                    <input
                      type="text"
                      value={newEmpData.shiftEnd}
                      onChange={(e) => setNewEmpData({ ...newEmpData, shiftEnd: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer"
                  id="btn-submit-enroll-employee"
                >
                  Enroll & Issue Employee ID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
