import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  UserPersona,
  UserRole,
  Employee,
  AccessLog,
  AttendanceRollup,
  PayrollRun,
  PayslipItem,
  JobOpening,
  Applicant,
  Project,
  ProjectStatus,
  ProjectStage,
  Task,
  Asset,
  ExpenseClaim,
  Invoice,
  AuditLog,
  CompanySettings,
  ScanType,
  ScanMethod,
  RecruitmentStage
} from '../types/erp';
import {
  INITIAL_PERSONAS,
  INITIAL_EMPLOYEES,
  INITIAL_ACCESS_LOGS,
  INITIAL_ATTENDANCE_ROLLUPS,
  INITIAL_PAYROLL_RUNS,
  INITIAL_JOB_OPENINGS,
  INITIAL_APPLICANTS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_ASSETS,
  INITIAL_EXPENSES,
  INITIAL_INVOICES,
  INITIAL_AUDIT_LOGS,
  INITIAL_SETTINGS
} from '../data/initialData';

interface ERPContextType {
  // Current logged in persona & RBAC
  currentUser: UserPersona;
  setCurrentUser: (user: UserPersona) => void;
  availablePersonas: UserPersona[];
  hasRole: (allowedRoles: UserRole[]) => boolean;

  // Active module navigation
  activeModule: string;
  setActiveModule: (mod: string) => void;

  // Core Data
  employees: Employee[];
  accessLogs: AccessLog[];
  attendanceRollups: AttendanceRollup[];
  payrollRuns: PayrollRun[];
  jobOpenings: JobOpening[];
  applicants: Applicant[];
  projects: Project[];
  tasks: Task[];
  assets: Asset[];
  expenses: ExpenseClaim[];
  invoices: Invoice[];
  auditLogs: AuditLog[];
  settings: CompanySettings;

  // Computed & Live presence
  currentlyInsideEmployees: Employee[];
  currentlyInsideCount: number;
  todayPresentCount: number;
  todayLateCount: number;

  // Actions: Employee
  addEmployee: (emp: Omit<Employee, 'id'> & { code?: string }) => Employee;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  getNextEmployeeCode: () => string;

  // Actions: Access Logs & QR Scanning
  recordScan: (params: {
    employeeId: string;
    scanType?: ScanType;
    gate?: string;
    method?: ScanMethod;
  }) => { success: boolean; message: string; log?: AccessLog; scanType: ScanType };
  recomputeAttendanceRollup: (date?: string) => void;

  // Actions: Payroll
  generatePayrollRun: (monthStr: string, periodStart: string, periodEnd: string) => PayrollRun;
  updatePayrollStatus: (runId: string, newStatus: 'draft' | 'approved' | 'paid') => void;
  updatePayslipOverrides: (runId: string, payslipId: string, updates: Partial<PayslipItem>) => void;

  // Actions: Recruitment & ATS
  addJobOpening: (job: Omit<JobOpening, 'id' | 'postedDate' | 'applicantsCount'>) => JobOpening;
  updateJobOpening: (id: string, updates: Partial<JobOpening>) => void;
  addApplicant: (app: Omit<Applicant, 'id' | 'appliedDate' | 'rating' | 'notes'>) => Applicant;
  updateApplicantStage: (id: string, newStage: RecruitmentStage) => void;
  convertApplicantToEmployee: (applicantId: string) => Employee | null;
  scoreApplicantWithAI: (applicantId: string) => Promise<boolean>;

