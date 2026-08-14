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
  WorkplaceNote
} from '../types/erp';

export const INITIAL_PERSONAS: UserPersona[] = [
  {
    id: 'user-admin',
    name: 'Eleanor Vance',
    email: 'eleanor.vance@comfortbizflow.io',
    role: 'ADMIN',
    roleTitle: 'Chief Executive & System Admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Executive Board',
    employeeId: 'emp-001'
  },
  {
    id: 'user-hr',
    name: 'Marcus Chen',
    email: 'marcus.chen@comfortbizflow.io',
    role: 'HR_MANAGER',
    roleTitle: 'Head of People & Talent',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Human Resources',
    employeeId: 'emp-002'
  },
  {
    id: 'user-finance',
    name: 'Sophia Patel',
    email: 'sophia.patel@comfortbizflow.io',
    role: 'FINANCE_DIRECTOR',
    roleTitle: 'Finance & Payroll Controller',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Finance & Accounting',
    employeeId: 'emp-003'
  },
  {
    id: 'user-pm',
    name: 'David Alvarez',
    email: 'david.alvarez@comfortbizflow.io',
    role: 'PROJECT_LEAD',
    roleTitle: 'Director of Engineering & Projects',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    employeeId: 'emp-004'
  },
  {
    id: 'user-emp',
    name: 'Amara Okafor',
    email: 'amara.okafor@comfortbizflow.io',
    role: 'EMPLOYEE',
    roleTitle: 'Senior Full Stack Engineer',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    employeeId: 'emp-005'
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-001',
    code: 'EMP-1001',
    firstName: 'Eleanor',
    lastName: 'Vance',
    email: 'eleanor.vance@comfortbizflow.io',
    phone: '+1 (555) 234-8901',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Executive Board',
    position: 'Chief Executive Officer',
    employmentType: 'Full-time',
    status: 'Active',
    sex: 'Female',
    dateOfEngagement: '2021-01-15',
    physicalAddress: '742 Evergreen Terrace, Seattle, WA 98101',
    joinDate: '2021-01-15',
    baseSalary: 14500,
    hourlyRate: 85,
    currency: 'USD',
    shiftStart: '08:30',
    shiftEnd: '17:30',
    address: '742 Evergreen Terrace, Seattle, WA 98101',
    nationalId: 'SSN-9982-1102',
    emergencyContact: {
      name: 'Julian Vance',
      relationship: 'Spouse',
      phone: '+1 (555) 902-3341'
    },
    bankDetails: {
      bankName: 'JPMorgan Chase',
      accountNumber: '•••• 4892',
      accountName: 'Eleanor Vance',
      routingNumber: '021000021'
    },
    notes: 'Key executive officer and enterprise administrator.'
  },
  {
    id: 'emp-002',
    code: 'EMP-1002',
    firstName: 'Marcus',
    lastName: 'Chen',
    email: 'marcus.chen@comfortbizflow.io',
    phone: '+1 (555) 345-6712',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Human Resources',
    position: 'Head of People & Talent',
    employmentType: 'Full-time',
    status: 'Active',
    sex: 'Male',
    dateOfEngagement: '2021-06-01',
    physicalAddress: '1204 Pine Street, Seattle, WA 98101',
    joinDate: '2021-06-01',
    baseSalary: 9200,
    hourlyRate: 54,
    currency: 'USD',
    shiftStart: '08:30',
    shiftEnd: '17:30',
    address: '1204 Pine Street, Seattle, WA 98101',
    nationalId: 'SSN-4421-8890',
    emergencyContact: {
      name: 'Lian Chen',
      relationship: 'Sibling',
      phone: '+1 (555) 334-1199'
    },
    bankDetails: {
      bankName: 'Bank of America',
      accountNumber: '•••• 9124',
      accountName: 'Marcus Chen',
      routingNumber: '121000358'
    }
  },
  {
    id: 'emp-003',
    code: 'EMP-1003',
    firstName: 'Sophia',
    lastName: 'Patel',
    email: 'sophia.patel@comfortbizflow.io',
    phone: '+1 (555) 456-7890',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Finance & Accounting',
    position: 'Finance & Payroll Director',
    employmentType: 'Full-time',
    status: 'Active',
    sex: 'Female',
    dateOfEngagement: '2022-03-15',
    physicalAddress: '890 Madison Avenue, Seattle, WA 98104',
    joinDate: '2022-03-15',
    baseSalary: 9800,
    hourlyRate: 58,
    currency: 'USD',
    shiftStart: '08:30',
    shiftEnd: '17:30',
    address: '890 Madison Avenue, Seattle, WA 98104',
    nationalId: 'SSN-6612-4091',
    emergencyContact: {
      name: 'Aarav Patel',
      relationship: 'Spouse',
      phone: '+1 (555) 789-2210'
    },
    bankDetails: {
      bankName: 'Wells Fargo',
      accountNumber: '•••• 3319',
      accountName: 'Sophia Patel',
      routingNumber: '121000248'
    }
  },
  {
    id: 'emp-004',
    code: 'EMP-1004',
    firstName: 'David',
    lastName: 'Alvarez',
    email: 'david.alvarez@comfortbizflow.io',
    phone: '+1 (555) 567-8901',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    position: 'Principal Architect & Lead',
    employmentType: 'Full-time',
    status: 'Active',
    sex: 'Male',
    dateOfEngagement: '2021-09-10',
    physicalAddress: '304 Olympic Blvd, Bellevue, WA 98004',
    joinDate: '2021-09-10',
    baseSalary: 11500,
    hourlyRate: 68,
    currency: 'USD',
    shiftStart: '09:00',
    shiftEnd: '18:00',
    address: '304 Olympic Blvd, Bellevue, WA 98004',
    nationalId: 'SSN-7734-1290',
    emergencyContact: {
      name: 'Elena Alvarez',
      relationship: 'Mother',
      phone: '+1 (555) 441-2098'
    },
    bankDetails: {
      bankName: 'Citibank',
      accountNumber: '•••• 7721',
      accountName: 'David Alvarez',
      routingNumber: '021000089'
    }
  },
  {
    id: 'emp-005',
    code: 'EMP-1005',
    firstName: 'Amara',
    lastName: 'Okafor',
    email: 'amara.okafor@comfortbizflow.io',
    phone: '+1 (555) 678-9012',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    position: 'Senior Full Stack Engineer',
    employmentType: 'Full-time',
    status: 'Active',
    sex: 'Female',
    dateOfEngagement: '2022-08-01',
    physicalAddress: '512 Fremont Ave, Seattle, WA 98103',
    joinDate: '2022-08-01',
    baseSalary: 8800,
    hourlyRate: 52,
    currency: 'USD',
    shiftStart: '08:30',
    shiftEnd: '17:30',
    address: '512 Fremont Ave, Seattle, WA 98103',
    nationalId: 'SSN-8819-3341',
    emergencyContact: {
      name: 'Chidi Okafor',
      relationship: 'Brother',
      phone: '+1 (555) 991-8822'
    },
    bankDetails: {
      bankName: 'Chase Bank',
      accountNumber: '•••• 5521',
      accountName: 'Amara Okafor',
      routingNumber: '021000021'
    }
  },
  {
    id: 'emp-006',
    code: 'EMP-1006',
    firstName: 'Lucas',
    lastName: 'Moretti',
    email: 'lucas.moretti@comfortbizflow.io',
    phone: '+1 (555) 789-0123',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    department: 'Product & Design',
    position: 'Staff UX/UI Designer',
    employmentType: 'Full-time',
    status: 'Active',
    sex: 'Male',
    dateOfEngagement: '2022-11-15',
    physicalAddress: '228 Queen Anne Ave, Seattle, WA 98109',
    joinDate: '2022-11-15',
    baseSalary: 8200,
    hourlyRate: 48,
    currency: 'USD',
    shiftStart: '08:30',
    shiftEnd: '17:30',
    address: '228 Queen Anne Ave, Seattle, WA 98109',
    nationalId: 'SSN-5512-9901',
    emergencyContact: {
      name: 'Isabella Moretti',
      relationship: 'Spouse',
      phone: '+1 (555) 332-9011'
    },
    bankDetails: {
      bankName: 'U.S. Bank',
      accountNumber: '•••• 1982',
      accountName: 'Lucas Moretti',
      routingNumber: '123000220'
    }
  },
  {
    id: 'emp-007',
    code: 'EMP-1007',
    firstName: 'Tanya',
    lastName: 'Kowalski',
    email: 'tanya.kowalski@comfortbizflow.io',
    phone: '+1 (555) 890-1234',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    department: 'Sales & Growth',
    position: 'Enterprise Account Executive',
    employmentType: 'Full-time',
    status: 'Active',
    sex: 'Female',
    dateOfEngagement: '2023-02-01',
    physicalAddress: '910 Belltown Way, Seattle, WA 98121',
    joinDate: '2023-02-01',
    baseSalary: 7500,
    hourlyRate: 44,
    currency: 'USD',
    shiftStart: '08:30',
    shiftEnd: '17:30',
    address: '910 Belltown Way, Seattle, WA 98121',
    nationalId: 'SSN-3391-4481',
    emergencyContact: {
      name: 'Piotr Kowalski',
      relationship: 'Father',
      phone: '+1 (555) 771-4499'
    },
    bankDetails: {
      bankName: 'Bank of America',
      accountNumber: '•••• 6672',
      accountName: 'Tanya Kowalski',
      routingNumber: '121000358'
    }
  },
  {
    id: 'emp-008',
    code: 'EMP-1008',
    firstName: 'Kenji',
    lastName: 'Takahashi',
    email: 'kenji.takahashi@comfortbizflow.io',
    phone: '+1 (555) 901-2345',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    department: 'Operations & Logistics',
    position: 'Logistics & Supply Chain Manager',
    employmentType: 'Full-time',
    status: 'Active',
    sex: 'Male',
    dateOfEngagement: '2023-04-10',
    physicalAddress: '401 Industrial Way, Seattle, WA 98134',
    joinDate: '2023-04-10',
    baseSalary: 7800,
    hourlyRate: 46,
    currency: 'USD',
    shiftStart: '08:00',
    shiftEnd: '17:00',
    address: '401 Industrial Way, Seattle, WA 98134',
    nationalId: 'SSN-2210-9944',
    emergencyContact: {
      name: 'Yuki Takahashi',
      relationship: 'Spouse',
      phone: '+1 (555) 881-2299'
    },
    bankDetails: {
      bankName: 'Chase Bank',
      accountNumber: '•••• 8820',
      accountName: 'Kenji Takahashi',
      routingNumber: '021000021'
    }
  },
  {
    id: 'emp-009',
    code: 'EMP-1009',
    firstName: 'Fatima',
    lastName: 'Al-Mansoor',
    email: 'fatima.mansoor@comfortbizflow.io',
    phone: '+1 (555) 012-3456',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    department: 'Quality & Compliance',
    position: 'QA Lead & DevOps Specialist',
    employmentType: 'Full-time',
    status: 'Active',
    sex: 'Female',
    dateOfEngagement: '2023-07-15',
    physicalAddress: '1502 Capitol Hill Blvd, Seattle, WA 98102',
    joinDate: '2023-07-15',
    baseSalary: 8400,
    hourlyRate: 50,
    currency: 'USD',
    shiftStart: '08:30',
    shiftEnd: '17:30',
    address: '1502 Capitol Hill Blvd, Seattle, WA 98102',
    nationalId: 'SSN-9912-3341',
    emergencyContact: {
      name: 'Tariq Al-Mansoor',
      relationship: 'Spouse',
      phone: '+1 (555) 334-8800'
    },
    bankDetails: {
      bankName: 'Wells Fargo',
      accountNumber: '•••• 4410',
      accountName: 'Fatima Al-Mansoor',
      routingNumber: '121000248'
    }
  },
  {
    id: 'emp-010',
    code: 'EMP-1010',
    firstName: 'Liam',
    lastName: 'O\'Connor',
    email: 'liam.oconnor@comfortbizflow.io',
    phone: '+1 (555) 123-7890',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    position: 'Cloud Infrastructure Engineer',
    employmentType: 'Full-time',
    status: 'On Leave',
    sex: 'Male',
    dateOfEngagement: '2023-09-01',
    physicalAddress: '618 Ballard Ave, Seattle, WA 98107',
    joinDate: '2023-09-01',
    baseSalary: 8100,
    hourlyRate: 48,
    currency: 'USD',
    shiftStart: '08:30',
    shiftEnd: '17:30',
    address: '618 Ballard Ave, Seattle, WA 98107',
    nationalId: 'SSN-1199-4402',
    emergencyContact: {
      name: 'Maeve O\'Connor',
      relationship: 'Sister',
      phone: '+1 (555) 221-9988'
    },
    bankDetails: {
      bankName: 'Citibank',
      accountNumber: '•••• 9931',
      accountName: 'Liam O\'Connor',
      routingNumber: '021000089'
    }
  }
];

