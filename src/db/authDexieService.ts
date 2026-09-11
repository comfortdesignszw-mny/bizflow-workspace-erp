import {
  UserAccount,
  DepartmentPermission,
  DEFAULT_ADMIN_PERMISSIONS,
  DEFAULT_HEAD_PERMISSIONS,
  DEFAULT_MANAGER_PERMISSIONS,
  DEFAULT_EMPLOYEE_PERMISSIONS,
  ReturningUserProfile,
  SignUpAccountType,
} from '../types/auth';
import { UserRole } from '../types/erp';
import { db } from './erpDexieDb';

const ACCOUNTS_STORAGE_KEY = 'bizflow_erp_accounts_v1';
const SESSION_STORAGE_KEY = 'bizflow_erp_auth_session_v1';
const RETURNING_USER_STORAGE_KEY = 'bizflow_erp_returning_user_v1';

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

  // Retrieve all registered accounts from Dexie IndexedDB, local storage, and backend API
  public async getAccounts(): Promise<UserAccount[]> {
    try {
      // 1. Primary: Dexie IndexedDB
      if (db.users) {
        try {
          const dexieUsers = await db.users.toArray();
          if (Array.isArray(dexieUsers) && dexieUsers.length > 0) {
            // Keep localStorage in sync
            localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(dexieUsers));
            return dexieUsers;
          }
        } catch (dexieErr) {
          console.warn('[AuthService] Dexie users read error:', dexieErr);
        }
      }

      // 2. Secondary: LocalStorage
      const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UserAccount[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Sync back to Dexie if possible
          if (db.users) {
            try {
              await db.users.bulkPut(parsed);
            } catch {}
          }
          return parsed;
        }
      }

      // 3. Fallback: Backend API
      try {
        const res = await fetch('/api/auth/users');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.users) && data.users.length > 0) {
            await this.persistAccounts(data.users);
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

  public async persistAccounts(accounts: UserAccount[]): Promise<void> {
    try {
      // 1. LocalStorage
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));

      // 2. Dexie IndexedDB
      if (db.users) {
        try {
          await db.users.clear();
          if (accounts.length > 0) {
            await db.users.bulkPut(accounts);
          }
        } catch (dexieErr) {
          console.warn('[AuthService] Dexie users write error:', dexieErr);
        }
      }

      // 3. Notify backend if online
      fetch('/api/auth/sync-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accounts }),
      }).catch(() => {});
    } catch (e) {
      console.warn('[AuthService] Failed to persist accounts:', e);
    }
  }

  // Active Session Management (persisted so users returning are automatically logged in)
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
        this.setLastReturningUser(user);
      } else {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('[AuthService] Failed to set session:', e);
    }
  }

  // Returning user profile memory (detects user even if logged out or on device return)
  public getLastReturningUser(): ReturningUserProfile | null {
    try {
      const raw = localStorage.getItem(RETURNING_USER_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as ReturningUserProfile;
    } catch {
      return null;
    }
  }

  public setLastReturningUser(user: UserAccount | null): void {
    try {
      if (user) {
        const profile: ReturningUserProfile = {
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          roleTitle: user.roleTitle,
          department: user.department,
          authProvider: user.authProvider,
          lastSeenAt: new Date().toISOString(),
        };
        localStorage.setItem(RETURNING_USER_STORAGE_KEY, JSON.stringify(profile));
      }
    } catch (e) {
      console.warn('[AuthService] Failed to store returning user:', e);
    }
  }

  public clearReturningUser(): void {
    try {
      localStorage.removeItem(RETURNING_USER_STORAGE_KEY);
    } catch {}
  }

  // Register with Email and Password
  // Password is STRICTLY required. First user automatically becomes Super Admin.
  // Subsequent users choose their Account Type (Head of Department or Employee) and Department.
  public async register(
    name: string,
    email: string,
    password: string,
    department: string = 'Engineering',
    accountType: SignUpAccountType = 'EMPLOYEE'
  ): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    const normalizedEmail = email.trim().toLowerCase();

    // Strict password validation
    if (!password || !password.trim()) {
      return { success: false, error: 'Password is required to create an account.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const accounts = await this.getAccounts();

    if (accounts.some(a => a.email.toLowerCase() === normalizedEmail)) {
      return { success: false, error: 'An account with this email address already exists. Please sign in instead.' };
    }

    const hashedPassword = await hashPassword(password);
    const isFirstAccount = accounts.length === 0 || !accounts.some(a => a.role === 'ADMIN');

    let role: UserRole;
    let roleTitle: string;
    let permissions: DepartmentPermission;
    let assignedDepartments: string[];
    let userDepartment: string;

    if (isFirstAccount) {
      // First user is automatically elevated to Super Administrator
      role = 'ADMIN';
      roleTitle = 'Super Administrator / System Owner';
      userDepartment = department || 'Executive Leadership';
      permissions = { ...DEFAULT_ADMIN_PERMISSIONS };
      assignedDepartments = ['ALL'];
    } else if (accountType === 'DEPARTMENT_HEAD') {
      // Subsequent user registering as Head of Department
      role = 'DEPARTMENT_HEAD';
      roleTitle = `Head of ${department}`;
      userDepartment = department;
      permissions = { ...DEFAULT_HEAD_PERMISSIONS };
      assignedDepartments = [department];
    } else {
      // Subsequent user registering as Employee
      role = 'EMPLOYEE';
      roleTitle = `${department} Specialist`;
      userDepartment = department;
      permissions = { ...DEFAULT_EMPLOYEE_PERMISSIONS };
      assignedDepartments = [department];
    }

    const newUser: UserAccount = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: name.trim(),
      email: normalizedEmail,
      role,
      roleTitle,
      department: userDepartment,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`,
      isFirstAdmin: isFirstAccount,
      authProvider: 'email',
      passwordHash: hashedPassword,
      assignedDepartments,
      permissions,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    const updated = [...accounts, newUser];
    await this.persistAccounts(updated);
    this.setSession(newUser);

    return { success: true, user: newUser };
  }

  // Login with Email and Password
  // Password is STRICTLY required
  public async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    const normalizedEmail = email.trim().toLowerCase();

    // Strict password validation
    if (!password || !password.trim()) {
      return { success: false, error: 'Password is required to sign in.' };
    }

    const accounts = await this.getAccounts();

    if (accounts.length === 0) {
      return {
        success: false,
        error: 'No registered accounts found in the database. Please create an account to get started.',
      };
    }

    const account = accounts.find(a => a.email.toLowerCase() === normalizedEmail);
    if (!account) {
      return { success: false, error: 'No account found with this email. Please check your spelling or register.' };
    }

    if (account.authProvider === 'google' && !account.passwordHash) {
      return {
        success: false,
        error: 'This account was created with Google. Please click "Continue with Google Account" to sign in.',
      };
    }

    const hashedPassword = await hashPassword(password);
    if (account.passwordHash && account.passwordHash !== hashedPassword) {
      return { success: false, error: 'Incorrect password. Please verify your credentials and try again.' };
    }

    // Update last login & persist
    account.lastLoginAt = new Date().toISOString();
    await this.persistAccounts(accounts);
    this.setSession(account);

    return { success: true, user: account };
  }

  // Login or Register via Google Account (automatic sign-in, no password required)
  public async loginWithGoogle(
    profile: {
      email: string;
      name: string;
      avatar?: string;
    },
    department: string = 'Engineering',
    accountType: SignUpAccountType = 'EMPLOYEE'
  ): Promise<{ success: boolean; user: UserAccount }> {
    const normalizedEmail = profile.email.trim().toLowerCase();
    const accounts = await this.getAccounts();
    const existing = accounts.find(a => a.email.toLowerCase() === normalizedEmail);

    if (existing) {
      existing.lastLoginAt = new Date().toISOString();
      if (profile.avatar) existing.avatar = profile.avatar;
      await this.persistAccounts(accounts);
      this.setSession(existing);
      return { success: true, user: existing };
    }

    // New Google User
    const isFirstAccount = accounts.length === 0 || !accounts.some(a => a.role === 'ADMIN');
    let role: UserRole;
    let roleTitle: string;
    let permissions: DepartmentPermission;
    let assignedDepartments: string[];
    let userDepartment: string;

    if (isFirstAccount) {
      // First Google user automatically elevated to Super Administrator
      role = 'ADMIN';
      roleTitle = 'Super Administrator / System Owner';
      userDepartment = 'Executive Leadership';
      permissions = { ...DEFAULT_ADMIN_PERMISSIONS };
      assignedDepartments = ['ALL'];
    } else if (accountType === 'DEPARTMENT_HEAD') {
      role = 'DEPARTMENT_HEAD';
      roleTitle = `Head of ${department}`;
      userDepartment = department;
      permissions = { ...DEFAULT_HEAD_PERMISSIONS };
      assignedDepartments = [department];
    } else {
      role = 'EMPLOYEE';
      roleTitle = `${department} Specialist`;
      userDepartment = department;
      permissions = { ...DEFAULT_EMPLOYEE_PERMISSIONS };
      assignedDepartments = [department];
    }

    const newUser: UserAccount = {
      id: `usr-g-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: profile.name.trim() || normalizedEmail.split('@')[0],
      email: normalizedEmail,
      role,
      roleTitle,
      department: userDepartment,
      avatar: profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.name || normalizedEmail)}`,
      isFirstAdmin: isFirstAccount,
      authProvider: 'google',
      assignedDepartments,
      permissions,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    const updated = [...accounts, newUser];
    await this.persistAccounts(updated);
    this.setSession(newUser);

    return { success: true, user: newUser };
  }

  // Admin Promotion: Elevate any user to Super Admin
  public async promoteToAdmin(userId: string): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    return this.updateUserPermissions(userId, {
      role: 'ADMIN',
      roleTitle: 'Super Administrator',
      department: 'Executive Leadership',
      assignedDepartments: ['ALL'],
      permissions: { ...DEFAULT_ADMIN_PERMISSIONS },
    });
  }

  // Admin Promotion: Elevate any user to Head of Department
  public async promoteToDepartmentHead(
    userId: string,
    department: string
  ): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    return this.updateUserPermissions(userId, {
      role: 'DEPARTMENT_HEAD',
      roleTitle: `Head of ${department}`,
      department,
      assignedDepartments: [department],
      permissions: { ...DEFAULT_HEAD_PERMISSIONS },
    });
  }

  // Admin Demotion: Set user as Department Employee
  public async demoteToEmployee(
    userId: string,
    department?: string
  ): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    const accounts = await this.getAccounts();
    const target = accounts.find(a => a.id === userId);
    if (!target) return { success: false, error: 'User not found.' };

    const dept = department || target.department || 'Engineering';
    return this.updateUserPermissions(userId, {
      role: 'EMPLOYEE',
      roleTitle: `${dept} Specialist`,
      department: dept,
      assignedDepartments: [dept],
      permissions: { ...DEFAULT_EMPLOYEE_PERMISSIONS },
    });
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

    await this.persistAccounts(accounts);

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
    await this.persistAccounts(updated);

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

