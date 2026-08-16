import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Download,
  X,
  Smartphone,
  Monitor,
  Share,
  PlusSquare,
  Sparkles,
  Database,
  WifiOff,
  CheckCircle2,
  Layers,
  ArrowRight
} from 'lucide-react';

export const PWAInstallModal: React.FC = () => {
  const {
    isPWAInstallModalOpen,
    setIsPWAInstallModalOpen,
    isInstallPromptAvailable,
    installPWA,
    isStandaloneMode
  } = useERP();

  const [activeTab, setActiveTab] = useState<'desktop' | 'ios' | 'android'>('desktop');
  const [installSuccessNotice, setInstallSuccessNotice] = useState(false);

  if (!isPWAInstallModalOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallPromptAvailable) {
      await installPWA();
    } else {
      setInstallSuccessNotice(true);
      setTimeout(() => setInstallSuccessNotice(false), 6000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      id="modal-pwa-install"
    >
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-neutral-100 flex flex-col max-h-[90vh]">
        {/* Header with App Brand and Icon */}
        <div className="relative p-6 bg-gradient-to-br from-blue-950/60 via-neutral-900 to-indigo-950/40 border-b border-neutral-800 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-xl shadow-blue-500/20 border border-blue-500/30 shrink-0 bg-neutral-950 p-1 flex items-center justify-center">
              <img
                src="/icons/icon-192x192.png"
                alt="BizFlow ERP App Icon"
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wide">
                  PWA Standalone App
                </span>
                {isStandaloneMode && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Running as Native
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                Install BizFlow ERP
              </h2>
              <p className="text-xs text-neutral-400">
                Enterprise Resource Planning & Biometric Terminal
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPWAInstallModalOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            id="btn-close-pwa-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Key Native Capabilities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                <WifiOff className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-neutral-200">100% Offline Database</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                  Dexie.JS IndexedDB stores all records locally with zero network latency.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                <Monitor className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-neutral-200">Standalone Window</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                  Runs without browser URL bars or tabs as a dedicated native OS application.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-neutral-200">Biometric & Camera</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                  Hardware access for employee QR badges, barcode scanning, and camera check-in.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-neutral-200">Auto Background Sync</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                  Queues offline actions and automatically reconciles when internet restores.
                </p>
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="space-y-2">
            <button
              onClick={handleInstallClick}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm shadow-xl shadow-blue-900/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer transform active:scale-[0.99]"
              id="btn-modal-install-now"
            >
              <Download className="w-4 h-4 animate-bounce" />
              <span>{isInstallPromptAvailable ? 'Install BizFlow Native App Now' : 'Prompt Native Installation'}</span>
            </button>

            {installSuccessNotice && (
              <div className="p-3 rounded-xl bg-blue-950/50 border border-blue-800 text-xs text-blue-300 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 shrink-0 text-blue-400 mt-0.5" />
                <p>
                  To install, click the <strong>Install App icon (⊕ or ⬇)</strong> in your browser&apos;s address bar, or follow the device guide below.
                </p>
              </div>
            )}
          </div>

          {/* Device Specific Installation Instructions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Device Guide
              </h3>
              <div className="flex bg-neutral-950 p-0.5 rounded-lg border border-neutral-800">
                <button
                  onClick={() => setActiveTab('desktop')}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                    activeTab === 'desktop' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Desktop
                </button>
                <button
                  onClick={() => setActiveTab('ios')}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                    activeTab === 'ios' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  iOS Safari
                </button>
                <button
                  onClick={() => setActiveTab('android')}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                    activeTab === 'android' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Android
                </button>
              </div>
            </div>

            {activeTab === 'desktop' && (
              <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-2 text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span><strong>Chrome / Edge / Brave:</strong> Look for the <strong>Install</strong> icon in the right side of the address bar.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Click <strong>Install &quot;BizFlow Enterprise ERP&quot;</strong> to create a desktop dock icon &amp; standalone window.</span>
                </div>
              </div>
            )}

            {activeTab === 'ios' && (
              <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-2 text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <Share className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>1. Tap the <strong>Share</strong> button at the bottom of Safari.</span>
                </div>
                <div className="flex items-center gap-2">
                  <PlusSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>2. Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong>.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>3. Tap <strong>Add</strong> in the top-right corner to launch from your home screen.</span>
                </div>
              </div>
            )}

            {activeTab === 'android' && (
              <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-2 text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>1. Tap the <strong>three dots (⋮)</strong> menu in Chrome.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>2. Select <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <span>BizFlow ERP v2.4.0 • PWA Standard Ready</span>
          <button
            onClick={() => setIsPWAInstallModalOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