const todayStr = '2026-08-14';

export const INITIAL_ACCESS_LOGS: AccessLog[] = [
  {
    id: 'log-001',
    employeeId: 'emp-001',
    employeeCode: 'EMP-1001',
    employeeName: 'Eleanor Vance',
    department: 'Executive Board',
    position: 'Chief Executive Officer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    scanType: 'IN',
    timestamp: `${todayStr}T08:14:22.000Z`,
    gate: 'Executive East Gate',
    method: 'QR_SCAN',
    verified: true
  },
  {
    id: 'log-002',
    employeeId: 'emp-002',
    employeeCode: 'EMP-1002',
    employeeName: 'Marcus Chen',
    department: 'Human Resources',
    position: 'Head of People & Talent',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    scanType: 'IN',
    timestamp: `${todayStr}T08:24:10.000Z`,
    gate: 'Main Lobby Turnstile 01',
    method: 'QR_SCAN',
    verified: true
  },
  {
    id: 'log-003',
    employeeId: 'emp-003',
    employeeCode: 'EMP-1003',
    employeeName: 'Sophia Patel',
    department: 'Finance & Accounting',
    position: 'Finance & Payroll Director',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    scanType: 'IN',
    timestamp: `${todayStr}T08:28:45.000Z`,
    gate: 'Main Lobby Turnstile 02',
    method: 'QR_SCAN',
    verified: true
  },
  {
    id: 'log-004',
    employeeId: 'emp-004',
    employeeCode: 'EMP-1004',
    employeeName: 'David Alvarez',
    department: 'Engineering',
    position: 'Principal Architect & Lead',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    scanType: 'IN',
    timestamp: `${todayStr}T08:42:00.000Z`,
    gate: 'R&D Innovation Lab Gate',
    method: 'QR_SCAN',
    verified: true
  },
  {
    id: 'log-005',
    employeeId: 'emp-005',
    employeeCode: 'EMP-1005',
    employeeName: 'Amara Okafor',
    department: 'Engineering',
    position: 'Senior Full Stack Engineer',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    scanType: 'IN',
    timestamp: `${todayStr}T08:29:15.000Z`,
    gate: 'R&D Innovation Lab Gate',
    method: 'QR_SCAN',
    verified: true
  },
  {
    id: 'log-006',
    employeeId: 'emp-006',
    employeeCode: 'EMP-1006',
    employeeName: 'Lucas Moretti',
    department: 'Product & Design',
    position: 'Staff UX/UI Designer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    scanType: 'IN',
    timestamp: `${todayStr}T08:48:30.000Z`,
    gate: 'Main Lobby Turnstile 01',
    method: 'QR_SCAN',
    verified: true,
    notes: 'Late arrival (18 mins post-shift target)'
  },
  {
    id: 'log-007',
    employeeId: 'emp-007',
    employeeCode: 'EMP-1007',
    employeeName: 'Tanya Kowalski',
    department: 'Sales & Growth',
    position: 'Enterprise Account Executive',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    scanType: 'IN',
    timestamp: `${todayStr}T08:19:00.000Z`,
    gate: 'Main Lobby Turnstile 03',
    method: 'QR_SCAN',
    verified: true
  },
  {
    id: 'log-008',
    employeeId: 'emp-008',
    employeeCode: 'EMP-1008',
    employeeName: 'Kenji Takahashi',
    department: 'Operations & Logistics',
    position: 'Logistics & Supply Chain Manager',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    scanType: 'IN',
    timestamp: `${todayStr}T07:55:10.000Z`,
    gate: 'Logistics & Loading Dock B',
    method: 'QR_SCAN',
    verified: true
  },
  {
    id: 'log-009',
    employeeId: 'emp-009',
    employeeCode: 'EMP-1009',
    employeeName: 'Fatima Al-Mansoor',
    department: 'Quality & Compliance',
    position: 'QA Lead & DevOps Specialist',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    scanType: 'IN',
    timestamp: `${todayStr}T08:31:05.000Z`,
    gate: 'Main Lobby Turnstile 02',
    method: 'QR_SCAN',
    verified: true
  }
];

