import { UserRole } from './erp';

export interface DepartmentPermission {
  canManageEmployees: boolean;
  canApprovePayroll: boolean;
  canManageProjects: boolean;
  canApproveEngineering: boolean;
  canManageFinance: boolean;
  canManageProcurement: boolean;
  canManageIT: boolean;
  canViewAuditLogs: boolean;
  canManagePermissions: boolean;
  canEditDepartmentSettings: boolean;
  departmentScoped: boolean;
}

export const DEFAULT_ADMIN_PERMISSIONS: DepartmentPermission = {
  canManageEmployees: true,
  canApprovePayroll: true,
  canManageProjects: true,
  canApproveEngineering: true,
  canManageFinance: true,
  canManageProcurement: true,
  canManageIT: true,
  canViewAuditLogs: true,
  canManagePermissions: true,
  canEditDepartmentSettings: true,
  departmentScoped: false,
};

export const DEFAULT_HEAD_PERMISSIONS: DepartmentPermission = {
  canManageEmployees: true,
  canApprovePayroll: false,
  canManageProjects: true,
  canApproveEngineering: true,
  canManageFinance: false,
  canManageProcurement: true,
  canManageIT: true,
  canViewAuditLogs: true,
  canManagePermissions: false,
  canEditDepartmentSettings: true,
  departmentScoped: true,
};

export const DEFAULT_MANAGER_PERMISSIONS: DepartmentPermission = {
  canManageEmployees: true,
  canApprovePayroll: false,
  canManageProjects: true,
  canApproveEngineering: false,
  canManageFinance: false,
  canManageProcurement: false,
  canManageIT: false,
  canViewAuditLogs: false,
  canManagePermissions: false,
  canEditDepartmentSettings: false,
  departmentScoped: true,
};

export const DEFAULT_EMPLOYEE_PERMISSIONS: DepartmentPermission = {
  canManageEmployees: false,
  canApprovePayroll: false,
  canManageProjects: false,
  canApproveEngineering: false,
  canManageFinance: false,
  canManageProcurement: false,
  canManageIT: false,
  canViewAuditLogs: false,
  canManagePermissions: false,
  canEditDepartmentSettings: false,
  departmentScoped: true,
};

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  department: string;
  avatar: string;
  isFirstAdmin?: boolean;
  authProvider: 'email' | 'google';
  passwordHash?: string;
  assignedDepartments?: string[];
  permissions: DepartmentPermission;
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserAccount | null;
  accounts: UserAccount[];
  token?: string;
}
