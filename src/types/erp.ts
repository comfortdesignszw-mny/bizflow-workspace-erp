export type UserRole = 'ADMIN' | 'HR_MANAGER' | 'FINANCE_DIRECTOR' | 'PROJECT_LEAD' | 'EMPLOYEE';

export interface UserPersona {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  avatar: string;
  department: string;
  employeeId?: string;
}

export type EmployeeStatus = 'Active' | 'On Leave' | 'Probation' | 'Terminated';
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
export type Gender = 'Male' | 'Female' | 'Other';

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
  routingNumber?: string;
}

export interface Employee {
  id: string;
  code: string; // e.g. EMP-1001 (Editable Employee Number, system issued)
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string; // Employee profile image
  department: string;
  position: string;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  sex?: Gender; // Male | Female | Other
  dateOfEngagement?: string; // Date of engagement / contract start
  physicalAddress?: string; // Physical residential address
  joinDate: string; // Aliased to dateOfEngagement
  baseSalary: number;
  hourlyRate: number;
  currency: string;
  shiftStart: string; // "08:30"
  shiftEnd: string;   // "17:30"
  address: string;
  nationalId: string;
  emergencyContact: EmergencyContact;
  bankDetails: BankDetails;
  notes?: string;
}

export type ScanType = 'IN' | 'OUT';
export type ScanMethod = 'QR_SCAN' | 'BADGE_TAP' | 'MANUAL_OVERRIDE' | 'FACIAL_ID';

export interface AccessLog {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  position: string;
  avatar: string;
  scanType: ScanType;
  timestamp: string; // ISO string
  gate: string;      // "Main Lobby Gate A", "Warehouse Ingress", "R&D Lab Gate 2", "Executive Floor"
  method: ScanMethod;
  verified: boolean;
  notes?: string;
}

export type AttendanceStatus = 'ON_TIME' | 'LATE' | 'EARLY_DEPARTURE' | 'OVERTIME' | 'INCOMPLETE' | 'ABSENT' | 'ON_LEAVE';

export interface AttendanceRollup {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  avatar: string;
  date: string; // "YYYY-MM-DD"
  firstIn: string | null;  // ISO string
  lastOut: string | null;  // ISO string
  totalHours: number;      // e.g. 8.5
  expectedHours: number;   // default 8.0
  overtimeHours: number;
  lateMinutes: number;
  status: AttendanceStatus;
  scanCount: number;
  adjustedBy?: string;
  adjustedReason?: string;
}

export type PayrollStatus = 'draft' | 'approved' | 'paid';

export interface AllowanceItem {
  id: string;
  name: string;
  amount: number;
}

export interface DeductionItem {
  id: string;
  name: string;
  amount: number;
}

export interface PayslipItem {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  position: string;
  bankDetails: BankDetails;
  baseSalary: number;
  workingDays: number;
  presentDays: number;
  absentDays: number;
  overtimeHours: number;
  overtimeRate: number;
  overtimePay: number;
  allowances: AllowanceItem[];
  deductions: DeductionItem[];
  grossPay: number;
  taxDeduction: number;
  pensionDeduction: number;
  healthInsuranceDeduction: number;
  totalDeductions: number;
  netPay: number;
  paymentMethod: string;
  status: PayrollStatus;
  generatedDate: string;
}

export interface PayrollRun {
  id: string;
  code: string; // e.g. PAY-2026-08
  title: string;
  periodMonth: string; // "August 2026"
  periodStart: string;
  periodEnd: string;
  status: PayrollStatus;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  employeeCount: number;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  paidAt?: string;
  payslips: PayslipItem[];
  currency: string;
}

export type RecruitmentStage = 'APPLIED' | 'SCREENING' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED';

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  salaryRange: string;
  experienceLevel: string;
  openPositions: number;
  status: 'Active' | 'Draft' | 'Closed';
  requirements: string[];
  description: string;
  postedDate: string;
  applicantsCount: number;
}

export interface Applicant {
  id: string;
  jobOpeningId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  currentCompany: string;
  yearsOfExperience: number;
  stage: RecruitmentStage;
  aiMatchScore?: number;
  aiMatchAnalysis?: string;
  strengths?: string[];
  gaps?: string[];
  resumeSummary: string;
  skills: string[];
  rating: number; // 1 to 5
  appliedDate: string;
  interviewDate?: string;
  notes: { id: string; author: string; text: string; date: string }[];
}

export type ProjectStatus = 'Planning' | 'In Progress' | 'Paused' | 'Finished';
export type ProjectStage = ProjectStatus;
export type ProjectPriority = 'Low' | 'Medium' | 'High' | 'Critical' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TaskStatus = 'Backlog' | 'Todo' | 'InProgress' | 'In Progress' | 'Review' | 'Done';

export interface ProjectMilestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface Task {
  id: string;
  projectId: string;
  projectCode: string;
  projectTitle: string;
  title: string;
  description: string;
  assignedToId: string;
  assignedToName: string;
  assignedToAvatar: string;
  priority: TaskPriority;
  status: TaskStatus;
  estimatedHours: number;
  loggedHours: number;
  dueDate: string;
  createdDate: string;
  tags: string[];
}