export const INITIAL_ATTENDANCE_ROLLUPS: AttendanceRollup[] = [
  {
    id: 'att-001',
    employeeId: 'emp-001',
    employeeCode: 'EMP-1001',
    employeeName: 'Eleanor Vance',
    department: 'Executive Board',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    date: todayStr,
    firstIn: `${todayStr}T08:14:22.000Z`,
    lastOut: null,
    totalHours: 7.2,
    expectedHours: 8.0,
    overtimeHours: 0,
    lateMinutes: 0,
    status: 'ON_TIME',
    scanCount: 1
  },
  {
    id: 'att-002',
    employeeId: 'emp-002',
    employeeCode: 'EMP-1002',
    employeeName: 'Marcus Chen',
    department: 'Human Resources',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    date: todayStr,
    firstIn: `${todayStr}T08:24:10.000Z`,
    lastOut: null,
    totalHours: 7.0,
    expectedHours: 8.0,
    overtimeHours: 0,
    lateMinutes: 0,
    status: 'ON_TIME',
    scanCount: 1
  },
  {
    id: 'att-003',
    employeeId: 'emp-003',
    employeeCode: 'EMP-1003',
    employeeName: 'Sophia Patel',
    department: 'Finance & Accounting',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    date: todayStr,
    firstIn: `${todayStr}T08:28:45.000Z`,
    lastOut: null,
    totalHours: 6.9,
    expectedHours: 8.0,
    overtimeHours: 0,
    lateMinutes: 0,
    status: 'ON_TIME',
    scanCount: 1
  },
  {
    id: 'att-004',
    employeeId: 'emp-004',
    employeeCode: 'EMP-1004',
    employeeName: 'David Alvarez',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    date: todayStr,
    firstIn: `${todayStr}T08:42:00.000Z`,
    lastOut: null,
    totalHours: 6.7,
    expectedHours: 8.0,
    overtimeHours: 0,
    lateMinutes: 0,
    status: 'ON_TIME',
    scanCount: 1
  },
  {
    id: 'att-005',
    employeeId: 'emp-005',
    employeeCode: 'EMP-1005',
    employeeName: 'Amara Okafor',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    date: todayStr,
    firstIn: `${todayStr}T08:29:15.000Z`,
    lastOut: null,
    totalHours: 6.9,
    expectedHours: 8.0,
    overtimeHours: 0,
    lateMinutes: 0,
    status: 'ON_TIME',
    scanCount: 1
  },
  {
    id: 'att-006',
    employeeId: 'emp-006',
    employeeCode: 'EMP-1006',
    employeeName: 'Lucas Moretti',
    department: 'Product & Design',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    date: todayStr,
    firstIn: `${todayStr}T08:48:30.000Z`,
    lastOut: null,
    totalHours: 6.6,
    expectedHours: 8.0,
    overtimeHours: 0,
    lateMinutes: 18,
    status: 'LATE',
    scanCount: 1
  },
  {
    id: 'att-007',
    employeeId: 'emp-007',
    employeeCode: 'EMP-1007',
    employeeName: 'Tanya Kowalski',
    department: 'Sales & Growth',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    date: todayStr,
    firstIn: `${todayStr}T08:19:00.000Z`,
    lastOut: null,
    totalHours: 7.1,
    expectedHours: 8.0,
    overtimeHours: 0,
    lateMinutes: 0,
    status: 'ON_TIME',
    scanCount: 1
  },
  {
    id: 'att-008',
    employeeId: 'emp-008',
    employeeCode: 'EMP-1008',
    employeeName: 'Kenji Takahashi',
    department: 'Operations & Logistics',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    date: todayStr,
    firstIn: `${todayStr}T07:55:10.000Z`,
    lastOut: null,
    totalHours: 7.5,
    expectedHours: 8.0,
    overtimeHours: 0,
    lateMinutes: 0,
    status: 'ON_TIME',
    scanCount: 1
  },
  {
    id: 'att-009',
    employeeId: 'emp-009',
    employeeCode: 'EMP-1009',
    employeeName: 'Fatima Al-Mansoor',
    department: 'Quality & Compliance',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    date: todayStr,
    firstIn: `${todayStr}T08:31:05.000Z`,
    lastOut: null,
    totalHours: 6.9,
    expectedHours: 8.0,
    overtimeHours: 0,
    lateMinutes: 1,
    status: 'ON_TIME',
    scanCount: 1
  },
  {
    id: 'att-010',
    employeeId: 'emp-010',
    employeeCode: 'EMP-1010',
    employeeName: 'Liam O\'Connor',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    date: todayStr,
    firstIn: null,
    lastOut: null,
    totalHours: 0,
    expectedHours: 8.0,
    overtimeHours: 0,
    lateMinutes: 0,
    status: 'ON_LEAVE',
    scanCount: 0
  }
];

export const INITIAL_PAYROLL_RUNS: PayrollRun[] = [
  {
    id: 'pay-2026-07',
    code: 'PAY-2026-07',
    title: 'July 2026 Monthly Workforce Payroll Run',
    periodMonth: 'July 2026',
    periodStart: '2026-07-01',
    periodEnd: '2026-07-31',
    status: 'paid',
    totalGross: 95500,
    totalDeductions: 21965,
    totalNet: 73535,
    employeeCount: 10,
    createdAt: '2026-07-28T10:00:00.000Z',
    approvedAt: '2026-07-29T14:30:00.000Z',
    approvedBy: 'Sophia Patel',
    paidAt: '2026-07-31T09:00:00.000Z',
    currency: 'USD',
    payslips: [
      {
        id: 'ps-07-001',
        employeeId: 'emp-001',
        employeeCode: 'EMP-1001',
        employeeName: 'Eleanor Vance',
        department: 'Executive Board',
        position: 'Chief Executive Officer',
        bankDetails: {
          bankName: 'JPMorgan Chase',
          accountNumber: '•••• 4892',
          accountName: 'Eleanor Vance',
          routingNumber: '021000021'
        },
        baseSalary: 14500,
        workingDays: 22,
        presentDays: 22,
        absentDays: 0,
        overtimeHours: 0,
        overtimeRate: 85,
        overtimePay: 0,
        allowances: [
          { id: 'al-1', name: 'Executive Transport Stipend', amount: 800 },
          { id: 'al-2', name: 'Communications Allowance', amount: 200 }
        ],
        deductions: [],
        grossPay: 15500,
        taxDeduction: 3565,
        pensionDeduction: 775,
        healthInsuranceDeduction: 350,
        totalDeductions: 4690,
        netPay: 10810,
        paymentMethod: 'Direct Bank Transfer (ACH)',
        status: 'paid',
        generatedDate: '2026-07-31'
      },
      {
        id: 'ps-07-004',
        employeeId: 'emp-004',
        employeeCode: 'EMP-1004',
        employeeName: 'David Alvarez',
        department: 'Engineering',
        position: 'Principal Architect & Lead',
        bankDetails: {
          bankName: 'Citibank',
          accountNumber: '•••• 7721',
          accountName: 'David Alvarez',
          routingNumber: '021000089'
        },
        baseSalary: 11500,
        workingDays: 22,
        presentDays: 22,
        absentDays: 0,
        overtimeHours: 6,
        overtimeRate: 102,
        overtimePay: 612,
        allowances: [
          { id: 'al-3', name: 'Tech Tool Stipend', amount: 350 }
        ],
        deductions: [],
        grossPay: 12462,
        taxDeduction: 2866,
        pensionDeduction: 623,
        healthInsuranceDeduction: 250,
        totalDeductions: 3739,
        netPay: 8723,
        paymentMethod: 'Direct Bank Transfer (ACH)',
        status: 'paid',
        generatedDate: '2026-07-31'
      },
      {
        id: 'ps-07-005',
        employeeId: 'emp-005',
        employeeCode: 'EMP-1005',
        employeeName: 'Amara Okafor',
        department: 'Engineering',
        position: 'Senior Full Stack Engineer',
        bankDetails: {
          bankName: 'Chase Bank',
          accountNumber: '•••• 5521',
          accountName: 'Amara Okafor',
          routingNumber: '021000021'
        },
        baseSalary: 8800,
        workingDays: 22,
        presentDays: 21,
        absentDays: 0,
        overtimeHours: 4,
        overtimeRate: 78,
        overtimePay: 312,
        allowances: [
          { id: 'al-4', name: 'Remote Connectivity', amount: 150 }
        ],
        deductions: [],
        grossPay: 9262,
        taxDeduction: 2130,
        pensionDeduction: 463,
        healthInsuranceDeduction: 200,
        totalDeductions: 2793,
        netPay: 6469,
        paymentMethod: 'Direct Bank Transfer (ACH)',
        status: 'paid',
        generatedDate: '2026-07-31'
      }
    ]
  },
  {
    id: 'pay-2026-08',
    code: 'PAY-2026-08',
    title: 'August 2026 Workforce Payroll Cycle',
    periodMonth: 'August 2026',
    periodStart: '2026-08-01',
    periodEnd: '2026-08-31',
    status: 'draft',
    totalGross: 98350,
    totalDeductions: 22620,
    totalNet: 75730,
    employeeCount: 10,
    createdAt: '2026-08-10T08:00:00.000Z',
    currency: 'USD',
    payslips: [
      {
        id: 'ps-08-001',
        employeeId: 'emp-001',
        employeeCode: 'EMP-1001',
        employeeName: 'Eleanor Vance',
        department: 'Executive Board',
        position: 'Chief Executive Officer',
        bankDetails: {
          bankName: 'JPMorgan Chase',
          accountNumber: '•••• 4892',
          accountName: 'Eleanor Vance',
          routingNumber: '021000021'
        },
        baseSalary: 14500,
        workingDays: 21,
        presentDays: 21,
        absentDays: 0,
        overtimeHours: 0,
        overtimeRate: 85,
        overtimePay: 0,
        allowances: [
          { id: 'al-1', name: 'Executive Transport Stipend', amount: 800 },
          { id: 'al-2', name: 'Communications Allowance', amount: 200 }
        ],
        deductions: [],
        grossPay: 15500,
        taxDeduction: 3565,
        pensionDeduction: 775,
        healthInsuranceDeduction: 350,
        totalDeductions: 4690,
        netPay: 10810,
        paymentMethod: 'Direct Bank Transfer (ACH)',
        status: 'draft',
        generatedDate: '2026-08-10'
      },
      {
        id: 'ps-08-002',
        employeeId: 'emp-002',
        employeeCode: 'EMP-1002',
        employeeName: 'Marcus Chen',
        department: 'Human Resources',
        position: 'Head of People & Talent',
        bankDetails: {
          bankName: 'Bank of America',
          accountNumber: '•••• 9124',
          accountName: 'Marcus Chen',
          routingNumber: '121000358'
        },
        baseSalary: 9200,
        workingDays: 21,
        presentDays: 21,
        absentDays: 0,
        overtimeHours: 0,
        overtimeRate: 54,
        overtimePay: 0,
        allowances: [
          { id: 'al-hr', name: 'Talent Acquisition Bonus', amount: 500 }
        ],
        deductions: [],
        grossPay: 9700,
        taxDeduction: 2231,
        pensionDeduction: 485,
        healthInsuranceDeduction: 220,
        totalDeductions: 2936,
        netPay: 6764,
        paymentMethod: 'Direct Bank Transfer (ACH)',
        status: 'draft',
        generatedDate: '2026-08-10'
      },
      {
        id: 'ps-08-005',
        employeeId: 'emp-005',
        employeeCode: 'EMP-1005',
        employeeName: 'Amara Okafor',
        department: 'Engineering',
        position: 'Senior Full Stack Engineer',
        bankDetails: {
          bankName: 'Chase Bank',
          accountNumber: '•••• 5521',
          accountName: 'Amara Okafor',
          routingNumber: '021000021'
        },
        baseSalary: 8800,
        workingDays: 21,
        presentDays: 21,
        absentDays: 0,
        overtimeHours: 8,
        overtimeRate: 78,
        overtimePay: 624,
        allowances: [
          { id: 'al-4', name: 'Remote Connectivity', amount: 150 }
        ],
        deductions: [],
        grossPay: 9574,
        taxDeduction: 2202,
        pensionDeduction: 478,
        healthInsuranceDeduction: 200,
        totalDeductions: 2880,
        netPay: 6694,
        paymentMethod: 'Direct Bank Transfer (ACH)',
        status: 'draft',
        generatedDate: '2026-08-10'
      }
    ]
  }
];

