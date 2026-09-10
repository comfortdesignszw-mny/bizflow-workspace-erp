// BizFlow ERP - Dynamic Web & Native App Manifest Configuration
export const appManifest = {
  name: "BizFlow Enterprise ERP",
  short_name: "BizFlow ERP",
  description: "Offline-First Enterprise Resource Planning & Workforce Management Platform with Dexie.JS IndexedDB, biometric access, and multi-department analytics.",
  start_url: "/",
  id: "/",
  display: "standalone",
  orientation: "any",
  background_color: "#06071b",
  theme_color: "#06071b",
  icons: [
    {
      src: "/icons/icon-192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any"
    },
    {
      src: "/icons/icon-512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any"
    },
    {
      src: "/icons/icon-maskable-512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable"
    },
    {
      src: "/icons/icon-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any"
    },
    {
      src: "/icons/icon-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any"
    },
    {
      src: "/icons/icon-maskable-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "maskable"
    }
  ],
  screenshots: [
    {
      src: "/screenshots/desktop-dashboard.png",
      sizes: "1920x1080",
      type: "image/png",
      form_factor: "wide",
      label: "BizFlow ERP Desktop Operations Dashboard"
    },
    {
      src: "/screenshots/mobile-operations.png",
      sizes: "750x1334",
      type: "image/png",
      form_factor: "narrow",
      label: "BizFlow ERP Mobile Real-Time Biometric & Project Operations"
    }
  ],
  categories: ["business", "productivity", "utilities", "finance"]
};

// Automatic manifest link injector if not present
if (typeof document !== 'undefined') {
  let link = document.querySelector('link[rel="manifest"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'manifest';
    link.href = '/manifest.json';
    document.head.appendChild(link);
  }
}
