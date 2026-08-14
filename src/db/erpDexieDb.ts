import Dexie, { Table } from 'dexie';
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
  Vendor,
  PurchaseOrder,
  Microservice,
  DeployPipeline,
  Deal,
  ClientAccount,
  WorkplaceNote,
  ITTicket,
  ITSystemHealth,
  ITDeviceInventory,
  ITSoftwareLicense
} from '../types/erp';

export interface SyncMetadata {
  key: string;
  lastSyncedAt: string;
  version: number;
  isDirty?: boolean;
}

export class BizFlowDexieDatabase extends Dexie {
  employees!: Table<Employee, string>;
  accessLogs!: Table<AccessLog, string>;
  attendanceRollups!: Table<AttendanceRollup, string>;
  payrollRuns!: Table<PayrollRun, string>;
  jobOpenings!: Table<JobOpening, string>;
  applicants!: Table<Applicant, string>;
  projects!: Table<Project, string>;
  tasks!: Table<Task, string>;
  assets!: Table<Asset, string>;
  expenses!: Table<ExpenseClaim, string>;
  invoices!: Table<Invoice, string>;
  auditLogs!: Table<AuditLog, string>;
  vendors!: Table<Vendor, string>;
  purchaseOrders!: Table<PurchaseOrder, string>;
  microservices!: Table<Microservice, string>;
  deployPipelines!: Table<DeployPipeline, string>;
  deals!: Table<Deal, string>;
  clientAccounts!: Table<ClientAccount, string>;
  notes!: Table<WorkplaceNote, string>;
  itTickets!: Table<ITTicket, string>;
  itSystems!: Table<ITSystemHealth, string>;
  itDevices!: Table<ITDeviceInventory, string>;
  itLicenses!: Table<ITSoftwareLicense, string>;
  settings!: Table<CompanySettings & { id: string }, string>;
  syncMeta!: Table<SyncMetadata, string>;

  constructor() {
    super('BizFlowWorkforceERP_IndexedDB');

    this.version(2).stores({
      employees: 'id, code, department, status, email, roleTitle',
      accessLogs: 'id, employeeId, timestamp, scanType, method, gate',
      attendanceRollups: 'id, date, employeeId, status',
      payrollRuns: 'id, month, status',
      jobOpenings: 'id, title, department, status',
      applicants: 'id, jobOpeningId, stage, email',
      projects: 'id, title, department, status',
      tasks: 'id, projectId, status, priority, assigneeId',
      assets: 'id, code, category, status, assignedTo',
      expenses: 'id, code, department, status, employeeId',
      invoices: 'id, invoiceNumber, clientName, status',
      auditLogs: 'id, timestamp, module, userId',
      vendors: 'id, code, name, category, status',
      purchaseOrders: 'id, poNumber, vendorId, status',
      microservices: 'id, name, status',
      deployPipelines: 'id, name, status',
      deals: 'id, title, clientAccountId, stage',
      clientAccounts: 'id, name, tier',
      notes: 'id, title, category, isPinned',
      itTickets: 'id, ticketNumber, category, priority, status, requesterName',
      itSystems: 'id, name, category, status',
      itDevices: 'id, assetTag, type, assignedTo, healthStatus',
      itLicenses: 'id, softwareName, vendor, category',
      settings: 'id',
      syncMeta: 'key, lastSyncedAt, isDirty'
    });
  }
}

export const db = new BizFlowDexieDatabase();
