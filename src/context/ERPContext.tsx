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
  RecruitmentStage,
  PurchaseOrder,
  PurchaseOrderStatus,
  Vendor,
  Microservice,
  DeployPipeline,
  Deal,
  DealStage,
  ClientAccount,
  WorkplaceNote,
  ITTicket,
  ITSystemHealth,
  ITDeviceInventory,
  ITSoftwareLicense,
  Vehicle,
  Driver,
  TripLog
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
  INITIAL_SETTINGS,
  INITIAL_VENDORS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_MICROSERVICES,
  INITIAL_DEPLOY_PIPELINES,
  INITIAL_CLIENT_ACCOUNTS,
  INITIAL_DEALS,
  INITIAL_NOTES,
  INITIAL_IT_TICKETS,
  INITIAL_IT_SYSTEMS,
  INITIAL_IT_DEVICES,
  INITIAL_IT_LICENSES,
  INITIAL_VEHICLES,
  INITIAL_DRIVERS,
  INITIAL_TRIP_LOGS
} from '../data/initialData';
import { db } from '../db/erpDexieDb';
import {
  getLocalSandbox,
  setLocalSandbox,
  loadCollectionOfflineFirst,
  persistCollectionToStorage,
  performFullSync
} from '../db/offlineSyncService';

interface ERPContextType {
  // PWA & Offline Engine
  isOnline: boolean;
  syncStatus: 'synced' | 'syncing' | 'offline';
  lastSyncTime: string;
  triggerManualSync: () => Promise<void>;
  isInstallPromptAvailable: boolean;
  installPWA: () => Promise<void>;
  offlineStorageEngine: string;

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
  vendors: Vendor[];
  purchaseOrders: PurchaseOrder[];
  microservices: Microservice[];
  deployPipelines: DeployPipeline[];
  deals: Deal[];
  clientAccounts: ClientAccount[];
  notes: WorkplaceNote[];
  itTickets: ITTicket[];
  itSystems: ITSystemHealth[];
  itDevices: ITDeviceInventory[];
  itLicenses: ITSoftwareLicense[];
  vehicles: Vehicle[];
  drivers: Driver[];
  tripLogs: TripLog[];

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

