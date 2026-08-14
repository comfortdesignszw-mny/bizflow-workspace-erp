import React from 'react';
import { useERP } from '../../context/ERPContext';
import { X, Printer, ShieldCheck, QrCode, Building, Phone, Mail, Award, Check } from 'lucide-react';

export const DigitalBadgeModal: React.FC = () => {
  const {
    selectedEmployeeForBadge,
    setSelectedEmployeeForBadge,
    settings,
    currentlyInsideEmployees
  } = useERP();

  if (!selectedEmployeeForBadge) return null;

  const emp = selectedEmployeeForBadge;
  const isInside = currentlyInsideEmployees.some(e => e.id === emp.id);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto" id="badge-modal-backdrop">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-700 text-white rounded-2xl shadow-2xl overflow-hidden" id="badge-modal-container">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Digital Identification Badge</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors flex items-center gap-1.5 text-xs"
              id="btn-print-badge"
              title="Print Badge"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={() => setSelectedEmployeeForBadge(null)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
              id="btn-close-badge"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Card Area */}
        <div className="p-6 flex flex-col items-center bg-neutral-900 print:bg-white print:text-black">
          <div className="w-full max-w-[320px] rounded-2xl bg-gradient-to-b from-neutral-800 to-neutral-950 border border-neutral-700 shadow-xl overflow-hidden print:border-neutral-300 print:from-white print:to-white print:shadow-none">
            
            {/* Badge Header Strip */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 p-4 text-white text-center relative">
              <div className="text-[10px] uppercase tracking-widest font-bold text-blue-200">BizFlow Workforce ID</div>
              <div className="text-xs font-semibold mt-0.5">{settings.companyName}</div>
              <div className="absolute top-3 right-3">
                <span className={`w-2.5 h-2.5 rounded-full inline-block ${isInside ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-400'}`} />
              </div>
            </div>

            {/* Badge Body */}
            <div className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <img
                  src={emp.avatar}
                  alt={emp.firstName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-neutral-700 shadow-md print:border-neutral-300"
                />
                <div className="absolute -bottom-2 -right-1 bg-blue-600 text-white rounded-full p-1 border-2 border-neutral-900">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white print:text-neutral-900">{emp.firstName} {emp.lastName}</h4>
                <p className="text-xs font-medium text-indigo-400 print:text-indigo-700">{emp.position}</p>
                <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-800 text-neutral-300 border border-neutral-700 print:bg-neutral-100 print:text-neutral-800">
                  {emp.department}
                </div>
              </div>

              {/* Scannable SVG QR Matrix */}
              <div className="p-3 bg-white rounded-xl shadow-inner border border-neutral-200">
                <div className="w-32 h-32 bg-white flex flex-col items-center justify-center relative">
                  {/* Generated clean geometric SVG QR Matrix representation */}
                  <svg viewBox="0 0 100 100" className="w-full h-full text-black fill-current">
                    {/* Position detection markers */}
                    <rect x="5" y="5" width="26" height="26" fill="black" rx="3" />
                    <rect x="9" y="9" width="18" height="18" fill="white" />
                    <rect x="13" y="13" width="10" height="10" fill="black" />

                    <rect x="69" y="5" width="26" height="26" fill="black" rx="3" />
                    <rect x="73" y="9" width="18" height="18" fill="white" />
                    <rect x="77" y="13" width="10" height="10" fill="black" />

                    <rect x="5" y="69" width="26" height="26" fill="black" rx="3" />
                    <rect x="9" y="73" width="18" height="18" fill="white" />
                    <rect x="13" y="77" width="10" height="10" fill="black" />

                    {/* Data patterns */}
                    <rect x="36" y="8" width="5" height="5" />
                    <rect x="46" y="8" width="5" height="5" />
                    <rect x="56" y="8" width="5" height="5" />
                    <rect x="36" y="18" width="8" height="5" />
                    <rect x="48" y="18" width="5" height="5" />
                    <rect x="56" y="18" width="8" height="5" />

                    <rect x="8" y="36" width="5" height="8" />
                    <rect x="18" y="36" width="8" height="5" />
                    <rect x="8" y="48" width="8" height="8" />
                    <rect x="20" y="48" width="5" height="5" />

                    <rect x="36" y="36" width="6" height="6" />
                    <rect x="46" y="36" width="8" height="8" />
                    <rect x="58" y="36" width="6" height="6" />
                    <rect x="70" y="36" width="8" height="6" />
                    <rect x="82" y="36" width="6" height="8" />

                    <rect x="36" y="48" width="8" height="6" />
                    <rect x="48" y="48" width="6" height="6" />
                    <rect x="58" y="48" width="8" height="6" />
                    <rect x="70" y="48" width="6" height="8" />
                    <rect x="80" y="48" width="8" height="6" />

                    <rect x="36" y="60" width="6" height="8" />
                    <rect x="48" y="60" width="8" height="6" />
                    <rect x="60" y="60" width="6" height="8" />
                    <rect x="72" y="60" width="8" height="6" />
                    <rect x="84" y="60" width="6" height="8" />

                    <rect x="36" y="74" width="8" height="6" />
                    <rect x="48" y="74" width="6" height="8" />
                    <rect x="58" y="74" width="8" height="6" />
                    <rect x="70" y="74" width="6" height="8" />
                    <rect x="80" y="74" width="8" height="6" />

                    <rect x="36" y="86" width="8" height="8" />
                    <rect x="48" y="86" width="6" height="6" />
                    <rect x="58" y="86" width="8" height="8" />
                    <rect x="72" y="86" width="8" height="6" />
                    <rect x="84" y="86" width="6" height="8" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-6 h-6 bg-white rounded border border-neutral-300 flex items-center justify-center shadow-xs">
                      <span className="text-[8px] font-black text-blue-600">BF</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Code & Security Details */}
              <div className="w-full text-xs space-y-1.5 pt-1 text-neutral-400 print:text-neutral-600 font-mono">
                <div className="flex justify-between border-b border-neutral-800 pb-1 print:border-neutral-200">
                  <span>Badge ID:</span>
                  <span className="font-bold text-white print:text-black">{emp.code}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-800 pb-1 print:border-neutral-200">
                  <span>Shift Target:</span>
                  <span className="text-neutral-300 print:text-neutral-800">{emp.shiftStart} - {emp.shiftEnd}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-emerald-400 font-bold">{emp.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <span>Encrypted Gateway Token: valid through 2027</span>
          <button
            onClick={() => setSelectedEmployeeForBadge(null)}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