export const INITIAL_JOB_OPENINGS: JobOpening[] = [
  {
    id: 'job-001',
    title: 'Senior Distributed Systems Architect',
    department: 'Engineering',
    location: 'Seattle, WA (Hybrid)',
    employmentType: 'Full-time',
    salaryRange: '$140,000 - $175,000',
    experienceLevel: '6+ years',
    openPositions: 2,
    status: 'Active',
    requirements: [
      'Expertise with Node.js, TypeScript, PostgreSQL, and Redis caching',
      'Track record building high-throughput event queues (BullMQ, Kafka)',
      'Experience in ERP / enterprise microservices architectures'
    ],
    description: 'Lead the architecture of our core workforce ERP engine and real-time biometric access processing pipelines.',
    postedDate: '2026-07-20',
    applicantsCount: 8
  },
  {
    id: 'job-002',
    title: 'Senior Product Manager - Workforce Solutions',
    department: 'Product & Design',
    location: 'Seattle, WA / Remote',
    employmentType: 'Full-time',
    salaryRange: '$125,000 - $155,000',
    experienceLevel: '4+ years',
    openPositions: 1,
    status: 'Active',
    requirements: [
      'Prior PM experience scaling B2B SaaS or ERP/HRIS software',
      'Strong data-driven analytical background and customer discovery skills',
      'Familiarity with payroll tax compliance and attendance workflows'
    ],
    description: 'Drive the product roadmap for our flagship BizFlow workforce suite and mobile companion applications.',
    postedDate: '2026-07-28',
    applicantsCount: 5
  },
  {
    id: 'job-003',
    title: 'Lead Financial Analyst & Auditor',
    department: 'Finance & Accounting',
    location: 'Seattle, WA (Onsite)',
    employmentType: 'Full-time',
    salaryRange: '$95,000 - $120,000',
    experienceLevel: '3+ years',
    openPositions: 1,
    status: 'Active',
    requirements: [
      'CPA or equivalent finance certification',
      'Experience in multi-entity corporate payroll reconciliation and tax filing',
      'Proficiency with automated ERP ledger integrations'
    ],
    description: 'Oversee corporate expense audits, balance sheet reconciliation, and payroll snapshot verifications.',
    postedDate: '2026-08-02',
    applicantsCount: 4
  }
];