  // Actions: Procurement & Fleet
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'poNumber' | 'orderDate'>) => PurchaseOrder;
  updatePurchaseOrderStatus: (id: string, status: PurchaseOrderStatus) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => Vehicle;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  addDriver: (driver: Omit<Driver, 'id' | 'createdAt'>) => Driver;
  updateDriver: (id: string, updates: Partial<Driver>) => void;
  deleteDriver: (id: string) => void;
  addTripLog: (trip: Omit<TripLog, 'id' | 'tripCode' | 'loggedAt' | 'totalMileage'> & { mileageIn?: number; totalMileage?: number; loggedBy?: string }) => TripLog;
  updateTripLog: (id: string, updates: Partial<TripLog>) => void;
  completeTripLog: (id: string, mileageIn: number, fuelGaugeIn: string, returnDateTime?: string, remarks?: string) => void;
  deleteTripLog: (id: string) => void;

  // Actions: Sales & CRM
  addDeal: (deal: Omit<Deal, 'id' | 'lastActivity'>) => Deal;
  updateDealStage: (id: string, stage: DealStage) => void;

  // Actions: Notes & Text Pad
  addNote: (note: Omit<WorkplaceNote, 'id' | 'createdAt' | 'updatedAt'>) => WorkplaceNote;
  updateNote: (id: string, updates: Partial<WorkplaceNote>) => void;
  deleteNote: (id: string) => void;

  // Actions: IT Department & Issue Management
  addITTicket: (ticket: Omit<ITTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt'>) => ITTicket;
  updateITTicket: (id: string, updates: Partial<ITTicket>) => void;
  resolveITTicket: (id: string, resolutionNotes: string) => void;
  deleteITTicket: (id: string) => void;
  updateSystemStatus: (id: string, status: ITSystemHealth['status'], latencyMs?: number) => void;
  addITDevice: (device: Omit<ITDeviceInventory, 'id'>) => ITDeviceInventory;
  updateITDevice: (id: string, updates: Partial<ITDeviceInventory>) => void;
  addITLicense: (license: Omit<ITSoftwareLicense, 'id'>) => ITSoftwareLicense;
  updateITLicense: (id: string, updates: Partial<ITSoftwareLicense>) => void;

  // Actions: Settings & System
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  updateSettings: (updates: Partial<CompanySettings>) => void;
  logAudit: (action: string, module: string, details: string, status?: 'SUCCESS' | 'WARNING' | 'ERROR') => void;
  resetAllDataToDefault: () => void;

  // Modal Triggers & Mobile Navigation
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean) => void;
  isQRScannerOpen: boolean;
  setIsQRScannerOpen: (open: boolean) => void;
  isPWAInstallModalOpen: boolean;
  setIsPWAInstallModalOpen: (open: boolean) => void;
  isStandaloneMode: boolean;
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
  // Network & Sync State
  const [isOnline, setIsOnline] = useState<boolean>(() => typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => new Date().toLocaleTimeString());
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallPromptAvailable, setIsInstallPromptAvailable] = useState<boolean>(false);

  const [currentUser, setCurrentUser] = useState<UserPersona>(() => getLocalSandbox('user', INITIAL_PERSONAS[0]));
  const [activeModule, setActiveModule] = useState<string>('dashboard');

  const [employees, setEmployees] = useState<Employee[]>(() => getLocalSandbox('employees', INITIAL_EMPLOYEES));
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>(() => getLocalSandbox('access_logs', INITIAL_ACCESS_LOGS));
  const [attendanceRollups, setAttendanceRollups] = useState<AttendanceRollup[]>(() => getLocalSandbox('attendance_rollups', INITIAL_ATTENDANCE_ROLLUPS));
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>(() => getLocalSandbox('payroll_runs', INITIAL_PAYROLL_RUNS));
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>(() => getLocalSandbox('job_openings', INITIAL_JOB_OPENINGS));
  const [applicants, setApplicants] = useState<Applicant[]>(() => getLocalSandbox('applicants', INITIAL_APPLICANTS));
  const [projects, setProjects] = useState<Project[]>(() => getLocalSandbox('projects', INITIAL_PROJECTS));
  const [tasks, setTasks] = useState<Task[]>(() => getLocalSandbox('tasks', INITIAL_TASKS));
  const [assets, setAssets] = useState<Asset[]>(() => getLocalSandbox('assets', INITIAL_ASSETS));
  const [expenses, setExpenses] = useState<ExpenseClaim[]>(() => getLocalSandbox('expenses', INITIAL_EXPENSES));
  const [invoices, setInvoices] = useState<Invoice[]>(() => getLocalSandbox('invoices', INITIAL_INVOICES));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => getLocalSandbox('audit_logs', INITIAL_AUDIT_LOGS));
  const [settings, setSettings] = useState<CompanySettings>(() => getLocalSandbox('settings', INITIAL_SETTINGS));

  const [vendors, setVendors] = useState<Vendor[]>(() => getLocalSandbox('vendors', INITIAL_VENDORS));
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => getLocalSandbox('purchase_orders', INITIAL_PURCHASE_ORDERS));
  const [microservices, setMicroservices] = useState<Microservice[]>(() => getLocalSandbox('microservices', INITIAL_MICROSERVICES));
  const [deployPipelines, setDeployPipelines] = useState<DeployPipeline[]>(() => getLocalSandbox('deploy_pipelines', INITIAL_DEPLOY_PIPELINES));
  const [clientAccounts, setClientAccounts] = useState<ClientAccount[]>(() => getLocalSandbox('client_accounts', INITIAL_CLIENT_ACCOUNTS));
  const [deals, setDeals] = useState<Deal[]>(() => getLocalSandbox('deals', INITIAL_DEALS));
  const [notes, setNotes] = useState<WorkplaceNote[]>(() => getLocalSandbox('notes', INITIAL_NOTES));
  const [itTickets, setItTickets] = useState<ITTicket[]>(() => getLocalSandbox('it_tickets', INITIAL_IT_TICKETS));
  const [itSystems, setItSystems] = useState<ITSystemHealth[]>(() => getLocalSandbox('it_systems', INITIAL_IT_SYSTEMS));
  const [itDevices, setItDevices] = useState<ITDeviceInventory[]>(() => getLocalSandbox('it_devices', INITIAL_IT_DEVICES));
  const [itLicenses, setItLicenses] = useState<ITSoftwareLicense[]>(() => getLocalSandbox('it_licenses', INITIAL_IT_LICENSES));
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => getLocalSandbox('vehicles', INITIAL_VEHICLES));
  const [drivers, setDrivers] = useState<Driver[]>(() => getLocalSandbox('drivers', INITIAL_DRIVERS));
  const [tripLogs, setTripLogs] = useState<TripLog[]>(() => getLocalSandbox('trip_logs', INITIAL_TRIP_LOGS));

  // Modal states & Navigation
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bizflow_erp_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark'; // Dark theme is default (current state)
  });

  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bizflow_erp_theme', newTheme);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Sync theme to root DOM and PWA theme-color
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'light') {
        root.classList.remove('dark');
        root.classList.add('light');
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) metaThemeColor.setAttribute('content', '#ffffff');
      } else {
        root.classList.remove('light');
        root.classList.add('dark');
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) metaThemeColor.setAttribute('content', '#0a0a0a');
      }
    }
  }, [theme]);

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isPWAInstallModalOpen, setIsPWAInstallModalOpen] = useState(false);
  const [isStandaloneMode, setIsStandaloneMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    }
    return false;
  });
  const [selectedEmployeeForBadge, setSelectedEmployeeForBadge] = useState<Employee | null>(null);
  const [selectedPayslipForModal, setSelectedPayslipForModal] = useState<PayslipItem | null>(null);
  const [selectedInvoiceForModal, setSelectedInvoiceForModal] = useState<Invoice | null>(null);

  // 1. Online / Offline listeners & PWA install prompt handler
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkStandalone = () => {
        setIsStandaloneMode(window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true);
      };
      const mediaQuery = window.matchMedia('(display-mode: standalone)');
      mediaQuery.addEventListener('change', checkStandalone);
    }

    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus('syncing');
      performFullSync().then(() => {
        setSyncStatus('synced');
        setLastSyncTime(new Date().toLocaleTimeString());
      });
    };
    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('offline');
    };

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallPromptAvailable(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // 2. Initial Boot: Load Dexie IndexedDB sandbox first, fallback to LocalStorage & Remote DB
  useEffect(() => {
    async function hydrateFromIndexedDB() {
      try {
        const [
          emp,
          accLogs,
          attRollups,
          payRuns,
          jobs,
          apps,
          projs,
          tsks,
          asts,
          exps,
          invs,
          audits,
          vends,
          pos,
          services,
          pipes,
          clients,
          dls,
          nts,
          tks,
          sys,
          devs,
          lics,
          vehs,
          drvs,
          trips
        ] = await Promise.all([
          loadCollectionOfflineFirst('employees', db.employees, INITIAL_EMPLOYEES),
          loadCollectionOfflineFirst('access_logs', db.accessLogs, INITIAL_ACCESS_LOGS),
          loadCollectionOfflineFirst('attendance_rollups', db.attendanceRollups, INITIAL_ATTENDANCE_ROLLUPS),
          loadCollectionOfflineFirst('payroll_runs', db.payrollRuns, INITIAL_PAYROLL_RUNS),
          loadCollectionOfflineFirst('job_openings', db.jobOpenings, INITIAL_JOB_OPENINGS),
          loadCollectionOfflineFirst('applicants', db.applicants, INITIAL_APPLICANTS),
          loadCollectionOfflineFirst('projects', db.projects, INITIAL_PROJECTS),
          loadCollectionOfflineFirst('tasks', db.tasks, INITIAL_TASKS),
          loadCollectionOfflineFirst('assets', db.assets, INITIAL_ASSETS),
          loadCollectionOfflineFirst('expenses', db.expenses, INITIAL_EXPENSES),
          loadCollectionOfflineFirst('invoices', db.invoices, INITIAL_INVOICES),
          loadCollectionOfflineFirst('audit_logs', db.auditLogs, INITIAL_AUDIT_LOGS),
          loadCollectionOfflineFirst('vendors', db.vendors, INITIAL_VENDORS),
          loadCollectionOfflineFirst('purchase_orders', db.purchaseOrders, INITIAL_PURCHASE_ORDERS),
          loadCollectionOfflineFirst('microservices', db.microservices, INITIAL_MICROSERVICES),
          loadCollectionOfflineFirst('deploy_pipelines', db.deployPipelines, INITIAL_DEPLOY_PIPELINES),
          loadCollectionOfflineFirst('client_accounts', db.clientAccounts, INITIAL_CLIENT_ACCOUNTS),
          loadCollectionOfflineFirst('deals', db.deals, INITIAL_DEALS),
          loadCollectionOfflineFirst('notes', db.notes, INITIAL_NOTES),
          loadCollectionOfflineFirst('it_tickets', db.itTickets, INITIAL_IT_TICKETS),
          loadCollectionOfflineFirst('it_systems', db.itSystems, INITIAL_IT_SYSTEMS),
          loadCollectionOfflineFirst('it_devices', db.itDevices, INITIAL_IT_DEVICES),
          loadCollectionOfflineFirst('it_licenses', db.itLicenses, INITIAL_IT_LICENSES),
          loadCollectionOfflineFirst('vehicles', db.vehicles, INITIAL_VEHICLES),
          loadCollectionOfflineFirst('drivers', db.drivers, INITIAL_DRIVERS),
          loadCollectionOfflineFirst('trip_logs', db.tripLogs, INITIAL_TRIP_LOGS)
        ]);

        if (emp && emp.length) setEmployees(emp);
        if (accLogs && accLogs.length) setAccessLogs(accLogs);
        if (attRollups && attRollups.length) setAttendanceRollups(attRollups);
        if (payRuns && payRuns.length) setPayrollRuns(payRuns);
        if (jobs && jobs.length) setJobOpenings(jobs);
        if (apps && apps.length) setApplicants(apps);
        if (projs && projs.length) setProjects(projs);
        if (tsks && tsks.length) setTasks(tsks);
        if (asts && asts.length) setAssets(asts);
        if (exps && exps.length) setExpenses(exps);
        if (invs && invs.length) setInvoices(invs);
        if (audits && audits.length) setAuditLogs(audits);
        if (vends && vends.length) setVendors(vends);
        if (pos && pos.length) setPurchaseOrders(pos);
        if (services && services.length) setMicroservices(services);
        if (pipes && pipes.length) setDeployPipelines(pipes);
        if (clients && clients.length) setClientAccounts(clients);
        if (dls && dls.length) setDeals(dls);
        if (nts && nts.length) setNotes(nts);
        if (tks && tks.length) setItTickets(tks);
        if (sys && sys.length) setItSystems(sys);
        if (devs && devs.length) setItDevices(devs);
        if (lics && lics.length) setItLicenses(lics);
        if (vehs && vehs.length) setVehicles(vehs);
        if (drvs && drvs.length) setDrivers(drvs);
        if (trips && trips.length) setTripLogs(trips);
      } catch (err) {
        console.warn('[Dexie Initial Boot] Hydration notice:', err);
      }
    }

    hydrateFromIndexedDB();
  }, []);

  // 3. Persistent Sync: Multi-tier IndexedDB + LocalStorage persistence
  useEffect(() => { setLocalSandbox('user', currentUser); }, [currentUser]);
  useEffect(() => { persistCollectionToStorage('employees', db.employees, employees); }, [employees]);
  useEffect(() => { persistCollectionToStorage('access_logs', db.accessLogs, accessLogs); }, [accessLogs]);
  useEffect(() => { persistCollectionToStorage('attendance_rollups', db.attendanceRollups, attendanceRollups); }, [attendanceRollups]);
  useEffect(() => { persistCollectionToStorage('payroll_runs', db.payrollRuns, payrollRuns); }, [payrollRuns]);
  useEffect(() => { persistCollectionToStorage('job_openings', db.jobOpenings, jobOpenings); }, [jobOpenings]);
  useEffect(() => { persistCollectionToStorage('applicants', db.applicants, applicants); }, [applicants]);
  useEffect(() => { persistCollectionToStorage('projects', db.projects, projects); }, [projects]);
  useEffect(() => { persistCollectionToStorage('tasks', db.tasks, tasks); }, [tasks]);
  useEffect(() => { persistCollectionToStorage('assets', db.assets, assets); }, [assets]);
  useEffect(() => { persistCollectionToStorage('expenses', db.expenses, expenses); }, [expenses]);
  useEffect(() => { persistCollectionToStorage('invoices', db.invoices, invoices); }, [invoices]);
  useEffect(() => { persistCollectionToStorage('audit_logs', db.auditLogs, auditLogs); }, [auditLogs]);
  useEffect(() => { setLocalSandbox('settings', settings); }, [settings]);
  useEffect(() => { persistCollectionToStorage('vendors', db.vendors, vendors); }, [vendors]);
  useEffect(() => { persistCollectionToStorage('purchase_orders', db.purchaseOrders, purchaseOrders); }, [purchaseOrders]);
  useEffect(() => { persistCollectionToStorage('microservices', db.microservices, microservices); }, [microservices]);
  useEffect(() => { persistCollectionToStorage('deploy_pipelines', db.deployPipelines, deployPipelines); }, [deployPipelines]);
  useEffect(() => { persistCollectionToStorage('client_accounts', db.clientAccounts, clientAccounts); }, [clientAccounts]);
  useEffect(() => { persistCollectionToStorage('deals', db.deals, deals); }, [deals]);
  useEffect(() => { persistCollectionToStorage('notes', db.notes, notes); }, [notes]);
  useEffect(() => { persistCollectionToStorage('it_tickets', db.itTickets, itTickets); }, [itTickets]);
  useEffect(() => { persistCollectionToStorage('it_systems', db.itSystems, itSystems); }, [itSystems]);
  useEffect(() => { persistCollectionToStorage('it_devices', db.itDevices, itDevices); }, [itDevices]);
  useEffect(() => { persistCollectionToStorage('it_licenses', db.itLicenses, itLicenses); }, [itLicenses]);
  useEffect(() => { persistCollectionToStorage('vehicles', db.vehicles, vehicles); }, [vehicles]);
  useEffect(() => { persistCollectionToStorage('drivers', db.drivers, drivers); }, [drivers]);
  useEffect(() => { persistCollectionToStorage('trip_logs', db.tripLogs, tripLogs); }, [tripLogs]);

  // Manual Full Sync Trigger
  const triggerManualSync = useCallback(async () => {
    setSyncStatus('syncing');
    try {
      const res = await performFullSync();
      if (res.success) {
        setSyncStatus('synced');
        setLastSyncTime(new Date().toLocaleTimeString());
      } else {
        setSyncStatus(navigator.onLine ? 'synced' : 'offline');
      }
    } catch {
      setSyncStatus(navigator.onLine ? 'synced' : 'offline');
    }
  }, []);

  // PWA Native Installation Trigger
  const installPWA = useCallback(async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          console.log('[PWA] User accepted the install prompt');
          setIsInstallPromptAvailable(false);
          setIsPWAInstallModalOpen(false);
        }
        setDeferredPrompt(null);
      } catch (e) {
        console.warn('[PWA] Installation trigger error:', e);
        setIsPWAInstallModalOpen(true);
      }
    } else {
      // Open interactive installation guide modal for all devices/browsers
      setIsPWAInstallModalOpen(true);
    }
  }, [deferredPrompt]);

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
    const today = (timestamp || new Date().toISOString()).split('T')[0];
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

    const names = (app.name || 'New Hire').split(' ');
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

  // Procurement & Purchase Orders
  const addPurchaseOrder = useCallback((po: Omit<PurchaseOrder, 'id' | 'poNumber' | 'orderDate'>): PurchaseOrder => {
    const count = purchaseOrders.length + 1;
    const newPO: PurchaseOrder = {
      ...po,
      id: `po-${Date.now()}`,
      poNumber: `PO-2026-0${80 + count}`,
      orderDate: new Date().toISOString().split('T')[0]
    };
    setPurchaseOrders(prev => [newPO, ...prev]);
    logAudit('PURCHASE_ORDER_CREATED', 'Procurement & Logistics', `Created purchase order ${newPO.poNumber} for $${newPO.totalAmount.toLocaleString()} to ${newPO.vendorName}.`);
    return newPO;
  }, [purchaseOrders.length, logAudit]);

  const updatePurchaseOrderStatus = useCallback((id: string, status: PurchaseOrderStatus) => {
    setPurchaseOrders(prev => prev.map(po => po.id === id ? { ...po, status, actualDelivery: status === 'Delivered' ? new Date().toISOString().split('T')[0] : po.actualDelivery } : po));
    logAudit('PO_STATUS_CHANGED', 'Procurement & Logistics', `Purchase order #${id} status changed to ${status}.`);
  }, [logAudit]);

  // Fleet Management (Procurement & Logistics sub-section)
  const addVehicle = useCallback((vehicleData: Omit<Vehicle, 'id' | 'createdAt'>): Vehicle => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: `veh-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setVehicles(prev => [newVehicle, ...prev]);
    logAudit('VEHICLE_REGISTERED', 'Procurement & Fleet', `Registered new fleet vehicle ${newVehicle.make} ${newVehicle.model} (${newVehicle.regNumber}) - Status: ${newVehicle.status}.`);
    return newVehicle;
  }, [logAudit]);

  const updateVehicle = useCallback((id: string, updates: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
    logAudit('VEHICLE_UPDATED', 'Procurement & Fleet', `Updated vehicle details for #${id}.`);
  }, [logAudit]);

  const deleteVehicle = useCallback((id: string) => {
    const target = vehicles.find(v => v.id === id);
    setVehicles(prev => prev.filter(v => v.id !== id));
    logAudit('VEHICLE_DELETED', 'Procurement & Fleet', `Removed fleet vehicle ${target?.regNumber || id} from registry.`, 'WARNING');
  }, [vehicles, logAudit]);

  const addDriver = useCallback((driverData: Omit<Driver, 'id' | 'createdAt'>): Driver => {
    const newDriver: Driver = {
      ...driverData,
      id: `drv-${Date.now()}`,
      totalTripsCompleted: driverData.totalTripsCompleted || 0,
      createdAt: new Date().toISOString()
    };
    setDrivers(prev => [newDriver, ...prev]);
    logAudit('DRIVER_REGISTERED', 'Procurement & Fleet', `Registered driver ${newDriver.fullName} (License: ${newDriver.licenseNumber}).`);
    return newDriver;
  }, [logAudit]);

  const updateDriver = useCallback((id: string, updates: Partial<Driver>) => {
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
    logAudit('DRIVER_UPDATED', 'Procurement & Fleet', `Updated driver profile for #${id}.`);
  }, [logAudit]);

  const deleteDriver = useCallback((id: string) => {
    const target = drivers.find(d => d.id === id);
    setDrivers(prev => prev.filter(d => d.id !== id));
    logAudit('DRIVER_DELETED', 'Procurement & Fleet', `Removed driver ${target?.fullName || id} from registry.`, 'WARNING');
  }, [drivers, logAudit]);

  const addTripLog = useCallback((tripData: Omit<TripLog, 'id' | 'tripCode' | 'loggedAt' | 'totalMileage'> & { mileageIn?: number; totalMileage?: number; loggedBy?: string }): TripLog => {
    const count = tripLogs.length + 1;
    const mileageInVal = Number(tripData.mileageIn) || 0;
    const mileageOutVal = Number(tripData.mileageOut) || 0;
    const calculatedTotal = (mileageInVal > mileageOutVal) ? (mileageInVal - mileageOutVal) : (tripData.totalMileage || 0);

    const newTrip: TripLog = {
      ...tripData,
      id: `trip-${Date.now()}`,
      tripCode: `TRIP-2026-${String(100 + count).padStart(4, '0')}`,
      mileageIn: mileageInVal,
      totalMileage: calculatedTotal,
      loggedAt: new Date().toISOString(),
      loggedBy: tripData.loggedBy || `${currentUser.name} (${currentUser.role})`,
      loggedByEmail: currentUser.email,
      loggedByRole: currentUser.role,
      verifiedBySupervisor: true
    };

    setTripLogs(prev => [newTrip, ...prev]);

    // Update vehicle's mileage and status
    setVehicles(prev => prev.map(v => {
      if (v.id === tripData.vehicleId || v.regNumber === tripData.regNumber) {
        return {
          ...v,
          currentMileage: mileageInVal > v.currentMileage ? mileageInVal : (mileageOutVal > v.currentMileage ? mileageOutVal : v.currentMileage),
          status: newTrip.status === 'Ongoing' ? 'assigned' : v.status
        };
      }
      return v;
    }));

    // If completed, increment driver's total trips
    if (newTrip.status === 'Completed' && tripData.driverId) {
      setDrivers(prev => prev.map(d => d.id === tripData.driverId ? { ...d, totalTripsCompleted: (d.totalTripsCompleted || 0) + 1 } : d));
    }

    logAudit('TRIP_LOGGED', 'Procurement & Fleet', `Logged vehicle trip ${newTrip.tripCode} for ${newTrip.regNumber} (${newTrip.driverName}) -> ${newTrip.destination} [Total: ${calculatedTotal} km]. Logged by ${newTrip.loggedBy}.`);
    return newTrip;
  }, [tripLogs.length, currentUser, logAudit]);

  const updateTripLog = useCallback((id: string, updates: Partial<TripLog>) => {
    setTripLogs(prev => prev.map(t => {
      if (t.id !== id) return t;
      const mileageOut = updates.mileageOut !== undefined ? Number(updates.mileageOut) : t.mileageOut;
      const mileageIn = updates.mileageIn !== undefined ? Number(updates.mileageIn) : (t.mileageIn || 0);
      const totalMileage = (mileageIn > mileageOut) ? (mileageIn - mileageOut) : (updates.totalMileage !== undefined ? updates.totalMileage : t.totalMileage);

      return {
        ...t,
        ...updates,
        mileageOut,
        mileageIn,
        totalMileage,
        updatedAt: new Date().toISOString(),
        updatedBy: `${currentUser.name} (${currentUser.role})`
      };
    }));
    logAudit('TRIP_UPDATED', 'Procurement & Fleet', `Updated trip log record #${id}. Audited by ${currentUser.name}.`);
  }, [currentUser, logAudit]);

  const completeTripLog = useCallback((id: string, mileageIn: number, fuelGaugeIn: string, returnDateTime?: string, remarks?: string) => {
    let completedTrip: TripLog | undefined;

    setTripLogs(prev => prev.map(t => {
      if (t.id !== id) return t;
      const totalMileage = Number(mileageIn) > Number(t.mileageOut) ? (Number(mileageIn) - Number(t.mileageOut)) : 0;
      const updated: TripLog = {
        ...t,
        status: 'Completed',
        mileageIn: Number(mileageIn),
        fuelGaugeIn: fuelGaugeIn || t.fuelGaugeIn || '',
        returnDateTime: returnDateTime || new Date().toISOString().slice(0, 16),
        totalMileage,
        remarks: remarks !== undefined ? remarks : t.remarks,
        updatedAt: new Date().toISOString(),
        updatedBy: `${currentUser.name} (${currentUser.role})`
      };
      completedTrip = updated;
      return updated;
    }));

    if (completedTrip) {
      const trip = completedTrip as TripLog;
      // Update vehicle current mileage and mark parked/available
      setVehicles(prev => prev.map(v => {
        if (v.id === trip.vehicleId || v.regNumber === trip.regNumber) {
          return {
            ...v,
            currentMileage: Math.max(v.currentMileage, Number(mileageIn)),
            status: v.status === 'assigned' ? 'parked' : v.status
          };
        }
        return v;
      }));

      // Increment driver's completed trips
      if (trip.driverId) {
        setDrivers(prev => prev.map(d => d.id === trip.driverId ? { ...d, totalTripsCompleted: (d.totalTripsCompleted || 0) + 1 } : d));
      }

      logAudit('TRIP_COMPLETED', 'Procurement & Fleet', `Trip ${trip.tripCode} marked Completed. Mileage In: ${mileageIn}km (Total Traveled: ${trip.totalMileage}km). Audited by ${currentUser.name}.`);
    }
  }, [currentUser, logAudit]);

  const deleteTripLog = useCallback((id: string) => {
    const target = tripLogs.find(t => t.id === id);
    setTripLogs(prev => prev.filter(t => t.id !== id));
    logAudit('TRIP_DELETED', 'Procurement & Fleet', `Deleted trip log record ${target?.tripCode || id}.`, 'WARNING');
  }, [tripLogs, logAudit]);

  // Sales & CRM Deals
  const addDeal = useCallback((deal: Omit<Deal, 'id' | 'lastActivity'>): Deal => {
    const newDeal: Deal = {
      ...deal,
      id: `deal-${Date.now()}`,
      lastActivity: `${new Date().toISOString().split('T')[0]}: Deal created in CRM pipeline`
    };
    setDeals(prev => [newDeal, ...prev]);
    logAudit('CRM_DEAL_CREATED', 'Sales & CRM', `Created sales opportunity "${newDeal.title}" with value $${newDeal.value.toLocaleString()}.`);
    return newDeal;
  }, [logAudit]);

  const updateDealStage = useCallback((id: string, stage: DealStage) => {
    setDeals(prev => prev.map(d => d.id === id ? {
      ...d,
      stage,
      probability: stage === 'Won' ? 100 : stage === 'Lost' ? 0 : stage === 'Negotiation' ? 85 : stage === 'Proposal' ? 60 : stage === 'Qualified' ? 40 : 20,
      lastActivity: `${new Date().toISOString().split('T')[0]}: Stage moved to ${stage}`
    } : d));
    logAudit('CRM_STAGE_ADVANCED', 'Sales & CRM', `Deal #${id} moved to ${stage} stage.`);
  }, [logAudit]);

  // Workplace Notes
  const addNote = useCallback((note: Omit<WorkplaceNote, 'id' | 'createdAt' | 'updatedAt'>): WorkplaceNote => {
    const newNote: WorkplaceNote = {
      ...note,
      id: `note-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setNotes(prev => [newNote, ...prev]);
    logAudit('NOTE_CREATED', 'Workplace Notes', `Created note "${newNote.title}" in category ${newNote.category}.`);
    return newNote;
  }, [logAudit]);

  const updateNote = useCallback((id: string, updates: Partial<WorkplaceNote>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  // IT Department Actions
  const addITTicket = useCallback((ticket: Omit<ITTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt'>): ITTicket => {
    const count = itTickets.length + 1;
    const newTicket: ITTicket = {
      ...ticket,
      id: `it-${Date.now()}`,
      ticketNumber: `INC-2026-${1000 + count}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setItTickets(prev => [newTicket, ...prev]);
    logAudit('IT_TICKET_CREATED', 'IT Department', `Created incident ticket ${newTicket.ticketNumber} (${newTicket.category}) - ${newTicket.title}.`);
    return newTicket;
  }, [itTickets.length, logAudit]);

  const updateITTicket = useCallback((id: string, updates: Partial<ITTicket>) => {
    setItTickets(prev => prev.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t));
    logAudit('IT_TICKET_UPDATED', 'IT Department', `Updated ticket #${id}.`);
  }, [logAudit]);

  const resolveITTicket = useCallback((id: string, resolutionNotes: string) => {
    setItTickets(prev => prev.map(t => t.id === id ? {
      ...t,
      status: 'Resolved',
      resolutionNotes,
      resolvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } : t));
    logAudit('IT_TICKET_RESOLVED', 'IT Department', `Resolved incident ticket #${id}.`);
  }, [logAudit]);

  const deleteITTicket = useCallback((id: string) => {
    setItTickets(prev => prev.filter(t => t.id !== id));
    logAudit('IT_TICKET_DELETED', 'IT Department', `Deleted ticket #${id}.`, 'WARNING');
  }, [logAudit]);

  const updateSystemStatus = useCallback((id: string, status: ITSystemHealth['status'], latencyMs?: number) => {
    setItSystems(prev => prev.map(s => s.id === id ? {
      ...s,
      status,
      latencyMs: latencyMs ?? s.latencyMs,
      lastPing: 'Just now'
    } : s));
    logAudit('IT_SYSTEM_STATUS_UPDATED', 'IT Department', `System ${id} health status changed to ${status}.`);
  }, [logAudit]);

  const addITDevice = useCallback((device: Omit<ITDeviceInventory, 'id'>): ITDeviceInventory => {
    const newDev: ITDeviceInventory = {
      ...device,
      id: `dev-${Date.now()}`
    };
    setItDevices(prev => [newDev, ...prev]);
    logAudit('IT_DEVICE_ADDED', 'IT Department', `Registered IT hardware ${newDev.assetTag} (${newDev.brand} ${newDev.model}).`);
    return newDev;
  }, [logAudit]);

  const updateITDevice = useCallback((id: string, updates: Partial<ITDeviceInventory>) => {
    setItDevices(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
    logAudit('IT_DEVICE_UPDATED', 'IT Department', `Updated device info #${id}.`);
  }, [logAudit]);

  const addITLicense = useCallback((license: Omit<ITSoftwareLicense, 'id'>): ITSoftwareLicense => {
    const newLic: ITSoftwareLicense = {
      ...license,
      id: `lic-${Date.now()}`
    };
    setItLicenses(prev => [newLic, ...prev]);
    logAudit('IT_LICENSE_ADDED', 'IT Department', `Added license for ${newLic.softwareName}.`);
    return newLic;
  }, [logAudit]);

  const updateITLicense = useCallback((id: string, updates: Partial<ITSoftwareLicense>) => {
    setItLicenses(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
    logAudit('IT_LICENSE_UPDATED', 'IT Department', `Updated license info #${id}.`);
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
    setVendors(INITIAL_VENDORS);
    setPurchaseOrders(INITIAL_PURCHASE_ORDERS);
    setMicroservices(INITIAL_MICROSERVICES);
    setDeployPipelines(INITIAL_DEPLOY_PIPELINES);
    setClientAccounts(INITIAL_CLIENT_ACCOUNTS);
    setDeals(INITIAL_DEALS);
    setNotes(INITIAL_NOTES);
    setItTickets(INITIAL_IT_TICKETS);
    setItSystems(INITIAL_IT_SYSTEMS);
    setItDevices(INITIAL_IT_DEVICES);
    setItLicenses(INITIAL_IT_LICENSES);
    setCurrentUser(INITIAL_PERSONAS[0]);
    localStorage.clear();
    // Clear Dexie tables
    Promise.all([
      db.employees.clear(),
      db.accessLogs.clear(),
      db.attendanceRollups.clear(),
      db.payrollRuns.clear(),
      db.jobOpenings.clear(),
      db.applicants.clear(),
      db.projects.clear(),
      db.tasks.clear(),
      db.assets.clear(),
      db.expenses.clear(),
      db.invoices.clear(),
      db.auditLogs.clear(),
      db.vendors.clear(),
      db.purchaseOrders.clear(),
      db.microservices.clear(),
      db.deployPipelines.clear(),
      db.clientAccounts.clear(),
      db.deals.clear(),
      db.notes.clear(),
      db.itTickets.clear(),
      db.itSystems.clear(),
      db.itDevices.clear(),
      db.itLicenses.clear()
    ]).catch(err => console.warn('Dexie reset error:', err));
    logAudit('SYSTEM_RESET', 'System Admin', 'System database reset to initial demonstration state.', 'WARNING');
  }, [logAudit]);

  const value = {
    isOnline,
    syncStatus,
    lastSyncTime,
    triggerManualSync,
    isInstallPromptAvailable,
    installPWA,
    offlineStorageEngine: 'Dexie.JS IndexedDB (Sandbox-First)',
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
    vendors,
    purchaseOrders,
    microservices,
    deployPipelines,
    deals,
    clientAccounts,
    notes,
    itTickets,
    itSystems,
    itDevices,
    itLicenses,
    vehicles,
    drivers,
    tripLogs,
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
    addPurchaseOrder,
    updatePurchaseOrderStatus,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    addDriver,
    updateDriver,
    deleteDriver,
    addTripLog,
    updateTripLog,
    completeTripLog,
    deleteTripLog,
    addDeal,
    updateDealStage,
    addNote,
    updateNote,
    deleteNote,
    addITTicket,
    updateITTicket,
    resolveITTicket,
    deleteITTicket,
    updateSystemStatus,
    addITDevice,
    updateITDevice,
    addITLicense,
    updateITLicense,
    updateSettings,
    logAudit,
    resetAllDataToDefault,
    theme,
    setTheme,
    toggleTheme,
    isMobileNavOpen,
    setIsMobileNavOpen,
    isQRScannerOpen,
    setIsQRScannerOpen,
    isPWAInstallModalOpen,
    setIsPWAInstallModalOpen,
    isStandaloneMode,
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