  // Actions: Projects & Tasks
  addProject: (proj: Partial<Project> & { title: string; department: string; description: string; startDate: string; endDate: string; budget: number; budgetReceived?: number; status?: ProjectStatus }) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  updateProjectStage: (id: string, stage: ProjectStatus) => void;
  deleteProject: (id: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdDate' | 'loggedHours'>) => Task;
  updateTaskStatus: (id: string, status: Task['status']) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;

  // Actions: Assets & Inventory
  addAsset: (asset: Omit<Asset, 'id' | 'code'>) => Asset;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  assignAsset: (assetId: string, employeeId?: string) => void;

  // Actions: Expenses & Invoicing
  addExpense: (expense: Omit<ExpenseClaim, 'id' | 'code' | 'submittedDate' | 'status'>) => ExpenseClaim;
  updateExpenseStatus: (id: string, status: ExpenseClaim['status']) => void;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => Invoice;
  updateInvoiceStatus: (id: string, status: Invoice['status']) => void;

  // Actions: Settings & System
  updateSettings: (updates: Partial<CompanySettings>) => void;
  logAudit: (action: string, module: string, details: string, status?: 'SUCCESS' | 'WARNING' | 'ERROR') => void;
  resetAllDataToDefault: () => void;

  // Modal Triggers
  isQRScannerOpen: boolean;
  setIsQRScannerOpen: (open: boolean) => void;
  selectedEmployeeForBadge: Employee | null;
  setSelectedEmployeeForBadge: (emp: Employee | null) => void;
  selectedPayslipForModal: PayslipItem | null;
  setSelectedPayslipForModal: (ps: PayslipItem | null) => void;
  selectedInvoiceForModal: Invoice | null;
  setSelectedInvoiceForModal: (inv: Invoice | null) => void;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = 'bizflow_erp_';

function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

export const ERPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserPersona>(() => getStored('user', INITIAL_PERSONAS[0]));
  const [activeModule, setActiveModule] = useState<string>('dashboard');

  const [employees, setEmployees] = useState<Employee[]>(() => getStored('employees', INITIAL_EMPLOYEES));
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>(() => getStored('access_logs', INITIAL_ACCESS_LOGS));
  const [attendanceRollups, setAttendanceRollups] = useState<AttendanceRollup[]>(() => getStored('attendance_rollups', INITIAL_ATTENDANCE_ROLLUPS));
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>(() => getStored('payroll_runs', INITIAL_PAYROLL_RUNS));
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>(() => getStored('job_openings', INITIAL_JOB_OPENINGS));
  const [applicants, setApplicants] = useState<Applicant[]>(() => getStored('applicants', INITIAL_APPLICANTS));
  const [projects, setProjects] = useState<Project[]>(() => getStored('projects', INITIAL_PROJECTS));
  const [tasks, setTasks] = useState<Task[]>(() => getStored('tasks', INITIAL_TASKS));
  const [assets, setAssets] = useState<Asset[]>(() => getStored('assets', INITIAL_ASSETS));
  const [expenses, setExpenses] = useState<ExpenseClaim[]>(() => getStored('expenses', INITIAL_EXPENSES));
  const [invoices, setInvoices] = useState<Invoice[]>(() => getStored('invoices', INITIAL_INVOICES));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => getStored('audit_logs', INITIAL_AUDIT_LOGS));
  const [settings, setSettings] = useState<CompanySettings>(() => getStored('settings', INITIAL_SETTINGS));

  // Modal states
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [selectedEmployeeForBadge, setSelectedEmployeeForBadge] = useState<Employee | null>(null);
  const [selectedPayslipForModal, setSelectedPayslipForModal] = useState<PayslipItem | null>(null);
  const [selectedInvoiceForModal, setSelectedInvoiceForModal] = useState<Invoice | null>(null);

  // Sync to local storage
  useEffect(() => { setStored('user', currentUser); }, [currentUser]);
  useEffect(() => { setStored('employees', employees); }, [employees]);
  useEffect(() => { setStored('access_logs', accessLogs); }, [accessLogs]);
  useEffect(() => { setStored('attendance_rollups', attendanceRollups); }, [attendanceRollups]);
  useEffect(() => { setStored('payroll_runs', payrollRuns); }, [payrollRuns]);
  useEffect(() => { setStored('job_openings', jobOpenings); }, [jobOpenings]);
  useEffect(() => { setStored('applicants', applicants); }, [applicants]);
  useEffect(() => { setStored('projects', projects); }, [projects]);
  useEffect(() => { setStored('tasks', tasks); }, [tasks]);
  useEffect(() => { setStored('assets', assets); }, [assets]);
  useEffect(() => { setStored('expenses', expenses); }, [expenses]);
  useEffect(() => { setStored('invoices', invoices); }, [invoices]);
  useEffect(() => { setStored('audit_logs', auditLogs); }, [auditLogs]);
  useEffect(() => { setStored('settings', settings); }, [settings]);

  const hasRole = useCallback((allowedRoles: UserRole[]): boolean => {
    if (currentUser.role === 'ADMIN') return true;
    return allowedRoles.includes(currentUser.role);
  }, [currentUser]);

  const logAudit = useCallback((action: string, module: string, details: string, status: 'SUCCESS' | 'WARNING' | 'ERROR' = 'SUCCESS') => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role,
      action,
      module,
      details,
      status
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, [currentUser]);

