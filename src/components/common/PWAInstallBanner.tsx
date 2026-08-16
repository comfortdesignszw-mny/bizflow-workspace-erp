import React, { useState, useEffect } from 'react';
import { useERP } from '../../context/ERPContext';
import { Download, X, Sparkles, Smartphone, Monitor } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const { installPWA, isStandaloneMode, setIsPWAInstallModalOpen } = useERP();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // If running in standalone mode, don't show the install banner
    if (isStandaloneMode) return;

    // Check if dismissed in this session
    const dismissed = sessionStorage.getItem('bizflow_pwa_banner_dismissed');
    if (dismissed) return;

    // Gently show after 3 seconds of usage
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isStandaloneMode]);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('bizflow_pwa_banner_dismissed', 'true');
  };

  const handleInstallClick = () => {
    installPWA();
  };

  if (!isVisible || isStandaloneMode) return null;

  return (
    <aside
      aria-label="App Installation Prompt"
      className="fixed bottom-4 right-4 z-40 max-w-sm w-full animate-slideUp"
      id="pwa-floating-install-banner"
    >
      <div className="p-4 rounded-2xl bg-neutral-900/95 border border-blue-500/40 shadow-2xl shadow-black/80 backdrop-blur-md flex items-start gap-3 text-neutral-100">
        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md shadow-blue-500/20 border border-blue-400/30 shrink-0 bg-neutral-950 p-0.5 flex items-center justify-center">
          <img
            src="/icons/icon-192x192.png"
            alt="BizFlow ERP App Logo"
            className="w-full h-full object-cover rounded-lg"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Sparkles className="w-2.5 h-2.5" />
              Native App
            </span>
          </div>
          <h3 className="text-xs font-bold text-white mt-1 truncate">
            Install BizFlow ERP
          </h3>
          <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
            Get instant offline access, hardware integration, and a dedicated desktop/mobile window.
          </p>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleInstallClick}
              className="flex-1 py-1.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-900/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              id="btn-banner-install-app"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
            <button
              onClick={() => setIsPWAInstallModalOpen(true)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Installation Guide"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="text-neutral-400 hover:text-white p-1 rounded-md hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
          aria-label="Dismiss installation prompt"
          id="btn-banner-dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
