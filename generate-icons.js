import sharp from 'sharp';
import fs from 'fs';

async function generateAllIcons() {
  const masterSource = './src/assets/images/bizflow_app_icon_1786882963754.jpg';
  if (!fs.existsSync(masterSource)) {
    throw new Error('Master source does not exist: ' + masterSource);
  }

  // Ensure public and public/icons exist
  fs.mkdirSync('./public', { recursive: true });
  fs.mkdirSync('./public/icons', { recursive: true });

  const sizes = [
    { file: './public/favicon.png', size: 32 },
    { file: './public/favicon-96x96.png', size: 96 },
    { file: './public/apple-touch-icon.png', size: 180 },
    { file: './public/apple-touch-icon-180x180.png', size: 180 },
    { file: './public/apple-touch-icon-precomposed.png', size: 180 },
    { file: './public/web-app-manifest-192x192.png', size: 192 },
    { file: './public/web-app-manifest-512x512.png', size: 512 },
    { file: './public/icon.png', size: 512 },
    { file: './public/icons/icon-72x72.png', size: 72 },
    { file: './public/icons/icon-96x96.png', size: 96 },
    { file: './public/icons/icon-128x128.png', size: 128 },
    { file: './public/icons/icon-144x144.png', size: 144 },
    { file: './public/icons/icon-152x152.png', size: 152 },
    { file: './public/icons/icon-192x192.png', size: 192 },
    { file: './public/icons/icon-384x384.png', size: 384 },
    { file: './public/icons/icon-512x512.png', size: 512 },
    { file: './public/icons/apple-touch-icon.png', size: 180 },
    { file: './public/icons/favicon-96x96.png', size: 96 },
    { file: './public/icons/web-app-manifest-192x192.png', size: 192 },
    { file: './public/icons/web-app-manifest-512x512.png', size: 512 },
  ];

  for (const item of sizes) {
    await sharp(masterSource)
      .resize(item.size, item.size, { fit: 'cover' })
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(item.file);
    console.log('Generated:', item.file, `${item.size}x${item.size}`);
  }

  // Generate Maskable Icons (safe zone with dark theme background #06071b matching icon background)
  await sharp(masterSource)
    .resize(154, 154, { fit: 'contain' })
    .extend({
      top: 19,
      bottom: 19,
      left: 19,
      right: 19,
      background: { r: 6, g: 7, b: 27, alpha: 1 }
    })
    .png({ quality: 100 })
    .toFile('./public/icons/icon-maskable-192x192.png');
  console.log('Generated maskable 192x192');

  await sharp(masterSource)
    .resize(410, 410, { fit: 'contain' })
    .extend({
      top: 51,
      bottom: 51,
      left: 51,
      right: 51,
      background: { r: 6, g: 7, b: 27, alpha: 1 }
    })
    .png({ quality: 100 })
    .toFile('./public/icons/icon-maskable-512x512.png');
  console.log('Generated maskable 512x512');

  // Copy favicon.png to favicon.ico as well
  fs.copyFileSync('./public/favicon.png', './public/favicon.ico');
  console.log('Copied favicon.ico');
}

generateAllIcons()
  .then(() => {
    console.log('ALL ICONS GENERATED SUCCESSFULLY');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
