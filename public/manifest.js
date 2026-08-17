// BizFlow ERP - Dynamic Web & Native App Manifest Configuration
export const appManifest = {
  name: "BizFlow Enterprise ERP",
  short_name: "BizFlow ERP",
  description: "Offline-First Enterprise Resource Planning & Workforce Management Platform",
  start_url: "/",
  id: "/",
  display: "standalone",
  orientation: "any",
  background_color: "#06071b",
  theme_color: "#06071b",
  icons: [
    {
      src: "/web-app-manifest-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any maskable"
    },
    {
      src: "/icons/web-app-manifest-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any maskable"
    },
    {
      src: "/web-app-manifest-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any maskable"
    },
    {
      src: "/icons/web-app-manifest-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any maskable"
    },
    {
      src: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png"
    },
    {
      src: "/favicon-96x96.png",
      sizes: "96x96",
      type: "image/png"
    },
    {
      src: "/icon.png",
      sizes: "512x512",
      type: "image/png"
    }
  ],
  categories: ["business", "productivity", "utilities"]
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

