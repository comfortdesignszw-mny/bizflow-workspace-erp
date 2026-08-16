import React, { useState, useEffect } from 'react';
import { useERP } from '../../context/ERPContext';
import QRCode from 'qrcode';
import {
  X,
  Printer,
  ShieldCheck,
  Award,
  Download,
  Copy,
  Check,
  QrCode,
  Sparkles,
  Building,
  Clock,
  Fingerprint
} from 'lucide-react';
import { downloadBadgePNG, copyBadgePNGToClipboard } from '../../utils/badgeExporter';

export const DigitalBadgeModal: React.FC = () => {
  const {
    selectedEmployeeForBadge,
    setSelectedEmployeeForBadge,
    settings,
    currentlyInsideEmployees
  } = useERP();

  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [imageLoadError, setImageLoadError] = useState(false);

  const emp = selectedEmployeeForBadge;
  const isInside = emp ? currentlyInsideEmployees.some(e => e.id === emp.id) : false;

  // Generate dynamic scannable QR matrix on load/change
  useEffect(() => {
    if (!emp) {
      setQrCodeDataUrl('');
      return;
    }
    setImageLoadError(false);

    const payload = JSON.stringify({
      badgeId: emp.code,
      employeeId: emp.id,
      name: `${emp.firstName} ${emp.lastName}`,
      department: emp.department,
      role: emp.position,
      status: emp.status,
      issuedBy: 'BIZFLOW-ERP-SECURITY',
      verified: true
    });

    QRCode.toDataURL(payload, {
      width: 256,
      margin: 1,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })
      .then(url => setQrCodeDataUrl(url))
      .catch(err => console.warn('[DigitalBadgeModal] QR generation notice:', err));
  }, [emp]);

  if (!emp) return null;

  const handleDownloadPNG = async () => {
    try {
      setIsDownloading(true);
      await downloadBadgePNG(emp, {
        companyName: settings.companyName,
        isInside
      });
    } catch (e) {
      console.error('[DigitalBadgeModal] Error downloading PNG badge:', e);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyPNG = async () => {
    try {
      const success = await copyBadgePNGToClipboard(emp, {
        companyName: settings.companyName,
        isInside
      });
      if (success) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
      }
    } catch (e) {
      console.warn('[DigitalBadgeModal] Copy error:', e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto"
      id="badge-modal-backdrop"
    >
      <div
        className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 text-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        id="badge-modal-container"
      >
        {/* Modal Top Action Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-neutral-800 bg-neutral-950/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Employee Identification Card</h3>
              <p className="text-[11px] text-neutral-400">Downloadable &amp; Scannable PNG Credential</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors flex items-center gap-1 text-xs cursor-pointer"
              id="btn-print-badge"
              title="Print Badge"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={() => setSelectedEmployeeForBadge(null)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              id="btn-close-badge"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Badge Preview Content */}
        <div className="p-6 overflow-y-auto flex flex-col items-center bg-neutral-950/50 space-y-5">
          {/* Card Physical Style Container */}
          <div
            id="employee-card-element"
            className="w-full max-w-[340px] rounded-3xl bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950 border-2 border-neutral-700/80 shadow-2xl overflow-hidden text-neutral-100 relative"
          >
            {/* Top Lanyard Slot Graphic */}
            <div className="h-2.5 w-full bg-neutral-950 flex items-center justify-center">
              <div className="w-14 h-1.5 bg-neutral-800 rounded-full border border-neutral-700" />
            </div>

            {/* Badge Header Strip */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 p-4 text-white text-center relative shadow-md">
              <div className="text-[9px] uppercase tracking-widest font-black text-blue-200">
                BizFlow Enterprise ERP
              </div>
              <div className="text-xs font-bold mt-0.5 tracking-wide text-white drop-shadow-sm">
                {settings.companyName}
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/20 px-2 py-0.5 rounded-full border border-white/10">
                <span
                  className={`w-2 h-2 rounded-full inline-block ${
                    isInside ? 'bg-emerald-400 animate-pulse' : 'bg-blue-300'
                  }`}
                />
                <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-100">
                  {isInside ? 'Present' : 'Active'}
                </span>
              </div>
            </div>

            {/* Badge Body */}
            <div className="p-5 flex flex-col items-center text-center space-y-4">
              {/* Profile Photo */}
              <div className="relative mt-1">
                {!imageLoadError ? (
                  <img
                    src={emp.avatar}
                    alt={emp.firstName}
                    onError={() => setImageLoadError(true)}
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-xl shadow-blue-900/30"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border-4 border-blue-400 flex items-center justify-center shadow-xl shadow-blue-900/30 text-white font-bold text-2xl">
                    {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1 border-2 border-neutral-900 shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Identity Details */}
              <div>
                <h4 className="text-lg font-bold text-white tracking-tight">
                  {emp.firstName} {emp.lastName}
                </h4>
                <p className="text-xs font-semibold text-indigo-400 mt-0.5">
                  {emp.position}
                </p>
                <div className="inline-block mt-2 px-3 py-0.5 rounded-full text-[10px] font-bold bg-neutral-800 text-neutral-200 border border-neutral-700 uppercase tracking-wide shadow-xs">
                  {emp.department}
                </div>
              </div>

              {/* Scannable Real QR Matrix Container */}
              <div className="p-2.5 bg-white rounded-2xl shadow-xl border border-neutral-300">
                <div className="w-36 h-36 bg-white flex flex-col items-center justify-center relative">
                  {qrCodeDataUrl ? (
                    <img
                      src={qrCodeDataUrl}
                      alt="Scannable Employee QR Code"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <QrCode className="w-12 h-12 text-neutral-400 animate-pulse" />
                    </div>
                  )}
                  {/* Miniature Center Logo Badge */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-7 h-7 bg-blue-900 rounded-md border-2 border-white flex items-center justify-center shadow-md">
                      <span className="text-[9px] font-black text-white">BF</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security & Access Monospace Table */}
              <div className="w-full text-xs space-y-1.5 p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/90 font-mono text-neutral-400">
                <div className="flex justify-between items-center border-b border-neutral-800/80 pb-1">
                  <span className="text-[11px]">BADGE ID</span>
                  <span className="font-bold text-white text-xs">{emp.code}</span>
                </div>
                <div className="flex justify-between items-center border-b border-neutral-800/80 pb-1">
                  <span className="text-[11px]">SHIFT</span>
                  <span className="text-neutral-200 text-xs">{emp.shiftStart} - {emp.shiftEnd}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px]">CLEARANCE</span>
                  <span className="text-emerald-400 font-bold text-[11px]">Tier-3 Ingress</span>
                </div>
              </div>

              {/* Barcode & Security Strip */}
              <div className="w-full pt-1">
                <div className="bg-white p-1.5 rounded-lg text-black flex flex-col items-center">
                  <div className="h-6 w-full flex items-center justify-center gap-0.5 overflow-hidden">
                    {[4, 2, 3, 1, 5, 2, 4, 1, 3, 5, 2, 1, 4, 3, 2, 5, 1, 4, 2, 3, 1, 4, 5, 2, 3, 1, 4, 2, 3, 5, 1, 4].map((h, i) => (
                      <div
                        key={i}
                        className="bg-black inline-block rounded-xs"
                        style={{ width: `${(i % 3 === 0 ? 3 : 1.5)}px`, height: `${16 + h * 1.2}px` }}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-mono font-bold text-neutral-800 mt-0.5">
                    *BF-{emp.code}*
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Export Actions */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Fingerprint className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Ready for terminal scan &amp; offline badge reader</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyPNG}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              id="btn-copy-badge-image"
              title="Copy Badge Image to Clipboard"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copied Image!' : 'Copy Image'}</span>
            </button>

            <button
              onClick={handleDownloadPNG}
              disabled={isDownloading}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
              id="btn-download-badge-png"
            >
              <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : ''}`} />
              <span>{isDownloading ? 'Generating HD PNG...' : 'Download .PNG Badge'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