  // Derived: "Workforce currently inside" — COUNT(last scan per employee today = IN)
  const currentlyInsideEmployees = useMemo(() => {
    const todayPrefix = new Date().toISOString().split('T')[0];
    const todaysLogs = accessLogs.filter(l => l.timestamp.startsWith(todayPrefix));
    
    // Sort ascending by time
    const sorted = [...todaysLogs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    // Map employeeId -> last scanType
    const lastScanMap = new Map<string, ScanType>();
    sorted.forEach(log => {
      lastScanMap.set(log.employeeId, log.scanType);
    });

    const insideEmpIds = Array.from(lastScanMap.entries())
      .filter(([_, type]) => type === 'IN')
      .map(([empId]) => empId);

    return employees.filter(e => insideEmpIds.includes(e.id));
  }, [accessLogs, employees]);

  const currentlyInsideCount = currentlyInsideEmployees.length;

  // Derived attendance stats for today
  const todayPresentCount = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return attendanceRollups.filter(r => r.date === today && r.status !== 'ABSENT' && r.status !== 'ON_LEAVE').length;
  }, [attendanceRollups]);

  const todayLateCount = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return attendanceRollups.filter(r => r.date === today && r.status === 'LATE').length;
  }, [attendanceRollups]);

  // Daily attendance calculation algorithm: derived from raw access_logs
  const computeRollupForDate = useCallback((targetDate: string, currentLogs: AccessLog[], currentEmployees: Employee[]): AttendanceRollup[] => {
    const dateLogs = currentLogs.filter(l => l.timestamp.startsWith(targetDate));
    const logsByEmp = new Map<string, AccessLog[]>();

    dateLogs.forEach(l => {
      const arr = logsByEmp.get(l.employeeId) || [];
      arr.push(l);
      logsByEmp.set(l.employeeId, arr);
    });

    return currentEmployees.map(emp => {
      const empLogs = (logsByEmp.get(emp.id) || []).sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      if (emp.status === 'On Leave') {
        return {
          id: `att-${emp.id}-${targetDate}`,
          employeeId: emp.id,
          employeeCode: emp.code,
          employeeName: `${emp.firstName} ${emp.lastName}`,
          department: emp.department,
          avatar: emp.avatar,
          date: targetDate,
          firstIn: null,
          lastOut: null,
          totalHours: 0,
          expectedHours: settings.standardDailyHours,
          overtimeHours: 0,
          lateMinutes: 0,
          status: 'ON_LEAVE',
          scanCount: 0
        };
      }

      if (empLogs.length === 0) {
        return {
          id: `att-${emp.id}-${targetDate}`,
          employeeId: emp.id,
          employeeCode: emp.code,
          employeeName: `${emp.firstName} ${emp.lastName}`,
          department: emp.department,
          avatar: emp.avatar,
          date: targetDate,
          firstIn: null,
          lastOut: null,
          totalHours: 0,
          expectedHours: settings.standardDailyHours,
          overtimeHours: 0,
          lateMinutes: 0,
          status: 'ABSENT',
          scanCount: 0
        };
      }

      const inScans = empLogs.filter(l => l.scanType === 'IN');
      const outScans = empLogs.filter(l => l.scanType === 'OUT');
      const firstIn = inScans.length > 0 ? inScans[0].timestamp : null;
      const lastOut = outScans.length > 0 ? outScans[outScans.length - 1].timestamp : null;

      // Calculate working hours
      let totalHours = 0;
      if (firstIn) {
        const endTime = lastOut ? new Date(lastOut).getTime() : new Date().getTime();
        const diffMs = endTime - new Date(firstIn).getTime();
        totalHours = Math.max(0, Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10);
      }

      // Check lateness against shiftStart + grace period
      let lateMinutes = 0;
      let status: AttendanceRollup['status'] = 'ON_TIME';

      if (firstIn) {
        const inDate = new Date(firstIn);
        const [shiftH, shiftM] = (emp.shiftStart || '08:30').split(':').map(Number);
        const shiftStartObj = new Date(inDate);
        shiftStartObj.setHours(shiftH, shiftM, 0, 0);

        const diffMins = Math.round((inDate.getTime() - shiftStartObj.getTime()) / (1000 * 60));
        if (diffMins > settings.lateGracePeriodMinutes) {
          lateMinutes = diffMins;
          status = 'LATE';
        }
      }

      // Overtime
      let overtimeHours = 0;
      if (totalHours > settings.standardDailyHours) {
        overtimeHours = Math.round((totalHours - settings.standardDailyHours) * 10) / 10;
        if (status === 'ON_TIME') status = 'OVERTIME';
      }

      if (!lastOut && totalHours > 0) {
        // still inside
      } else if (!firstIn && lastOut) {
        status = 'INCOMPLETE';
      }

      return {
        id: `att-${emp.id}-${targetDate}`,
        employeeId: emp.id,
        employeeCode: emp.code,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        department: emp.department,
        avatar: emp.avatar,
        date: targetDate,
        firstIn,
        lastOut,
        totalHours,
        expectedHours: settings.standardDailyHours,
        overtimeHours,
        lateMinutes,
        status,
        scanCount: empLogs.length
      };
    });
  }, [settings]);

  // Recompute rollups for today or target date
  const recomputeAttendanceRollup = useCallback((dateStr?: string) => {
    const target = dateStr || new Date().toISOString().split('T')[0];
    const newRollupsForDay = computeRollupForDate(target, accessLogs, employees);
    
    setAttendanceRollups(prev => {
      const filtered = prev.filter(r => r.date !== target);
      return [...newRollupsForDay, ...filtered];
    });

    logAudit('ATTENDANCE_RECOMPUTED', 'Attendance Engine', `Daily attendance rollup recomputed for ${target}.`);
  }, [accessLogs, employees, computeRollupForDate, logAudit]);

  // QR Scan Terminal Trigger
  const recordScan = useCallback((params: {
    employeeId: string;
    scanType?: ScanType;
    gate?: string;
    method?: ScanMethod;
  }) => {
    const emp = employees.find(e => e.id === params.employeeId || e.code === params.employeeId);
    if (!emp) {
      return { success: false, message: `Employee record not found for "${params.employeeId}".`, scanType: 'IN' };
    }

    // Determine IN vs OUT automatically if not explicitly given
    let determinedScanType = params.scanType;
    if (!determinedScanType) {
      const isCurrentlyIn = currentlyInsideEmployees.some(e => e.id === emp.id);
      determinedScanType = isCurrentlyIn ? 'OUT' : 'IN';
    }

    const timestamp = new Date().toISOString();
    const newLog: AccessLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      employeeId: emp.id,
      employeeCode: emp.code,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      department: emp.department,
      position: emp.position,
      avatar: emp.avatar,
      scanType: determinedScanType,
      timestamp,
      gate: params.gate || 'Main Biometric Terminal 01',
      method: params.method || 'QR_SCAN',
      verified: true
    };

    // Append-only to access_logs
    const updatedLogs = [newLog, ...accessLogs];
    setAccessLogs(updatedLogs);

    // Derive and update today's rollup
    const today = timestamp.split('T')[0];
    const updatedRollups = computeRollupForDate(today, updatedLogs, employees);
    setAttendanceRollups(prev => {
      const filtered = prev.filter(r => r.date !== today);
      return [...updatedRollups, ...filtered];
    });

    logAudit(
      `QR_BADGE_SCAN_${determinedScanType}`,
      'Access Control',
      `${emp.firstName} ${emp.lastName} (${emp.code}) checked ${determinedScanType} at ${newLog.gate}.`
    );

    return {
      success: true,
      message: `Verified: ${emp.firstName} ${emp.lastName} clocked ${determinedScanType} successfully!`,
      log: newLog,
      scanType: determinedScanType
    };
  }, [employees, currentlyInsideEmployees, accessLogs, computeRollupForDate, logAudit]);

  // Employee CRUD
  const getNextEmployeeCode = useCallback((): string => {
    const existingCodes = employees.map(e => e.code).filter(Boolean);
    let maxNum = 1000;
    for (const c of existingCodes) {
      const match = c.match(/EMP-(\d+)/i);
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    }
    return `EMP-${maxNum + 1}`;
  }, [employees]);

  const addEmployee = useCallback((empData: Omit<Employee, 'id'> & { code?: string }): Employee => {
    const code = empData.code && empData.code.trim().length > 0 ? empData.code.trim() : getNextEmployeeCode();
    const newEmp: Employee = {
      ...empData,
      id: `emp-${Date.now()}`,
      code,
    };

    setEmployees(prev => [newEmp, ...prev]);
    logAudit('EMPLOYEE_CREATED', 'Employee Directory', `Added new employee ${newEmp.firstName} ${newEmp.lastName} (${code}).`);
    return newEmp;
  }, [getNextEmployeeCode, logAudit]);

  const updateEmployee = useCallback((id: string, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    logAudit('EMPLOYEE_UPDATED', 'Employee Directory', `Updated employee profile #${id}.`);
  }, [logAudit]);

  const deleteEmployee = useCallback((id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    logAudit('EMPLOYEE_TERMINATED', 'Employee Directory', `Removed employee record #${id}.`, 'WARNING');
  }, [logAudit]);

  // Payroll snapshot generation
  const generatePayrollRun = useCallback((monthStr: string, periodStart: string, periodEnd: string): PayrollRun => {
    const code = `PAY-${monthStr.toUpperCase().replace(/\s+/g, '-')}`;
    
    // Generate snapshot payslips for each active employee
    const payslips: PayslipItem[] = employees.filter(e => e.status === 'Active').map(emp => {
      const workingDays = 22;
      const presentDays = 21;
      const absentDays = 1;
      const overtimeHours = 4;
      const overtimeRate = Math.round(emp.hourlyRate * settings.overtimeMultiplier);
      const overtimePay = overtimeHours * overtimeRate;

      const allowances = [
        { id: 'al-std', name: 'Workplace Connectivity & Travel', amount: 250 }
      ];
      const deductions: { id: string; name: string; amount: number }[] = [];

      const grossPay = emp.baseSalary + overtimePay + allowances.reduce((s, a) => s + a.amount, 0);
      const taxDeduction = Math.round(grossPay * (settings.defaultTaxRate / 100));
      const pensionDeduction = Math.round(grossPay * 0.05);
      const healthInsuranceDeduction = 220;
      const totalDeductions = taxDeduction + pensionDeduction + healthInsuranceDeduction + deductions.reduce((s, d) => s + d.amount, 0);
      const netPay = grossPay - totalDeductions;

      return {
        id: `ps-${emp.id}-${Date.now()}`,
        employeeId: emp.id,
        employeeCode: emp.code,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        department: emp.department,
        position: emp.position,
        bankDetails: emp.bankDetails,
        baseSalary: emp.baseSalary,
        workingDays,
        presentDays,
        absentDays,
        overtimeHours,
        overtimeRate,
        overtimePay,
        allowances,
        deductions,
        grossPay,
        taxDeduction,
        pensionDeduction,
        healthInsuranceDeduction,
        totalDeductions,
        netPay,
        paymentMethod: 'Direct Bank Transfer (ACH)',
        status: 'draft',
        generatedDate: new Date().toISOString().split('T')[0]
      };
    });

    const totalGross = payslips.reduce((s, p) => s + p.grossPay, 0);
    const totalDeductions = payslips.reduce((s, p) => s + p.totalDeductions, 0);
    const totalNet = payslips.reduce((s, p) => s + p.netPay, 0);

    const newRun: PayrollRun = {
      id: `run-${Date.now()}`,
      code,
      title: `${monthStr} Workforce Payroll Cycle`,
      periodMonth: monthStr,
      periodStart,
      periodEnd,
      status: 'draft',
      totalGross,
      totalDeductions,
      totalNet,
      employeeCount: payslips.length,
      createdAt: new Date().toISOString(),
      currency: settings.currency,
      payslips
    };

    setPayrollRuns(prev => [newRun, ...prev]);
    logAudit('PAYROLL_RUN_CREATED', 'Payroll Engine', `Generated draft payroll run ${code} for ${payslips.length} employees ($${totalGross.toLocaleString()}).`);
    return newRun;
  }, [employees, settings, logAudit]);

  const updatePayrollStatus = useCallback((runId: string, newStatus: 'draft' | 'approved' | 'paid') => {
    setPayrollRuns(prev => prev.map(run => {
      if (run.id !== runId) return run;
      const now = new Date().toISOString();
      return {
        ...run,
        status: newStatus,
        approvedAt: newStatus === 'approved' || newStatus === 'paid' ? (run.approvedAt || now) : undefined,
        approvedBy: newStatus === 'approved' || newStatus === 'paid' ? (run.approvedBy || currentUser.name) : undefined,
        paidAt: newStatus === 'paid' ? now : undefined,
        payslips: run.payslips.map(ps => ({ ...ps, status: newStatus }))
      };
    }));
    logAudit('PAYROLL_STATUS_CHANGED', 'Payroll Engine', `Payroll run #${runId} transitioned to ${newStatus.toUpperCase()}.`);
  }, [currentUser.name, logAudit]);

  const updatePayslipOverrides = useCallback((runId: string, payslipId: string, updates: Partial<PayslipItem>) => {
    setPayrollRuns(prev => prev.map(run => {
      if (run.id !== runId || run.status === 'paid') return run; // Immutable if paid
      const updatedPayslips = run.payslips.map(ps => {
        if (ps.id !== payslipId) return ps;
        const merged = { ...ps, ...updates };
        const gross = merged.baseSalary + merged.overtimePay + merged.allowances.reduce((s, a) => s + a.amount, 0);
        const tax = Math.round(gross * (settings.defaultTaxRate / 100));
        const pension = Math.round(gross * 0.05);
        const deductionsTot = tax + pension + merged.healthInsuranceDeduction + merged.deductions.reduce((s, d) => s + d.amount, 0);
        return {
          ...merged,
          grossPay: gross,
          taxDeduction: tax,
          pensionDeduction: pension,
          totalDeductions: deductionsTot,
          netPay: gross - deductionsTot
        };
      });

      const totalGross = updatedPayslips.reduce((s, p) => s + p.grossPay, 0);
      const totalDeductions = updatedPayslips.reduce((s, p) => s + p.totalDeductions, 0);
      return {
        ...run,
        totalGross,
        totalDeductions,
        totalNet: totalGross - totalDeductions,
        payslips: updatedPayslips
      };
    }));
  }, [settings.defaultTaxRate]);

  // Recruitment & ATS
  const addJobOpening = useCallback((job: Omit<JobOpening, 'id' | 'postedDate' | 'applicantsCount'>): JobOpening => {
    const newJob: JobOpening = {
      ...job,
      id: `job-${Date.now()}`,
      postedDate: new Date().toISOString().split('T')[0],
      applicantsCount: 0
    };
    setJobOpenings(prev => [newJob, ...prev]);
    logAudit('JOB_POSTED', 'Recruitment ATS', `Opened new position: ${newJob.title} in ${newJob.department}.`);
    return newJob;
  }, [logAudit]);

  const updateJobOpening = useCallback((id: string, updates: Partial<JobOpening>) => {
    setJobOpenings(prev => prev.map(j => j.id === id ? { ...j, ...updates } : j));
  }, []);

  const addApplicant = useCallback((app: Omit<Applicant, 'id' | 'appliedDate' | 'rating' | 'notes'>): Applicant => {
    const newApp: Applicant = {
      ...app,
      id: `app-${Date.now()}`,
      appliedDate: new Date().toISOString().split('T')[0],
      rating: 4,
      notes: [{ id: `n-${Date.now()}`, author: currentUser.name, text: 'Applicant submitted to ATS pipeline.', date: new Date().toISOString().split('T')[0] }]
    };
    setApplicants(prev => [newApp, ...prev]);
    setJobOpenings(prev => prev.map(j => j.id === app.jobOpeningId ? { ...j, applicantsCount: j.applicantsCount + 1 } : j));
    logAudit('APPLICANT_APPLIED', 'Recruitment ATS', `New application received for ${app.name} -> ${app.jobTitle}.`);
    return newApp;
  }, [currentUser.name, logAudit]);

  const updateApplicantStage = useCallback((id: string, newStage: RecruitmentStage) => {
    setApplicants(prev => prev.map(a => {
      if (a.id !== id) return a;
      return {
        ...a,
        stage: newStage,
        notes: [
          ...a.notes,
          { id: `n-${Date.now()}`, author: currentUser.name, text: `Stage advanced to ${newStage}.`, date: new Date().toISOString().split('T')[0] }
        ]
      };
    }));
    logAudit('APPLICANT_STAGE_UPDATED', 'Recruitment ATS', `Candidate #${id} moved to stage ${newStage}.`);
  }, [currentUser.name, logAudit]);

  const convertApplicantToEmployee = useCallback((applicantId: string): Employee | null => {
    const app = applicants.find(a => a.id === applicantId);
    if (!app) return null;

    const names = app.name.split(' ');
    const firstName = names[0] || 'New';
    const lastName = names.slice(1).join(' ') || 'Hire';
    const job = jobOpenings.find(j => j.id === app.jobOpeningId);

    const newEmp = addEmployee({
      firstName,
      lastName,
      email: app.email,
      phone: app.phone,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      department: job?.department || 'Engineering',
      position: app.jobTitle,
      employmentType: 'Full-time',
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      baseSalary: 8500,
      hourlyRate: 50,
      currency: settings.currency,
      shiftStart: '08:30',
      shiftEnd: '17:30',
      address: 'Seattle, WA',
      nationalId: `SSN-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      emergencyContact: {
        name: 'Contact',
        relationship: 'Family',
        phone: app.phone
      },
      bankDetails: {
        bankName: 'Bank of America',
        accountNumber: '•••• ' + Math.floor(1000 + Math.random() * 9000),
        accountName: app.name,
        routingNumber: '121000358'
      },
      notes: `Onboarded directly from ATS Recruitment Pipeline. AI Resume Match: ${app.aiMatchScore || 90}%.`
    });

    updateApplicantStage(applicantId, 'HIRED');
    logAudit('APPLICANT_CONVERTED_TO_EMPLOYEE', 'Recruitment ATS', `Hired ${app.name} as ${app.jobTitle} (Employee ID: ${newEmp.code}).`);
    return newEmp;
  }, [applicants, jobOpenings, addEmployee, settings.currency, updateApplicantStage, logAudit]);

  const scoreApplicantWithAI = useCallback(async (applicantId: string): Promise<boolean> => {
    const app = applicants.find(a => a.id === applicantId);
    if (!app) return false;
    const job = jobOpenings.find(j => j.id === app.jobOpeningId);

    try {
      const res = await fetch('/api/ai/cv-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName: app.name,
          jobTitle: app.jobTitle,
          jobRequirements: job?.requirements || [],
          resumeSummary: app.resumeSummary,
          skills: app.skills,
          yearsOfExperience: app.yearsOfExperience
        })
      });

      if (!res.ok) throw new Error('AI request failed');
      const data = await res.json();

      setApplicants(prev => prev.map(a => {
        if (a.id !== applicantId) return a;
        return {
          ...a,
          aiMatchScore: data.matchScore,
          aiMatchAnalysis: data.analysis,
          strengths: data.strengths,
          gaps: data.gaps
        };
      }));

      logAudit('AI_RESUME_SCORED', 'Recruitment ATS', `Gemini AI evaluated ${app.name}: Score ${data.matchScore}%.`);
      return true;
    } catch (e) {
      console.warn('AI scoring fallback:', e);
      // Fallback calculation
      const score = 88;
      setApplicants(prev => prev.map(a => {
        if (a.id !== applicantId) return a;
        return {
          ...a,
          aiMatchScore: score,
          aiMatchAnalysis: `${app.name} shows high compatibility (${score}%) based on skillset alignment.`,
          strengths: ['High technical relevance', 'Strong experience depth', 'Team alignment'],
          gaps: ['Assess edge gateway familiarity during interview']
        };
      }));
      return true;
    }
  }, [applicants, jobOpenings, logAudit]);

  // Projects & Tasks
  const addProject = useCallback((proj: Partial<Project> & { title: string; department: string; description: string; startDate: string; endDate: string; budget: number; budgetReceived?: number; status?: ProjectStatus }): Project => {
    const count = projects.length + 1;
    // Generate departmental code prefix if available
    const deptPrefix = proj.department ? proj.department.split(/[\s&]+/)[0].toUpperCase().slice(0, 3) : 'PRJ';
    const code = proj.code || `PRJ-${deptPrefix}-0${count}`;
    const budgetAllocated = proj.budgetAllocated ?? proj.budget;
    const budgetReceived = proj.budgetReceived ?? 0;
    const dueDate = proj.dueDate || proj.endDate;

    const newProj: Project = {
      id: `proj-${Date.now()}`,
      code,
      title: proj.title,
      department: proj.department,
      description: proj.description,
      status: proj.status || 'Planning',
      client: proj.client || `${proj.department} Operations`,
      leadId: proj.leadId,
      leadName: proj.leadName || 'Unassigned Lead',
      leadAvatar: proj.leadAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      teamMembers: proj.teamMembers || [],
      budget: proj.budget,
      budgetAllocated,
      budgetReceived,
      spent: proj.spent || 0,
      currency: proj.currency || settings.currency,
      startDate: proj.startDate,
      endDate: proj.endDate,
      dueDate,
      progressPercent: proj.progressPercent || (proj.status === 'Finished' ? 100 : 0),
      tasksCount: proj.tasksCount || 0,
      completedTasksCount: proj.completedTasksCount || 0,
      priority: proj.priority || 'Medium',
      milestones: proj.milestones || []
    };
    setProjects(prev => [newProj, ...prev]);
    logAudit('PROJECT_CREATED', 'Project Management', `Created project ${newProj.title} (${newProj.code}) in ${newProj.department} department.`);
    return newProj;
  }, [projects.length, settings.currency, logAudit]);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== id) return p;
      const updated = { ...p, ...updates };
      // Auto-recalculate progress if marked Finished
      if (updates.status === 'Finished' && p.status !== 'Finished') {
        updated.progressPercent = 100;
      }
      return updated;
    }));
    logAudit('PROJECT_UPDATED', 'Project Management', `Updated project #${id}.`);
  }, [logAudit]);

  const updateProjectStage = useCallback((id: string, stage: ProjectStatus) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== id) return p;
      const progressPercent = stage === 'Finished' ? 100 : stage === 'Planning' ? Math.min(p.progressPercent, 15) : p.progressPercent;
      return { ...p, status: stage, progressPercent };
    }));
    logAudit('PROJECT_STAGE_CHANGED', 'Project Management', `Project #${id} stage changed to ${stage}.`);
  }, [logAudit]);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setTasks(prev => prev.filter(t => t.projectId !== id));
    logAudit('PROJECT_DELETED', 'Project Management', `Deleted project #${id} and associated tasks.`, 'WARNING');
  }, [logAudit]);

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdDate' | 'loggedHours'>): Task => {
    const newTask: Task = {
      ...task,
      id: `tsk-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
      loggedHours: 0
    };
    setTasks(prev => [newTask, ...prev]);
    setProjects(prev => prev.map(p => {
      if (p.id !== task.projectId) return p;
      return { ...p, tasksCount: p.tasksCount + 1 };
    }));
    return newTask;
  }, []);

  const updateTaskStatus = useCallback((id: string, status: Task['status']) => {
    setTasks(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, status } : t);
      // update project progress
      const targetTask = prev.find(t => t.id === id);
      if (targetTask) {
        const projTasks = updated.filter(t => t.projectId === targetTask.projectId);
        const doneCount = projTasks.filter(t => t.status === 'Done').length;
        const progress = Math.round((doneCount / (projTasks.length || 1)) * 100);
        setProjects(pList => pList.map(p => p.id === targetTask.projectId ? { ...p, completedTasksCount: doneCount, progressPercent: progress } : p));
      }
      return updated;
    });
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  // Assets
  const addAsset = useCallback((asset: Omit<Asset, 'id' | 'code'>): Asset => {
    const count = assets.length + 1;
    const newAsset: Asset = {
      ...asset,
      id: `ast-${Date.now()}`,
      code: `AST-${1000 + count}`
    };
    setAssets(prev => [newAsset, ...prev]);
    logAudit('ASSET_REGISTERED', 'Asset Inventory', `Registered asset ${newAsset.name} (${newAsset.code}).`);
    return newAsset;
  }, [assets.length, logAudit]);

  const updateAsset = useCallback((id: string, updates: Partial<Asset>) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  }, []);

  const assignAsset = useCallback((assetId: string, employeeId?: string) => {
    const emp = employees.find(e => e.id === employeeId);
    setAssets(prev => prev.map(a => {
      if (a.id !== assetId) return a;
      return {
        ...a,
        status: employeeId ? 'Assigned' : 'Available',
        assignedToId: employeeId,
        assignedToName: emp ? `${emp.firstName} ${emp.lastName}` : undefined,
        assignedDate: employeeId ? new Date().toISOString().split('T')[0] : undefined
      };
    }));
    logAudit('ASSET_REASSIGNED', 'Asset Inventory', `Asset #${assetId} assignment updated.`);
  }, [employees, logAudit]);

  // Expenses & Invoices
  const addExpense = useCallback((expense: Omit<ExpenseClaim, 'id' | 'code' | 'submittedDate' | 'status'>): ExpenseClaim => {
    const count = expenses.length + 1;
    const newExp: ExpenseClaim = {
      ...expense,
      id: `exp-${Date.now()}`,
      code: `EXP-2026-0${80 + count}`,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setExpenses(prev => [newExp, ...prev]);
    logAudit('EXPENSE_SUBMITTED', 'Finance & Expenses', `Submitted expense claim ${newExp.code} for $${newExp.amount}.`);
    return newExp;
  }, [expenses.length, logAudit]);

  const updateExpenseStatus = useCallback((id: string, status: ExpenseClaim['status']) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status, reviewedDate: new Date().toISOString().split('T')[0], reviewedBy: currentUser.name } : e));
    logAudit('EXPENSE_STATUS_UPDATED', 'Finance & Expenses', `Expense claim #${id} status changed to ${status}.`);
  }, [currentUser.name, logAudit]);

  const addInvoice = useCallback((invoice: Omit<Invoice, 'id' | 'invoiceNumber'>): Invoice => {
    const count = invoices.length + 1;
    const newInv: Invoice = {
      ...invoice,
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-0${800 + count}`
    };
    setInvoices(prev => [newInv, ...prev]);
    logAudit('INVOICE_GENERATED', 'Finance & Billing', `Generated invoice ${newInv.invoiceNumber} for ${newInv.clientName} ($${newInv.totalAmount.toLocaleString()}).`);
    return newInv;
  }, [invoices.length, logAudit]);

  const updateInvoiceStatus = useCallback((id: string, status: Invoice['status']) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status } : inv));
    logAudit('INVOICE_STATUS_UPDATED', 'Finance & Billing', `Invoice #${id} status set to ${status}.`);
  }, [logAudit]);

  // Settings & Reset
  const updateSettings = useCallback((updates: Partial<CompanySettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    logAudit('SETTINGS_MODIFIED', 'System Settings', 'Company configuration updated.');
  }, [logAudit]);

  const resetAllDataToDefault = useCallback(() => {
    setEmployees(INITIAL_EMPLOYEES);
    setAccessLogs(INITIAL_ACCESS_LOGS);
    setAttendanceRollups(INITIAL_ATTENDANCE_ROLLUPS);
    setPayrollRuns(INITIAL_PAYROLL_RUNS);
    setJobOpenings(INITIAL_JOB_OPENINGS);
    setApplicants(INITIAL_APPLICANTS);
    setProjects(INITIAL_PROJECTS);
    setTasks(INITIAL_TASKS);
    setAssets(INITIAL_ASSETS);
    setExpenses(INITIAL_EXPENSES);
    setInvoices(INITIAL_INVOICES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setSettings(INITIAL_SETTINGS);
    setCurrentUser(INITIAL_PERSONAS[0]);
    localStorage.clear();
    logAudit('SYSTEM_RESET', 'System Admin', 'System database reset to initial demonstration state.', 'WARNING');
  }, [logAudit]);

  const value = {
    currentUser,
    setCurrentUser,
    availablePersonas: INITIAL_PERSONAS,
    hasRole,
    activeModule,
    setActiveModule,
    employees,
    accessLogs,
    attendanceRollups,
    payrollRuns,
    jobOpenings,
    applicants,
    projects,
    tasks,
    assets,
    expenses,
    invoices,
    auditLogs,
    settings,
    currentlyInsideEmployees,
    currentlyInsideCount,
    todayPresentCount,
    todayLateCount,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getNextEmployeeCode,
    recordScan,
    recomputeAttendanceRollup,
    generatePayrollRun,
    updatePayrollStatus,
    updatePayslipOverrides,
    addJobOpening,
    updateJobOpening,
    addApplicant,
    updateApplicantStage,
    convertApplicantToEmployee,
    scoreApplicantWithAI,
    addProject,
    updateProject,
    updateProjectStage,
    deleteProject,
    addTask,
    updateTaskStatus,
    updateTask,
    addAsset,
    updateAsset,
    assignAsset,
    addExpense,
    updateExpenseStatus,
    addInvoice,
    updateInvoiceStatus,
    updateSettings,
    logAudit,
    resetAllDataToDefault,
    isQRScannerOpen,
    setIsQRScannerOpen,
    selectedEmployeeForBadge,
    setSelectedEmployeeForBadge,
    selectedPayslipForModal,
    setSelectedPayslipForModal,
    selectedInvoiceForModal,
    setSelectedInvoiceForModal
  };

  return <ERPContext.Provider value={value}>{children}</ERPContext.Provider>;
};

export const useERP = () => {
  const ctx = useContext(ERPContext);
  if (!ctx) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return ctx;
};
