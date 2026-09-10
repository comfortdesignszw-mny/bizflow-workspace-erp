import React, { useState } from 'react';
import {
  Shield,
  UserCheck,
  Building2,
  Lock,
  Check,
  X,
  Sliders,
  Sparkles,
  AlertTriangle,
  Save,
  Users,
  Briefcase
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { UserAccount, DepartmentPermission, DEFAULT_HEAD_PERMISSIONS, DEFAULT_MANAGER_PERMISSIONS, DEFAULT_EMPLOYEE_PERMISSIONS, DEFAULT_ADMIN_PERMISSIONS } from '../../types/auth';
import { UserRole } from '../../types/erp';

interface DepartmentPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEPARTMENTS = [
  'Engineering',
  'IT Systems',
  'Finance & Accounts',
  'Human Resources',
  'Procurement & Fleet',
  'Sales & Business Dev',
  'Executive Leadership',
  'Operations & Logistics'
];

export const DepartmentPermissionsModal: React.FC<DepartmentPermissionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { allUserAccounts, updateUserPermissions, currentUser, userAccount } = useERP();

  const [selectedUserId, setSelectedUserId] = useState<string>(
    allUserAccounts[0]?.id || ''
  );
  const [activeRole, setActiveRole] = useState<UserRole>('DEPARTMENT_HEAD');
  const [roleTitle, setRoleTitle] = useState('Head of Department');
  const [department, setDepartment] = useState('Engineering');
  const [permissions, setPermissions] = useState<DepartmentPermission>({ ...DEFAULT_HEAD_PERMISSIONS });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedUser = allUserAccounts.find(u => u.id === selectedUserId) || allUserAccounts[0];

  // Sync state when selected user changes
  React.useEffect(() => {
    if (selectedUser) {
      setActiveRole(selectedUser.role || 'EMPLOYEE');
      setRoleTitle(selectedUser.roleTitle || 'Staff Member');
      setDepartment(selectedUser.department || 'Engineering');
      setPermissions({ ...(selectedUser.permissions || DEFAULT_EMPLOYEE_PERMISSIONS) });
    }
  }, [selectedUserId]);

  if (!isOpen) return null;

  const isAdmin = currentUser.role === 'ADMIN' || userAccount?.role === 'ADMIN';

  const handleApplyPreset = (preset: 'ADMIN' | 'HEAD' | 'MANAGER' | 'STAFF') => {
    if (preset === 'ADMIN') {
      setActiveRole('ADMIN');
      setRoleTitle('Super Administrator / System Executive');
      setPermissions({ ...DEFAULT_ADMIN_PERMISSIONS });
    } else if (preset === 'HEAD') {
      setActiveRole('DEPARTMENT_HEAD');
      setRoleTitle(`Head of ${department}`);
      setPermissions({ ...DEFAULT_HEAD_PERMISSIONS });
    } else if (preset === 'MANAGER') {
      setActiveRole('MANAGER');
      setRoleTitle(`${department} Operations Manager`);
      setPermissions({ ...DEFAULT_MANAGER_PERMISSIONS });
    } else {
      setActiveRole('EMPLOYEE');
      setRoleTitle(`${department} Specialist`);
      setPermissions({ ...DEFAULT_EMPLOYEE_PERMISSIONS });
    }
  };

  const handleTogglePermission = (key: keyof DepartmentPermission) => {
    setPermissions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    if (!selectedUser) return;
    const res = await updateUserPermissions(selectedUser.id, {
      role: activeRole,
      roleTitle,
      department,
      assignedDepartments: activeRole === 'ADMIN' ? ['ALL'] : [department],
      permissions
    });

    if (res.success) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const filteredUsers = allUserAccounts.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto" id="modal-dept-permissions">
      <div className="w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Department Heads &amp; Manager Permissions
                <span className="text-[11px] font-semibold bg-blue-950 text-blue-400 px-2 py-0.5 rounded-full border border-blue-800">
                  Admin Authority
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Designate department leaders, managers, and configure granular authorization boundaries.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-neutral-800">
          {/* Left Column: User Selector List */}
          <div className="md:col-span-4 p-4 flex flex-col bg-neutral-950/30">
            <div className="mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search team members..."
                className="w-full bg-neutral-900 border border-neutral-800 focus:border-blue-500 text-white rounded-xl px-3 py-2 text-xs outline-none"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-[500px]">
              {filteredUsers.length === 0 ? (
                <p className="text-xs text-neutral-500 py-4 text-center">No accounts found.</p>
              ) : (
                filteredUsers.map((u) => {
                  const isSelected = u.id === selectedUserId;
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setSelectedUserId(u.id)}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center gap-3 border ${
                        isSelected
                          ? 'bg-blue-600/10 border-blue-500 text-white shadow-sm'
                          : 'bg-neutral-900/40 hover:bg-neutral-900 border-neutral-800/80 text-neutral-300'
                      }`}
                    >
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-9 h-9 rounded-full bg-neutral-800 shrink-0 border border-neutral-700"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold truncate text-white">{u.name}</span>
                          {u.isFirstAdmin ? (
                            <span className="text-[9px] font-extrabold text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/60">
                              SUPER ADMIN
                            </span>
                          ) : (
                            <span className="text-[9px] font-semibold text-neutral-400 uppercase">
                              {u.role}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-400 truncate">{u.email}</p>
                        <p className="text-[10px] text-blue-400 truncate">{u.department || 'General'}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Role & Granular Permissions Editor */}
          <div className="md:col-span-8 p-4 sm:p-6 flex flex-col space-y-5">
            {selectedUser ? (
              <>
                {/* User Card Header */}
                <div className="flex items-center justify-between bg-neutral-950/60 border border-neutral-800 p-3.5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                      className="w-12 h-12 rounded-full border-2 border-blue-500/40 bg-neutral-800"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-white">{selectedUser.name}</h3>
                      <p className="text-xs text-neutral-400">{selectedUser.email}</p>
                      <span className="text-[10px] text-neutral-500">
                        Auth: {selectedUser.authProvider.toUpperCase()} • Joined: {new Date(selectedUser.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Preset Fast-Action Buttons */}
                  {isAdmin && (
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleApplyPreset('HEAD')}
                        className="px-2.5 py-1 bg-purple-950 hover:bg-purple-900 border border-purple-700 text-purple-200 text-[10px] font-bold rounded-lg transition-colors"
                      >
                        Set Head
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyPreset('MANAGER')}
                        className="px-2.5 py-1 bg-blue-950 hover:bg-blue-900 border border-blue-700 text-blue-200 text-[10px] font-bold rounded-lg transition-colors"
                      >
                        Set Manager
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyPreset('ADMIN')}
                        className="px-2.5 py-1 bg-amber-950 hover:bg-amber-900 border border-amber-700 text-amber-200 text-[10px] font-bold rounded-lg transition-colors"
                      >
                        Set Admin
                      </button>
                    </div>
                  )}
                </div>

                {/* Role & Department Designation */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      System Role Level
                    </label>
                    <select
                      value={activeRole}
                      onChange={(e) => setActiveRole(e.target.value as UserRole)}
                      disabled={!isAdmin}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-blue-500 text-white rounded-xl px-3 py-2 text-xs outline-none"
                    >
                      <option value="ADMIN">Super Admin (All Permissions)</option>
                      <option value="DEPARTMENT_HEAD">Department Head</option>
                      <option value="MANAGER">Department Manager</option>
                      <option value="HR_MANAGER">HR Manager</option>
                      <option value="FINANCE_DIRECTOR">Finance Director</option>
                      <option value="PROJECT_LEAD">Project Lead</option>
                      <option value="EMPLOYEE">Standard Staff / Employee</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Assigned Department
                    </label>
                    <select
                      value={department}
                      onChange={(e) => {
                        setDepartment(e.target.value);
                        if (activeRole === 'DEPARTMENT_HEAD') {
                          setRoleTitle(`Head of ${e.target.value}`);
                        } else if (activeRole === 'MANAGER') {
                          setRoleTitle(`${e.target.value} Manager`);
                        }
                      }}
                      disabled={!isAdmin}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-blue-500 text-white rounded-xl px-3 py-2 text-xs outline-none"
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Custom Role Title
                    </label>
                    <input
                      type="text"
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                      disabled={!isAdmin}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-blue-500 text-white rounded-xl px-3 py-2 text-xs outline-none"
                      placeholder="e.g. Head of Engineering"
                    />
                  </div>
                </div>

                {/* Scope Enforcer Toggle */}
                <div className="bg-neutral-950/70 border border-neutral-800 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-blue-400" />
                      Department Scope Boundary
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      When enabled, this leader's management permissions only apply to items belonging to{' '}
                      <strong className="text-white">{department}</strong>.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.departmentScoped}
                      onChange={() => handleTogglePermission('departmentScoped')}
                      disabled={!isAdmin || activeRole === 'ADMIN'}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Granular Permission Checklist */}
                <div>
                  <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-400" />
                    Granular Department Authorization Toggles
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      { key: 'canManageEmployees', label: 'Manage Employees & Enrollment', desc: 'Can add, edit, or terminate departmental staff' },
                      { key: 'canApprovePayroll', label: 'Approve Payroll & Compensation', desc: 'Can verify earnings, deductions, and approve batch runs' },
                      { key: 'canManageProjects', label: 'Manage Agile Projects & Sprints', desc: 'Can create tasks, update kanban boards, and milestones' },
                      { key: 'canApproveEngineering', label: 'Approve Engineering Job Cards', desc: 'Can sign off on mechanical, electrical & automation job cards' },
                      { key: 'canManageFinance', label: 'Finance & Expense Claims', desc: 'Can view ledgers and approve expense claims' },
                      { key: 'canManageProcurement', label: 'Procurement & Fleet Orders', desc: 'Can approve purchase orders and schedule vehicle trips' },
                      { key: 'canManageIT', label: 'IT Systems & Ticket Resolution', desc: 'Can assign IT tickets, manage devices, and software licenses' },
                      { key: 'canViewAuditLogs', label: 'View System Audit Logs', desc: 'Can audit operational history and access telemetry' },
                      { key: 'canEditDepartmentSettings', label: 'Edit Department Parameters', desc: 'Can configure department shifts and thresholds' },
                      { key: 'canManagePermissions', label: 'Manage User Permissions', desc: 'Can promote other users (Super Admin only)' },
                    ].map((item) => {
                      const isChecked = !!permissions[item.key as keyof DepartmentPermission];
                      const disabled = !isAdmin || (activeRole === 'ADMIN' && item.key !== 'departmentScoped');

                      return (
                        <div
                          key={item.key}
                          onClick={() => {
                            if (!disabled) handleTogglePermission(item.key as keyof DepartmentPermission);
                          }}
                          className={`p-2.5 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer select-none ${
                            isChecked
                              ? 'bg-blue-950/30 border-blue-600/40 text-white'
                              : 'bg-neutral-950/40 border-neutral-800/80 text-neutral-400 hover:border-neutral-700'
                          } ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                          <div
                            className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-colors shrink-0 ${
                              isChecked
                                ? 'bg-blue-600 border-blue-500 text-white'
                                : 'border-neutral-700 bg-neutral-900'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                          <div className="min-w-0">
                            <span className={`font-semibold block ${isChecked ? 'text-white' : 'text-neutral-300'}`}>
                              {item.label}
                            </span>
                            <span className="text-[10px] text-neutral-500 block leading-tight">
                              {item.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Save Banner & Actions */}
                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                  {savedSuccess ? (
                    <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                      <Check className="w-4 h-4" />
                      <span>Permissions &amp; Role successfully updated in database!</span>
                    </div>
                  ) : (
                    <span className="text-xs text-neutral-500">
                      Changes apply immediately to active session and offline storage.
                    </span>
                  )}

                  {isAdmin && (
                    <button
                      type="button"
                      id="btn-save-permissions"
                      onClick={handleSave}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Leader Permissions</span>
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center text-neutral-500">
                Select an account on the left to configure their leadership permissions.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
