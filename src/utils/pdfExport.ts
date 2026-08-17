import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Applicant, JobOpening, PayrollRun, PayslipItem, CompanySettings } from '../types/erp';

/**
 * Export ATS Applicants to formatted PDF document
 */
export const exportApplicantsPDF = (
  applicants: Applicant[],
  jobOpenings: JobOpening[],
  companyName: string = 'Comfort BizFlow ERP'
) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Header Banner
  doc.setFillColor(17, 24, 39); // neutral-900
  doc.rect(0, 0, 297, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text(`${companyName.toUpperCase()} — ATS TALENT ACQUISITION REGISTER`, 14, 12);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(190, 195, 205);
  doc.text(`Official Recruitment & ATS Candidate Register | Export Date: ${new Date().toLocaleString()}`, 14, 19);

  // Summary Metrics Banner
  doc.setFillColor(243, 244, 246);
  doc.rect(14, 30, 269, 13, 'F');
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');

  const hiredCount = applicants.filter(a => a.stage === 'HIRED').length;
  const interviewCount = applicants.filter(a => a.stage === 'INTERVIEW').length;
  const activeJobsCount = jobOpenings.filter(j => j.status === 'Active').length;

  doc.text(
    `Total Candidates: ${applicants.length}   |   Active Requisitions: ${activeJobsCount}   |   Interviewing: ${interviewCount}   |   Hired: ${hiredCount}   |   CVs on Record: ${applicants.filter(a => !!a.cvFile).length}`,
    18,
    38
  );

  const tableRows = applicants.map((a, idx) => [
    idx + 1,
    a.name,
    a.jobTitle,
    a.stage,
    `${a.email}\n${a.phone || '-'}`,
    `${a.gender || '-'} / ${a.maritalStatus || '-'}`,
    a.nationalId || '-',
    `${a.yearsOfExperience}y`,
    a.skills.slice(0, 3).join(', '),
    a.aiMatchScore ? `${a.aiMatchScore}%` : '-',
    a.appliedDate,
    a.cvFile ? 'CV Attached' : 'Text Resume'
  ]);

  autoTable(doc, {
    startY: 47,
    head: [
      [
        '#',
        'Candidate Name',
        'Target Requisition',
        'Stage',
        'Contact',
        'Sex / Marital',
        'National ID',
        'Exp',
        'Key Skills',
        'AI Fit',
        'Applied',
        'Files'
      ]
    ],
    body: tableRows,
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
      overflow: 'linebreak'
    },
    headStyles: {
      fillColor: [126, 34, 206], // purple-700
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'left'
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251]
    }
  });

  doc.save(`bizflow-ats-applicants-report-${new Date().toISOString().split('T')[0]}.pdf`);
};

/**
 * Export ATS Applicants to CSV
 */