export const INITIAL_APPLICANTS: Applicant[] = [
  {
    id: 'app-001',
    jobOpeningId: 'job-001',
    jobTitle: 'Senior Distributed Systems Architect',
    name: 'Siddharth Nair',
    email: 'siddharth.nair@example.com',
    phone: '+1 (555) 781-9923',
    currentCompany: 'Apex Cloud Systems',
    yearsOfExperience: 7,
    stage: 'INTERVIEW',
    aiMatchScore: 94,
    aiMatchAnalysis: 'Exceptional fit with high throughput Node.js / PostgreSQL streaming and enterprise ERP background. Strong architectural communication.',
    strengths: ['PostgreSQL optimization', 'Distributed Redis event queues', 'RBAC & Multi-tenant security'],
    gaps: ['Needs quick onboarding on custom hardware QR biometric drivers'],
    resumeSummary: 'Principal Backend Engineer with 7 years scaling enterprise SaaS platforms from 10k to 500k DAU.',
    skills: ['TypeScript', 'Node.js', 'PostgreSQL', 'Prisma', 'BullMQ', 'Docker', 'Kubernetes'],
    rating: 5,
    appliedDate: '2026-08-01',
    interviewDate: '2026-08-16 14:00 PST',
    notes: [
      { id: 'n-1', author: 'Marcus Chen', text: 'Screening passed effortlessly. High system design aptitude.', date: '2026-08-03' }
    ]
  },
  {
    id: 'app-002',
    jobOpeningId: 'job-001',
    jobTitle: 'Senior Distributed Systems Architect',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    phone: '+1 (555) 892-1102',
    currentCompany: 'FinTech Dynamics',
    yearsOfExperience: 6,
    stage: 'OFFER',
    aiMatchScore: 91,
    aiMatchAnalysis: 'Superb transactional database experience and high-reliability payments / payroll calculation background.',
    strengths: ['Financial precision', 'Idempotent API design', 'TypeScript mastery'],
    gaps: ['Primarily AWS stack, minimal GCP background'],
    resumeSummary: 'Lead Infrastructure Engineer specializing in ACID compliant financial ledgers and real-time audit trails.',
    skills: ['Node.js', 'TypeScript', 'SQL', 'Event Sourcing', 'Kafka', 'Redis'],
    rating: 5,
    appliedDate: '2026-07-25',
    notes: [
      { id: 'n-2', author: 'David Alvarez', text: 'Executive team approved offer package. Awaiting candidate signature.', date: '2026-08-12' }
    ]
  },
  {
    id: 'app-003',
    jobOpeningId: 'job-002',
    jobTitle: 'Senior Product Manager - Workforce Solutions',
    name: 'Kofi Mensah',
    email: 'kofi.mensah@example.com',
    phone: '+1 (555) 670-3499',
    currentCompany: 'HumanCapital Tech',
    yearsOfExperience: 5,
    stage: 'SCREENING',
    aiMatchScore: 88,
    aiMatchAnalysis: 'Strong product background in HRIS and time-tracking systems. Great user research methodologies.',
    strengths: ['HRIS domain knowledge', 'Cross-functional leadership', 'UI/UX precision'],
    gaps: ['Less technical background on raw biometric firmware'],
    resumeSummary: 'Senior PM with 5 years experience launching B2B workforce management solutions for enterprise clients.',
    skills: ['Product Strategy', 'Roadmapping', 'User Research', 'Figma', 'SQL Analytics', 'Jira'],
    rating: 4,
    appliedDate: '2026-08-05',
    notes: [
      { id: 'n-3', author: 'Marcus Chen', text: 'Phone screen scheduled for tomorrow at 10 AM.', date: '2026-08-08' }
    ]
  },
  {
    id: 'app-004',
    jobOpeningId: 'job-003',
    jobTitle: 'Lead Financial Analyst & Auditor',
    name: 'Rachel Sterling',
    email: 'rachel.sterling@example.com',
    phone: '+1 (555) 431-8890',
    currentCompany: 'Deloitte Consulting',
    yearsOfExperience: 4,
    stage: 'APPLIED',
    aiMatchScore: 85,
    aiMatchAnalysis: 'CPA certified with Big 4 auditing background. Highly proficient with corporate reconciliation.',
    strengths: ['CPA Certified', 'SOX Compliance', 'ERP Ledger Integration'],
    gaps: ['Wants 100% remote flexibility'],
    resumeSummary: 'Audit Manager with Big 4 credentials focusing on corporate tech sector audits and payroll compliance.',
    skills: ['Financial Auditing', 'Payroll Tax Reconciliation', 'SAP', 'Excel Macro Automation', 'GAAP'],
    rating: 4,
    appliedDate: '2026-08-11',
    notes: []
  },
  {
    id: 'app-005',
    jobOpeningId: 'job-001',
    jobTitle: 'Senior Distributed Systems Architect',
    name: 'Mateo Hernandez',
    email: 'mateo.hernandez@example.com',
    phone: '+1 (555) 902-7711',
    currentCompany: 'CloudScale Labs',
    yearsOfExperience: 8,
    stage: 'HIRED',
    aiMatchScore: 96,
    aiMatchAnalysis: 'Flawless background in distributed microservices and real-time telemetry processing.',
    strengths: ['High-throughput systems', 'Mentorship', 'DevOps automation'],
    gaps: [],
    resumeSummary: 'Former Staff Engineer at CloudScale Labs with 8 years building enterprise distributed services.',
    skills: ['Go', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'WebSockets', 'Terraform'],
    rating: 5,
    appliedDate: '2026-07-15',
    notes: [
      { id: 'n-4', author: 'Eleanor Vance', text: 'Offer accepted! Starting onboarding sequence on September 1st.', date: '2026-08-10' }
    ]
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    code: 'PRJ-ENG-01',
    title: 'Workforce Biometric Access Gateway v2.4',
    client: 'Internal Enterprise Infrastructure',
    department: 'Engineering',
    description: 'Next-generation low-latency QR scan ingestion pipeline with sub-100ms attendance reconciliation and biometric fallback drivers.',
    status: 'In Progress',
    leadId: 'emp-004',
    leadName: 'David Alvarez',
    leadAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    teamMembers: [
      { id: 'emp-004', name: 'David Alvarez', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', role: 'Tech Lead' },
      { id: 'emp-005', name: 'Amara Okafor', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80', role: 'Full Stack Engineer' },
      { id: 'emp-009', name: 'Fatima Al-Mansoor', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', role: 'QA & DevOps' }
    ],
    budget: 45000,
    budgetAllocated: 45000,
    budgetReceived: 45000,
    spent: 28500,
    currency: 'USD',
    startDate: '2026-06-01',
    endDate: '2026-09-15',
    dueDate: '2026-09-15',
    progressPercent: 68,
    tasksCount: 14,
    completedTasksCount: 9,
    priority: 'High',
    milestones: [
      { id: 'm-1', title: 'Architecture RFC Approval', dueDate: '2026-06-15', completed: true },
      { id: 'm-2', title: 'Scanner Firmware Ingestion Hook', dueDate: '2026-07-20', completed: true },
      { id: 'm-3', title: 'Load testing & latency benchmarks', dueDate: '2026-08-30', completed: false }
    ]
  },
  {
    id: 'proj-002',
    code: 'PRJ-FIN-02',
    title: 'Automated Multi-Tier Tax & Payroll Engine',
    client: 'Global Finance & Compliance',
    department: 'Finance & Accounting',
    description: 'Instant snapshot payroll compilation module supporting multi-jurisdictional deduction tables, pension accruals, and direct wire transfers.',
    status: 'In Progress',
    leadId: 'emp-003',
    leadName: 'Sophia Patel',
    leadAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    teamMembers: [
      { id: 'emp-003', name: 'Sophia Patel', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', role: 'Finance Lead' },
      { id: 'emp-005', name: 'Amara Okafor', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80', role: 'Senior Engineer' }
    ],
    budget: 32000,
    budgetAllocated: 32000,
    budgetReceived: 26000,
    spent: 19400,
    currency: 'USD',
    startDate: '2026-07-01',
    endDate: '2026-10-01',
    dueDate: '2026-10-01',
    progressPercent: 55,
    tasksCount: 10,
    completedTasksCount: 6,
    priority: 'Critical',
    milestones: [
      { id: 'm-4', title: 'Tax Formula Rule Definitions', dueDate: '2026-07-15', completed: true },
      { id: 'm-5', title: 'Bank ACH Batch Transfer Generator', dueDate: '2026-08-25', completed: false }
    ]
  },
  {
    id: 'proj-003',
    code: 'PRJ-PRD-03',
    title: 'Workforce Mobile ID & Presence Scanner (Expo)',
    client: 'Field Operations & Remote Workforce',
    department: 'Product & Design',
    description: 'Native mobile companion app for employee self-service, real-time digital badge QR display, leave requests, and instant gate check-in.',
    status: 'In Progress',
    leadId: 'emp-006',
    leadName: 'Lucas Moretti',
    leadAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    teamMembers: [
      { id: 'emp-006', name: 'Lucas Moretti', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', role: 'UX/UI Lead' },
      { id: 'emp-005', name: 'Amara Okafor', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80', role: 'React Native Dev' }
    ],
    budget: 28000,
    budgetAllocated: 28000,
    budgetReceived: 28000,
    spent: 12100,
    currency: 'USD',
    startDate: '2026-07-15',
    endDate: '2026-09-30',
    dueDate: '2026-09-30',
    progressPercent: 42,
    tasksCount: 12,
    completedTasksCount: 5,
    priority: 'Medium',
    milestones: [
      { id: 'm-6', title: 'Figma Design System & Prototypes', dueDate: '2026-07-28', completed: true },
      { id: 'm-7', title: 'Offline Token Caching Module', dueDate: '2026-08-20', completed: false }
    ]
  },
  {
    id: 'proj-004',
    code: 'PRJ-OPS-04',
    title: 'Warehouse Automated RFID Inventory Tracking',
    client: 'Supply Chain & Fulfillment Depot',
    department: 'Operations & Logistics',
    description: 'Hardware installation of high-range UHF RFID antennas for automated pallet scanning and real-time inventory ledger updates.',
    status: 'Paused',
    leadId: 'emp-008',
    leadName: 'Kenji Takahashi',
    leadAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    teamMembers: [
      { id: 'emp-008', name: 'Kenji Takahashi', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', role: 'Logistics Lead' },
      { id: 'emp-010', name: 'Liam O\'Connor', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', role: 'Infra Specialist' }
    ],
    budget: 52000,
    budgetAllocated: 52000,
    budgetReceived: 35000,
    spent: 24800,
    currency: 'USD',
    startDate: '2026-05-10',
    endDate: '2026-11-15',
    dueDate: '2026-11-15',
    progressPercent: 35,
    tasksCount: 8,
    completedTasksCount: 3,
    priority: 'Medium',
    milestones: [
      { id: 'm-8', title: 'Hardware vendor procurement', dueDate: '2026-05-30', completed: true },
      { id: 'm-9', title: 'Bay 1 antenna calibration', dueDate: '2026-06-25', completed: false }
    ]
  },
  {
    id: 'proj-005',
    code: 'PRJ-SEC-05',
    title: 'SOC2 Type II Compliance & Zero Trust Audit',
    client: 'Enterprise Risk & InfoSec Committee',
    department: 'Quality & Compliance',
    description: 'Comprehensive organizational security auditing, automated role-based access review (RBAC), and external penetration testing preparation.',
    status: 'Planning',
    leadId: 'emp-009',
    leadName: 'Fatima Al-Mansoor',
    leadAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    teamMembers: [
      { id: 'emp-009', name: 'Fatima Al-Mansoor', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', role: 'Security Lead' },
      { id: 'emp-001', name: 'Eleanor Vance', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', role: 'Executive Sponsor' }
    ],
    budget: 38000,
    budgetAllocated: 38000,
    budgetReceived: 15000,
    spent: 4200,
    currency: 'USD',
    startDate: '2026-08-15',
    endDate: '2026-12-31',
    dueDate: '2026-12-31',
    progressPercent: 12,
    tasksCount: 6,
    completedTasksCount: 1,
    priority: 'High',
    milestones: [
      { id: 'm-10', title: 'Vendor gap assessment audit', dueDate: '2026-09-01', completed: false }
    ]
  },
  {
    id: 'proj-006',
    code: 'PRJ-HR-06',
    title: 'Workforce Onboarding Automation & ATS Portal',
    client: 'People Operations & Talent Acquisition',
    department: 'Human Resources',
    description: 'Automated candidate hiring pipeline, resume screening scoring with Gemini AI, digital ID badge auto-provisioning, and document signing.',
    status: 'Finished',
    leadId: 'emp-002',
    leadName: 'Marcus Chen',
    leadAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    teamMembers: [
      { id: 'emp-002', name: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', role: 'HR Lead' },
      { id: 'emp-005', name: 'Amara Okafor', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80', role: 'Full Stack Dev' }
    ],
    budget: 24000,
    budgetAllocated: 24000,
    budgetReceived: 24000,
    spent: 23600,
    currency: 'USD',
    startDate: '2026-04-01',
    endDate: '2026-07-31',
    dueDate: '2026-07-31',
    progressPercent: 100,
    tasksCount: 11,
    completedTasksCount: 11,
    priority: 'Medium',
    milestones: [
      { id: 'm-11', title: 'ATS Workflow Integration', dueDate: '2026-05-15', completed: true },
      { id: 'm-12', title: 'Automated Offer Letter Engine', dueDate: '2026-06-30', completed: true },
      { id: 'm-13', title: 'Final User Acceptance Testing', dueDate: '2026-07-28', completed: true }
    ]
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'tsk-001',
    projectId: 'proj-001',
    projectCode: 'PRJ-BIZ-01',
    projectTitle: 'Workforce Biometric Access Gateway v2.4',
    title: 'Implement append-only access_logs raw ingest stream',
    description: 'Ensure scanner terminal writes directly to access_logs without modifying attendance table.',
    assignedToId: 'emp-005',
    assignedToName: 'Amara Okafor',
    assignedToAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    priority: 'High',
    status: 'Done',
    estimatedHours: 16,
    loggedHours: 14,
    dueDate: '2026-08-08',
    createdDate: '2026-08-01',
    tags: ['Backend', 'AccessLogs', 'Prisma']
  },
  {
    id: 'tsk-002',
    projectId: 'proj-001',
    projectCode: 'PRJ-BIZ-01',
    projectTitle: 'Workforce Biometric Access Gateway v2.4',
    title: 'Build automated daily attendance rollup background calculation job',
    description: 'Aggregate first IN, last OUT, overtime hours, and late flags into attendance rollup records.',
    assignedToId: 'emp-004',
    assignedToName: 'David Alvarez',
    assignedToAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    priority: 'Urgent',
    status: 'Done',
    estimatedHours: 20,
    loggedHours: 18,
    dueDate: '2026-08-11',
    createdDate: '2026-08-02',
    tags: ['BackgroundJob', 'Attendance', 'BullMQ']
  },
  {
    id: 'tsk-003',
    projectId: 'proj-001',
    projectCode: 'PRJ-BIZ-01',
    projectTitle: 'Workforce Biometric Access Gateway v2.4',
    title: 'Real-time live presence counter (COUNT last scan = IN)',
    description: 'Dynamic in-building presence calculation without mutable counters.',
    assignedToId: 'emp-005',
    assignedToName: 'Amara Okafor',
    assignedToAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    priority: 'High',
    status: 'InProgress',
    estimatedHours: 12,
    loggedHours: 8,
    dueDate: '2026-08-16',
    createdDate: '2026-08-05',
    tags: ['Realtime', 'WebSocket', 'Dashboard']
  },
  {
    id: 'tsk-004',
    projectId: 'proj-002',
    projectCode: 'PRJ-PAY-02',
    projectTitle: 'Automated Multi-Tier Tax Engine',
    title: 'Snapshot payroll freezing engine (draft -> approved -> paid)',
    description: 'Create immutable snapshot payloads upon approval to lock payslip history against retroactive changes.',
    assignedToId: 'emp-003',
    assignedToName: 'Sophia Patel',
    assignedToAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    priority: 'High',
    status: 'InProgress',
    estimatedHours: 18,
    loggedHours: 12,
    dueDate: '2026-08-18',
    createdDate: '2026-08-06',
    tags: ['Finance', 'Payroll', 'Audit']
  },
  {
    id: 'tsk-005',
    projectId: 'proj-003',
    projectCode: 'PRJ-APP-03',
    projectTitle: 'Workforce Mobile ID & Presence Scanner (Expo)',
    title: 'Design high-contrast digital employee identification badge with QR payload',
    description: 'Craft beautiful corporate ID badge with employee photo, department badge, and dynamic verification code.',
    assignedToId: 'emp-006',
    assignedToName: 'Lucas Moretti',
    assignedToAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    priority: 'Medium',
    status: 'Done',
    estimatedHours: 14,
    loggedHours: 14,
    dueDate: '2026-08-10',
    createdDate: '2026-08-03',
    tags: ['Design', 'Figma', 'MobileBadge']
  },
  {
    id: 'tsk-006',
    projectId: 'proj-003',
    projectCode: 'PRJ-APP-03',
    projectTitle: 'Workforce Mobile ID & Presence Scanner (Expo)',
    title: 'Camera hardware scanner integration with haptic beep feedback',
    description: 'Integrate Expo Barcode / Camera scanner module with immediate visual verification card.',
    assignedToId: 'emp-005',
    assignedToName: 'Amara Okafor',
    assignedToAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    priority: 'High',
    status: 'Todo',
    estimatedHours: 16,
    loggedHours: 0,
    dueDate: '2026-08-22',
    createdDate: '2026-08-10',
    tags: ['Mobile', 'Camera', 'QR']
  }
];

export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'ast-001',
    code: 'AST-1001',
    name: 'MacBook Pro 16" M3 Max (64GB RAM)',
    category: 'Hardware',
    model: 'Apple A2991 Space Black',
    serialNumber: 'C02G8901L98',
    status: 'Assigned',
    condition: 'New',
    purchaseValue: 3499,
    purchaseDate: '2024-02-10',
    assignedToId: 'emp-004',
    assignedToName: 'David Alvarez',
    assignedDate: '2024-02-12',
    location: 'Engineering Department (Floor 4)',
    lastMaintenanceDate: '2026-05-10',
    warrantyExpiry: '2027-02-10'
  },
  {
    id: 'ast-002',
    code: 'AST-1002',
    name: 'Dell UltraSharp 32" 4K Thunderbolt Monitor',
    category: 'Hardware',
    model: 'Dell U3223QE',
    serialNumber: 'CN-098K41-71618',
    status: 'Assigned',
    condition: 'Good',
    purchaseValue: 899,
    purchaseDate: '2023-08-15',
    assignedToId: 'emp-006',
    assignedToName: 'Lucas Moretti',
    assignedDate: '2023-08-16',
    location: 'Design Studio Desk #14',
    lastMaintenanceDate: '2026-04-20',
    warrantyExpiry: '2026-08-15'
  },
  {
    id: 'ast-003',
    code: 'AST-1003',
    name: 'Tesla Model Y Long Range (Company Fleet #02)',
    category: 'Vehicle',
    model: 'Tesla Model Y Dual Motor AWD',
    serialNumber: '5YJYGDED8NF492011',
    status: 'Assigned',
    condition: 'Good',
    purchaseValue: 48900,
    purchaseDate: '2023-05-20',
    assignedToId: 'emp-001',
    assignedToName: 'Eleanor Vance',
    assignedDate: '2023-05-22',
    location: 'Corporate Garage Bay 01',
    lastMaintenanceDate: '2026-06-15',
    warrantyExpiry: '2027-05-20'
  },
  {
    id: 'ast-004',
    code: 'AST-1004',
    name: 'Zebra Enterprise Biometric Gate Scanner Station',
    category: 'Office Equipment',
    model: 'Zebra TC58 Enterprise Terminal',
    serialNumber: 'ZBR-99812-US',
    status: 'Available',
    condition: 'New',
    purchaseValue: 1250,
    purchaseDate: '2024-04-10',
    location: 'Main Reception Reserve Bay',
    lastMaintenanceDate: '2026-07-01',
    warrantyExpiry: '2027-04-10'
  },
  {
    id: 'ast-005',
    code: 'AST-1005',
    name: 'High-Security Master Server Room RFID Keycard #04',
    category: 'Keycard',
    model: 'HID iCLASS SEOS 8k',
    serialNumber: 'HID-8839-004',
    status: 'Assigned',
    condition: 'Good',
    purchaseValue: 45,
    purchaseDate: '2024-01-05',
    assignedToId: 'emp-005',
    assignedToName: 'Amara Okafor',
    assignedDate: '2024-01-10',
    location: 'Security Operations Safe',
    lastMaintenanceDate: '2026-01-10'
  },
  {
    id: 'ast-006',
    code: 'AST-1006',
    name: 'Forklift Toyota 8FGU25 (Warehouse Yard)',
    category: 'Vehicle',
    model: 'Toyota Core IC Pneumatic',
    serialNumber: 'TYT-8FGU-88219',
    status: 'Assigned',
    condition: 'Fair',
    purchaseValue: 27500,
    purchaseDate: '2022-09-10',
    assignedToId: 'emp-008',
    assignedToName: 'Kenji Takahashi',
    assignedDate: '2022-09-15',
    location: 'Warehouse Logistics Loading Dock B',
    lastMaintenanceDate: '2026-07-22',
    warrantyExpiry: '2025-09-10'
  }
];

export const INITIAL_EXPENSES: ExpenseClaim[] = [
  {
    id: 'exp-001',
    code: 'EXP-2026-081',
    employeeId: 'emp-007',
    employeeName: 'Tanya Kowalski',
    department: 'Sales & Growth',
    category: 'Client Dinner',
    amount: 342.50,
    currency: 'USD',
    description: 'Quarterly partnership dinner with CloudNexus Enterprise stakeholders.',
    status: 'Approved',
    submittedDate: '2026-08-08',
    reviewedDate: '2026-08-09',
    reviewedBy: 'Sophia Patel'
  },
  {
    id: 'exp-002',
    code: 'EXP-2026-082',
    employeeId: 'emp-004',
    employeeName: 'David Alvarez',
    department: 'Engineering',
    category: 'Software',
    amount: 1200.00,
    currency: 'USD',
    description: 'Annual team subscription for JetBrains Ultimate & Datadog APM licenses.',
    status: 'Approved',
    submittedDate: '2026-08-05',
    reviewedDate: '2026-08-06',
    reviewedBy: 'Sophia Patel'
  },
  {
    id: 'exp-003',
    code: 'EXP-2026-083',
    employeeId: 'emp-008',
    employeeName: 'Kenji Takahashi',
    department: 'Operations & Logistics',
    category: 'Hardware',
    amount: 580.00,
    currency: 'USD',
    description: 'Heavy duty thermal label printer and replacement scanner battery packs.',
    status: 'Pending',
    submittedDate: '2026-08-12'
  },
  {
    id: 'exp-004',
    code: 'EXP-2026-084',
    employeeId: 'emp-002',
    employeeName: 'Marcus Chen',
    department: 'Human Resources',
    category: 'Training',
    amount: 750.00,
    currency: 'USD',
    description: 'SHRM Enterprise Executive Talent & Diversity certification program.',
    status: 'Reimbursed',
    submittedDate: '2026-07-25',
    reviewedDate: '2026-07-26',
    reviewedBy: 'Sophia Patel'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2026-0801',
    clientName: 'Meridian Global Logistics Corp',
    clientEmail: 'billing@meridianglobal.com',
    clientAddress: '100 Wall Street, Suite 2400, New York, NY',
    issueDate: '2026-08-01',
    dueDate: '2026-08-31',
    items: [
      { id: 'item-1', description: 'Enterprise Workforce ERP Platform License (500 Seats)', quantity: 1, unitPrice: 15000, total: 15000 },
      { id: 'item-2', description: 'Dedicated Cloud Gateway & Biometric Hardware Setup', quantity: 2, unitPrice: 2500, total: 5000 },
      { id: 'item-3', description: 'Custom Payroll Multi-Tax Rule Integration', quantity: 1, unitPrice: 4500, total: 4500 }
    ],
    subtotal: 24500,
    taxRate: 0.08,
    taxAmount: 1960,
    totalAmount: 26460,
    currency: 'USD',
    status: 'Sent',
    notes: 'Payment terms net 30 days. Wire transfer preferred.'
  },
  {
    id: 'inv-002',
    invoiceNumber: 'INV-2026-0792',
    clientName: 'AeroTech Systems Inc',
    clientEmail: 'accounts@aerotech.io',
    clientAddress: '450 Innovation Parkway, Austin, TX',
    issueDate: '2026-07-15',
    dueDate: '2026-08-15',
    items: [
      { id: 'item-4', description: 'BizFlow ATS & Smart Recruitment Engine Add-on', quantity: 1, unitPrice: 8500, total: 8500 },
      { id: 'item-5', description: 'Employee Attendance & Shift Rollup Automation Support', quantity: 1, unitPrice: 3200, total: 3200 }
    ],
    subtotal: 11700,
    taxRate: 0.08,
    taxAmount: 936,
    totalAmount: 12636,
    currency: 'USD',
    status: 'Paid',
    notes: 'Paid in full via ACH on August 10, 2026.'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-001',
    timestamp: `${todayStr}T08:14:22.000Z`,
    userId: 'user-admin',
    userName: 'Eleanor Vance',
    role: 'ADMIN',
    action: 'BADGE_SCAN_IN',
    module: 'Access Control',
    details: 'QR Scan verified at Executive East Gate. Presence state updated to INSIDE.',
    status: 'SUCCESS'
  },
  {
    id: 'aud-002',
    timestamp: `${todayStr}T08:24:10.000Z`,
    userId: 'user-hr',
    userName: 'Marcus Chen',
    role: 'HR_MANAGER',
    action: 'BADGE_SCAN_IN',
    module: 'Access Control',
    details: 'QR Scan verified at Main Lobby Turnstile 01. Presence state updated to INSIDE.',
    status: 'SUCCESS'
  },
  {
    id: 'aud-003',
    timestamp: `${todayStr}T08:48:30.000Z`,
    userId: 'emp-006',
    userName: 'Lucas Moretti',
    role: 'EMPLOYEE',
    action: 'ATTENDANCE_LATE_FLAG',
    module: 'Attendance Engine',
    details: 'Calculated 18 minutes late arrival against scheduled 08:30 shift.',
    status: 'WARNING'
  },
  {
    id: 'aud-004',
    timestamp: '2026-08-12T14:20:00.000Z',
    userId: 'user-admin',
    userName: 'Eleanor Vance',
    role: 'ADMIN',
    action: 'APPLICANT_STAGE_ADVANCED',
    module: 'Recruitment ATS',
    details: 'Candidate Mateo Hernandez transitioned to HIRED stage for Senior Distributed Systems Architect opening.',
    status: 'SUCCESS'
  },
  {
    id: 'aud-005',
    timestamp: '2026-08-10T08:00:00.000Z',
    userId: 'user-finance',
    userName: 'Sophia Patel',
    role: 'FINANCE_DIRECTOR',
    action: 'PAYROLL_CYCLE_GENERATED',
    module: 'Payroll Management',
    details: 'Generated August 2026 Draft payroll run for 10 active employees. Total Gross: $98,350.00.',
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

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'ven-001',
    name: 'Apex Cloud & Infrastructure Inc.',
    category: 'Hardware & Cloud',
    contactPerson: 'Rachel Sterling',
    email: 'rachel@apexcloud.io',
    phone: '+1 (555) 302-8819',
    rating: 4.9,
    paymentTerms: 'Net 30',
    status: 'Active',
    totalSpend: 142000
  },
  {
    id: 'ven-002',
    name: 'Silicon Valley Biometrics Corp',
    category: 'Hardware & Cloud',
    contactPerson: 'Victor Vance',
    email: 'victor@svbiometrics.com',
    phone: '+1 (555) 441-2099',
    rating: 4.8,
    paymentTerms: 'Net 15',
    status: 'Active',
    totalSpend: 56000
  },
  {
    id: 'ven-003',
    name: 'Nordic Office Logistics & Ergonomics',
    category: 'Office & Facilities',
    contactPerson: 'Freja Lindqvist',
    email: 'freja@nordicfurniture.se',
    phone: '+1 (555) 912-3301',
    rating: 4.7,
    paymentTerms: 'Net 30',
    status: 'Active',
    totalSpend: 28400
  },
  {
    id: 'ven-004',
    name: 'Global Freight & Express Forwarding',
    category: 'Logistics & Freight',
    contactPerson: 'Tariq Al-Mansoor',
    email: 'dispatch@globalfreight.net',
    phone: '+1 (555) 782-9011',
    rating: 4.6,
    paymentTerms: 'Net 15',
    status: 'Active',
    totalSpend: 19800
  }
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-001',
    poNumber: 'PO-2026-081',
    vendorId: 'ven-001',
    vendorName: 'Apex Cloud & Infrastructure Inc.',
    requestedBy: 'David Alvarez',
    department: 'Engineering',
    status: 'Delivered',
    items: [
      { id: 'poi-1', name: 'GPU Cluster Compute Nodes (H100 NVLink)', sku: 'SRV-H100-NODE', quantity: 2, unitPrice: 32000, total: 64000 },
      { id: 'poi-2', name: 'Managed Kubernetes Ingress Gateway', sku: 'K8S-INGRESS-PRO', quantity: 1, unitPrice: 4200, total: 4200 }
    ],
    totalAmount: 68200,
    currency: 'USD',
    orderDate: '2026-08-01',
    expectedDelivery: '2026-08-10',
    actualDelivery: '2026-08-09',
    trackingNumber: 'FX-8892019482',
    carrier: 'FedEx Priority Freight',
    notes: 'Q3 Machine Learning & Telemetry cluster expansion.'
  },
  {
    id: 'po-002',
    poNumber: 'PO-2026-082',
    vendorId: 'ven-002',
    vendorName: 'Silicon Valley Biometrics Corp',
    requestedBy: 'Marcus Chen',
    department: 'Human Resources',
    status: 'Ordered',
    items: [
      { id: 'poi-3', name: 'NFC-v4 Biometric Gate Scanners', sku: 'BIO-NFC-V4', quantity: 4, unitPrice: 1850, total: 7400 },
      { id: 'poi-4', name: 'Cryptographic QR Badge Printers', sku: 'BADGE-PRT-SEC', quantity: 2, unitPrice: 1200, total: 2400 }
    ],
    totalAmount: 9800,
    currency: 'USD',
    orderDate: '2026-08-11',
    expectedDelivery: '2026-08-18',
    trackingNumber: 'UPS-1Z992A01948',
    carrier: 'UPS Worldwide Express',
    notes: 'Access control upgrade for 4th floor R&D labs.'
  },
  {
    id: 'po-003',
    poNumber: 'PO-2026-083',
    vendorId: 'ven-003',
    vendorName: 'Nordic Office Logistics & Ergonomics',
    requestedBy: 'Eleanor Vance',
    department: 'Operations',
    status: 'Requested',
    items: [
      { id: 'poi-5', name: 'Ergonomic Motorized Sit-Stand Desks', sku: 'DSK-SIT-STND', quantity: 12, unitPrice: 650, total: 7800 },
      { id: 'poi-6', name: 'High-Mesh Executive Task Chairs', sku: 'CHR-EXEC-MESH', quantity: 12, unitPrice: 420, total: 5040 }
    ],
    totalAmount: 12840,
    currency: 'USD',
    orderDate: '2026-08-13',
    expectedDelivery: '2026-08-25',
    notes: 'New engineering wing workstation provisioning.'
  }
];

export const INITIAL_MICROSERVICES: Microservice[] = [
  {
    id: 'srv-001',
    name: 'Auth & Biometric Gate Ingress',
    code: 'SVC-AUTH-GATE',
    status: 'Healthy',
    uptimePercent: 99.98,
    latencyMs: 18,
    version: 'v2.8.4',
    techStack: ['Go', 'gRPC', 'PostgreSQL', 'Redis'],
    leadEngineer: 'Amara Okafor',
    repository: 'github.com/comfortbizflow/auth-gate-ingress',
    lastDeployed: '2026-08-13 18:42'
  },
  {
    id: 'srv-002',
    name: 'Payroll Engine & Rollup Streamer',
    code: 'SVC-PAYROLL-ROLLUP',
    status: 'Healthy',
    uptimePercent: 99.95,
    latencyMs: 34,
    version: 'v3.1.0',
    techStack: ['Node.js', 'TypeScript', 'BullMQ', 'PostgreSQL'],
    leadEngineer: 'Devon Miller',
    repository: 'github.com/comfortbizflow/payroll-stream-engine',
    lastDeployed: '2026-08-14 02:15'
  },
  {
    id: 'srv-003',
    name: 'Gemini AI Executive Telemetry Copilot',
    code: 'SVC-AI-INTELLIGENCE',
    status: 'Healthy',
    uptimePercent: 99.92,
    latencyMs: 120,
    version: 'v4.0.2',
    techStack: ['Python', 'FastAPI', 'Gemini 3.7 Flash', 'Milvus Vector DB'],
    leadEngineer: 'Amara Okafor',
    repository: 'github.com/comfortbizflow/ai-telemetry-copilot',
    lastDeployed: '2026-08-14 04:30'
  },
  {
    id: 'srv-004',
    name: 'ATS Resume Parser & Match Scoring',
    code: 'SVC-ATS-MATCH',
    status: 'Healthy',
    uptimePercent: 99.89,
    latencyMs: 85,
    version: 'v1.9.1',
    techStack: ['Python', 'LangChain', 'OCR-Tesseract', 'Redis'],
    leadEngineer: 'Mateo Hernandez',
    repository: 'github.com/comfortbizflow/ats-candidate-matcher',
    lastDeployed: '2026-08-12 11:10'
  }
];

export const INITIAL_DEPLOY_PIPELINES: DeployPipeline[] = [
  {
    id: 'dep-001',
    serviceId: 'srv-001',
    serviceName: 'Auth & Biometric Gate Ingress',
    branch: 'main',
    commitHash: '7b92f01',
    commitMessage: 'feat(qr-crypto): enforce SHA-256 rotating badge salt verification',
    author: 'Amara Okafor',
    status: 'SUCCESS',
    durationSeconds: 142,
    timestamp: '2026-08-13T18:42:00.000Z'
  },
  {
    id: 'dep-002',
    serviceId: 'srv-002',
    serviceName: 'Payroll Engine & Rollup Streamer',
    branch: 'release/v3.1.0',
    commitHash: '3c81e94',
    commitMessage: 'fix(tax-brackets): reconcile 2026 federal withholding formulas',
    author: 'Devon Miller',
    status: 'SUCCESS',
    durationSeconds: 98,
    timestamp: '2026-08-14T02:15:00.000Z'
  },
  {
    id: 'dep-003',
    serviceId: 'srv-003',
    serviceName: 'Gemini AI Executive Telemetry Copilot',
    branch: 'feat/workforce-trends',
    commitHash: '9a44d12',
    commitMessage: 'feat: add Recharts KPI synthesis & departmental velocity scoring',
    author: 'Eleanor Vance',
    status: 'SUCCESS',
    durationSeconds: 110,
    timestamp: '2026-08-14T04:30:00.000Z'
  }
];

export const INITIAL_CLIENT_ACCOUNTS: ClientAccount[] = [
  {
    id: 'acc-001',
    name: 'Horizon FinTech International',
    industry: 'Financial Services & Banking',
    tier: 'Enterprise',
    annualRevenue: 4800000,
    primaryContact: 'Charlotte Moreau',
    email: 'charlotte@horizonfintech.com',
    phone: '+1 (555) 789-0123',
    status: 'Active',
    openDealsCount: 2,
    lifetimeValue: 320000
  },
  {
    id: 'acc-002',
    name: 'Aether Cloud Data Systems',
    industry: 'Cloud Infrastructure & AI',
    tier: 'Enterprise',
    annualRevenue: 12000000,
    primaryContact: 'Liam O\'Connor',
    email: 'loconnor@aetherdata.io',
    phone: '+1 (555) 890-1234',
    status: 'Active',
    openDealsCount: 1,
    lifetimeValue: 480000
  },
  {
    id: 'acc-003',
    name: 'Veritas BioHealth & Genomics',
    industry: 'Life Sciences & Healthcare',
    tier: 'Growth',
    annualRevenue: 2400000,
    primaryContact: 'Dr. Sarah Jenkins',
    email: 'sjenkins@veritasgenomics.org',
    phone: '+1 (555) 901-2345',
    status: 'Onboarding',
    openDealsCount: 1,
    lifetimeValue: 145000
  },
  {
    id: 'acc-004',
    name: 'Vanguard Autonomous Robotics',
    industry: 'Industrial Automation',
    tier: 'Growth',
    annualRevenue: 3100000,
    primaryContact: 'Hiroshi Tanaka',
    email: 'htanaka@vanguardrobotics.co.jp',
    phone: '+1 (555) 012-3456',
    status: 'Prospect',
    openDealsCount: 1,
    lifetimeValue: 92000
  }
];

export const INITIAL_DEALS: Deal[] = [
  {
    id: 'deal-001',
    title: 'Enterprise Biometric ERP Rollout (1,200 Seats)',
    clientCompany: 'Horizon FinTech International',
    contactName: 'Charlotte Moreau',
    contactEmail: 'charlotte@horizonfintech.com',
    value: 185000,
    currency: 'USD',
    stage: 'Negotiation',
    probability: 85,
    ownerName: 'Eleanor Vance',
    expectedCloseDate: '2026-08-30',
    tags: ['Enterprise', 'Biometrics', 'Annual Contract'],
    lastActivity: '2026-08-13: Contract redline review completed by legal'
  },
  {
    id: 'deal-002',
    title: 'Distributed Cloud Ingress Architecture Modernization',
    clientCompany: 'Aether Cloud Data Systems',
    contactName: 'Liam O\'Connor',
    contactEmail: 'loconnor@aetherdata.io',
    value: 240000,
    currency: 'USD',
    stage: 'Won',
    probability: 100,
    ownerName: 'David Alvarez',
    expectedCloseDate: '2026-08-10',
    tags: ['Architecture', 'Cloud', 'Engineering'],
    lastActivity: '2026-08-10: SOW signed and initial $80,000 retainer invoiced'
  },
  {
    id: 'deal-003',
    title: 'HIPAA-Compliant ATS & People Ops Platform',
    clientCompany: 'Veritas BioHealth & Genomics',
    contactName: 'Dr. Sarah Jenkins',
    contactEmail: 'sjenkins@veritasgenomics.org',
    value: 95000,
    currency: 'USD',
    stage: 'Proposal',
    probability: 60,
    ownerName: 'Marcus Chen',
    expectedCloseDate: '2026-09-15',
    tags: ['HR Tech', 'Healthcare', 'Compliance'],
    lastActivity: '2026-08-12: Demo of AI Match Scoring presented to HR committee'
  },
  {
    id: 'deal-004',
    title: 'Factory Access & QR Attendance Terminal Pilot',
    clientCompany: 'Vanguard Autonomous Robotics',
    contactName: 'Hiroshi Tanaka',
    contactEmail: 'htanaka@vanguardrobotics.co.jp',
    value: 62000,
    currency: 'USD',
    stage: 'Qualified',
    probability: 40,
    ownerName: 'Eleanor Vance',
    expectedCloseDate: '2026-09-30',
    tags: ['Hardware', 'IoT', 'Pilot'],
    lastActivity: '2026-08-14: Technical specs sent to facility operations manager'
  }
];

export const INITIAL_NOTES: WorkplaceNote[] = [
  {
    id: 'note-001',
    title: 'Q3 Executive Strategy & Capital Allocation Plan',
    category: 'Executive',
    content: `# Q3 Executive Strategy & Capital Allocation

## Strategic Priorities
1. **Workforce Acceleration**: Expand Senior Distributed Systems team to support high-throughput financial ingress workloads.
2. **Financial Efficiency**: Target maintaining monthly gross payroll burn under $105k while delivering 100% of milestones in PRJ-ENG-01 and PRJ-FIN-02.
3. **Biometric Security Rollout**: Complete NFC/QR gate installations across 4th-floor R&D labs by August 25.

## Action Items
- [x] Reconcile August 2026 Draft payroll run with Sophia Patel.
- [ ] Finalize Horizon FinTech Enterprise contract ($185k ARR).
- [ ] Review Gemini 3.7 Flash telemetry copilot latency metrics.`,
    tags: ['Executive', 'Q3 Planning', 'Board'],
    pinned: true,
    authorName: 'Eleanor Vance',
    createdAt: '2026-08-10T09:00:00.000Z',
    updatedAt: '2026-08-14T05:30:00.000Z'
  },
  {
    id: 'note-002',
    title: 'Engineering Sprint 34: Microservices & Cryptographic QR Verification',
    category: 'Engineering',
    content: `# Sprint 34 Architecture Notes

### Key Architecture Milestones
- **QR Gateway Protocol**: Implemented SHA-256 HMAC tokens on digital badges with a 60-second rotating window.
- **Rollup Aggregator**: Real-time worker scans calculate daily late minutes, overtime, and break times automatically at 17:30.

### Team Focus
- Amara Okafor: Load testing on Redis biometric ingress queues.
- Mateo Hernandez: Finalizing ATS resume vector embedding pipeline.`,
    tags: ['Engineering', 'Architecture', 'Sprint 34'],
    pinned: true,
    authorName: 'David Alvarez',
    createdAt: '2026-08-12T14:00:00.000Z',
    updatedAt: '2026-08-14T03:15:00.000Z'
  },
  {
    id: 'note-003',
    title: 'HR Guidelines: 2026 Remote & Hybrid Engagement Policy',
    category: 'HR',
    content: `# 2026 Workplace & Attendance Policy

### Core Hours
- Standard shift: **08:30 – 17:30**
- Grace period for on-time biometric check-in: **10 minutes** (until 08:40).
- Overtime calculation multiplier: **1.5x hourly base rate**.

### Expense Reimbursements
- Claims submitted through the Finance portal before the 20th are settled with the monthly payroll run.`,
    tags: ['HR Policy', 'Operations', 'Compliance'],
    pinned: false,
    authorName: 'Marcus Chen',
    createdAt: '2026-08-08T11:00:00.000Z',
    updatedAt: '2026-08-11T16:20:00.000Z'
  }
];

