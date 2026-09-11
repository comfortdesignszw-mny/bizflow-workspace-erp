import React, { useState, useEffect } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Users,
  Search,
  Plus,
  QrCode,
  Mail,
  Phone,
  DollarSign,
  Shield,
  Eye,
  Trash2,
  Award,
  Clock,
  Package,
  X,
  MapPin,
  RefreshCw,
  Upload,
  User,
  LayoutGrid,
  Table,
  Share2,
  Download,
  Printer,
  Edit3,
  AlertCircle,
  Building,
  Check,
  CreditCard,
  FileCheck
} from 'lucide-react';
import { EmptyState } from '../common/EmptyState';
import { Employee, EmployeeStatus, EmploymentType, Gender, DisbursementMethod } from '../../types/erp';

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

const DISBURSEMENT_METHODS: DisbursementMethod[] = [
  'Direct Deposit (ACH)',
  'Electronic Funds Transfer',
  'Mobile Money',
  'Bank Wire',
  'Check',
  'Cash'
];

const EMPLOYMENT_TYPES: EmploymentType[] = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Probation'
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
    settings
  } = useERP();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedEmpType, setSelectedEmpType] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Selected employee for profile drawer
  const [activeProfileEmp, setActiveProfileEmp] = useState<Employee | null>(null);

  // Management modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [autoCodeGenerated, setAutoCodeGenerated] = useState('');
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const [dossierEmployee, setDossierEmployee] = useState<Employee | null>(null);
  const [setupEmployee, setSetupEmployee] = useState<Employee | null>(null);

  // Toast / alert feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Clean empty state for new employee enrollment (no auto-added sample data)
  const [newEmpData, setNewEmpData] = useState({
    code: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: AVATAR_PRESETS[0],
    sex: 'Female' as Gender,
    dateOfEngagement: new Date().toISOString().split('T')[0],
    physicalAddress: '',
    department: 'Engineering',
    position: '',
    employmentType: 'Full-time' as EmploymentType,
    status: 'Active' as EmployeeStatus,
    joinDate: new Date().toISOString().split('T')[0],
    baseSalary: 0,
    hourlyRate: 0,
    currency: 'USD',
    shiftStart: '08:30',
    shiftEnd: '17:30',
    address: '',
    nationalId: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    bankDetails: {
      bankName: '',
      accountNumber: '',
      accountName: '',
      branchCode: '',
      routingNumber: '',
      swiftCode: '',
      disbursementMethod: 'Direct Deposit (ACH)' as DisbursementMethod
    },
    notes: '',
    profileCompleted: true
  });

  // When Add modal opens, initialize auto-generated employee ID and reset form cleanly
  useEffect(() => {
    if (isAddModalOpen) {
      const nextCode = getNextEmployeeCode();
      setAutoCodeGenerated(nextCode);
      setNewEmpData({
        code: nextCode,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        avatar: AVATAR_PRESETS[0],
        sex: 'Female',
        dateOfEngagement: new Date().toISOString().split('T')[0],
        physicalAddress: '',
        department: 'Engineering',
        position: '',
        employmentType: 'Full-time',
        status: 'Active',
        joinDate: new Date().toISOString().split('T')[0],
        baseSalary: 0,
        hourlyRate: 0,
        currency: 'USD',
        shiftStart: '08:30',
        shiftEnd: '17:30',
        address: '',
        nationalId: '',
        emergencyContact: {
          name: '',
          relationship: '',
          phone: ''
        },
        bankDetails: {
          bankName: '',
          accountNumber: '',
          accountName: '',
          branchCode: '',
          routingNumber: '',
          swiftCode: '',
          disbursementMethod: 'Direct Deposit (ACH)'
        },
        notes: '',
        profileCompleted: true
      });
    }
  }, [isAddModalOpen, getNextEmployeeCode]);

  const handleRegenerateCode = () => {
    const nextCode = getNextEmployeeCode();
    setAutoCodeGenerated(nextCode);
    setNewEmpData(prev => ({ ...prev, code: nextCode }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'new' | 'edit' | 'setup') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const resultStr = reader.result;
          if (target === 'new') {
            setNewEmpData(prev => ({ ...prev, avatar: resultStr }));
          } else if (target === 'edit' && editingEmployee) {
            setEditingEmployee({ ...editingEmployee, avatar: resultStr });
          } else if (target === 'setup' && setupEmployee) {
            setSetupEmployee({ ...setupEmployee, avatar: resultStr });
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const departments = ['ALL', ...Array.from(new Set(employees.map(e => e.department)))];

  // Incomplete profile detection (e.g. from initial signup without full disbursement/photo/gender)
  const incompleteEmployees = employees.filter(emp => !emp.profileCompleted || !emp.bankDetails?.accountNumber || !emp.sex);

  const filteredEmployees = employees.filter(emp => {
    const matchesQuery = `${emp.firstName} ${emp.lastName} ${emp.code} ${emp.position} ${emp.email} ${emp.physicalAddress || ''} ${emp.sex || ''} ${emp.bankDetails?.bankName || ''}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || emp.department === selectedDept;
    const matchesStatus = selectedStatus === 'ALL' || emp.status === selectedStatus;
    const matchesType = selectedEmpType === 'ALL' || emp.employmentType === selectedEmpType;
    return matchesQuery && matchesDept && matchesStatus && matchesType;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpData.firstName || !newEmpData.lastName || !newEmpData.position) return;

    addEmployee({
      ...newEmpData,
      code: newEmpData.code.trim() || autoCodeGenerated,
      address: newEmpData.physicalAddress,
      profileCompleted: true,
      bankDetails: {
        ...newEmpData.bankDetails,
        accountName: newEmpData.bankDetails.accountName.trim() || `${newEmpData.firstName} ${newEmpData.lastName}`
      }
    });

    setIsAddModalOpen(false);
    showToast(`Employee ${newEmpData.firstName} ${newEmpData.lastName} enrolled successfully.`);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;

    updateEmployee(editingEmployee.id, {
      ...editingEmployee,
      address: editingEmployee.physicalAddress || editingEmployee.address,
      bankDetails: {
        ...editingEmployee.bankDetails,
        accountName: editingEmployee.bankDetails?.accountName?.trim() || `${editingEmployee.firstName} ${editingEmployee.lastName}`
      }
    });

    if (activeProfileEmp?.id === editingEmployee.id) {
      setActiveProfileEmp(editingEmployee);
    }

    setEditingEmployee(null);
    showToast(`Employee details for ${editingEmployee.firstName} ${editingEmployee.lastName} updated successfully.`);
  };

  const handleDeleteConfirm = () => {
    if (!deletingEmployee) return;
    deleteEmployee(deletingEmployee.id);
    if (activeProfileEmp?.id === deletingEmployee.id) {
      setActiveProfileEmp(null);
    }
    showToast(`Employee ${deletingEmployee.firstName} ${deletingEmployee.lastName} deleted from database.`);
    setDeletingEmployee(null);
  };

  const handleShareEmployee = async (emp: Employee) => {
    const summary = `OFFICIAL EMPLOYEE RECORD: ${emp.firstName} ${emp.lastName} (${emp.code})
--------------------------------------------------
Role: ${emp.position} | Dept: ${emp.department}
Employment Type: ${emp.employmentType || 'Full-time'}
Status: ${emp.status} | Gender: ${emp.sex || 'Unspecified'}
Hire Date: ${emp.dateOfEngagement || emp.joinDate}
Corporate Email: ${emp.email}
Phone: ${emp.phone || 'N/A'}
Address: ${emp.physicalAddress || emp.address || 'N/A'}
National ID: ${emp.nationalId || 'N/A'}

BANK DISBURSEMENT DATA:
Bank Name: ${emp.bankDetails?.bankName || 'Pending Setup'}
Account Number: ${emp.bankDetails?.accountNumber || 'Pending Setup'}
Account Name: ${emp.bankDetails?.accountName || `${emp.firstName} ${emp.lastName}`}
Branch Code: ${emp.bankDetails?.branchCode || 'N/A'}
Routing/SWIFT: ${emp.bankDetails?.routingNumber || emp.bankDetails?.swiftCode || 'N/A'}
Method: ${emp.bankDetails?.disbursementMethod || 'Direct Deposit (ACH)'}

EMERGENCY CONTACT:
${emp.emergencyContact?.name || 'N/A'} (${emp.emergencyContact?.relationship || 'Next of Kin'}) - ${emp.emergencyContact?.phone || 'N/A'}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${emp.firstName} ${emp.lastName} - Employee Dossier`,
          text: summary
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    await navigator.clipboard.writeText(summary);
    showToast(`Employee profile for ${emp.firstName} ${emp.lastName} copied to clipboard!`);
  };

  const handleFinishSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupEmployee) return;

    const finalized: Employee = {
      ...setupEmployee,
      profileCompleted: true,
      bankDetails: {
        ...setupEmployee.bankDetails,
        accountName: setupEmployee.bankDetails?.accountName?.trim() || `${setupEmployee.firstName} ${setupEmployee.lastName}`
      }
    };

    updateEmployee(finalized.id, finalized);
    if (activeProfileEmp?.id === finalized.id) {
      setActiveProfileEmp(finalized);
    }
    setSetupEmployee(null);
    showToast(`Profile setup finalized for ${finalized.firstName} ${finalized.lastName}. Bank disbursement activated.`);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto" id="employees-module-view">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-blue-600 text-white px-4 py-3 rounded-xl shadow-2xl border border-blue-400/40 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <Check className="w-5 h-5 shrink-0 text-white" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-900/80 p-6 rounded-2xl border border-neutral-800 shadow-sm backdrop-blur-xs">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">Workforce & Employee Directory</h1>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Total {employees.length} personnel enrolled • Complete bank disbursement management, employment types, verifiable badges, and print-ready dossiers.
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
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
            id="btn-add-employee"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll Employee</span>
          </button>
        </div>
      </div>

      {/* Incomplete Profile Setup Banner (Post-Signup Employee Setup Alert) */}
      {incompleteEmployees.length > 0 && (
        <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg shadow-amber-950/20">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400 border border-amber-500/30 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-200">
                Pending Profile & Bank Disbursement Setup ({incompleteEmployees.length})
              </h3>
              <p className="text-xs text-amber-300/80 mt-0.5">
                {incompleteEmployees.length === 1
                  ? `${incompleteEmployees[0].firstName} ${incompleteEmployees[0].lastName} requires completion of profile photo, gender, and bank disbursement details.`
                  : `${incompleteEmployees.length} personnel need profile completion (photo, gender, bank disbursement details) to activate automated payroll.`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSetupEmployee(incompleteEmployees[0])}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md cursor-pointer shrink-0"
          >
            <FileCheck className="w-4 h-4" />
            <span>Finish Employee Setup</span>
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800/80">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by name, ID code, role, bank, physical address, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
            id="input-search-employees"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-300 focus:outline-none focus:border-blue-500"
            id="select-dept-filter"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept === 'ALL' ? 'All Departments' : dept}</option>
            ))}
          </select>

          {/* Employment Type Filter */}
          <select
            value={selectedEmpType}
            onChange={(e) => setSelectedEmpType(e.target.value)}
            className="px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-300 focus:outline-none focus:border-blue-500"
            id="select-type-filter"
          >
            <option value="ALL">All Employment Types</option>
            {EMPLOYMENT_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-300 focus:outline-none focus:border-blue-500"
            id="select-status-filter"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Probation">Probation</option>
            <option value="On Leave">On Leave</option>
            <option value="Terminated">Terminated</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredEmployees.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Workforce Members Found"
          description={
            employees.length === 0
              ? 'No employees enrolled yet. Click "Enroll Employee" above to register workforce personnel with comprehensive bank disbursement, employment type, and personal credentials.'
              : 'No workforce personnel match your current search query or filter parameters.'
          }
          actionText={employees.length === 0 ? "+ Enroll First Employee" : undefined}
          onAction={employees.length === 0 ? () => setIsAddModalOpen(true) : undefined}
        />
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="employees-grid-list">
          {filteredEmployees.map((emp) => {
            const isInside = currentlyInsideEmployees.some(c => c.id === emp.id);
            const isIncomplete = !emp.profileCompleted || !emp.bankDetails?.accountNumber || !emp.sex;

            return (
              <div
                key={emp.id}
                className={`p-5 rounded-2xl bg-neutral-900/80 border transition-all duration-200 flex flex-col justify-between gap-4 shadow-sm hover:border-neutral-700 ${
                  isIncomplete ? 'border-amber-500/40 bg-amber-950/10' : 'border-neutral-800'
                }`}
                id={`emp-card-${emp.id}`}
              >
                {/* Card Top: Photo & Core identity */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={emp.avatar}
                        alt={`${emp.firstName} ${emp.lastName}`}
                        className="w-12 h-12 rounded-xl object-cover border border-neutral-700 shadow-md bg-neutral-950"
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-neutral-900 ${
                          isInside ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-600'
                        }`}
                        title={isInside ? 'Currently Inside Premise' : 'Off-site / Offline'}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-sm">
                          {emp.firstName} {emp.lastName}
                        </h3>
                        <span className="font-mono text-[10px] bg-blue-950/80 text-blue-300 border border-blue-800/40 px-1.5 py-0.5 rounded font-bold">
                          {emp.code}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 font-medium">{emp.position}</p>
                      <p className="text-[11px] text-neutral-500">{emp.department}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-300 border border-neutral-700">
                      {emp.employmentType || 'Full-time'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      emp.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      emp.status === 'On Leave' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-neutral-800 text-neutral-400'
                    }`}>
                      {emp.status}
                    </span>
                  </div>
                </div>

                {/* Profile Incomplete Alert */}
                {isIncomplete && (
                  <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px]">
                    <span className="flex items-center gap-1.5 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Setup Incomplete (No Bank / Photo)</span>
                    </span>
                    <button
                      onClick={() => setSetupEmployee(emp)}
                      className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-[10px] transition-colors shrink-0 cursor-pointer"
                    >
                      Finish Setup
                    </button>
                  </div>
                )}

                {/* Bank Disbursement Data Box */}
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800/90 text-xs space-y-1">
                  <div className="flex items-center justify-between text-neutral-400">
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-neutral-300">
                      <CreditCard className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="font-semibold text-white truncate max-w-[130px]">
                        {emp.bankDetails?.bankName || 'Bank Not Configured'}
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {emp.bankDetails?.disbursementMethod || 'Direct Deposit'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                    <span className="text-neutral-500">A/C: {emp.bankDetails?.accountNumber || '—'}</span>
                    <span className="text-emerald-400 font-bold">${(emp.baseSalary || 0).toLocaleString()}/mo</span>
                  </div>
                </div>

                {/* Contact & Meta details */}
                <div className="grid grid-cols-2 gap-2 text-xs text-neutral-400 pt-1 border-t border-neutral-800/80">
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span className="truncate text-[11px]">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span className="text-[11px]">{emp.shiftStart} - {emp.shiftEnd}</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2 truncate">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="truncate text-[11px] text-neutral-300">{emp.physicalAddress || emp.address || 'No address on file'}</span>
                  </div>
                </div>

                {/* Card Management Action Buttons: View, Edit, Delete, Share, PDF, Badge */}
                <div className="grid grid-cols-5 gap-1.5 pt-2 border-t border-neutral-800/80">
                  <button
                    onClick={() => setActiveProfileEmp(emp)}
                    className="py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="View Profile"
                    id={`btn-view-${emp.id}`}
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-400" />
                    <span className="hidden sm:inline">View</span>
                  </button>

                  <button
                    onClick={() => setEditingEmployee(emp)}
                    className="py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="Edit Employee Information & Bank Disbursement"
                    id={`btn-edit-${emp.id}`}
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>

                  <button
                    onClick={() => handleShareEmployee(emp)}
                    className="py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="Share Employee Profile"
                    id={`btn-share-${emp.id}`}
                  >
                    <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="hidden sm:inline">Share</span>
                  </button>

                  <button
                    onClick={() => setDossierEmployee(emp)}
                    className="py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="Download Official Dossier as PDF"
                    id={`btn-pdf-${emp.id}`}
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline">PDF</span>
                  </button>

                  <button
                    onClick={() => setDeletingEmployee(emp)}
                    className="py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-medium border border-rose-800/40 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="Delete Employee"
                    id={`btn-delete-${emp.id}`}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span className="hidden sm:inline">Delete</span>
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
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Department & Role</th>
                  <th className="py-3 px-4">Bank Disbursement</th>
                  <th className="py-3 px-4">Monthly Salary</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Management Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img src={emp.avatar} alt={emp.firstName} className="w-8 h-8 rounded-lg object-cover border border-neutral-700 bg-neutral-950" />
                        <div>
                          <p className="font-bold text-white">{emp.firstName} {emp.lastName}</p>
                          <p className="text-[10px] text-neutral-400 truncate max-w-[150px]">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-300">{emp.code}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-neutral-800 text-neutral-300 font-medium">
                        {emp.employmentType || 'Full-time'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-neutral-200">{emp.position}</p>
                      <p className="text-[10px] text-neutral-400">{emp.department}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono text-[11px]">
                        <p className="text-white font-semibold">{emp.bankDetails?.bankName || 'Pending'}</p>
                        <p className="text-[10px] text-neutral-400">{emp.bankDetails?.accountNumber || 'No A/C'}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-400 font-semibold">
                      ${(emp.baseSalary || 0).toLocaleString()}/mo
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
                          <Eye className="w-3.5 h-3.5 text-blue-400" />
                        </button>
                        <button
                          onClick={() => setEditingEmployee(emp)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                          title="Edit Information & Bank Details"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                        </button>
                        <button
                          onClick={() => handleShareEmployee(emp)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                          title="Share Profile"
                        >
                          <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                        </button>
                        <button
                          onClick={() => setDossierEmployee(emp)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                          title="Download Dossier PDF"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-400" />
                        </button>
                        <button
                          onClick={() => setSelectedEmployeeForBadge(emp)}
                          className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300"
                          title="Digital ID Badge"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingEmployee(emp)}
                          className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40"
                          title="Delete Employee"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* DETAILED EMPLOYEE PROFILE DRAWER */}
      {activeProfileEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto" id="employee-profile-drawer">
          <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700 text-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
              <div className="flex items-center gap-3">
                <img
                  src={activeProfileEmp.avatar}
                  alt={activeProfileEmp.firstName}
                  className="w-12 h-12 rounded-xl object-cover border border-neutral-700 shadow-md bg-neutral-950"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">{activeProfileEmp.firstName} {activeProfileEmp.lastName}</h2>
                    <span className="font-mono text-xs bg-blue-950 text-blue-300 border border-blue-800/50 px-2 py-0.5 rounded">
                      {activeProfileEmp.code}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-300 border border-neutral-700">
                      {activeProfileEmp.employmentType || 'Full-time'}
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

            {/* Quick Management Toolbar inside Profile Drawer */}
            <div className="px-6 py-2.5 bg-neutral-950/80 border-b border-neutral-800 flex items-center justify-between gap-2">
              <span className="text-[11px] text-neutral-400 uppercase font-mono tracking-wider font-bold">Management Controls</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const emp = activeProfileEmp;
                    setActiveProfileEmp(null);
                    setEditingEmployee(emp);
                  }}
                  className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>
                <button
                  onClick={() => handleShareEmployee(activeProfileEmp)}
                  className="px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Share</span>
                </button>
                <button
                  onClick={() => {
                    const emp = activeProfileEmp;
                    setActiveProfileEmp(null);
                    setDossierEmployee(emp);
                  }}
                  className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF Dossier</span>
                </button>
                <button
                  onClick={() => {
                    const emp = activeProfileEmp;
                    setActiveProfileEmp(null);
                    setDeletingEmployee(emp);
                  }}
                  className="px-3 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
              
              {/* Core Employment Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Employment Type</span>
                  <span className="font-bold text-white text-xs mt-1 block">{activeProfileEmp.employmentType || 'Full-time'}</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Gender / Sex</span>
                  <span className="font-bold text-white text-xs mt-1 block">{activeProfileEmp.sex || 'Unspecified'}</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Base Salary</span>
                  <span className="font-bold text-emerald-400 font-mono text-xs mt-1 block">${(activeProfileEmp.baseSalary || 0).toLocaleString()}/mo</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Engagement Date</span>
                  <span className="font-mono text-neutral-300 text-xs mt-1 block">{activeProfileEmp.dateOfEngagement || activeProfileEmp.joinDate}</span>
                </div>
              </div>

              {/* Bank Disbursement Data (Editable in employee card) */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <span>Bank Disbursement & Remittance Details</span>
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {activeProfileEmp.bankDetails?.disbursementMethod || 'Direct Deposit (ACH)'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-neutral-300">
                  <div>
                    <span className="text-neutral-500 block text-[10px]">Bank Name:</span>
                    <span className="font-semibold text-white">{activeProfileEmp.bankDetails?.bankName || 'Not configured'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">Account Name:</span>
                    <span className="font-semibold text-white">{activeProfileEmp.bankDetails?.accountName || `${activeProfileEmp.firstName} ${activeProfileEmp.lastName}`}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">Account / IBAN Number:</span>
                    <span className="font-mono font-bold text-emerald-400">{activeProfileEmp.bankDetails?.accountNumber || '—'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">Branch / Sort Code:</span>
                    <span className="font-mono">{activeProfileEmp.bankDetails?.branchCode || '—'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">Routing Number / SWIFT:</span>
                    <span className="font-mono">{activeProfileEmp.bankDetails?.routingNumber || activeProfileEmp.bankDetails?.swiftCode || '—'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">Remittance Schedule:</span>
                    <span>Monthly Payroll Run (Auto-Disbursed)</span>
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
                  <p><span className="text-neutral-500">Phone:</span> {activeProfileEmp.phone || '—'}</p>
                  <p><span className="text-neutral-500">National ID / SSN:</span> <span className="font-mono">{activeProfileEmp.nationalId || '—'}</span></p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <h4 className="font-bold text-neutral-300 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Emergency Contact</span>
                  </h4>
                  <p><span className="text-neutral-500">Contact Name:</span> {activeProfileEmp.emergencyContact?.name || '—'}</p>
                  <p><span className="text-neutral-500">Relationship:</span> {activeProfileEmp.emergencyContact?.relationship || '—'}</p>
                  <p><span className="text-neutral-500">Phone:</span> {activeProfileEmp.emergencyContact?.phone || '—'}</p>
                  <p><span className="text-neutral-500">Work Shift:</span> <span className="font-mono">{activeProfileEmp.shiftStart} - {activeProfileEmp.shiftEnd}</span></p>
                </div>
              </div>

              {/* Assigned Hardware Assets */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Assigned Hardware Assets</h4>
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

      {/* ENROLL NEW EMPLOYEE MODAL (Clean inputs, Bank Disbursement + Employment Type, No Auto Demo Data) */}
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
                <p className="text-[11px] text-neutral-400">Add personal details, employment type, and bank disbursement remittance entries.</p>
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
                    <Shield className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Employee ID & Profile Photo</span>
                  </h3>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full font-medium">
                    Auto-ID Assigned
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={newEmpData.avatar}
                      alt="Avatar"
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-md bg-neutral-950"
                    />
                    <label className="absolute -bottom-1 -right-1 p-1.5 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-500 transition-colors shadow">
                      <Upload className="w-3 h-3 text-white" />
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'new')} className="hidden" />
                    </label>
                  </div>

                  <div className="space-y-3 flex-1 w-full">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-neutral-300 font-semibold">Assigned Employee Code *</label>
                        <button
                          type="button"
                          onClick={handleRegenerateCode}
                          className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
                        >
                          <RefreshCw className="w-2.5 h-2.5" /> Regenerate
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={newEmpData.code}
                        onChange={(e) => setNewEmpData({ ...newEmpData, code: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-blue-300 font-mono font-bold focus:outline-none focus:border-blue-500"
                        id="input-employee-code"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-400 mb-1 text-[11px]">Or select preset avatar</label>
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                        {AVATAR_PRESETS.map((url, i) => (
                          <img
                            key={i}
                            src={url}
                            alt={`Preset ${i}`}
                            onClick={() => setNewEmpData({ ...newEmpData, avatar: url })}
                            className={`w-7 h-7 rounded-lg object-cover cursor-pointer border transition-transform hover:scale-110 shrink-0 ${
                              newEmpData.avatar === url ? 'border-blue-400 ring-2 ring-blue-500/40' : 'border-neutral-700 opacity-60'
                            }`}
                          />
                        ))}
                      </div>
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
                      placeholder="Enter first name"
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
                      placeholder="Enter last name"
                      value={newEmpData.lastName}
                      onChange={(e) => setNewEmpData({ ...newEmpData, lastName: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                      id="input-emp-last-name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

                  <div>
                    <label className="block text-neutral-400 mb-1">National ID / SSN</label>
                    <input
                      type="text"
                      placeholder="e.g. ID-8820-991"
                      value={newEmpData.nationalId}
                      onChange={(e) => setNewEmpData({ ...newEmpData, nationalId: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">Physical Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="Residential address street, city, state"
                      value={newEmpData.physicalAddress}
                      onChange={(e) => setNewEmpData({ ...newEmpData, physicalAddress: e.target.value, address: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                      id="input-emp-physical-address"
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

              {/* Employment Type & Department Role Assignment */}
              <div className="space-y-3 pt-3 border-t border-neutral-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Employment Type & Corporate Role</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">Employment Type *</label>
                    <select
                      value={newEmpData.employmentType}
                      onChange={(e) => setNewEmpData({ ...newEmpData, employmentType: e.target.value as EmploymentType })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-semibold"
                      id="select-employment-type"
                    >
                      {EMPLOYMENT_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">Department *</label>
                    <select
                      value={newEmpData.department}
                      onChange={(e) => setNewEmpData({ ...newEmpData, department: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Civil & Structural">Civil & Structural</option>
                      <option value="Automation & Instrumentation">Automation & Instrumentation</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Finance & Accounting">Finance & Accounting</option>
                      <option value="Product & Design">Product & Design</option>
                      <option value="Sales & Growth">Sales & Growth</option>
                      <option value="Operations & Logistics">Operations & Logistics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">Position / Job Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Electrical Systems Engineer"
                      value={newEmpData.position}
                      onChange={(e) => setNewEmpData({ ...newEmpData, position: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                      id="input-emp-position"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">Corporate Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={newEmpData.email}
                      onChange={(e) => setNewEmpData({ ...newEmpData, email: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">Status</label>
                    <select
                      value={newEmpData.status}
                      onChange={(e) => setNewEmpData({ ...newEmpData, status: e.target.value as EmployeeStatus })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Probation">Probation</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* BANK DISBURSEMENT DATA (Requested entries: Bank Name, A/C number, method, branch, routing) */}
              <div className="space-y-3 pt-3 border-t border-neutral-800 bg-neutral-950/60 p-4 rounded-xl border border-neutral-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4" />
                    <span>Bank Disbursement Data</span>
                  </h3>
                  <span className="text-[10px] text-neutral-400">Remittance & Payroll Routing</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-300 mb-1">Bank Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Standard Chartered / Chase / Barclays"
                      value={newEmpData.bankDetails.bankName}
                      onChange={(e) => setNewEmpData({
                        ...newEmpData,
                        bankDetails: { ...newEmpData.bankDetails, bankName: e.target.value }
                      })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-medium"
                      id="input-bank-name"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-1">Account / IBAN Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 010293847592"
                      value={newEmpData.bankDetails.accountNumber}
                      onChange={(e) => setNewEmpData({
                        ...newEmpData,
                        bankDetails: { ...newEmpData.bankDetails, accountNumber: e.target.value }
                      })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                      id="input-account-number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">Account Holder Name</label>
                    <input
                      type="text"
                      placeholder="Leave blank to use Employee Name"
                      value={newEmpData.bankDetails.accountName}
                      onChange={(e) => setNewEmpData({
                        ...newEmpData,
                        bankDetails: { ...newEmpData.bankDetails, accountName: e.target.value }
                      })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">Branch Code / Sort Code</label>
                    <input
                      type="text"
                      placeholder="e.g. 021-004"
                      value={newEmpData.bankDetails.branchCode}
                      onChange={(e) => setNewEmpData({
                        ...newEmpData,
                        bankDetails: { ...newEmpData.bankDetails, branchCode: e.target.value }
                      })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">Disbursement Method *</label>
                    <select
                      value={newEmpData.bankDetails.disbursementMethod}
                      onChange={(e) => setNewEmpData({
                        ...newEmpData,
                        bankDetails: { ...newEmpData.bankDetails, disbursementMethod: e.target.value as DisbursementMethod }
                      })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-medium"
                      id="select-disbursement-method"
                    >
                      {DISBURSEMENT_METHODS.map(method => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Routing Number / SWIFT Code</label>
                  <input
                    type="text"
                    placeholder="e.g. SCBLUS33XXX / 021000021"
                    value={newEmpData.bankDetails.routingNumber}
                    onChange={(e) => setNewEmpData({
                      ...newEmpData,
                      bankDetails: { ...newEmpData.bankDetails, routingNumber: e.target.value, swiftCode: e.target.value }
                    })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Compensation & Working Schedule */}
              <div className="space-y-3 pt-3 border-t border-neutral-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Compensation & Working Schedule</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">Monthly Salary ($) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 5000"
                      value={newEmpData.baseSalary || ''}
                      onChange={(e) => setNewEmpData({ ...newEmpData, baseSalary: Number(e.target.value) })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                      id="input-base-salary"
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

              {/* Emergency Contact */}
              <div className="space-y-3 pt-3 border-t border-neutral-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Emergency Contact</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">Contact Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Jane Doe"
                      value={newEmpData.emergencyContact.name}
                      onChange={(e) => setNewEmpData({
                        ...newEmpData,
                        emergencyContact: { ...newEmpData.emergencyContact, name: e.target.value }
                      })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Relationship</label>
                    <input
                      type="text"
                      placeholder="e.g. Spouse / Sibling"
                      value={newEmpData.emergencyContact.relationship}
                      onChange={(e) => setNewEmpData({
                        ...newEmpData,
                        emergencyContact: { ...newEmpData.emergencyContact, relationship: e.target.value }
                      })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      value={newEmpData.emergencyContact.phone}
                      onChange={(e) => setNewEmpData({
                        ...newEmpData,
                        emergencyContact: { ...newEmpData.emergencyContact, phone: e.target.value }
                      })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
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
                  Enroll & Activate Bank Remittance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT EMPLOYEE MODAL (All information editable in employee card) */}
      {editingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto" id="modal-edit-employee">
          <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-700 text-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  <span>Edit Employee: {editingEmployee.firstName} {editingEmployee.lastName} ({editingEmployee.code})</span>
                </h2>
                <p className="text-[11px] text-neutral-400">Modify employee personal records, employment type, salary, and bank disbursement data.</p>
              </div>
              <button onClick={() => setEditingEmployee(null)} className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
              
              {/* Photo & Identity Section */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={editingEmployee.avatar}
                      alt="Avatar"
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500 shadow-md bg-neutral-950"
                    />
                    <label className="absolute -bottom-1 -right-1 p-1.5 bg-amber-600 rounded-full cursor-pointer hover:bg-amber-500 transition-colors shadow">
                      <Upload className="w-3 h-3 text-black" />
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'edit')} className="hidden" />
                    </label>
                  </div>

                  <div className="space-y-2 flex-1 w-full">
                    <div>
                      <label className="text-neutral-400 font-semibold mb-1 block">Profile Photo URL</label>
                      <input
                        type="url"
                        value={editingEmployee.avatar}
                        onChange={(e) => setEditingEmployee({ ...editingEmployee, avatar: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono text-[11px] focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-500 text-[10px] mb-1">Or choose preset avatar</label>
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                        {AVATAR_PRESETS.map((url, i) => (
                          <img
                            key={i}
                            src={url}
                            alt={`Preset ${i}`}
                            onClick={() => setEditingEmployee({ ...editingEmployee, avatar: url })}
                            className={`w-6 h-6 rounded-lg object-cover cursor-pointer border transition-transform hover:scale-110 shrink-0 ${
                              editingEmployee.avatar === url ? 'border-amber-400 ring-2 ring-amber-500/40' : 'border-neutral-700 opacity-60'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Personal & Contact Information</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      value={editingEmployee.firstName}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, firstName: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={editingEmployee.lastName}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, lastName: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">Sex / Gender</label>
                    <select
                      value={editingEmployee.sex || 'Female'}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, sex: e.target.value as Gender })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">Engagement Date</label>
                    <input
                      type="date"
                      value={editingEmployee.dateOfEngagement || editingEmployee.joinDate}
                      onChange={(e) => setEditingEmployee({
                        ...editingEmployee,
                        dateOfEngagement: e.target.value,
                        joinDate: e.target.value
                      })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">National ID / SSN</label>
                    <input
                      type="text"
                      value={editingEmployee.nationalId || ''}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, nationalId: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">Physical Address *</label>
                    <input
                      type="text"
                      required
                      value={editingEmployee.physicalAddress || editingEmployee.address || ''}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, physicalAddress: e.target.value, address: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={editingEmployee.phone || ''}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, phone: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Role & Employment Type */}
              <div className="space-y-3 pt-3 border-t border-neutral-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Department, Role & Employment Type</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">Employment Type *</label>
                    <select
                      value={editingEmployee.employmentType || 'Full-time'}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, employmentType: e.target.value as EmploymentType })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-amber-500"
                    >
                      {EMPLOYMENT_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">Department *</label>
                    <select
                      value={editingEmployee.department}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, department: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Civil & Structural">Civil & Structural</option>
                      <option value="Automation & Instrumentation">Automation & Instrumentation</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Finance & Accounting">Finance & Accounting</option>
                      <option value="Product & Design">Product & Design</option>
                      <option value="Sales & Growth">Sales & Growth</option>
                      <option value="Operations & Logistics">Operations & Logistics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">Position / Job Title *</label>
                    <input
                      type="text"
                      required
                      value={editingEmployee.position}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, position: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">Corporate Email *</label>
                    <input
                      type="email"
                      required
                      value={editingEmployee.email}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">Status</label>
                    <select
                      value={editingEmployee.status}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, status: e.target.value as EmployeeStatus })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Probation">Probation</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Terminated">Terminated</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* BANK DISBURSEMENT DATA (Fully editable) */}
              <div className="space-y-3 pt-3 border-t border-neutral-800 bg-neutral-950/60 p-4 rounded-xl border border-neutral-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4" />
                    <span>Bank Disbursement & Remittance Entries</span>
                  </h3>
                  <span className="text-[10px] text-neutral-400">Directly Linked to Accounts & Payroll</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-300 mb-1">Bank Name *</label>
                    <input
                      type="text"
                      required
                      value={editingEmployee.bankDetails?.bankName || ''}
                      onChange={(e) => setEditingEmployee({
                        ...editingEmployee,
                        bankDetails: {
                          ...editingEmployee.bankDetails,
                          bankName: e.target.value,
                          accountNumber: editingEmployee.bankDetails?.accountNumber || '',
                          accountName: editingEmployee.bankDetails?.accountName || '',
                          branchCode: editingEmployee.bankDetails?.branchCode || '',
                          routingNumber: editingEmployee.bankDetails?.routingNumber || '',
                          swiftCode: editingEmployee.bankDetails?.swiftCode || '',
                          disbursementMethod: editingEmployee.bankDetails?.disbursementMethod || 'Direct Deposit (ACH)'
                        }
                      })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-1">Account Number *</label>
                    <input
                      type="text"
                      required
                      value={editingEmployee.bankDetails?.accountNumber || ''}
                      onChange={(e) => setEditingEmployee({
                        ...editingEmployee,
                        bankDetails: {
                          ...editingEmployee.bankDetails,
                          accountNumber: e.target.value,
                          bankName: editingEmployee.bankDetails?.bankName || '',
                          accountName: editingEmployee.bankDetails?.accountName || '',
                          branchCode: editingEmployee.bankDetails?.branchCode || '',
                          routingNumber: editingEmployee.bankDetails?.routingNumber || '',
                          swiftCode: editingEmployee.bankDetails?.swiftCode || '',
                          disbursementMethod: editingEmployee.bankDetails?.disbursementMethod || 'Direct Deposit (ACH)'
                        }
                      })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">Account Holder Name</label>
                    <input
                      type="text"
                      value={editingEmployee.bankDetails?.accountName || ''}
                      onChange={(e) => setEditingEmployee({
                        ...editingEmployee,
                        bankDetails: {
                          ...editingEmployee.bankDetails,
                          accountName: e.target.value,
                          bankName: editingEmployee.bankDetails?.bankName || '',
                          accountNumber: editingEmployee.bankDetails?.accountNumber || '',
                          branchCode: editingEmployee.bankDetails?.branchCode || '',
                          routingNumber: editingEmployee.bankDetails?.routingNumber || '',
                          swiftCode: editingEmployee.bankDetails?.swiftCode || '',
                          disbursementMethod: editingEmployee.bankDetails?.disbursementMethod || 'Direct Deposit (ACH)'
                        }
                      })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">Branch / Sort Code</label>
                    <input
                      type="text"
                      value={editingEmployee.bankDetails?.branchCode || ''}
                      onChange={(e) => setEditingEmployee({
                        ...editingEmployee,
                        bankDetails: {
                          ...editingEmployee.bankDetails,
                          branchCode: e.target.value,
                          bankName: editingEmployee.bankDetails?.bankName || '',
                          accountNumber: editingEmployee.bankDetails?.accountNumber || '',
                          accountName: editingEmployee.bankDetails?.accountName || '',
                          routingNumber: editingEmployee.bankDetails?.routingNumber || '',
                          swiftCode: editingEmployee.bankDetails?.swiftCode || '',
                          disbursementMethod: editingEmployee.bankDetails?.disbursementMethod || 'Direct Deposit (ACH)'
                        }
                      })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">Disbursement Method *</label>
                    <select
                      value={editingEmployee.bankDetails?.disbursementMethod || 'Direct Deposit (ACH)'}
                      onChange={(e) => setEditingEmployee({
                        ...editingEmployee,
                        bankDetails: {
                          ...editingEmployee.bankDetails,
                          disbursementMethod: e.target.value as DisbursementMethod,
                          bankName: editingEmployee.bankDetails?.bankName || '',
                          accountNumber: editingEmployee.bankDetails?.accountNumber || '',
                          accountName: editingEmployee.bankDetails?.accountName || '',
                          branchCode: editingEmployee.bankDetails?.branchCode || '',
                          routingNumber: editingEmployee.bankDetails?.routingNumber || '',
                          swiftCode: editingEmployee.bankDetails?.swiftCode || ''
                        }
                      })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-emerald-500"
                    >
                      {DISBURSEMENT_METHODS.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Routing Number / SWIFT Code</label>
                  <input
                    type="text"
                    value={editingEmployee.bankDetails?.routingNumber || editingEmployee.bankDetails?.swiftCode || ''}
                    onChange={(e) => setEditingEmployee({
                      ...editingEmployee,
                      bankDetails: {
                        ...editingEmployee.bankDetails,
                        routingNumber: e.target.value,
                        swiftCode: e.target.value,
                        bankName: editingEmployee.bankDetails?.bankName || '',
                        accountNumber: editingEmployee.bankDetails?.accountNumber || '',
                        accountName: editingEmployee.bankDetails?.accountName || '',
                        branchCode: editingEmployee.bankDetails?.branchCode || '',
                        disbursementMethod: editingEmployee.bankDetails?.disbursementMethod || 'Direct Deposit (ACH)'
                      }
                    })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Salary & Shifts */}
              <div className="space-y-3 pt-3 border-t border-neutral-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Monthly Compensation & Shift</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">Base Salary ($)</label>
                    <input
                      type="number"
                      value={editingEmployee.baseSalary}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, baseSalary: Number(e.target.value) })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Shift Start</label>
                    <input
                      type="text"
                      value={editingEmployee.shiftStart}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, shiftStart: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Shift End</label>
                    <input
                      type="text"
                      value={editingEmployee.shiftEnd}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, shiftEnd: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingEmployee(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FINISH EMPLOYEE PROFILE SETUP MODAL (Post-Signup Setup Wizard) */}
      {setupEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto" id="modal-finish-setup">
          <div className="relative w-full max-w-2xl bg-neutral-900 border border-amber-500/40 text-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-amber-950/40">
              <div>
                <h2 className="text-base font-bold text-amber-200 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-amber-400" />
                  <span>Finish Setting Up: {setupEmployee.firstName} {setupEmployee.lastName}</span>
                </h2>
                <p className="text-[11px] text-amber-300/80">
                  Complete onboarding requirements: upload employee photo, specify gender, and register bank disbursement details.
                </p>
              </div>
              <button onClick={() => setSetupEmployee(null)} className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFinishSetupSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
              
              {/* Photo & Gender */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">1. Profile / Employee Photo & Gender</h3>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={setupEmployee.avatar}
                      alt="Avatar"
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md bg-neutral-950"
                    />
                    <label className="absolute -bottom-1 -right-1 p-1.5 bg-amber-500 rounded-full cursor-pointer hover:bg-amber-400 transition-colors shadow text-black">
                      <Upload className="w-3 h-3" />
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'setup')} className="hidden" />
                    </label>
                  </div>

                  <div className="space-y-2 flex-1 w-full">
                    <div>
                      <label className="text-neutral-400 block mb-1">Sex / Gender *</label>
                      <select
                        value={setupEmployee.sex || 'Female'}
                        onChange={(e) => setSetupEmployee({ ...setupEmployee, sex: e.target.value as Gender })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Non-binary">Non-binary</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-neutral-500 text-[10px] mb-1">Or select avatar preset</label>
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                        {AVATAR_PRESETS.map((url, i) => (
                          <img
                            key={i}
                            src={url}
                            alt={`Preset ${i}`}
                            onClick={() => setSetupEmployee({ ...setupEmployee, avatar: url })}
                            className={`w-6 h-6 rounded-lg object-cover cursor-pointer border transition-transform hover:scale-110 shrink-0 ${
                              setupEmployee.avatar === url ? 'border-amber-400 ring-2 ring-amber-500/40' : 'border-neutral-700 opacity-60'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Employment Type */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">2. Employment Classification</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">Employment Type *</label>
                    <select
                      value={setupEmployee.employmentType || 'Full-time'}
                      onChange={(e) => setSetupEmployee({ ...setupEmployee, employmentType: e.target.value as EmploymentType })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-amber-400"
                    >
                      {EMPLOYMENT_TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Monthly Salary ($)</label>
                    <input
                      type="number"
                      value={setupEmployee.baseSalary || ''}
                      onChange={(e) => setSetupEmployee({ ...setupEmployee, baseSalary: Number(e.target.value) })}
                      placeholder="e.g. 6000"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Bank Disbursement Data */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4" />
                    <span>3. Bank Disbursement & Remittance Entries</span>
                  </h3>
                  <span className="text-[10px] text-emerald-300">Required for Payroll</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-300 mb-1">Bank Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. First National Bank / Wells Fargo"
                      value={setupEmployee.bankDetails?.bankName || ''}
                      onChange={(e) => setSetupEmployee({
                        ...setupEmployee,
                        bankDetails: {
                          ...setupEmployee.bankDetails,
                          bankName: e.target.value,
                          accountNumber: setupEmployee.bankDetails?.accountNumber || '',
                          accountName: setupEmployee.bankDetails?.accountName || '',
                          branchCode: setupEmployee.bankDetails?.branchCode || '',
                          routingNumber: setupEmployee.bankDetails?.routingNumber || '',
                          swiftCode: setupEmployee.bankDetails?.swiftCode || '',
                          disbursementMethod: setupEmployee.bankDetails?.disbursementMethod || 'Direct Deposit (ACH)'
                        }
                      })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-1">Account Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1092837482"
                      value={setupEmployee.bankDetails?.accountNumber || ''}
                      onChange={(e) => setSetupEmployee({
                        ...setupEmployee,
                        bankDetails: {
                          ...setupEmployee.bankDetails,
                          accountNumber: e.target.value,
                          bankName: setupEmployee.bankDetails?.bankName || '',
                          accountName: setupEmployee.bankDetails?.accountName || '',
                          branchCode: setupEmployee.bankDetails?.branchCode || '',
                          routingNumber: setupEmployee.bankDetails?.routingNumber || '',
                          swiftCode: setupEmployee.bankDetails?.swiftCode || '',
                          disbursementMethod: setupEmployee.bankDetails?.disbursementMethod || 'Direct Deposit (ACH)'
                        }
                      })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">Disbursement Method</label>
                    <select
                      value={setupEmployee.bankDetails?.disbursementMethod || 'Direct Deposit (ACH)'}
                      onChange={(e) => setSetupEmployee({
                        ...setupEmployee,
                        bankDetails: {
                          ...setupEmployee.bankDetails,
                          disbursementMethod: e.target.value as DisbursementMethod,
                          bankName: setupEmployee.bankDetails?.bankName || '',
                          accountNumber: setupEmployee.bankDetails?.accountNumber || '',
                          accountName: setupEmployee.bankDetails?.accountName || '',
                          branchCode: setupEmployee.bankDetails?.branchCode || '',
                          routingNumber: setupEmployee.bankDetails?.routingNumber || '',
                          swiftCode: setupEmployee.bankDetails?.swiftCode || ''
                        }
                      })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    >
                      {DISBURSEMENT_METHODS.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">Branch / Routing Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 021000021"
                      value={setupEmployee.bankDetails?.routingNumber || ''}
                      onChange={(e) => setSetupEmployee({
                        ...setupEmployee,
                        bankDetails: {
                          ...setupEmployee.bankDetails,
                          routingNumber: e.target.value,
                          bankName: setupEmployee.bankDetails?.bankName || '',
                          accountNumber: setupEmployee.bankDetails?.accountNumber || '',
                          accountName: setupEmployee.bankDetails?.accountName || '',
                          branchCode: setupEmployee.bankDetails?.branchCode || '',
                          swiftCode: setupEmployee.bankDetails?.swiftCode || '',
                          disbursementMethod: setupEmployee.bankDetails?.disbursementMethod || 'Direct Deposit (ACH)'
                        }
                      })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Physical Address & Phone */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">4. Physical Address & Phone</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">Physical Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="Street, City, State, ZIP"
                      value={setupEmployee.physicalAddress || setupEmployee.address || ''}
                      onChange={(e) => setSetupEmployee({ ...setupEmployee, physicalAddress: e.target.value, address: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      value={setupEmployee.phone || ''}
                      onChange={(e) => setSetupEmployee({ ...setupEmployee, phone: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSetupEmployee(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Save & Complete Onboarding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deletingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto" id="modal-delete-employee">
          <div className="relative w-full max-w-md bg-neutral-900 border border-rose-800/60 text-white rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Permanently Remove Employee?</h3>
                <p className="text-xs text-neutral-400 mt-0.5">This operation cannot be reversed.</p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 bg-neutral-950 p-3 rounded-xl border border-neutral-800">
              Are you sure you want to delete <strong className="text-white">{deletingEmployee.firstName} {deletingEmployee.lastName}</strong> (<span className="font-mono text-blue-400">{deletingEmployee.code}</span>)? This will remove their personnel record, revoke premise access credentials, and archive their bank disbursement entries.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingEmployee(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/20 cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL EMPLOYEE DOSSIER / DOWNLOAD AS PDF MODAL */}
      {dossierEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto" id="modal-employee-dossier">
          <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-700 text-white rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Action Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950 print:hidden">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Official Workforce Credential Dossier (PDF Export)</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save as PDF</span>
                </button>
                <button
                  onClick={() => setDossierEmployee(null)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable A4 Document Canvas */}
            <div className="p-8 bg-neutral-950 text-neutral-100 space-y-6 text-xs font-sans print:p-0 print:bg-white print:text-black" id="printable-dossier-canvas">
              
              {/* Document Header with Corporate Verification */}
              <div className="flex items-start justify-between border-b border-neutral-800 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black tracking-tight text-white print:text-black">
                      {settings.companyName || 'COMFORT BIZFLOW ENTERPRISE'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 print:border-black print:text-black">
                      VERIFIED DOSSIER
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 print:text-gray-600 mt-1">
                    Workforce Identification, Remittance Certification & Security Record
                  </p>
                  <p className="text-[10px] text-neutral-500 print:text-gray-500 font-mono">
                    Document ID: DOS-{dossierEmployee.code}-{new Date().getFullYear()} • Generated: {new Date().toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <div className="font-mono text-xl font-black text-blue-400 print:text-black">
                    {dossierEmployee.code}
                  </div>
                  <span className="text-[10px] text-emerald-400 print:text-emerald-700 font-bold uppercase">
                    Active Clearance
                  </span>
                </div>
              </div>

              {/* Identity Banner */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-neutral-900 border border-neutral-800 print:bg-gray-100 print:border-gray-300">
                <img
                  src={dossierEmployee.avatar}
                  alt={dossierEmployee.firstName}
                  className="w-24 h-24 rounded-xl object-cover border-2 border-neutral-700 shadow-lg bg-neutral-950"
                />
                <div className="space-y-1 text-center sm:text-left flex-1">
                  <h2 className="text-xl font-black text-white print:text-black">
                    {dossierEmployee.firstName} {dossierEmployee.lastName}
                  </h2>
                  <p className="text-sm font-semibold text-blue-400 print:text-blue-700">
                    {dossierEmployee.position} • {dossierEmployee.department}
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-300 print:bg-gray-200 print:text-black">
                      Type: {dossierEmployee.employmentType || 'Full-time'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-300 print:bg-gray-200 print:text-black">
                      Gender: {dossierEmployee.sex || 'Unspecified'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-300 print:bg-gray-200 print:text-black">
                      Engaged: {dossierEmployee.dateOfEngagement || dossierEmployee.joinDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2-Column Details: Contact & Banking */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Contact & Residential */}
                <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 print:bg-gray-50 print:border-gray-200 space-y-2">
                  <h4 className="font-bold text-neutral-200 print:text-black uppercase text-[10px] tracking-wider border-b border-neutral-800 pb-1">
                    Physical & Contact Dossier
                  </h4>
                  <p><strong className="text-neutral-400 print:text-gray-700">Physical Address:</strong> <span className="text-white print:text-black">{dossierEmployee.physicalAddress || dossierEmployee.address || 'N/A'}</span></p>
                  <p><strong className="text-neutral-400 print:text-gray-700">Corporate Email:</strong> <span className="text-white print:text-black">{dossierEmployee.email}</span></p>
                  <p><strong className="text-neutral-400 print:text-gray-700">Telephone:</strong> <span className="text-white print:text-black">{dossierEmployee.phone || 'N/A'}</span></p>
                  <p><strong className="text-neutral-400 print:text-gray-700">National ID / SSN:</strong> <span className="font-mono text-white print:text-black">{dossierEmployee.nationalId || 'N/A'}</span></p>
                  <p><strong className="text-neutral-400 print:text-gray-700">Shift Schedule:</strong> <span className="font-mono text-white print:text-black">{dossierEmployee.shiftStart} - {dossierEmployee.shiftEnd}</span></p>
                </div>

                {/* Bank Disbursement Remittance */}
                <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 print:bg-gray-50 print:border-gray-200 space-y-2">
                  <h4 className="font-bold text-emerald-400 print:text-emerald-800 uppercase text-[10px] tracking-wider border-b border-neutral-800 pb-1">
                    Bank Disbursement Data
                  </h4>
                  <p><strong className="text-neutral-400 print:text-gray-700">Remittance Bank:</strong> <span className="text-white print:text-black font-semibold">{dossierEmployee.bankDetails?.bankName || 'Pending Setup'}</span></p>
                  <p><strong className="text-neutral-400 print:text-gray-700">Account Number:</strong> <span className="font-mono text-emerald-400 print:text-emerald-700 font-bold">{dossierEmployee.bankDetails?.accountNumber || 'Pending Setup'}</span></p>
                  <p><strong className="text-neutral-400 print:text-gray-700">Account Holder:</strong> <span className="text-white print:text-black">{dossierEmployee.bankDetails?.accountName || `${dossierEmployee.firstName} ${dossierEmployee.lastName}`}</span></p>
                  <p><strong className="text-neutral-400 print:text-gray-700">Disbursement Method:</strong> <span className="text-white print:text-black">{dossierEmployee.bankDetails?.disbursementMethod || 'Direct Deposit (ACH)'}</span></p>
                  <p><strong className="text-neutral-400 print:text-gray-700">Routing / SWIFT:</strong> <span className="font-mono text-white print:text-black">{dossierEmployee.bankDetails?.routingNumber || dossierEmployee.bankDetails?.swiftCode || 'N/A'}</span></p>
                  <p><strong className="text-neutral-400 print:text-gray-700">Monthly Compensation:</strong> <span className="font-mono font-bold text-white print:text-black">${(dossierEmployee.baseSalary || 0).toLocaleString()} USD</span></p>
                </div>
              </div>

              {/* Emergency Contact & HR Authentication */}
              <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800 print:bg-white print:border-gray-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 print:text-gray-600 block">Emergency Contact Notification</span>
                  <p className="font-bold text-white print:text-black mt-0.5">
                    {dossierEmployee.emergencyContact?.name || 'Next of Kin'} ({dossierEmployee.emergencyContact?.relationship || 'Family'})
                  </p>
                  <p className="font-mono text-neutral-400 print:text-gray-600 text-[11px]">{dossierEmployee.emergencyContact?.phone || 'No phone recorded'}</p>
                </div>

                <div className="border-t sm:border-t-0 sm:border-l border-neutral-800 print:border-gray-300 sm:pl-6 pt-3 sm:pt-0 text-right">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 print:text-gray-600 block">Corporate Seal & Signature</span>
                  <div className="h-8 flex items-center justify-end font-serif italic text-neutral-300 print:text-gray-800 text-sm">
                    Comfort BizFlow HR Exec
                  </div>
                  <span className="text-[9px] text-neutral-500 print:text-gray-500 block">Digitally Certified & Watermarked</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
