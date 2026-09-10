import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateAllIconsAndScreenshots() {
  const masterSource = './src/assets/images/bizflow_app_icon_1786882963754.jpg';
  if (!fs.existsSync(masterSource)) {
    throw new Error('Master source does not exist: ' + masterSource);
  }

  // Ensure directories exist
  const dirs = [
    './public',
    './public/icons',
    './public/screenshots',
    './dist',
    './dist/icons',
    './dist/screenshots'
  ];
  for (const d of dirs) {
    fs.mkdirSync(d, { recursive: true });
  }

  console.log('Generating standard square icons...');

  // Standard sizes to generate
  const standardIcons = [
    { name: 'favicon.png', size: 32 },
    { name: 'favicon-96x96.png', size: 96 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'apple-touch-icon-180x180.png', size: 180 },
    { name: 'apple-touch-icon-precomposed.png', size: 180 },
    { name: 'web-app-manifest-192x192.png', size: 192 },
    { name: 'web-app-manifest-512x512.png', size: 512 },
    { name: 'icon.png', size: 512 },
    { name: 'icon-72x72.png', size: 72 },
    { name: 'icon-96x96.png', size: 96 },
    { name: 'icon-128x128.png', size: 128 },
    { name: 'icon-144x144.png', size: 144 },
    { name: 'icon-152x152.png', size: 152 },
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-192x192.png', size: 192 },
    { name: 'icon-384x384.png', size: 384 },
    { name: 'icon-512.png', size: 512 },
    { name: 'icon-512x512.png', size: 512 },
  ];

  for (const item of standardIcons) {
    const buffer = await sharp(masterSource)
      .resize(item.size, item.size, { fit: 'cover' })
      .png({ quality: 100, compressionLevel: 9 })
      .toBuffer();

    // Write to public/icons/
    fs.writeFileSync(path.join('./public/icons', item.name), buffer);
    // Write to public/
    fs.writeFileSync(path.join('./public', item.name), buffer);
    // Write to dist/icons/
    fs.writeFileSync(path.join('./dist/icons', item.name), buffer);
    // Write to dist/
    fs.writeFileSync(path.join('./dist', item.name), buffer);

    console.log(`Generated ${item.name} (${item.size}x${item.size}) in root and icons/`);
  }

  // Favicon.ico copy
  const faviconBuffer = fs.readFileSync('./public/favicon.png');
  fs.writeFileSync('./public/favicon.ico', faviconBuffer);
  fs.writeFileSync('./public/icons/favicon.ico', faviconBuffer);
  fs.writeFileSync('./dist/favicon.ico', faviconBuffer);
  fs.writeFileSync('./dist/icons/favicon.ico', faviconBuffer);

  console.log('Generating maskable icons with 10% safe zone...');

  // Maskable 192x192
  const maskable192 = await sharp(masterSource)
    .resize(154, 154, { fit: 'contain' })
    .extend({
      top: 19,
      bottom: 19,
      left: 19,
      right: 19,
      background: { r: 6, g: 7, b: 27, alpha: 1 }
    })
    .png({ quality: 100, compressionLevel: 9 })
    .toBuffer();

  const maskable192Names = ['icon-maskable-192x192.png', 'icon-maskable-192.png'];
  for (const m of maskable192Names) {
    fs.writeFileSync(path.join('./public/icons', m), maskable192);
    fs.writeFileSync(path.join('./public', m), maskable192);
    fs.writeFileSync(path.join('./dist/icons', m), maskable192);
    fs.writeFileSync(path.join('./dist', m), maskable192);
  }

  // Maskable 512x512
  const maskable512 = await sharp(masterSource)
    .resize(410, 410, { fit: 'contain' })
    .extend({
      top: 51,
      bottom: 51,
      left: 51,
      right: 51,
      background: { r: 6, g: 7, b: 27, alpha: 1 }
    })
    .png({ quality: 100, compressionLevel: 9 })
    .toBuffer();

  const maskable512Names = ['icon-maskable-512x512.png', 'icon-maskable-512.png'];
  for (const m of maskable512Names) {
    fs.writeFileSync(path.join('./public/icons', m), maskable512);
    fs.writeFileSync(path.join('./public', m), maskable512);
    fs.writeFileSync(path.join('./dist/icons', m), maskable512);
    fs.writeFileSync(path.join('./dist', m), maskable512);
  }

  console.log('Generating Desktop & Mobile PWA Screenshots...');

  // Desktop Screenshot (1920x1080, wide form_factor)
  const desktopSvg = `
<svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#06071b"/>
      <stop offset="50%" stop-color="#0a0f29"/>
      <stop offset="100%" stop-color="#030712"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#111827"/>
      <stop offset="100%" stop-color="#0b0f19"/>
    </linearGradient>
    <linearGradient id="blueAccent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
    <linearGradient id="emeraldAccent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#34d399"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <linearGradient id="purpleAccent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#c084fc"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
    <linearGradient id="amberAccent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
  </defs>

  <!-- Canvas Background -->
  <rect width="1920" height="1080" fill="url(#bg)"/>

  <!-- Left Sidebar (width 280) -->
  <rect x="0" y="0" width="280" height="1080" fill="#090d1a" stroke="#1f293d" stroke-width="1"/>
  
  <!-- Sidebar Brand -->
  <rect x="24" y="24" width="44" height="44" rx="12" fill="url(#blueAccent)"/>
  <text x="38" y="53" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="24">B</text>
  <text x="80" y="44" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="700" font-size="20">BizFlow ERP</text>
  <text x="80" y="62" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="12">Enterprise Operations</text>

  <!-- Sidebar Nav Items -->
  <g transform="translate(16, 100)">
    <!-- Active Item: Dashboard -->
    <rect x="0" y="0" width="248" height="46" rx="10" fill="#1e293b" stroke="#3b82f6" stroke-width="1"/>
    <circle cx="26" cy="23" r="6" fill="#38bdf8"/>
    <text x="44" y="29" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="600" font-size="15">Dashboard &amp; KPIs</text>

    <!-- Other items -->
    <g transform="translate(0, 56)">
      <text x="44" y="26" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14">Projects &amp; Tasks</text>
      <circle cx="26" cy="20" r="4" fill="#475569"/>
    </g>
    <g transform="translate(0, 102)">
      <text x="44" y="26" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14">Engineering (6 Divisions)</text>
      <circle cx="26" cy="20" r="4" fill="#475569"/>
    </g>
    <g transform="translate(0, 148)">
      <text x="44" y="26" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14">Biometric Terminal</text>
      <circle cx="26" cy="20" r="4" fill="#475569"/>
    </g>
    <g transform="translate(0, 194)">
      <text x="44" y="26" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14">Employee Management</text>
      <circle cx="26" cy="20" r="4" fill="#475569"/>
    </g>
    <g transform="translate(0, 240)">
      <text x="44" y="26" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14">Payroll &amp; Compensation</text>
      <circle cx="26" cy="20" r="4" fill="#475569"/>
    </g>
    <g transform="translate(0, 286)">
      <text x="44" y="26" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14">Accounts &amp; Finance</text>
      <circle cx="26" cy="20" r="4" fill="#475569"/>
    </g>
    <g transform="translate(0, 332)">
      <text x="44" y="26" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14">Procurement Orders</text>
      <circle cx="26" cy="20" r="4" fill="#475569"/>
    </g>
    <g transform="translate(0, 378)">
      <text x="44" y="26" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14">Fleet &amp; Trip Logs</text>
      <circle cx="26" cy="20" r="4" fill="#475569"/>
    </g>
    <g transform="translate(0, 424)">
      <text x="44" y="26" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14">IT Systems &amp; Helpdesk</text>
      <circle cx="26" cy="20" r="4" fill="#475569"/>
    </g>
  </g>

  <!-- Top Header Bar (x: 280, y: 0, w: 1640, h: 74) -->
  <rect x="280" y="0" width="1640" height="74" fill="#090d1a" stroke="#1f293d" stroke-width="1"/>
  
  <!-- Search Bar -->
  <rect x="312" y="16" width="460" height="42" rx="10" fill="#111827" stroke="#374151" stroke-width="1"/>
  <text x="340" y="42" fill="#6b7280" font-family="system-ui, sans-serif" font-size="14">Search employees, job cards, payroll, POs...</text>

  <!-- Live Status Pill -->
  <rect x="1380" y="18" width="180" height="38" rx="19" fill="#064e3b" stroke="#059669" stroke-width="1"/>
  <circle cx="1400" cy="37" r="5" fill="#34d399"/>
  <text x="1415" y="42" fill="#34d399" font-family="system-ui, sans-serif" font-weight="600" font-size="13">12 Staff On-Site</text>

  <!-- User Profile -->
  <circle cx="1840" cy="37" r="18" fill="url(#blueAccent)"/>
  <text x="1834" y="43" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="700" font-size="15">C</text>
  <text x="1670" y="36" fill="#f3f4f6" font-family="system-ui, sans-serif" font-weight="600" font-size="14">Comfort (Admin)</text>
  <text x="1670" y="52" fill="#9ca3af" font-family="system-ui, sans-serif" font-size="11">comfort.designszw@gmail.com</text>

  <!-- Main Content Area -->
  <g transform="translate(312, 100)">
    <!-- Page Title & Subtitle -->
    <text x="0" y="30" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="800" font-size="28">Enterprise Workforce &amp; Operations Center</text>
    <text x="0" y="54" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14">Offline-first synchronized telemetry, job card lifecycle, automated payroll, and access monitoring</text>

    <!-- 4 KPI Summary Cards -->
    <g transform="translate(0, 76)">
      <!-- Card 1: Headcount -->
      <rect x="0" y="0" width="370" height="130" rx="14" fill="url(#cardGrad)" stroke="#1f293d" stroke-width="1.5"/>
      <text x="24" y="38" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13" font-weight="500">ACTIVE WORKFORCE</text>
      <text x="24" y="80" fill="#ffffff" font-family="system-ui, sans-serif" font-size="36" font-weight="800">14</text>
      <rect x="250" y="24" width="96" height="28" rx="14" fill="#1e3a8a"/>
      <text x="262" y="42" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="12" font-weight="600">92.8% Punctual</text>
      <text x="24" y="108" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="12">12 Clocked IN today via QR badge</text>

      <!-- Card 2: Payroll Burn -->
      <rect x="394" y="0" width="370" height="130" rx="14" fill="url(#cardGrad)" stroke="#1f293d" stroke-width="1.5"/>
      <text x="418" y="38" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13" font-weight="500">MONTHLY PAYROLL DISBURSED</text>
      <text x="418" y="80" fill="#ffffff" font-family="system-ui, sans-serif" font-size="36" font-weight="800">$118,500</text>
      <rect x="650" y="24" width="90" height="28" rx="14" fill="#064e3b"/>
      <text x="664" y="42" fill="#34d399" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Processed</text>
      <text x="418" y="108" fill="#34d399" font-family="system-ui, sans-serif" font-size="12">Direct Deposit ACH verified</text>

      <!-- Card 3: Engineering Job Cards -->
      <rect x="788" y="0" width="370" height="130" rx="14" fill="url(#cardGrad)" stroke="#1f293d" stroke-width="1.5"/>
      <text x="812" y="38" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13" font-weight="500">ENGINEERING JOB CARDS</text>
      <text x="812" y="80" fill="#ffffff" font-family="system-ui, sans-serif" font-size="36" font-weight="800">4 Active</text>
      <rect x="1030" y="24" width="104" height="28" rx="14" fill="#4c1d95"/>
      <text x="1042" y="42" fill="#c084fc" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Synced to Accts</text>
      <text x="812" y="108" fill="#a78bfa" font-family="system-ui, sans-serif" font-size="12">Mechanical &amp; Electrical maintenance</text>

      <!-- Card 4: Projects & Velocity -->
      <rect x="1182" y="0" width="370" height="130" rx="14" fill="url(#cardGrad)" stroke="#1f293d" stroke-width="1.5"/>
      <text x="1206" y="38" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13" font-weight="500">PROJECTS &amp; ROADMAP</text>
      <text x="1206" y="80" fill="#ffffff" font-family="system-ui, sans-serif" font-size="36" font-weight="800">6 Active</text>
      <rect x="1430" y="24" width="98" height="28" rx="14" fill="#78350f"/>
      <text x="1442" y="42" fill="#fbbf24" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Sprint 14</text>
      <text x="1206" y="108" fill="#fbbf24" font-family="system-ui, sans-serif" font-size="12">94.2% on-time milestone velocity</text>
    </g>

    <!-- Mid Section: Left Chart (900 wide) + Right Engineering Board (652 wide) -->
    <g transform="translate(0, 230)">
      <!-- Left: Realtime Biometric Telemetry Chart -->
      <rect x="0" y="0" width="900" height="440" rx="14" fill="url(#cardGrad)" stroke="#1f293d" stroke-width="1.5"/>
      <text x="28" y="40" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="700" font-size="18">Weekly Workforce Attendance &amp; Shift Rollup</text>
      <text x="28" y="64" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13">Biometric gate scanner clock-in punctuality vs standard working hours</text>

      <!-- Bar Graph Mockup -->
      <g transform="translate(40, 100)">
        <!-- Monday -->
        <rect x="40" y="40" width="48" height="220" rx="6" fill="#3b82f6"/>
        <text x="48" y="284" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13">Mon</text>
        <text x="46" y="30" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="12">96%</text>

        <!-- Tuesday -->
        <rect x="160" y="30" width="48" height="230" rx="6" fill="#3b82f6"/>
        <text x="168" y="284" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13">Tue</text>
        <text x="166" y="20" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="12">98%</text>

        <!-- Wednesday -->
        <rect x="280" y="20" width="48" height="240" rx="6" fill="#38bdf8"/>
        <text x="288" y="284" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13">Wed</text>
        <text x="286" y="10" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="12">100%</text>

        <!-- Thursday -->
        <rect x="400" y="50" width="48" height="210" rx="6" fill="#3b82f6"/>
        <text x="408" y="284" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13">Thu</text>
        <text x="406" y="40" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="12">94%</text>

        <!-- Friday -->
        <rect x="520" y="35" width="48" height="225" rx="6" fill="#3b82f6"/>
        <text x="528" y="284" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13">Fri</text>
        <text x="526" y="25" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="12">97%</text>

        <!-- Saturday -->
        <rect x="640" y="180" width="48" height="80" rx="6" fill="#1e293b"/>
        <text x="648" y="284" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13">Sat</text>
        <text x="646" y="170" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">35%</text>

        <!-- Sunday -->
        <rect x="760" y="220" width="48" height="40" rx="6" fill="#1e293b"/>
        <text x="768" y="284" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13">Sun</text>
        <text x="766" y="210" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">18%</text>
      </g>

      <!-- Right: Engineering Job Cards List (624 wide) -->
      <g transform="translate(924, 0)">
        <rect x="0" y="0" width="628" height="440" rx="14" fill="url(#cardGrad)" stroke="#1f293d" stroke-width="1.5"/>
        <text x="24" y="40" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="700" font-size="18">Engineering Job Cards</text>
        <text x="24" y="64" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13">Mechanical, Electrical &amp; Automation lifecycle</text>

        <!-- Job Card 1 -->
        <g transform="translate(24, 90)">
          <rect x="0" y="0" width="580" height="96" rx="10" fill="#1e293b" stroke="#334155" stroke-width="1"/>
          <text x="20" y="32" fill="#38bdf8" font-family="system-ui, sans-serif" font-weight="700" font-size="14">JC-MECH-2026-001</text>
          <text x="170" y="32" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="12">Mechanical • Marcus Brody</text>
          <rect x="460" y="16" width="100" height="24" rx="12" fill="#1e3a8a"/>
          <text x="472" y="32" fill="#93c5fd" font-family="system-ui, sans-serif" font-weight="600" font-size="11">IN PROGRESS</text>
          <text x="20" y="58" fill="#f1f5f9" font-family="system-ui, sans-serif" font-size="13">Centrifugal Water Chiller Compressor Overhaul</text>
          <text x="20" y="80" fill="#10b981" font-family="system-ui, sans-serif" font-weight="600" font-size="12">$3,850 Approved • Synced to Finance Expenses</text>
        </g>

        <!-- Job Card 2 -->
        <g transform="translate(24, 202)">
          <rect x="0" y="0" width="580" height="96" rx="10" fill="#1e293b" stroke="#334155" stroke-width="1"/>
          <text x="20" y="32" fill="#38bdf8" font-family="system-ui, sans-serif" font-weight="700" font-size="14">JC-ELEC-2026-002</text>
          <text x="170" y="32" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="12">Electrical • Tariro Ndlovu</text>
          <rect x="470" y="16" width="90" height="24" rx="12" fill="#064e3b"/>
          <text x="485" y="32" fill="#6ee7b7" font-family="system-ui, sans-serif" font-weight="600" font-size="11">APPROVED</text>
          <text x="20" y="58" fill="#f1f5f9" font-family="system-ui, sans-serif" font-size="13">High-Voltage Switchgear Relay Calibration</text>
          <text x="20" y="80" fill="#10b981" font-family="system-ui, sans-serif" font-weight="600" font-size="12">$4,200 Approved • Synced to Finance Expenses</text>
        </g>

        <!-- Job Card 3 -->
        <g transform="translate(24, 314)">
          <rect x="0" y="0" width="580" height="96" rx="10" fill="#1e293b" stroke="#334155" stroke-width="1"/>
          <text x="20" y="32" fill="#38bdf8" font-family="system-ui, sans-serif" font-weight="700" font-size="14">JC-AUTO-2026-003</text>
          <text x="170" y="32" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="12">Automation • Liam Vance</text>
          <rect x="480" y="16" width="80" height="24" rx="12" fill="#78350f"/>
          <text x="498" y="32" fill="#fde047" font-family="system-ui, sans-serif" font-weight="600" font-size="11">RAISED</text>
          <text x="20" y="58" fill="#f1f5f9" font-family="system-ui, sans-serif" font-size="13">SCADA PLC Firmware Patch &amp; Actuator Retuning</text>
          <text x="20" y="80" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="12">$1,950 Estimated • Awaiting Approval</text>
        </g>
      </g>
    </g>
  </g>
</svg>
`;

  // Mobile Screenshot (750x1334, narrow form_factor)
  const mobileSvg = `
<svg width="750" height="1334" viewBox="0 0 750 1334" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="mBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#06071b"/>
      <stop offset="50%" stop-color="#0b1026"/>
      <stop offset="100%" stop-color="#030712"/>
    </linearGradient>
    <linearGradient id="mCard" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#111827"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="mBlue" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
  </defs>

  <rect width="750" height="1334" fill="url(#mBg)"/>

  <!-- Mobile Top Bar -->
  <rect x="0" y="0" width="750" height="110" fill="#090d1a" stroke="#1f293d" stroke-width="1"/>
  <rect x="36" y="32" width="46" height="46" rx="12" fill="url(#mBlue)"/>
  <text x="50" y="64" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="26">B</text>
  <text x="96" y="55" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="700" font-size="22">BizFlow ERP</text>
  <text x="96" y="74" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="13">Enterprise Suite</text>

  <!-- Live Status Pill -->
  <rect x="530" y="36" width="180" height="38" rx="19" fill="#064e3b" stroke="#059669" stroke-width="1"/>
  <circle cx="550" cy="55" r="5" fill="#34d399"/>
  <text x="566" y="60" fill="#34d399" font-family="system-ui, sans-serif" font-weight="600" font-size="14">12 On-Site</text>

  <!-- Content Container -->
  <g transform="translate(36, 130)">
    <!-- Title -->
    <text x="0" y="32" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="800" font-size="28">Biometric Terminal</text>
    <text x="0" y="60" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="16">Real-Time QR Attendance &amp; Operations</text>

    <!-- QR Terminal Viewfinder Card -->
    <rect x="0" y="86" width="678" height="340" rx="18" fill="url(#mCard)" stroke="#2563eb" stroke-width="2"/>
    
    <!-- Viewfinder Reticle -->
    <rect x="239" y="126" width="200" height="200" rx="16" fill="#030712" stroke="#38bdf8" stroke-width="2" stroke-dasharray="16,8"/>
    <rect x="279" y="166" width="120" height="120" rx="8" fill="#1e293b"/>
    <text x="295" y="235" fill="#38bdf8" font-family="system-ui, sans-serif" font-weight="800" font-size="16">[ QR READY ]</text>
    <text x="220" y="360" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="15">Align badge or tap for manual punch</text>

    <!-- Quick Stat Chips -->
    <g transform="translate(0, 450)">
      <rect x="0" y="0" width="324" height="110" rx="14" fill="url(#mCard)" stroke="#1f293d" stroke-width="1.5"/>
      <text x="20" y="36" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14">WORKFORCE</text>
      <text x="20" y="74" fill="#ffffff" font-family="system-ui, sans-serif" font-size="32" font-weight="800">14 Staff</text>
      <text x="20" y="96" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="13">92.8% On-Time</text>

      <rect x="354" y="0" width="324" height="110" rx="14" fill="url(#mCard)" stroke="#1f293d" stroke-width="1.5"/>
      <text x="374" y="36" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14">JOB CARDS</text>
      <text x="374" y="74" fill="#ffffff" font-family="system-ui, sans-serif" font-size="32" font-weight="800">4 Active</text>
      <text x="374" y="96" fill="#34d399" font-family="system-ui, sans-serif" font-size="13">Synced to Finance</text>
    </g>

    <!-- Recent Job Card Card -->
    <g transform="translate(0, 584)">
      <rect x="0" y="0" width="678" height="180" rx="16" fill="url(#mCard)" stroke="#1f293d" stroke-width="1.5"/>
      <text x="24" y="36" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="700" font-size="18">Active Job Card: Mechanical</text>
      <rect x="520" y="16" width="134" height="30" rx="15" fill="#1e3a8a"/>
      <text x="540" y="36" fill="#93c5fd" font-family="system-ui, sans-serif" font-weight="600" font-size="13">IN PROGRESS</text>
      
      <text x="24" y="74" fill="#38bdf8" font-family="system-ui, sans-serif" font-weight="700" font-size="16">JC-MECH-2026-001</text>
      <text x="24" y="104" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="15">Chiller Compressor Overhaul &amp; Seal Replacement</text>
      <text x="24" y="136" fill="#10b981" font-family="system-ui, sans-serif" font-weight="600" font-size="14">$3,850 • Assigned to Marcus Brody</text>
    </g>

    <!-- Bottom Action Buttons -->
    <g transform="translate(0, 788)">
      <rect x="0" y="0" width="678" height="60" rx="14" fill="#2563eb"/>
      <text x="270" y="38" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="700" font-size="18">CLOCK IN / OUT</text>
    </g>

    <g transform="translate(0, 862)">
      <rect x="0" y="0" width="678" height="60" rx="14" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <text x="240" y="38" fill="#e2e8f0" font-family="system-ui, sans-serif" font-weight="600" font-size="17">+ CREATE NEW JOB CARD</text>
    </g>
  </g>

  <!-- Mobile Bottom Nav -->
  <g transform="translate(0, 1224)">
    <rect x="0" y="0" width="750" height="110" fill="#090d1a" stroke="#1f293d" stroke-width="1"/>
    <text x="90" y="65" fill="#38bdf8" font-family="system-ui, sans-serif" font-weight="700" font-size="16">Overview</text>
    <text x="260" y="65" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="16">Scanner</text>
    <text x="430" y="65" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="16">Job Cards</text>
    <text x="600" y="65" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="16">Payroll</text>
  </g>
</svg>
`;

  // Render Desktop Screenshot PNG
  await sharp(Buffer.from(desktopSvg))
    .png({ quality: 100, compressionLevel: 8 })
    .toFile('./public/screenshots/desktop-dashboard.png');
  fs.copyFileSync('./public/screenshots/desktop-dashboard.png', './dist/screenshots/desktop-dashboard.png');
  console.log('Generated desktop-dashboard.png (1920x1080)');

  // Render Mobile Screenshot PNG
  await sharp(Buffer.from(mobileSvg))
    .png({ quality: 100, compressionLevel: 8 })
    .toFile('./public/screenshots/mobile-operations.png');
  fs.copyFileSync('./public/screenshots/mobile-operations.png', './dist/screenshots/mobile-operations.png');
  console.log('Generated mobile-operations.png (750x1334)');

  console.log('ALL ICONS AND SCREENSHOTS PRODUCED SUCCESSFULLY');
}

generateAllIconsAndScreenshots()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