export interface Project {
  id: string;
  code: string; // e.g. PRJ-ENG-01
  title: string;
  client: string;
  department: string; // Linked Department
  description: string; // Project Description
  status: ProjectStatus; // Planning | In Progress | Paused | Finished
  leadId: string;
  leadName: string;
  leadAvatar: string;
  teamMembers: { id: string; name: string; avatar: string; role: string }[];
  budget: number; // Budget Allocation
  budgetAllocated?: number;
  budgetReceived: number; // Budget Received / Disbursed
  spent: number; // Actual Expenditure
  currency: string;
  startDate: string; // Project Start Date
  endDate: string; // Project End Date
  dueDate?: string; // Aliased for legacy tasks
  progressPercent: number;
  tasksCount: number;
  completedTasksCount: number;
  milestones?: ProjectMilestone[];
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
}

export type AssetCategory = 'Hardware' | 'Vehicle' | 'Keycard' | 'Office Equipment' | 'Software License';
export type AssetStatus = 'Available' | 'Assigned' | 'Maintenance' | 'Retired';
export type AssetCondition = 'New' | 'Good' | 'Fair' | 'Needs Repair';

export interface Asset {
  id: string;
  code: string; // e.g. AST-1002
  name: string;
  category: AssetCategory;
  model: string;
  serialNumber: string;
  status: AssetStatus;
  condition: AssetCondition;
  purchaseValue: number;
  purchaseDate: string;
  assignedToId?: string;
  assignedToName?: string;
  assignedDate?: string;
  location: string;
  lastMaintenanceDate?: string;
  warrantyExpiry?: string;
}

export type ExpenseCategory = 'Travel' | 'Software' | 'Office Supplies' | 'Client Dinner' | 'Training' | 'Hardware';
export type ExpenseStatus = 'Pending' | 'Approved' | 'Rejected' | 'Reimbursed';

export interface ExpenseClaim {
  id: string;
  code: string; // e.g. EXP-2026-041
  employeeId: string;
  employeeName: string;
  department: string;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  description: string;
  receiptUrl?: string;
  status: ExpenseStatus;
  submittedDate: string;
  reviewedDate?: string;
  reviewedBy?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue';

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. INV-2026-089
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number; // e.g. 0.10 for 10%
  taxAmount: number;
  totalAmount: number;
  currency: string;
  status: InvoiceStatus;
  notes?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string;
  module: string;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'ERROR';
}

export interface CompanySettings {
  companyName: string;
  tagline: string;
  registrationNumber: string;
  taxNumber: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  currencySymbol: string;
  workDayStart: string; // "08:30"
  workDayEnd: string;   // "17:30"
  standardDailyHours: number;
  lateGracePeriodMinutes: number;
  overtimeMultiplier: number;
  defaultTaxRate: number;
  geminiAiEnabled: boolean;
}

// Procurement & Logistics Types
export type PurchaseOrderStatus = 'Draft' | 'Requested' | 'Approved' | 'Ordered' | 'Delivered' | 'Cancelled';

export interface PurchaseOrderItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string; // PO-2026-081
  vendorId: string;
  vendorName: string;
  requestedBy: string;
  department: string;
  status: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
  totalAmount: number;
  currency: string;
  orderDate: string;
  expectedDelivery: string;
  actualDelivery?: string;
  trackingNumber?: string;
  carrier?: string;
  notes?: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: 'Hardware & Cloud' | 'Office & Facilities' | 'Software Licenses' | 'Logistics & Freight' | 'Consulting';
  contactPerson: string;
  email: string;
  phone: string;
  rating: number; // 1 to 5
  paymentTerms: string; // Net 30, Net 15
  status: 'Active' | 'Under Review' | 'Inactive';
  totalSpend: number;
}

// Engineering & Systems Types
export interface Microservice {
  id: string;
  name: string;
  code: string;
  status: 'Healthy' | 'Degraded' | 'Deploying' | 'Incident';
  uptimePercent: number;
  latencyMs: number;
  version: string;
  techStack: string[];
  leadEngineer: string;
  repository: string;
  lastDeployed: string;
}

export interface DeployPipeline {
  id: string;
  serviceId: string;
  serviceName: string;
  branch: string;
  commitHash: string;
  commitMessage: string;
  author: string;
  status: 'SUCCESS' | 'RUNNING' | 'FAILED' | 'QUEUED';
  durationSeconds: number;
  timestamp: string;
}

// Sales & CRM Types
export type DealStage = 'Lead' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';

export interface Deal {
  id: string;
  title: string;
  clientCompany: string;
  contactName: string;
  contactEmail: string;
  value: number;
  currency: string;
  stage: DealStage;
  probability: number; // 0-100%
  ownerName: string;
  expectedCloseDate: string;
  tags: string[];
  lastActivity: string;
}

export interface ClientAccount {
  id: string;
  name: string;
  industry: string;
  tier: 'Enterprise' | 'Growth' | 'Mid-Market' | 'Startup';
  annualRevenue: number;
  primaryContact: string;
  email: string;
  phone: string;
  status: 'Active' | 'Onboarding' | 'Churn Risk' | 'Prospect';
  openDealsCount: number;
  lifetimeValue: number;
}

// Workplace Notes & Scratchpad Types
export interface WorkplaceNote {
  id: string;
  title: string;
  category: 'Executive' | 'HR' | 'Engineering' | 'Finance' | 'Procurement' | 'General';
  content: string;
  tags: string[];
  pinned: boolean;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

