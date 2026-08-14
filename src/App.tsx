import React, { useState } from 'react';
import { ERPProvider, useERP } from './context/ERPContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardModule } from './components/dashboard/DashboardModule';
import { EmployeesModule } from './components/employees/EmployeesModule';
import { AccessAndAttendanceModule } from './components/access/AccessAndAttendanceModule';
import { PayrollModule } from './components/payroll/PayrollModule';
import { RecruitmentModule } from './components/recruitment/RecruitmentModule';
import { ProjectsModule } from './components/projects/ProjectsModule';
import { InventoryModule } from './components/inventory/InventoryModule';
import { FinanceModule } from './components/finance/FinanceModule';
import { ReportsModule } from './components/reports/ReportsModule';
import { SettingsModule } from './components/settings/SettingsModule';
import { QRScannerModal } from './components/modals/QRScannerModal';
import { DigitalBadgeModal } from './components/modals/DigitalBadgeModal';
import { PayslipModal } from './components/modals/PayslipModal';
import { InvoiceModal } from './components/modals/InvoiceModal';

const ERPAppContent: React.FC = () => {
  const { activeModule } = useERP();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardModule />;
      case 'employees':
        return <EmployeesModule />;
      case 'access':
        return <AccessAndAttendanceModule />;
      case 'payroll':
        return <PayrollModule />;
      case 'recruitment':
        return <RecruitmentModule />;
      case 'projects':
        return <ProjectsModule />;
      case 'inventory':
        return <InventoryModule />;
      case 'finance':
        return <FinanceModule />;
      case 'reports':
        return <ReportsModule />;
      case 'settings':
        return <SettingsModule />;
      default:
        return <DashboardModule />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col md:flex-row antialiased selection:bg-blue-600 selection:text-white" id="bizflow-erp-root">
      
      {/* Sidebar Navigation */}
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <Header />
        
        <main className="flex-1 bg-neutral-950/95 overflow-y-auto">
          {renderActiveModule()}
        </main>
      </div>

      {/* Global Modals */}
      <QRScannerModal />
      <DigitalBadgeModal />
      <PayslipModal />
      <InvoiceModal />
    </div>
  );
};

export function App() {
  return (
    <ERPProvider>
      <ERPAppContent />
    </ERPProvider>
  );
}

export default App;
