import React, { useState } from 'react';

interface ResilientAppIconProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  showGlow?: boolean;
  alt?: string;
  rounded?: string;
}

export const ResilientAppIcon: React.FC<ResilientAppIconProps> = ({
  className = '',
  size = 'md',
  showGlow = false,
  alt = 'BizFlow ERP Logo',
  rounded = 'rounded-xl'
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [fallbackStep, setFallbackStep] = useState(0);

  const fallbackSources = [
    '/icons/icon-192.png',
    '/web-app-manifest-192x192.png',
    '/favicon-96x96.png',
    '/icon-192x192.png'
  ];

  const handleImageError = () => {
    if (fallbackStep < fallbackSources.length - 1) {
      setFallbackStep(prev => prev + 1);
    } else {
      setImageFailed(true);
    }
  };

  const sizeDimensions = {
    xs: { px: 20, class: 'w-5 h-5' },
    sm: { px: 28, class: 'w-7 h-7' },
    md: { px: 38, class: 'w-9.5 h-9.5' },
    lg: { px: 48, class: 'w-12 h-12' },
    xl: { px: 64, class: 'w-16 h-16' }
  };

  const dimension = typeof size === 'number' 
    ? { px: size, class: `w-[${size}px] h-[${size}px]` } 
    : (sizeDimensions[size] || sizeDimensions.md);

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden ${dimension.class} ${rounded} ${className} ${
        showGlow ? 'shadow-lg shadow-blue-500/25 ring-1 ring-blue-500/30' : ''
      }`}
      style={typeof size === 'number' ? { width: size, height: size } : undefined}
      id="bizflow-resilient-brand-icon"
    >
      {!imageFailed ? (
        <img
          src={fallbackSources[fallbackStep]}
          alt={alt}
          onError={handleImageError}
          className={`w-full h-full object-cover select-none ${rounded}`}
          draggable={false}
          loading="eager"
        />
      ) : (
        // Resilient High-Contrast Vector SVG Monogram Fallback
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full ${rounded} select-none`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="50%" stopColor="#0b1120" />
              <stop offset="100%" stopColor="#030712" />
            </linearGradient>
            <linearGradient id="primaryFlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
            <linearGradient id="goldNode" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          {/* Background Card */}
          <rect width="100" height="100" rx="22" fill="url(#bgGrad)" />
          <rect width="98" height="98" x="1" y="1" rx="21" fill="none" stroke="#334155" strokeWidth="1.5" />

          {/* Hexagonal Grid Circuit */}
          <path
            d="M50 15 L80 32 L80 68 L50 85 L20 68 L20 32 Z"
            fill="none"
            stroke="#1e293b"
            strokeWidth="2.5"
          />

          {/* Bold Futuristic "B" Monogram & Flow Lines */}
          <path
            d="M34 26 H56 C66 26 73 32 73 40 C73 45 69 49 63 51 C71 53 76 58 76 66 C76 75 68 81 56 81 H34 Z"
            fill="url(#primaryFlow)"
          />
          
          {/* Internal negative space cutouts for crisp B definition */}
          <path
            d="M44 36 H54 C58 36 61 38 61 42 C61 46 58 48 54 48 H44 Z"
            fill="#0b1120"
          />
          <path
            d="M44 58 H55 C60 58 64 61 64 65 C64 69 60 72 55 72 H44 Z"
            fill="#0b1120"
          />

          {/* Sync Node Sparks (ERP realtime heartbeat indicator) */}
          <circle cx="76" cy="28" r="4.5" fill="url(#goldNode)" />
          <circle cx="76" cy="28" r="2" fill="#ffffff" />
          <line x1="68" y1="32" x2="73" y2="30" stroke="#38bdf8" strokeWidth="1.5" />
        </svg>
      )}
    </div>
  );
};
