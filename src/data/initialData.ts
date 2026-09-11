import {
  Employee,
  AccessLog,
  AttendanceRollup,
  PayrollRun,
  JobOpening,
  Applicant,
  Project,
  Task,
  Asset,
  ExpenseClaim,
  Invoice,
  AuditLog,
  CompanySettings,
  UserPersona,
  PurchaseOrder,
  Vendor,
  Microservice,
  DeployPipeline,
  Deal,
  ClientAccount,
  WorkplaceNote,
  ITTicket,
  ITSystemHealth,
  ITDeviceInventory,
  ITSoftwareLicense,
  Vehicle,
  Driver,
  TripLog,
  EngineeringJobCard
} from '../types/erp';

export const DEFAULT_FALLBACK_PERSONA: UserPersona = {
  id: 'user-default',
  name: 'System User',
  email: '',
  role: 'ADMIN',
  roleTitle: 'Administrator',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  department: 'Executive Board',
  employeeId: 'emp-default'
};

export const INITIAL_PERSONAS: UserPersona[] = [];

export const INITIAL_EMPLOYEES: Employee[] = [];

export const INITIAL_ACCESS_LOGS: AccessLog[] = [];

export const INITIAL_ATTENDANCE_ROLLUPS: AttendanceRollup[] = [];

export const INITIAL_PAYROLL_RUNS: PayrollRun[] = [];

export const INITIAL_JOB_OPENINGS: JobOpening[] = [];

export const INITIAL_APPLICANTS: Applicant[] = [];

export const INITIAL_PROJECTS: Project[] = [];

export const INITIAL_TASKS: Task[] = [];

export const INITIAL_ASSETS: Asset[] = [];

export const INITIAL_EXPENSES: ExpenseClaim[] = [];

export const INITIAL_INVOICES: Invoice[] = [];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-sys-init',
    timestamp: new Date().toISOString(),
    userId: 'system',
    userName: 'Security Subsystem',
    role: 'ADMIN',
    action: 'SYSTEM_INITIALIZATION',
    module: 'System Integrity',
    details: 'Zero-trust enterprise database initialized. Demo records purged; awaiting authenticated staff logins.',
    status: 'SUCCESS'
  }
];

export const INITIAL_SETTINGS: CompanySettings = {
  companyName: 'Comfort BizFlow ERP Systems',
  tagline: 'Intelligent Enterprise Workforce & Biometric Operations',
  registrationNumber: 'WA-CORP-984210-A',
  taxNumber: 'US-EIN-91-8849201',
  email: 'operations@comfortbizflow.io',
  phone: '+1 (555) 800-BIZFLOW',
  address: '800 5th Avenue, Suite 3400, Seattle, WA 98104',
  currency: 'USD',
  currencySymbol: '$',
  workDayStart: '08:30',
  workDayEnd: '17:30',
  standardDailyHours: 8.0,
  lateGracePeriodMinutes: 10,
  overtimeMultiplier: 1.5,
  defaultTaxRate: 23.0,
  geminiAiEnabled: true
};

export const INITIAL_VENDORS: Vendor[] = [];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [];

export const INITIAL_MICROSERVICES: Microservice[] = [];

export const INITIAL_DEPLOY_PIPELINES: DeployPipeline[] = [];

export const INITIAL_CLIENT_ACCOUNTS: ClientAccount[] = [];

export const INITIAL_DEALS: Deal[] = [];

export const INITIAL_NOTES: WorkplaceNote[] = [];

export const INITIAL_IT_TICKETS: ITTicket[] = [];

export const INITIAL_IT_SYSTEMS: ITSystemHealth[] = [];

export const INITIAL_IT_DEVICES: ITDeviceInventory[] = [];

export const INITIAL_IT_LICENSES: ITSoftwareLicense[] = [];

export const INITIAL_VEHICLES: Vehicle[] = [];

export const INITIAL_DRIVERS: Driver[] = [];

export const INITIAL_TRIP_LOGS: TripLog[] = [];

export const INITIAL_ENGINEERING_JOB_CARDS: EngineeringJobCard[] = [];
