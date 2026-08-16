import React, { useState, useMemo } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Car,
  Truck,
  UserCheck,
  ClipboardList,
  Plus,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Wrench,
  XCircle,
  Navigation,
  Fuel,
  Gauge,
  Calendar,
  Phone,
  MapPin,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Eye,
  Edit2,
  Trash2,
  Check,
  User,
  Info,
  Layers,
  History,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Vehicle, Driver, TripLog, VehicleStatus, VehicleCondition } from '../../types/erp';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const FleetManagement: React.FC = () => {
  const {
    vehicles,
    drivers,
    tripLogs,
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
    currentUser,
    logAudit
  } = useERP();

  // Sub-tab selection: 'inventory' | 'drivers' | 'trips' | 'audit'
  const [activeSubTab, setActiveSubTab] = useState<'inventory' | 'drivers' | 'trips'>('inventory');

  // Search and Filters
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [vehicleStatusFilter, setVehicleStatusFilter] = useState<string>('ALL');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<string>('ALL');

  const [driverSearch, setDriverSearch] = useState('');
  const [driverStatusFilter, setDriverStatusFilter] = useState<string>('ALL');

  const [tripSearch, setTripSearch] = useState('');
  const [tripStatusFilter, setTripStatusFilter] = useState<string>('ALL');
  const [tripDateFilter, setTripDateFilter] = useState<string>('');

  // Modals
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const [isAddDriverModalOpen, setIsAddDriverModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const [isAddTripModalOpen, setIsAddTripModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<TripLog | null>(null);
  const [returnTripTarget, setReturnTripTarget] = useState<TripLog | null>(null);
  const [selectedTripForAudit, setSelectedTripForAudit] = useState<TripLog | null>(null);

  // Form States
  const [vehicleForm, setVehicleForm] = useState<Omit<Vehicle, 'id' | 'createdAt'>>({
    type: 'Pickup Truck',
    make: '',
    model: '',
    regNumber: '',
    year: new Date().getFullYear(),
    condition: 'Good',
    status: 'parked',
    assignedDriverId: '',
    assignedDriverName: '',
    currentMileage: 0,
    fuelType: 'Diesel',
    fuelCapacity: 80,
    lastServiceDate: new Date().toISOString().split('T')[0],
    nextServiceMileage: 10000,
    insuranceExpiry: '',
    color: '',
    notes: ''
  });

  const [driverForm, setDriverForm] = useState<Omit<Driver, 'id' | 'createdAt'>>({
    fullName: '',
    licenseNumber: '',
    licenseClass: 'Class 2 Heavy Goods & Commercial',
    dateEngaged: new Date().toISOString().split('T')[0],
    contactNumber: '',
    address: '',
    status: 'Active',
    assignedVehicleId: '',
    assignedVehicleReg: '',
    emergencyContact: '',
    licenseExpiry: '',
    totalTripsCompleted: 0,
    notes: ''
  });

  const [tripForm, setTripForm] = useState({
    dateTime: new Date().toISOString().slice(0, 16),
    vehicleId: '',
    vehicleType: '',
    vehicleMake: '',
    regNumber: '',
    driverId: '',
    driverName: '',
    driverLicenseNumber: '',
    mileageOut: 0,
    fuelGaugeOut: 'Full (100%)',
    destination: '',
    reasonOfTrip: '',
    returnDateTime: '',
    mileageIn: 0,
    fuelGaugeIn: '',
    status: 'Ongoing' as 'Ongoing' | 'Completed' | 'Cancelled',
    remarks: ''
  });

  const [returnForm, setReturnForm] = useState({
    returnDateTime: new Date().toISOString().slice(0, 16),
    mileageIn: 0,
    fuelGaugeIn: '3/4 Tank (75%)',
    remarks: ''
  });

  // Calculate live total mileage in Add Trip Form
  const calculatedFormTotalMileage = useMemo(() => {
    if (tripForm.status === 'Completed' && tripForm.mileageIn > tripForm.mileageOut) {
      return tripForm.mileageIn - tripForm.mileageOut;
    }
    return 0;
  }, [tripForm.mileageIn, tripForm.mileageOut, tripForm.status]);

  // Calculate live total mileage in Return Trip Form
  const calculatedReturnMileage = useMemo(() => {
    if (returnTripTarget && returnForm.mileageIn > returnTripTarget.mileageOut) {
      return returnForm.mileageIn - returnTripTarget.mileageOut;
    }
    return 0;
  }, [returnTripTarget, returnForm.mileageIn]);

  // Filtered lists
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const q = vehicleSearch.toLowerCase();
      const matchesSearch = v.regNumber.toLowerCase().includes(q) ||
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.type.toLowerCase().includes(q) ||
        (v.assignedDriverName && v.assignedDriverName.toLowerCase().includes(q));
      const matchesStatus = vehicleStatusFilter === 'ALL' || v.status === vehicleStatusFilter;
      const matchesType = vehicleTypeFilter === 'ALL' || v.type === vehicleTypeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [vehicles, vehicleSearch, vehicleStatusFilter, vehicleTypeFilter]);

  const filteredDrivers = useMemo(() => {
    return drivers.filter(d => {
      const q = driverSearch.toLowerCase();
      const matchesSearch = d.fullName.toLowerCase().includes(q) ||
        d.licenseNumber.toLowerCase().includes(q) ||
        d.contactNumber.toLowerCase().includes(q) ||
        d.address.toLowerCase().includes(q);
      const matchesStatus = driverStatusFilter === 'ALL' || d.status === driverStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [drivers, driverSearch, driverStatusFilter]);

  const filteredTripLogs = useMemo(() => {
    return tripLogs.filter(t => {
      const q = tripSearch.toLowerCase();
      const matchesSearch = t.tripCode.toLowerCase().includes(q) ||
        t.regNumber.toLowerCase().includes(q) ||
        t.vehicleMake.toLowerCase().includes(q) ||
        t.driverName.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q) ||
        t.reasonOfTrip.toLowerCase().includes(q) ||
        t.loggedBy.toLowerCase().includes(q);
      const matchesStatus = tripStatusFilter === 'ALL' || t.status === tripStatusFilter;
      const matchesDate = !tripDateFilter || t.date === tripDateFilter || t.dateTime.startsWith(tripDateFilter);
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [tripLogs, tripSearch, tripStatusFilter, tripDateFilter]);

  // Aggregate stats
  const totalFleetCount = vehicles.length;
  const assignedVehiclesCount = vehicles.filter(v => v.status === 'assigned').length;
  const parkedVehiclesCount = vehicles.filter(v => v.status === 'parked').length;
  const inServiceVehiclesCount = vehicles.filter(v => v.status === 'on repairs and service').length;
  const notWorkingVehiclesCount = vehicles.filter(v => v.status === 'not working').length;

  const totalMileageTraveled = useMemo(() => {
    return tripLogs.reduce((sum, t) => sum + (t.totalMileage || 0), 0);
  }, [tripLogs]);

  const ongoingTripsCount = tripLogs.filter(t => t.status === 'Ongoing').length;
  const completedTripsCount = tripLogs.filter(t => t.status === 'Completed').length;

  // Status helper badges
  const getVehicleStatusBadge = (status: VehicleStatus) => {
    switch (status) {
      case 'assigned':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-blue-400" /> Assigned / In Use
          </span>
        );
      case 'parked':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <Gauge className="w-3 h-3 text-emerald-400" /> Parked & Available
          </span>
        );
      case 'on repairs and service':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Wrench className="w-3 h-3 text-amber-400" /> On Repairs & Service
          </span>
        );
      case 'not working':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1">
            <XCircle className="w-3 h-3 text-red-400" /> Not Working / Grounded
          </span>
        );
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-800 text-neutral-300">{status}</span>;
    }
  };

  const getConditionBadge = (condition: VehicleCondition) => {
    switch (condition) {
      case 'Excellent':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-900/50 text-emerald-300 border border-emerald-500/30">Excellent</span>;
      case 'Good':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-900/50 text-blue-300 border border-blue-500/30">Good</span>;
      case 'Fair':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-900/50 text-amber-300 border border-amber-500/30">Fair</span>;
      case 'Needs Attention':
      case 'Poor':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-900/50 text-red-300 border border-red-500/30">{condition}</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-neutral-800 text-neutral-400">{condition}</span>;
    }
  };

  // Open Vehicle Modal for Create / Edit
  const handleOpenAddVehicle = () => {
    setEditingVehicle(null);
    setVehicleForm({
      type: 'Pickup Truck',
      make: '',
      model: '',
      regNumber: '',
      year: 2024,
      condition: 'Excellent',
      status: 'parked',
      assignedDriverId: '',
      assignedDriverName: '',
      currentMileage: 0,
      fuelType: 'Diesel',
      fuelCapacity: 80,
      lastServiceDate: new Date().toISOString().split('T')[0],
      nextServiceMileage: 10000,
      insuranceExpiry: '',
      color: '',
      notes: ''
    });
    setIsAddVehicleModalOpen(true);
  };

  const handleOpenEditVehicle = (veh: Vehicle) => {
    setEditingVehicle(veh);
    setVehicleForm({
      type: veh.type,
      make: veh.make,
      model: veh.model,
      regNumber: veh.regNumber,
      year: veh.year,
      condition: veh.condition,
      status: veh.status,
      assignedDriverId: veh.assignedDriverId || '',
      assignedDriverName: veh.assignedDriverName || '',
      currentMileage: veh.currentMileage || 0,
      fuelType: veh.fuelType || 'Diesel',
      fuelCapacity: veh.fuelCapacity || 80,
      lastServiceDate: veh.lastServiceDate || '',
      nextServiceMileage: veh.nextServiceMileage || 0,
      insuranceExpiry: veh.insuranceExpiry || '',
      color: veh.color || '',
      notes: veh.notes || ''
    });
    setIsAddVehicleModalOpen(true);
  };

  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedDrv = drivers.find(d => d.id === vehicleForm.assignedDriverId);
    const payload = {
      ...vehicleForm,
      assignedDriverName: assignedDrv ? assignedDrv.fullName : (vehicleForm.assignedDriverId ? vehicleForm.assignedDriverName : undefined)
    };

    if (editingVehicle) {
      updateVehicle(editingVehicle.id, payload);
    } else {
      addVehicle(payload);
    }
    setIsAddVehicleModalOpen(false);
  };

  // Open Driver Modal for Create / Edit
  const handleOpenAddDriver = () => {
    setEditingDriver(null);
    setDriverForm({
      fullName: '',
      licenseNumber: '',
      licenseClass: 'Class 2 Heavy Goods & Commercial Code 10',
      dateEngaged: new Date().toISOString().split('T')[0],
      contactNumber: '',
      address: '',
      status: 'Active',
      assignedVehicleId: '',
      assignedVehicleReg: '',
      emergencyContact: '',
      licenseExpiry: '',
      totalTripsCompleted: 0,
      notes: ''
    });
    setIsAddDriverModalOpen(true);
  };

  const handleOpenEditDriver = (drv: Driver) => {
    setEditingDriver(drv);
    setDriverForm({
      fullName: drv.fullName,
      licenseNumber: drv.licenseNumber,
      licenseClass: drv.licenseClass || 'Class 2 Heavy Goods',
      dateEngaged: drv.dateEngaged,
      contactNumber: drv.contactNumber,
      address: drv.address,
      status: drv.status,
      assignedVehicleId: drv.assignedVehicleId || '',
      assignedVehicleReg: drv.assignedVehicleReg || '',
      emergencyContact: drv.emergencyContact || '',
      licenseExpiry: drv.licenseExpiry || '',
      totalTripsCompleted: drv.totalTripsCompleted || 0,
      notes: drv.notes || ''
    });
    setIsAddDriverModalOpen(true);
  };

  const handleSaveDriver = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedVeh = vehicles.find(v => v.id === driverForm.assignedVehicleId);
    const payload = {
      ...driverForm,
      assignedVehicleReg: assignedVeh ? assignedVeh.regNumber : undefined
    };

    if (editingDriver) {
      updateDriver(editingDriver.id, payload);
    } else {
      addDriver(payload);
    }
    setIsAddDriverModalOpen(false);
  };

  // Open Add Trip Log Modal
  const handleOpenAddTrip = (preselectedVehicleId?: string) => {
    setEditingTrip(null);
    const targetVeh = preselectedVehicleId
      ? vehicles.find(v => v.id === preselectedVehicleId)
      : vehicles.find(v => v.status === 'parked' || v.status === 'assigned') || vehicles[0];

    const targetDriver = targetVeh?.assignedDriverId
      ? drivers.find(d => d.id === targetVeh.assignedDriverId)
      : drivers[0];

    const nowIso = new Date().toISOString();
    setTripForm({
      dateTime: nowIso.slice(0, 16),
      vehicleId: targetVeh ? targetVeh.id : '',
      vehicleType: targetVeh ? targetVeh.type : '',
      vehicleMake: targetVeh ? `${targetVeh.make} ${targetVeh.model}` : '',
      regNumber: targetVeh ? targetVeh.regNumber : '',
      driverId: targetDriver ? targetDriver.id : '',
      driverName: targetDriver ? targetDriver.fullName : '',
      driverLicenseNumber: targetDriver ? targetDriver.licenseNumber : '',
      mileageOut: targetVeh ? targetVeh.currentMileage : 0,
      fuelGaugeOut: 'Full (100%)',
      destination: '',
      reasonOfTrip: '',
      returnDateTime: '',
      mileageIn: 0,
      fuelGaugeIn: '',
      status: 'Ongoing',
      remarks: ''
    });
    setIsAddTripModalOpen(true);
  };

  const handleSelectVehicleForTrip = (vehId: string) => {
    const veh = vehicles.find(v => v.id === vehId);
    if (!veh) return;

    const drv = veh.assignedDriverId ? drivers.find(d => d.id === veh.assignedDriverId) : undefined;

    setTripForm(prev => ({
      ...prev,
      vehicleId: veh.id,
      vehicleType: veh.type,
      vehicleMake: `${veh.make} ${veh.model}`,
      regNumber: veh.regNumber,
      mileageOut: veh.currentMileage,
      driverId: drv ? drv.id : prev.driverId,
      driverName: drv ? drv.fullName : prev.driverName,
      driverLicenseNumber: drv ? drv.licenseNumber : prev.driverLicenseNumber
    }));
  };

  const handleSelectDriverForTrip = (drvId: string) => {
    const drv = drivers.find(d => d.id === drvId);
    if (!drv) return;

    setTripForm(prev => ({
      ...prev,
      driverId: drv.id,
      driverName: drv.fullName,
      driverLicenseNumber: drv.licenseNumber
    }));
  };

  const handleSaveTrip = (e: React.FormEvent) => {
    e.preventDefault();
    const datePart = tripForm.dateTime.split('T')[0];
    const timePart = tripForm.dateTime.split('T')[1] || '08:00';

    const payload = {
      dateTime: tripForm.dateTime,
      date: datePart,
      time: timePart,
      vehicleId: tripForm.vehicleId,
      vehicleType: tripForm.vehicleType,
      vehicleMake: tripForm.vehicleMake,
      regNumber: tripForm.regNumber,
      driverId: tripForm.driverId,
      driverName: tripForm.driverName,
      driverLicenseNumber: tripForm.driverLicenseNumber,
      mileageOut: Number(tripForm.mileageOut),
      fuelGaugeOut: tripForm.fuelGaugeOut,
      destination: tripForm.destination,
      reasonOfTrip: tripForm.reasonOfTrip,
      returnDateTime: tripForm.returnDateTime || undefined,
      mileageIn: Number(tripForm.mileageIn) || 0,
      fuelGaugeIn: tripForm.fuelGaugeIn || '',
      status: tripForm.status,
      remarks: tripForm.remarks,
      totalMileage: calculatedFormTotalMileage,
      loggedBy: `${currentUser.name} (${currentUser.role})`
    };

    if (editingTrip) {
      updateTripLog(editingTrip.id, payload);
    } else {
      addTripLog(payload);
    }
    setIsAddTripModalOpen(false);
  };

  // Quick Return / Check-in Trip
  const handleOpenReturnTrip = (trip: TripLog) => {
    setReturnTripTarget(trip);
    setReturnForm({
      returnDateTime: new Date().toISOString().slice(0, 16),
      mileageIn: trip.mileageOut + 25, // suggested default
      fuelGaugeIn: '3/4 Tank (75%)',
      remarks: 'Returned safely, mission accomplished.'
    });
  };

  const handleSaveReturnTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnTripTarget) return;

    completeTripLog(
      returnTripTarget.id,
      Number(returnForm.mileageIn),
      returnForm.fuelGaugeIn,
      returnForm.returnDateTime,
      returnForm.remarks
    );
    setReturnTripTarget(null);
  };

  // EXPORT TO CSV
  const handleExportCSV = () => {
    const headers = [
      'Trip Code',
      'Date & Time',
      'Vehicle Type',
      'Vehicle Make & Model',
      'Registration Number',
      'Assigned Driver',
      "Driver's License Number",
      'Mileage Out (km)',
      'Fuel Gauge Out',
      'Destination',
      'Reason of Trip',
      'Return Date & Time',
      'Mileage In (km)',
      'Fuel Gauge In',
      'Total Mileage Travelled (km)',
      'Status',
      'Audited / Logged By',
      'Logged At (UTC)',
      'Updated By',
      'Remarks'
    ];

    const rows = filteredTripLogs.map(t => [
      `"${t.tripCode}"`,
      `"${t.dateTime}"`,
      `"${t.vehicleType}"`,
      `"${t.vehicleMake}"`,
      `"${t.regNumber}"`,
      `"${t.driverName}"`,
      `"${t.driverLicenseNumber || ''}"`,
      t.mileageOut,
      `"${t.fuelGaugeOut}"`,
      `"${(t.destination || '').replace(/"/g, '""')}"`,
      `"${(t.reasonOfTrip || '').replace(/"/g, '""')}"`,
      `"${t.returnDateTime || ''}"`,
      t.mileageIn || '',
      `"${t.fuelGaugeIn || ''}"`,
      t.totalMileage || 0,
      `"${t.status}"`,
      `"${t.loggedBy}"`,
      `"${t.loggedAt}"`,
      `"${t.updatedBy || ''}"`,
      `"${(t.remarks || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `BizFlow_Fleet_Trip_Logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logAudit('FLEET_LOGS_EXPORTED_CSV', 'Procurement & Fleet', `Exported ${filteredTripLogs.length} trip log records to CSV.`);
  };

  // EXPORT TO PDF
  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    // Corporate Header & Branding
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 297, 28, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('BIZFLOW ERP — FLEET LOGISTICS & VEHICLE TRIP REGISTER', 14, 12);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(203, 213, 225); // slate-300
    doc.text(`Official Audited Vehicle Trip Register | Generated: ${new Date().toLocaleString()} | User: ${currentUser.name} (${currentUser.role})`, 14, 20);

    // Summary Metric Banner
    doc.setFillColor(241, 245, 249); // slate-100
    doc.rect(14, 32, 269, 14, 'F');
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(
      `Total Trips Logged: ${filteredTripLogs.length}   |   Completed Trips: ${filteredTripLogs.filter(t => t.status === 'Completed').length}   |   Active Fleet Traveled: ${filteredTripLogs.reduce((acc, c) => acc + (c.totalMileage || 0), 0).toLocaleString()} km   |   Active Drivers: ${drivers.filter(d => d.status === 'Active').length}`,
      18,
      41
    );

    // Table Data mapping
    const tableRows = filteredTripLogs.map((t, idx) => [
      idx + 1,
      t.tripCode,
      `${t.date}\n${t.time}`,
      `${t.regNumber}\n(${t.vehicleType})`,
      `${t.driverName}\n${t.driverLicenseNumber || ''}`,
      `${t.mileageOut} km\n(${t.fuelGaugeOut})`,
      `${t.mileageIn ? t.mileageIn + ' km' : 'En Route'}\n(${t.fuelGaugeIn || '-'})`,
      `${t.totalMileage ? t.totalMileage + ' km' : '0 km'}`,
      `${t.destination}\n• ${t.reasonOfTrip.slice(0, 45)}...`,
      t.status,
      `${t.loggedBy.split(' (')[0]}\n${t.loggedAt.split('T')[0]}`
    ]);

    autoTable(doc, {
      startY: 50,
      head: [
        [
          '#',
          'Trip ID',
          'Date/Time',
          'Vehicle / Reg',
          'Driver & License',
          'Mileage & Fuel Out',
          'Mileage & Fuel In',
          'Total Dist.',
          'Destination & Reason',
          'Status',
          'Audited By'
        ]
      ],
      body: tableRows,
      styles: {
        fontSize: 7.5,
        cellPadding: 2,
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [79, 70, 229], // indigo-600
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 8
      },
      columnStyles: {
        0: { cellWidth: 8 },
        1: { cellWidth: 24, fontStyle: 'bold' },
        2: { cellWidth: 20 },
        3: { cellWidth: 26 },
        4: { cellWidth: 32 },
        5: { cellWidth: 26 },
        6: { cellWidth: 26 },
        7: { cellWidth: 18, fontStyle: 'bold' },
        8: { cellWidth: 47 },
        9: { cellWidth: 18 },
        10: { cellWidth: 24 }
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      margin: { left: 14, right: 14 }
    });

    // Footer with signature line
    const finalY = (doc as any).lastAutoTable?.finalY || 180;
    if (finalY < 170) {
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('Authorized Logistics Officer Signature: _______________________', 14, finalY + 15);
      doc.text('Audited by Enterprise Quality & Safety Desk: _______________________', 150, finalY + 15);
      doc.text('BizFlow ERP Compliance Record ID: BZF-AUD-FLT-2026', 14, finalY + 22);
    }

    doc.save(`BizFlow_Fleet_Trip_Log_Register_${new Date().toISOString().split('T')[0]}.pdf`);
    logAudit('FLEET_LOGS_EXPORTED_PDF', 'Procurement & Fleet', `Exported official Fleet Trip Log Register to PDF.`);
  };

  return (
    <div className="space-y-6" id="fleet-management-subsystem">
      {/* Fleet Hero & KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-neutral-400 font-medium">Total Fleet</div>
            <div className="text-lg font-bold text-white font-mono mt-0.5">{totalFleetCount} Vehicles</div>
            <span className="text-[10px] text-purple-400 font-medium">{parkedVehiclesCount} Ready in depot</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-neutral-400 font-medium">Assigned / In Use</div>
            <div className="text-lg font-bold text-white font-mono mt-0.5">{assignedVehiclesCount} Dispatched</div>
            <span className="text-[10px] text-blue-400 font-medium">{ongoingTripsCount} Trips active now</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-neutral-400 font-medium">Repairs & Service</div>
            <div className="text-lg font-bold text-white font-mono mt-0.5">{inServiceVehiclesCount} In Workshop</div>
            <span className="text-[10px] text-amber-400 font-medium">{notWorkingVehiclesCount} Grounded</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-neutral-400 font-medium">Licensed Drivers</div>
            <div className="text-lg font-bold text-white font-mono mt-0.5">{drivers.length} Drivers</div>
            <span className="text-[10px] text-emerald-400 font-medium">{drivers.filter(d => d.status === 'Active').length} Active on duty</span>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-2 lg:col-span-1 p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-neutral-400 font-medium">Total Mileage</div>
            <div className="text-lg font-bold text-white font-mono mt-0.5">{totalMileageTraveled.toLocaleString()} km</div>
            <span className="text-[10px] text-indigo-400 font-medium">{completedTripsCount} Audited trips</span>
          </div>
        </div>
      </div>

      {/* Fleet Sub-navigation Tabs & Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 border-b border-neutral-800 pb-3">
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab('inventory')}
            className={`px-3 sm:px-4 py-2.5 sm:py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 cursor-pointer ${
              activeSubTab === 'inventory'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900 bg-neutral-900/60 sm:bg-transparent'
            }`}
            id="fleet-subtab-inventory"
          >
            <Car className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Vehicles</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-black/30 text-[10px]">{vehicles.length}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('drivers')}
            className={`px-3 sm:px-4 py-2.5 sm:py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 cursor-pointer ${
              activeSubTab === 'drivers'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900 bg-neutral-900/60 sm:bg-transparent'
            }`}
            id="fleet-subtab-drivers"
          >
            <UserCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Drivers</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-black/30 text-[10px]">{drivers.length}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('trips')}
            className={`col-span-2 sm:col-span-1 px-3 sm:px-4 py-2.5 sm:py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 cursor-pointer ${
              activeSubTab === 'trips'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900 bg-neutral-900/60 sm:bg-transparent'
            }`}
            id="fleet-subtab-trips"
          >
            <ClipboardList className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Trip Log Register</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-black/30 text-[10px]">{tripLogs.length}</span>
          </button>
        </div>

        {/* Dynamic Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {activeSubTab === 'inventory' && (
            <button
              onClick={handleOpenAddVehicle}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-purple-600/20 transition-all cursor-pointer"
              id="btn-add-vehicle"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Vehicle</span>
            </button>
          )}

          {activeSubTab === 'drivers' && (
            <button
              onClick={handleOpenAddDriver}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-purple-600/20 transition-all cursor-pointer"
              id="btn-add-driver"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Driver</span>
            </button>
          )}

          {activeSubTab === 'trips' && (
            <div className="grid grid-cols-3 sm:flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleExportCSV}
                className="flex items-center justify-center gap-1 px-2.5 sm:px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/80 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                title="Export trip logs as CSV spreadsheet"
                id="btn-export-trips-csv"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Export </span>CSV
              </button>

              <button
                onClick={handleExportPDF}
                className="flex items-center justify-center gap-1 px-2.5 sm:px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/80 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                title="Export official trip log report as PDF"
                id="btn-export-trips-pdf"
              >
                <FileText className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">Export </span>PDF
              </button>

              <button
                onClick={() => handleOpenAddTrip()}
                className="flex items-center justify-center gap-1 px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-purple-600/20 transition-all cursor-pointer"
                id="btn-log-trip"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="truncate">Log Trip</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-SECTION 1: VEHICLE INVENTORY */}
      {/* ========================================================================= */}
      {activeSubTab === 'inventory' && (
        <div className="space-y-4" id="fleet-inventory-panel">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Search Reg #, make, model, type, or driver..."
                value={vehicleSearch}
                onChange={(e) => setVehicleSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <Filter className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
              <select
                value={vehicleStatusFilter}
                onChange={(e) => setVehicleStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 focus:outline-hidden focus:border-purple-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="assigned">Assigned</option>
                <option value="parked">Parked</option>
                <option value="on repairs and service">On Repairs & Service</option>
                <option value="not working">Not Working</option>
              </select>

              <select
                value={vehicleTypeFilter}
                onChange={(e) => setVehicleTypeFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 focus:outline-hidden focus:border-purple-500"
              >
                <option value="ALL">All Vehicle Types</option>
                <option value="Pickup Truck">Pickup Truck</option>
                <option value="Delivery Van">Delivery Van</option>
                <option value="SUV">SUV</option>
                <option value="Box Truck">Box Truck</option>
                <option value="Sedan">Sedan</option>
                <option value="Minibus">Minibus</option>
              </select>
            </div>
          </div>

          {/* Vehicle Inventory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVehicles.map(veh => (
              <div
                key={veh.id}
                className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top line: Reg Number & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-black text-white px-2 py-0.5 rounded-lg bg-neutral-800 border border-neutral-700 tracking-wider">
                          {veh.regNumber}
                        </span>
                        {getConditionBadge(veh.condition)}
                      </div>
                      <h3 className="text-sm font-bold text-white mt-2">
                        {veh.make} {veh.model}
                      </h3>
                      <div className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5">
                        <span className="text-purple-400 font-semibold">{veh.type}</span>
                        <span>•</span>
                        <span>Year {veh.year}</span>
                        {veh.color && (
                          <>
                            <span>•</span>
                            <span>{veh.color}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    {getVehicleStatusBadge(veh.status)}
                  </div>

                  {/* Details Specs Table */}
                  <div className="mt-4 pt-3 border-t border-neutral-800/80 grid grid-cols-2 gap-2.5 text-[11px]">
                    <div className="p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/60">
                      <span className="text-neutral-500 block">Odometer / Mileage</span>
                      <span className="text-white font-mono font-semibold">{veh.currentMileage.toLocaleString()} km</span>
                    </div>

                    <div className="p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/60">
                      <span className="text-neutral-500 block">Fuel Tank</span>
                      <span className="text-white font-mono font-semibold">{veh.fuelType} ({veh.fuelCapacity}L)</span>
                    </div>

                    <div className="p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/60">
                      <span className="text-neutral-500 block">Assigned Driver</span>
                      <span className="text-neutral-200 font-medium truncate block">
                        {veh.assignedDriverName || <span className="text-neutral-500 italic">None assigned</span>}
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/60">
                      <span className="text-neutral-500 block">Next Service At</span>
                      <span className="text-neutral-200 font-mono font-medium">
                        {veh.nextServiceMileage ? `${veh.nextServiceMileage.toLocaleString()} km` : 'N/A'}
                      </span>
                    </div>
                  </div>

                  {veh.notes && (
                    <p className="mt-3 text-[11px] text-neutral-400 bg-neutral-950/40 p-2 rounded-lg border border-neutral-800/40 line-clamp-2">
                      {veh.notes}
                    </p>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditVehicle(veh)}
                      className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all cursor-pointer"
                      title="Edit vehicle details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove vehicle ${veh.regNumber} (${veh.make} ${veh.model}) from fleet inventory?`)) {
                          deleteVehicle(veh.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-all cursor-pointer"
                      title="Delete vehicle"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {veh.status !== 'not working' && (
                    <button
                      onClick={() => handleOpenAddTrip(veh.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Dispatch Trip</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredVehicles.length === 0 && (
            <div className="p-12 text-center rounded-2xl bg-neutral-900/40 border border-neutral-800 text-neutral-500">
              <Car className="w-10 h-10 mx-auto mb-2 text-neutral-600" />
              <p className="text-sm">No vehicles match your search and filter criteria.</p>
              <button
                onClick={handleOpenAddVehicle}
                className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-semibold"
              >
                <Plus className="w-3 h-3" /> Add Vehicle
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-SECTION 2: DRIVERS REGISTER */}
      {/* ========================================================================= */}
      {activeSubTab === 'drivers' && (
        <div className="space-y-4" id="fleet-drivers-panel">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Search driver name, license #, phone, address..."
                value={driverSearch}
                onChange={(e) => setDriverSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
              <select
                value={driverStatusFilter}
                onChange={(e) => setDriverStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 focus:outline-hidden focus:border-purple-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Drivers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDrivers.map(drv => (
              <div
                key={drv.id}
                className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Header with Photo and status */}
                  <div className="flex items-start gap-3.5">
                    {drv.avatar ? (
                      <img
                        src={drv.avatar}
                        alt={drv.fullName}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover border border-neutral-700 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-lg shrink-0">
                        {drv.fullName.charAt(0)}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="text-sm font-bold text-white truncate">{drv.fullName}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          drv.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          drv.status === 'On Leave' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-neutral-800 text-neutral-400'
                        }`}>
                          {drv.status}
                        </span>
                      </div>
                      <div className="font-mono text-xs text-purple-400 font-semibold mt-0.5">
                        {drv.licenseNumber}
                      </div>
                      <div className="text-[11px] text-neutral-400 truncate">
                        {drv.licenseClass || 'Commercial License'}
                      </div>
                    </div>
                  </div>

                  {/* Driver Information Card */}
                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-neutral-300">
                      <Calendar className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span className="text-neutral-400">Engaged:</span>
                      <span className="font-medium text-white">{drv.dateEngaged}</span>
                    </div>

                    <div className="flex items-center gap-2 text-neutral-300">
                      <Phone className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span className="text-neutral-400">Contact:</span>
                      <a href={`tel:${drv.contactNumber}`} className="text-purple-400 hover:underline font-mono">
                        {drv.contactNumber}
                      </a>
                    </div>

                    <div className="flex items-start gap-2 text-neutral-300">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                      <span className="text-neutral-400">Address:</span>
                      <span className="text-neutral-200 line-clamp-1">{drv.address}</span>
                    </div>

                    {drv.assignedVehicleReg && (
                      <div className="flex items-center gap-2 text-neutral-300">
                        <Car className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <span className="text-neutral-400">Assigned Car:</span>
                        <span className="font-mono font-bold text-white px-1.5 py-0.2 rounded bg-neutral-800">
                          {drv.assignedVehicleReg}
                        </span>
                      </div>
                    )}

                    <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800/60 flex items-center justify-between text-[11px] mt-2">
                      <span className="text-neutral-400">Total Trips Executed:</span>
                      <span className="font-mono font-bold text-emerald-400 text-sm">
                        {drv.totalTripsCompleted || 0} Trips
                      </span>
                    </div>
                  </div>

                  {drv.notes && (
                    <p className="mt-3 text-[11px] text-neutral-400 bg-neutral-950/40 p-2 rounded-lg border border-neutral-800/40 line-clamp-2">
                      {drv.notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditDriver(drv)}
                      className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all cursor-pointer"
                      title="Edit driver profile"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove driver ${drv.fullName} (License: ${drv.licenseNumber}) from register?`)) {
                          deleteDriver(drv.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-all cursor-pointer"
                      title="Delete driver"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <a
                    href={`tel:${drv.contactNumber}`}
                    className="flex items-center gap-1 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg text-xs font-semibold transition-all"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call Driver</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filteredDrivers.length === 0 && (
            <div className="p-12 text-center rounded-2xl bg-neutral-900/40 border border-neutral-800 text-neutral-500">
              <UserCheck className="w-10 h-10 mx-auto mb-2 text-neutral-600" />
              <p className="text-sm">No drivers match your search and filter criteria.</p>
              <button
                onClick={handleOpenAddDriver}
                className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-semibold"
              >
                <Plus className="w-3 h-3" /> Register Driver
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-SECTION 3: TRIP LOG REGISTER (Auditable + Exportable) */}
      {/* ========================================================================= */}
      {activeSubTab === 'trips' && (
        <div className="space-y-4" id="fleet-trip-logs-panel">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Search trip code, destination, vehicle reg, driver, auditor..."
                value={tripSearch}
                onChange={(e) => setTripSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <Filter className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
              <select
                value={tripStatusFilter}
                onChange={(e) => setTripStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 focus:outline-hidden focus:border-purple-500"
              >
                <option value="ALL">All Trips</option>
                <option value="Ongoing">Ongoing / En Route</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <input
                type="date"
                value={tripDateFilter}
                onChange={(e) => setTripDateFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 focus:outline-hidden focus:border-purple-500"
                title="Filter by trip date"
              />

              {tripDateFilter && (
                <button
                  onClick={() => setTripDateFilter('')}
                  className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white text-xs"
                  title="Clear date filter"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Audit Notice Banner */}
          <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between text-xs text-purple-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
              <span>
                <strong>Auditable Vehicle Trip Logs:</strong> All entries record exact dispatch timestamps, user credentials, odometer readings, and supervisor verification.
              </span>
            </div>
            <span className="hidden md:inline font-mono text-[11px] text-purple-400/80">
              ISO 9001 / Fleet Audit Ready
            </span>
          </div>

          {/* Trip Log Table */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-neutral-950/80 text-neutral-400 font-semibold border-b border-neutral-800 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Trip Code</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Vehicle & Reg #</th>
                    <th className="py-3 px-4">Driver Assigned</th>
                    <th className="py-3 px-4">Mileage & Fuel Out</th>
                    <th className="py-3 px-4">Mileage & Fuel In</th>
                    <th className="py-3 px-4">Total Distance</th>
                    <th className="py-3 px-4">Destination & Reason</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Audit & Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {filteredTripLogs.map(trip => (
                    <tr key={trip.id} className="hover:bg-neutral-800/40 transition-colors">
                      {/* Trip Code */}
                      <td className="py-3 px-4 font-mono font-bold text-purple-400">
                        {trip.tripCode}
                      </td>

                      {/* Date & Time */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-white">{trip.date}</div>
                        <div className="text-[11px] text-neutral-500">{trip.time}</div>
                      </td>

                      {/* Vehicle */}
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-white">{trip.regNumber}</div>
                        <div className="text-[11px] text-neutral-400">{trip.vehicleMake}</div>
                      </td>

                      {/* Driver */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{trip.driverName}</div>
                        <div className="text-[11px] font-mono text-neutral-500">{trip.driverLicenseNumber || 'Lic. Verified'}</div>
                      </td>

                      {/* Mileage Out & Fuel Out */}
                      <td className="py-3 px-4 font-mono">
                        <div className="text-white font-semibold">{trip.mileageOut.toLocaleString()} km</div>
                        <div className="text-[11px] text-amber-400 font-sans">{trip.fuelGaugeOut}</div>
                      </td>

                      {/* Mileage In & Fuel In */}
                      <td className="py-3 px-4 font-mono">
                        {trip.status === 'Completed' ? (
                          <>
                            <div className="text-emerald-400 font-semibold">{trip.mileageIn.toLocaleString()} km</div>
                            <div className="text-[11px] text-neutral-400 font-sans">{trip.fuelGaugeIn || 'N/A'}</div>
                          </>
                        ) : (
                          <span className="text-neutral-500 italic font-sans text-[11px]">En Route (Pending Return)</span>
                        )}
                      </td>

                      {/* Auto Calculated Total Mileage */}
                      <td className="py-3 px-4">
                        {trip.status === 'Completed' ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">
                            {trip.totalMileage.toLocaleString()} km
                          </span>
                        ) : (
                          <span className="text-neutral-500 font-mono">-</span>
                        )}
                      </td>

                      {/* Destination and Reason */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-medium text-white line-clamp-1">{trip.destination}</div>
                        <div className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">{trip.reasonOfTrip}</div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {trip.status === 'Completed' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" /> Completed
                          </span>
                        ) : trip.status === 'Ongoing' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1 w-fit animate-pulse">
                            <Clock className="w-3 h-3" /> Ongoing
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-800 text-neutral-400">
                            {trip.status}
                          </span>
                        )}
                      </td>

                      {/* Actions & Audit Modal Button */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {trip.status === 'Ongoing' && (
                            <button
                              onClick={() => handleOpenReturnTrip(trip)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
                              title="Log Vehicle Return (Mileage In & Fuel)"
                            >
                              <Check className="w-3 h-3" />
                              <span>Log Return</span>
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedTripForAudit(trip)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-purple-600/30 text-neutral-300 hover:text-purple-300 transition-all cursor-pointer"
                            title="View Audit Trail & Entry Details"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Delete trip log record ${trip.tripCode}?`)) {
                                deleteTripLog(trip.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-all cursor-pointer"
                            title="Delete record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredTripLogs.length === 0 && (
              <div className="p-12 text-center text-neutral-500">
                <ClipboardList className="w-10 h-10 mx-auto mb-2 text-neutral-600" />
                <p className="text-sm">No trip logs found matching the filter criteria.</p>
                <button
                  onClick={() => handleOpenAddTrip()}
                  className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-semibold"
                >
                  <Plus className="w-3 h-3" /> Log First Trip
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD / EDIT VEHICLE */}
      {/* ========================================================================= */}
      {isAddVehicleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {editingVehicle ? 'Edit Vehicle Details' : 'Register New Fleet Vehicle'}
                </h2>
                <p className="text-xs text-neutral-400">Enter vehicle specifications, registration number, and operating status</p>
              </div>
              <button
                onClick={() => setIsAddVehicleModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Registration Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AFG-8902, BZF-1049"
                    value={vehicleForm.regNumber}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, regNumber: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white font-mono uppercase focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Vehicle Type *</label>
                  <select
                    value={vehicleForm.type}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-hidden focus:border-purple-500"
                  >
                    <option value="Pickup Truck">Pickup Truck</option>
                    <option value="Delivery Van">Delivery Van</option>
                    <option value="SUV">SUV</option>
                    <option value="Box Truck">Box Truck</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Minibus">Minibus</option>
                    <option value="Motorcycle">Motorcycle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Vehicle Make *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Toyota, Mercedes-Benz, Ford, Isuzu"
                    value={vehicleForm.make}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, make: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Vehicle Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hilux 2.8 GD-6, Sprinter 519 CDI"
                    value={vehicleForm.model}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Manufacturing Year *</label>
                  <input
                    type="number"
                    required
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    value={vehicleForm.year}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, year: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Vehicle Condition *</label>
                  <select
                    value={vehicleForm.condition}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, condition: e.target.value as VehicleCondition })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-hidden focus:border-purple-500"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Needs Attention">Needs Attention</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Operating Status *</label>
                  <select
                    value={vehicleForm.status}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, status: e.target.value as VehicleStatus })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-hidden focus:border-purple-500"
                  >
                    <option value="parked">parked (Available in Depot)</option>
                    <option value="assigned">assigned (In Active Service)</option>
                    <option value="on repairs and service">on repairs and service (In Workshop)</option>
                    <option value="not working">not working (Grounded / Faulty)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Assigned Driver</label>
                  <select
                    value={vehicleForm.assignedDriverId}
                    onChange={(e) => {
                      const sel = drivers.find(d => d.id === e.target.value);
                      setVehicleForm({
                        ...vehicleForm,
                        assignedDriverId: e.target.value,
                        assignedDriverName: sel ? sel.fullName : ''
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-hidden focus:border-purple-500"
                  >
                    <option value="">No Driver Assigned (Pool)</option>
                    {drivers.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.fullName} ({d.licenseNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Current Mileage (km)</label>
                  <input
                    type="number"
                    min="0"
                    value={vehicleForm.currentMileage}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, currentMileage: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white font-mono focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Fuel Type & Tank (Litres)</label>
                  <div className="flex gap-2">
                    <select
                      value={vehicleForm.fuelType}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, fuelType: e.target.value })}
                      className="w-1/2 px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white"
                    >
                      <option value="Diesel">Diesel</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Electric">Electric</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Cap. (L)"
                      value={vehicleForm.fuelCapacity}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, fuelCapacity: Number(e.target.value) })}
                      className="w-1/2 px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Last Service Date</label>
                  <input
                    type="date"
                    value={vehicleForm.lastServiceDate}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, lastServiceDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Next Service Mileage (km)</label>
                  <input
                    type="number"
                    value={vehicleForm.nextServiceMileage}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, nextServiceMileage: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Vehicle Specifications & Notes</label>
                <textarea
                  rows={2}
                  placeholder="Details regarding fitted equipment, tracking tags, special permits..."
                  value={vehicleForm.notes}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddVehicleModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20 cursor-pointer"
                >
                  {editingVehicle ? 'Update Vehicle' : 'Register Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD / EDIT DRIVER */}
      {/* ========================================================================= */}
      {isAddDriverModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {editingDriver ? 'Edit Driver Record' : 'Register Certified Driver'}
                </h2>
                <p className="text-xs text-neutral-400">Enter driver's full name, licence credentials, and employment details</p>
              </div>
              <button
                onClick={() => setIsAddDriverModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDriver} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tinashe Moyo, Farai Sibanda"
                    value={driverForm.fullName}
                    onChange={(e) => setDriverForm({ ...driverForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Driver's Licence Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. DL-ZW-948201"
                      value={driverForm.licenseNumber}
                      onChange={(e) => setDriverForm({ ...driverForm, licenseNumber: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white font-mono uppercase focus:outline-hidden focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Date Engaged *</label>
                    <input
                      type="date"
                      required
                      value={driverForm.dateEngaged}
                      onChange={(e) => setDriverForm({ ...driverForm, dateEngaged: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-hidden focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Contact Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +263 77 234 8901"
                      value={driverForm.contactNumber}
                      onChange={(e) => setDriverForm({ ...driverForm, contactNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white font-mono focus:outline-hidden focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Driver Status *</label>
                    <select
                      value={driverForm.status}
                      onChange={(e) => setDriverForm({ ...driverForm, status: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-hidden focus:border-purple-500"
                    >
                      <option value="Active">Active (On Duty)</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Residential Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 14 Enterprise Road, Logistics Park, Harare"
                    value={driverForm.address}
                    onChange={(e) => setDriverForm({ ...driverForm, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">License Class</label>
                    <input
                      type="text"
                      placeholder="e.g. Class 2 Heavy Goods & Articulated"
                      value={driverForm.licenseClass}
                      onChange={(e) => setDriverForm({ ...driverForm, licenseClass: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Emergency Contact</label>
                    <input
                      type="text"
                      placeholder="e.g. Rutendo Moyo (Spouse) - 0779912234"
                      value={driverForm.emergencyContact}
                      onChange={(e) => setDriverForm({ ...driverForm, emergencyContact: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Assigned Default Vehicle</label>
                  <select
                    value={driverForm.assignedVehicleId}
                    onChange={(e) => {
                      const veh = vehicles.find(v => v.id === e.target.value);
                      setDriverForm({
                        ...driverForm,
                        assignedVehicleId: e.target.value,
                        assignedVehicleReg: veh ? veh.regNumber : ''
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white"
                  >
                    <option value="">No Vehicle Assigned</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.regNumber} — {v.make} {v.model} ({v.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Driver Notes & Safety Certifications</label>
                  <textarea
                    rows={2}
                    placeholder="Defensive driving certificates, hazmat training, incident records..."
                    value={driverForm.notes}
                    onChange={(e) => setDriverForm({ ...driverForm, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-hidden focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddDriverModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20 cursor-pointer"
                >
                  {editingDriver ? 'Update Driver Record' : 'Register Driver'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADD / LOG VEHICLE TRIP */}
      {/* ========================================================================= */}
      {isAddTripModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Log Vehicle Trip Register</h2>
                <p className="text-xs text-neutral-400">
                  Audited vehicle journey entry • Automatic mileage calculation
                </p>
              </div>
              <button
                onClick={() => setIsAddTripModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTrip} className="space-y-4">
              {/* Audit Badge Header */}
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-neutral-400">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  <span>Logging as:</span>
                  <span className="font-semibold text-white">{currentUser.name}</span>
                  <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[10px]">{currentUser.role}</span>
                </div>
                <span className="text-[11px] text-neutral-500 font-mono">
                  Timestamp: {new Date().toLocaleTimeString()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date and Time */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Date & Time Out *</label>
                  <input
                    type="datetime-local"
                    required
                    value={tripForm.dateTime}
                    onChange={(e) => setTripForm({ ...tripForm, dateTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                {/* Vehicle Selection */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Select Fleet Vehicle *</label>
                  <select
                    required
                    value={tripForm.vehicleId}
                    onChange={(e) => handleSelectVehicleForTrip(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-hidden focus:border-purple-500"
                  >
                    <option value="">-- Choose Vehicle --</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.regNumber} — {v.make} {v.model} ({v.type}) [{v.currentMileage} km]
                      </option>
                    ))}
                  </select>
                </div>

                {/* Driver Selection */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Driver Assigned *</label>
                  <select
                    required
                    value={tripForm.driverId}
                    onChange={(e) => handleSelectDriverForTrip(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-hidden focus:border-purple-500"
                  >
                    <option value="">-- Choose Driver --</option>
                    {drivers.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.fullName} (Lic: {d.licenseNumber}) - {d.status}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Trip Status *</label>
                  <select
                    value={tripForm.status}
                    onChange={(e) => setTripForm({ ...tripForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-hidden focus:border-purple-500"
                  >
                    <option value="Ongoing">Ongoing / Dispatched (En Route)</option>
                    <option value="Completed">Completed (Returned to Base)</option>
                  </select>
                </div>

                {/* Mileage Out */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Mileage Out (km) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="Numerical odometer value"
                    value={tripForm.mileageOut}
                    onChange={(e) => setTripForm({ ...tripForm, mileageOut: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white font-mono focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                {/* Fuel Gauge Out */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Fuel Gauge Out *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Full (100%), 3/4 Tank (75%)"
                      value={tripForm.fuelGaugeOut}
                      onChange={(e) => setTripForm({ ...tripForm, fuelGaugeOut: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-hidden focus:border-purple-500"
                    />
                  </div>
                  <div className="flex gap-1 mt-1 overflow-x-auto">
                    {['Full (100%)', '3/4 Tank (75%)', '1/2 Tank (50%)', '1/4 Tank (25%)'].map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setTripForm({ ...tripForm, fuelGaugeOut: preset })}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
                      >
                        {preset.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Destination and Reason */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Destination of Trip *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Robert Gabriel Mugabe Int. Airport - Freight Cargo Terminal 3"
                  value={tripForm.destination}
                  onChange={(e) => setTripForm({ ...tripForm, destination: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Reason of Trip *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Urgent customs clearance & pickup of server blade hardware and optical fiber modules..."
                  value={tripForm.reasonOfTrip}
                  onChange={(e) => setTripForm({ ...tripForm, reasonOfTrip: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-hidden focus:border-purple-500"
                />
              </div>

              {/* Conditional Return Fields if marking completed right away */}
              {tripForm.status === 'Completed' && (
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-3">
                  <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
                    <span>Return Check-in Information</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-300 mb-1">Return Date & Time</label>
                      <input
                        type="datetime-local"
                        value={tripForm.returnDateTime || tripForm.dateTime}
                        onChange={(e) => setTripForm({ ...tripForm, returnDateTime: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-neutral-300 mb-1">Returning Mileage In (km)</label>
                      <input
                        type="number"
                        min={tripForm.mileageOut}
                        placeholder={`> ${tripForm.mileageOut}`}
                        value={tripForm.mileageIn}
                        onChange={(e) => setTripForm({ ...tripForm, mileageIn: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white font-mono font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-neutral-300 mb-1">Fuel Gauge In</label>
                      <input
                        type="text"
                        placeholder="e.g. 3/4 Tank (75%)"
                        value={tripForm.fuelGaugeIn}
                        onChange={(e) => setTripForm({ ...tripForm, fuelGaugeIn: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Realtime Mileage Calculation Banner */}
                  <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                    <span className="text-xs text-neutral-400">
                      Auto Calculated Total Mileage:
                      <span className="text-[10px] text-neutral-500 block">Formula: [Mileage In] ({tripForm.mileageIn}) - [Mileage Out] ({tripForm.mileageOut})</span>
                    </span>
                    <span className="font-mono font-black text-lg text-emerald-400">
                      {calculatedFormTotalMileage} km
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Supervisor Remarks & Delivery Notes</label>
                <input
                  type="text"
                  placeholder="Optional delivery note numbers, cargo receipt sign-offs..."
                  value={tripForm.remarks}
                  onChange={(e) => setTripForm({ ...tripForm, remarks: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddTripModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Audited Log</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: RETURN / CHECK-IN TRIP */}
      {/* ========================================================================= */}
      {returnTripTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Log Vehicle Return & Check-in</h2>
                <p className="text-xs text-neutral-400">
                  Trip {returnTripTarget.tripCode} • {returnTripTarget.regNumber} ({returnTripTarget.driverName})
                </p>
              </div>
              <button
                onClick={() => setReturnTripTarget(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReturnTrip} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-neutral-500 block">Mileage Out</span>
                  <span className="text-white font-mono font-bold">{returnTripTarget.mileageOut.toLocaleString()} km</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Fuel Out</span>
                  <span className="text-amber-400 font-medium">{returnTripTarget.fuelGaugeOut}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-neutral-500 block">Destination</span>
                  <span className="text-neutral-300 font-medium">{returnTripTarget.destination}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Return Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={returnForm.returnDateTime}
                  onChange={(e) => setReturnForm({ ...returnForm, returnDateTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Returning Mileage In (km) *</label>
                  <input
                    type="number"
                    required
                    min={returnTripTarget.mileageOut}
                    value={returnForm.mileageIn}
                    onChange={(e) => setReturnForm({ ...returnForm, mileageIn: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white font-mono font-bold text-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Returning Fuel In *</label>
                  <input
                    type="text"
                    required
                    value={returnForm.fuelGaugeIn}
                    onChange={(e) => setReturnForm({ ...returnForm, fuelGaugeIn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white"
                  />
                </div>
              </div>

              {/* Realtime Calculated Mileage */}
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-300 block">Total Mileage Travelled:</span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {returnForm.mileageIn} km - {returnTripTarget.mileageOut} km
                  </span>
                </div>
                <span className="font-mono font-black text-2xl text-emerald-400">
                  {calculatedReturnMileage} km
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Trip Completion Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. Cargo delivered safely, no vehicle anomalies reported."
                  value={returnForm.remarks}
                  onChange={(e) => setReturnForm({ ...returnForm, remarks: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setReturnTripTarget(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Complete Trip</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: AUDIT TRAIL & INSPECTION */}
      {/* ========================================================================= */}
      {selectedTripForAudit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">Trip Audit Certificate</h3>
              </div>
              <button
                onClick={() => setSelectedTripForAudit(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Trip Identifier:</span>
                  <span className="font-mono font-bold text-purple-400">{selectedTripForAudit.tripCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Logged By (User / Role):</span>
                  <span className="font-semibold text-white">{selectedTripForAudit.loggedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Logged At Timestamp (UTC):</span>
                  <span className="font-mono text-neutral-300">{selectedTripForAudit.loggedAt}</span>
                </div>
                {selectedTripForAudit.updatedBy && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Last Audited / Modified By:</span>
                    <span className="font-medium text-neutral-300">{selectedTripForAudit.updatedBy}</span>
                  </div>
                )}
                {selectedTripForAudit.updatedAt && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Last Modified Timestamp:</span>
                    <span className="font-mono text-neutral-400">{selectedTripForAudit.updatedAt}</span>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Trip Summary</span>
                <div className="text-neutral-300">
                  <strong>Vehicle:</strong> {selectedTripForAudit.vehicleMake} ({selectedTripForAudit.regNumber})
                </div>
                <div className="text-neutral-300">
                  <strong>Driver:</strong> {selectedTripForAudit.driverName} (Lic. {selectedTripForAudit.driverLicenseNumber || 'N/A'})
                </div>
                <div className="text-neutral-300">
                  <strong>Destination:</strong> {selectedTripForAudit.destination}
                </div>
                <div className="text-neutral-300">
                  <strong>Purpose:</strong> {selectedTripForAudit.reasonOfTrip}
                </div>
                <div className="text-neutral-300">
                  <strong>Total Distance Travelled:</strong> <span className="font-mono font-bold text-emerald-400">{selectedTripForAudit.totalMileage} km</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedTripForAudit(null)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
              >
                Close Audit Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