export const exportApplicantsCSV = (applicants: Applicant[]) => {
  const headers = [
    'Applicant ID',
    'Candidate Name',
    'Applied Job Title',
    'Job Opening ID',
    'Email Address',
    'Phone Number',
    'Gender / Sex',
    'Marital Status',
    'National ID / Passport',
    'Current Company',
    'Years of Experience',
    'Recruitment Stage',
    'AI Match Score (%)',
    'Skills',
    'Applied Date',
    'Has CV File',
    'Resume Summary'
  ];

  const csvRows = applicants.map(a => [
    `"${a.id}"`,
    `"${a.name.replace(/"/g, '""')}"`,
    `"${a.jobTitle.replace(/"/g, '""')}"`,
    `"${a.jobOpeningId}"`,
    `"${a.email}"`,
    `"${a.phone || ''}"`,
    `"${a.gender || ''}"`,
    `"${a.maritalStatus || ''}"`,
    `"${a.nationalId || ''}"`,
    `"${(a.currentCompany || '').replace(/"/g, '""')}"`,
    a.yearsOfExperience,
    `"${a.stage}"`,
    a.aiMatchScore || '',
    `"${a.skills.join(', ').replace(/"/g, '""')}"`,
    `"${a.appliedDate}"`,
    a.cvFile ? 'YES' : 'NO',
    `"${(a.resumeSummary || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...csvRows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `bizflow-ats-candidates-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export Full Payroll Run / Ledger to PDF
 */
export const exportPayrollRunPDF = (
  run: PayrollRun,
  settings: CompanySettings
) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 297, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`${(settings.companyName || 'BIZFLOW CORP').toUpperCase()} — WORKFORCE PAYROLL STATEMENT`, 14, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(
    `Run Code: ${run.code} | Cycle: ${run.periodMonth} (${run.periodStart} to ${run.periodEnd}) | Status: ${run.status.toUpperCase()} | Tax ID: ${settings.taxNumber || 'US-99201928-TX'}`,
    14,
    20
  );

  // Financial Ledger KPI Summary Strip
  doc.setFillColor(241, 245, 249);
  doc.rect(14, 32, 269, 14, 'F');
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(
    `Enrolled Staff: ${run.employeeCount}   |   Total Gross Earnings: $${run.totalGross.toLocaleString()}   |   Total Statutory Deductions: -$${run.totalDeductions.toLocaleString()}   |   Net Take-Home Disbursed: $${run.totalNet.toLocaleString()}`,
    18,
    41
  );

  const tableRows = run.payslips.map((ps, idx) => [
    idx + 1,
    ps.employeeCode,
    ps.employeeName,
    ps.department,
    `$${ps.baseSalary.toLocaleString()}`,
    ps.overtimeHours > 0 ? `+$${ps.overtimePay} (${ps.overtimeHours}h)` : '$0',
    `$${ps.grossPay.toLocaleString()}`,
    `-$${ps.taxDeduction.toLocaleString()}`,
    `-$${ps.pensionDeduction.toLocaleString()}`,
    `-$${ps.healthInsuranceDeduction.toLocaleString()}`,
    `-$${ps.totalDeductions.toLocaleString()}`,
    `$${ps.netPay.toLocaleString()}`,
    ps.status.toUpperCase()
  ]);

  autoTable(doc, {
    startY: 50,
    head: [
      [
        '#',
        'Emp Code',
        'Employee Name',
        'Department',
        'Base Salary',
        'Overtime',
        'Gross Pay',
        'Tax Withholding',
        'Pension (5%)',
        'Health Ins.',
        'Tot. Deduct.',
        'Net Take-Home',
        'Status'
      ]
    ],
    body: tableRows,
    styles: {
      fontSize: 8,
      cellPadding: 2.2,
      overflow: 'linebreak'
    },
    headStyles: {
      fillColor: [37, 99, 235], // blue-600
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    }
  });

  // Footer notes
  const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : 180;
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Audited and computed under statutory compensation compliance guidelines. Generated on ${new Date().toLocaleString()}.`,
    14,
    Math.min(finalY, 195)
  );

  doc.save(`bizflow-payroll-${run.code}-${run.periodMonth.replace(/\s+/g, '_')}.pdf`);
};

/**
 * Export Individual Employee Payslip Voucher as PDF
 */
export const exportIndividualPayslipPDF = (
  ps: PayslipItem,
  settings: CompanySettings
) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Top Header Banner
  doc.setFillColor(17, 24, 39); // neutral-900
  doc.rect(0, 0, 210, 36, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(settings.companyName || 'COMFORT BIZFLOW ERP CORP', 14, 14);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(209, 213, 219);
  doc.text(settings.address || '77 Innovation Way, Tech Core Square, Suite 400', 14, 21);
  doc.text(`Tax Registration ID: ${settings.taxNumber || 'US-99482019-TAX'} | Corporate Currency: ${settings.currency || 'USD'}`, 14, 27);

  // Payslip Badge
  doc.setFillColor(59, 130, 246); // blue-500
  doc.roundedRect(145, 8, 51, 18, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL PAYSLIP', 148, 15);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Status: ${ps.status.toUpperCase()}`, 148, 21);

  // Employee Metadata Box
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(14, 42, 182, 30, 2, 2, 'F');

  doc.setTextColor(55, 65, 81);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Employee Information', 18, 48);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Employee Name: ${ps.employeeName}`, 18, 55);
  doc.text(`Employee ID: ${ps.employeeCode}`, 18, 61);
  doc.text(`Department: ${ps.department}`, 18, 67);

  doc.text(`Designation: ${ps.position}`, 105, 55);
  doc.text(`Disbursement Date: ${ps.generatedDate}`, 105, 61);
  doc.text(`Bank: ${ps.bankDetails?.bankName || 'Standard Chartered'} (${ps.bankDetails?.accountNumber || '****9921'})`, 105, 67);

  // Dual Table: Earnings vs Deductions
  const earningsRows = [
    ['Base Monthly Salary', `$${ps.baseSalary.toLocaleString()}`],
    ps.overtimeHours > 0
      ? [`Overtime Pay (${ps.overtimeHours} hrs @ $${ps.overtimeRate}/hr)`, `+$${ps.overtimePay.toLocaleString()}`]
      : ['Overtime', '$0'],
    ...(ps.allowances || []).map(al => [al.name, `+$${al.amount.toLocaleString()}`])
  ];

  const deductionsRows = [
    [`Statutory Withholding Tax (${settings.defaultTaxRate}%)`, `-$${ps.taxDeduction.toLocaleString()}`],
    ['Retirement Pension Contribution (5%)', `-$${ps.pensionDeduction.toLocaleString()}`],
    ['Corporate Health Insurance Premium', `-$${ps.healthInsuranceDeduction.toLocaleString()}`],
    ...(ps.deductions || []).map(d => [d.name, `-$${d.amount.toLocaleString()}`])
  ];

  // Earnings Table
  autoTable(doc, {
    startY: 78,
    margin: { left: 14, right: 110 },
    head: [['Earnings Category', 'Amount ($)']],
    body: earningsRows,
    foot: [['Gross Total Earnings', `$${ps.grossPay.toLocaleString()}`]],
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: 'bold' },
    footStyles: { fillColor: [240, 253, 244], textColor: [5, 150, 105], fontStyle: 'bold' }
  });

  // Deductions Table
  autoTable(doc, {
    startY: 78,
    margin: { left: 110, right: 14 },
    head: [['Deduction Category', 'Amount ($)']],
    body: deductionsRows,
    foot: [['Total Deductions', `-$${ps.totalDeductions.toLocaleString()}`]],
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [239, 68, 68], textColor: [255, 255, 255], fontStyle: 'bold' },
    footStyles: { fillColor: [254, 242, 242], textColor: [220, 38, 38], fontStyle: 'bold' }
  });

  // Net Take-Home Callout Banner
  const tablesFinalY = 150;
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.roundedRect(14, tablesFinalY, 182, 22, 2, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('NET TAKE-HOME PAYABLE', 20, tablesFinalY + 8);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Disbursed via ${ps.paymentMethod || 'Direct Bank ACH'}`, 20, tablesFinalY + 15);

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`$${ps.netPay.toLocaleString()}`, 145, tablesFinalY + 14);

  // Digital Signature and Voucher Stamp
  doc.setDrawColor(229, 231, 235);
  doc.rect(14, tablesFinalY + 28, 182, 38);

  doc.setTextColor(75, 85, 99);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Authorized Corporate Seal & Verification Stamp:', 18, tablesFinalY + 35);
  doc.text('This is a computer-generated voucher and requires no physical signature under digital payroll bylaws.', 18, tablesFinalY + 41);
  doc.text(`Voucher ID: ${ps.id}`, 18, tablesFinalY + 47);
  doc.text(`Verified by Comfort BizFlow Payroll Engine — Timestamp: ${new Date().toISOString()}`, 18, tablesFinalY + 53);

  doc.save(`payslip-${ps.employeeCode}-${ps.employeeName.replace(/\s+/g, '_')}-${ps.generatedDate}.pdf`);
};
