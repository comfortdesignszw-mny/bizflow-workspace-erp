import {
  UserAccount,
  DepartmentPermission,
  DEFAULT_ADMIN_PERMISSIONS,
  DEFAULT_HEAD_PERMISSIONS,
  DEFAULT_MANAGER_PERMISSIONS,
  DEFAULT_EMPLOYEE_PERMISSIONS,
} from '../types/auth';
import { UserRole } from '../types/erp';

const ACCOUNTS_STORAGE_KEY = 'bizflow_erp_accounts_v1';
const SESSION_STORAGE_KEY = 'bizflow_erp_auth_session_v1';

// Helper to hash password locally (simple SHA-256 via crypto.subtle or fallback)
async function hashPassword(password: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const msgUint8 = new TextEncoder().encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback below
    }
  }
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(16);
}

export class AuthService {
  private static instance: AuthService;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Retrieve all registered accounts from local storage and backend sync
  public async getAccounts(): Promise<UserAccount[]> {
    try {
      const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UserAccount[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }

      // Try fetching from backend API if available
      try {
        const res = await fetch('/api/auth/users');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.users) && data.users.length > 0) {
            this.persistAccounts(data.users);
            return data.users;
          }
        }
      } catch {
        // Backend offline, fallback to empty
      }

      return [];
    } catch (e) {
      console.warn('[AuthService] Error reading accounts:', e);
      return [];
    }
  }

  public persistAccounts(accounts: UserAccount[]): void {
    try {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
      // Notify backend if online
      fetch('/api/auth/sync-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accounts }),
      }).catch(() => {});
    } catch (e) {
      console.warn('[AuthService] Failed to persist accounts:', e);
    }
  }

  public getSession(): UserAccount | null {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as UserAccount;
    } catch {
      return null;
    }
  }

  public setSession(user: UserAccount | null): void {
    try {
      if (user) {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('[AuthService] Failed to set session:', e);
    }
  }

  // Register with Email and Password
  public async register(
    name: string,
    email: string,
    password: string,
    department: string = 'Executive'
  ): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    const accounts = await this.getAccounts();

    if (accounts.some(a => a.email.toLowerCase() === normalizedEmail)) {
      return { success: false, error: 'An account with this email address already exists. Please sign in instead.' };
    }

    const hashedPassword = await hashPassword(password);
    const isFirstAccount = accounts.length === 0 || !accounts.some(a => a.role === 'ADMIN');

    const role: UserRole = isFirstAccount ? 'ADMIN' : 'EMPLOYEE';
    const roleTitle = isFirstAccount
      ? 'Super Administrator / Owner'
      : `${department} Staff Specialist`;
    const permissions: DepartmentPermission = isFirstAccount
      ? { ...DEFAULT_ADMIN_PERMISSIONS }
      : { ...DEFAULT_EMPLOYEE_PERMISSIONS };

    const newUser: UserAccount = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: name.trim(),
      email: normalizedEmail,
      role,
      roleTitle,
      department: isFirstAccount ? 'Executive Leadership' : department,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`,
      isFirstAdmin: isFirstAccount,
      authProvider: 'email',
      passwordHash: hashedPassword,
      assignedDepartments: isFirstAccount ? ['ALL'] : [department],
      permissions,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    const updated = [...accounts, newUser];
    this.persistAccounts(updated);
    this.setSession(newUser);

    return { success: true, user: newUser };
  }

  // Login with Email and Password
  public async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    const accounts = await this.getAccounts();

    // If no accounts exist yet, prompt them to register or auto-bootstrap as first admin
    if (accounts.length === 0) {
      return {
        success: false,
        error: 'No accounts registered yet. The first user to register will automatically become the Super Administrator.',
      };
    }

    const account = accounts.find(a => a.email.toLowerCase() === normalizedEmail);
    if (!account) {
      return { success: false, error: 'No account found with this email. Please check your spelling or register.' };
    }

    const hashedPassword = await hashPassword(password);
    if (account.passwordHash && account.passwordHash !== hashedPassword) {
      return { success: false, error: 'Incorrect password. Please verify your credentials and try again.' };
    }

    // Update last login
    account.lastLoginAt = new Date().toISOString();
    this.persistAccounts(accounts);
    this.setSession(account);

    return { success: true, user: account };
  }

  // Login or Register via Google Account
  public async loginWithGoogle(profile: {
    email: string;
    name: string;
    avatar?: string;
  }): Promise<{ success: boolean; user: UserAccount }> {
    const normalizedEmail = profile.email.trim().toLowerCase();
    const accounts = await this.getAccounts();
    const existing = accounts.find(a => a.email.toLowerCase() === normalizedEmail);

    if (existing) {
      existing.lastLoginAt = new Date().toISOString();
      if (profile.avatar) existing.avatar = profile.avatar;
      this.persistAccounts(accounts);
      this.setSession(existing);
      return { success: true, user: existing };
    }

    // New Google User
    const isFirstAccount = accounts.length === 0 || !accounts.some(a => a.role === 'ADMIN');
    const role: UserRole = isFirstAccount ? 'ADMIN' : 'EMPLOYEE';
    const roleTitle = isFirstAccount
      ? 'Super Administrator / Owner'
      : 'Operations Specialist';
    const permissions: DepartmentPermission = isFirstAccount
      ? { ...DEFAULT_ADMIN_PERMISSIONS }
      : { ...DEFAULT_EMPLOYEE_PERMISSIONS };

    const newUser: UserAccount = {
      id: `usr-g-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: profile.name.trim() || normalizedEmail.split('@')[0],
      email: normalizedEmail,
      role,
      roleTitle,
      department: isFirstAccount ? 'Executive Leadership' : 'General Operations',
      avatar: profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.name || normalizedEmail)}`,
      isFirstAdmin: isFirstAccount,
      authProvider: 'google',
      assignedDepartments: isFirstAccount ? ['ALL'] : ['General Operations'],
      permissions,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    const updated = [...accounts, newUser];
    this.persistAccounts(updated);
    this.setSession(newUser);

    return { success: true, user: newUser };
  }

  // Update a user's role, department, or granular permissions (Admin action)
  public async updateUserPermissions(
    userId: string,
    updates: {
      role?: UserRole;
      roleTitle?: string;
      department?: string;
      assignedDepartments?: string[];
      permissions?: Partial<DepartmentPermission>;
    }
  ): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    const accounts = await this.getAccounts();
    const target = accounts.find(a => a.id === userId);

    if (!target) {
      return { success: false, error: 'User account not found.' };
    }

    if (updates.role) {
      target.role = updates.role;
      // If promoting to head or manager, set default baseline permissions if not specified
      if (updates.role === 'ADMIN') {
        target.permissions = { ...DEFAULT_ADMIN_PERMISSIONS, ...(updates.permissions || {}) };
      } else if (updates.role === 'DEPARTMENT_HEAD') {
        target.permissions = { ...DEFAULT_HEAD_PERMISSIONS, ...(updates.permissions || {}) };
      } else if (updates.role === 'MANAGER') {
        target.permissions = { ...DEFAULT_MANAGER_PERMISSIONS, ...(updates.permissions || {}) };
      } else {
        target.permissions = { ...DEFAULT_EMPLOYEE_PERMISSIONS, ...(updates.permissions || {}) };
      }
    }

    if (updates.roleTitle) target.roleTitle = updates.roleTitle;
    if (updates.department) target.department = updates.department;
    if (updates.assignedDepartments) target.assignedDepartments = updates.assignedDepartments;
    if (updates.permissions) {
      target.permissions = { ...target.permissions, ...updates.permissions };
    }

    this.persistAccounts(accounts);

    // If updating current logged in user session, refresh session
    const currentSession = this.getSession();
    if (currentSession && currentSession.id === userId) {
      this.setSession(target);
    }

    return { success: true, user: target };
  }

  // Delete an account (Admin only, cannot delete first admin)
  public async deleteAccount(userId: string): Promise<{ success: boolean; error?: string }> {
    const accounts = await this.getAccounts();
    const target = accounts.find(a => a.id === userId);

    if (!target) {
      return { success: false, error: 'User not found.' };
    }

    if (target.isFirstAdmin) {
      return { success: false, error: 'The primary system administrator account cannot be deleted.' };
    }

    const updated = accounts.filter(a => a.id !== userId);
    this.persistAccounts(updated);

    const currentSession = this.getSession();
    if (currentSession && currentSession.id === userId) {
      this.setSession(null);
    }

    return { success: true };
  }

  public logout(): void {
    this.setSession(null);
  }
}

export const authService = AuthService.getInstance();
