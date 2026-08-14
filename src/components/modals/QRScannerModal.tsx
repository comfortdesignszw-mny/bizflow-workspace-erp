import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { QrCode, Scan, CheckCircle2, AlertTriangle, X, ShieldCheck, Building2, User, Clock } from 'lucide-react';
import { ScanType, ScanMethod } from '../../types/erp';

export const QRScannerModal: React.FC = () => {
  const {
    isQRScannerOpen,
    setIsQRScannerOpen,
    employees,
    currentlyInsideEmployees,
    recordScan
  } = useERP();

  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || '');
  const [selectedGate, setSelectedGate] = useState<string>('Main Lobby Turnstile 01');
  const [forcedScanType, setForcedScanType] = useState<ScanType | 'AUTO'>('AUTO');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; type: ScanType; time: string } | null>(null);
  const [isScanningAnimation, setIsScanningAnimation] = useState<boolean>(false);

  if (!isQRScannerOpen) return null;

  const currentSelectedEmp = employees.find(e => e.id === selectedEmpId);
  const isCurrentlyIn = currentlyInsideEmployees.some(e => e.id === selectedEmpId);

  const handleSimulateScan = () => {
    if (!selectedEmpId) return;

    setIsScanningAnimation(true);
    setScanResult(null);

    setTimeout(() => {
      setIsScanningAnimation(false);
      const res = recordScan({
        employeeId: selectedEmpId,
        scanType: forcedScanType === 'AUTO' ? undefined : forcedScanType,
        gate: selectedGate,
        method: 'QR_SCAN'
      });

      setScanResult({
        success: res.success,
        message: res.message,
        type: res.scanType,
        time: new Date().toLocaleTimeString()
      });
    }, 650);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto" id="qr-scanner-modal-backdrop">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-700 text-white rounded-2xl shadow-2xl overflow-hidden" id="qr-scanner-modal-container">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Biometric & QR Access Terminal</h2>
              <p className="text-xs text-neutral-400">Append-only raw ingest stream with sub-100ms verification</p>
            </div>
          </div>
          <button
            onClick={() => { setIsQRScannerOpen(false); setScanResult(null); }}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            id="btn-close-scanner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Animated Scanner Viewport */}
          <div className="relative rounded-xl border-2 border-dashed border-blue-500/40 bg-neutral-950 p-6 flex flex-col items-center justify-center min-h-[170px] overflow-hidden">
            {isScanningAnimation && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 shadow-[0_0_15px_#38bdf8] animate-bounce top-0 bottom-0 m-auto" />
            )}

            {scanResult ? (
              <div className="text-center space-y-2 animate-in fade-in zoom-in duration-300">
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${scanResult.type === 'IN' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'}`}>
                  {scanResult.success ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                </div>
                <p className="text-sm font-semibold text-white">{scanResult.message}</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-neutral-800 text-neutral-300 border border-neutral-700">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  Recorded: {scanResult.time} • Gate: {selectedGate}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-full inline-block">
                  <QrCode className="w-10 h-10 animate-pulse" />
                </div>
                <p className="text-sm font-medium text-neutral-200">Point Employee QR Badge or Select Personnel below</p>
                <p className="text-xs text-neutral-500">Supports Dynamic QR Badges, NFC Badges & Terminal Emulation</p>
              </div>
            )}
          </div>

          {/* Employee Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-neutral-300">Select Employee Badge to Scan</label>
            <div className="grid grid-cols-1 gap-2">
              <select
                value={selectedEmpId}
                onChange={(e) => { setSelectedEmpId(e.target.value); setScanResult(null); }}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                id="select-scanner-employee"
              >
                {employees.map(emp => {
                  const isInside = currentlyInsideEmployees.some(e => e.id === emp.id);
                  return (
                    <option key={emp.id} value={emp.id}>
                      {emp.code} - {emp.firstName} {emp.lastName} ({emp.department}) [{isInside ? '🟢 INSIDE' : '⚪ OUTSIDE'}]
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Selected Badge Preview Card */}
            {currentSelectedEmp && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-800/60 border border-neutral-700/80">
                <div className="flex items-center gap-3">
                  <img
                    src={currentSelectedEmp.avatar}
                    alt={currentSelectedEmp.firstName}
                    className="w-10 h-10 rounded-full object-cover border border-neutral-600"
                  />
                  <div>
                    <p className="text-sm font-medium text-white">{currentSelectedEmp.firstName} {currentSelectedEmp.lastName}</p>
                    <p className="text-xs text-neutral-400">{currentSelectedEmp.position} • {currentSelectedEmp.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${isCurrentlyIn ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-neutral-700 text-neutral-300'}`}>
                    <span className={`w-2 h-2 rounded-full ${isCurrentlyIn ? 'bg-emerald-400 animate-ping' : 'bg-neutral-400'}`} />
                    {isCurrentlyIn ? 'Present Inside' : 'Clocked Out'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Gate & Direction Configuration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Access Gate / Ingress</label>
              <select
                value={selectedGate}
                onChange={(e) => setSelectedGate(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                id="select-scanner-gate"
              >
                <option value="Main Lobby Turnstile 01">Main Lobby Turnstile 01</option>
                <option value="Main Lobby Turnstile 02">Main Lobby Turnstile 02</option>
                <option value="Executive East Gate">Executive East Gate</option>
                <option value="R&D Innovation Lab Gate">R&D Innovation Lab Gate</option>
                <option value="Logistics & Loading Dock B">Logistics & Loading Dock B</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Direction Event</label>
              <select
                value={forcedScanType}
                onChange={(e) => setForcedScanType(e.target.value as any)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                id="select-scanner-direction"
              >
                <option value="AUTO">Auto Toggle (Smart IN/OUT)</option>
                <option value="IN">Force Check-IN</option>
                <option value="OUT">Force Check-OUT</option>
              </select>
            </div>
          </div>

          {/* Trigger Scan Button */}
          <button
            onClick={handleSimulateScan}
            disabled={isScanningAnimation}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50"
            id="btn-trigger-scan"
          >
            <Scan className={`w-4 h-4 ${isScanningAnimation ? 'animate-spin' : ''}`} />
            {isScanningAnimation ? 'Ingesting Biometric Badge...' : 'Trigger Instant QR Badge Scan'}
          </button>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-neutral-950/60 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Append-only Audit Log Verified
          </span>
          <span>Comfort BizFlow Gate Engine v2.4</span>
        </div>
      </div>
    </div>
  );
};
