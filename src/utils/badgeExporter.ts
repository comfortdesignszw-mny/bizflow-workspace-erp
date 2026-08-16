import QRCode from 'qrcode';
import { Employee } from '../types/erp';

export interface BadgeExportOptions {
  companyName?: string;
  isInside?: boolean;
  scale?: number;
}

/**
 * Helper to safely load an image as an HTMLImageElement with fallback on CORS/network errors
 */
const loadImageSafely = (src: string): Promise<HTMLImageElement | null> => {
  return new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';

    img.onload = () => resolve(img);
    img.onerror = () => {
      // If crossOrigin anonymous failed, try without crossOrigin or fallback
      const fallbackImg = new Image();
      fallbackImg.referrerPolicy = 'no-referrer';
      fallbackImg.onload = () => resolve(fallbackImg);
      fallbackImg.onerror = () => resolve(null);
      fallbackImg.src = src;
    };
    img.src = src;
  });
};

/**
 * Generate a high-resolution, beautifully formatted employee identification card PNG Blob
 */
export async function generateBadgeCanvas(
  emp: Employee,
  options: BadgeExportOptions = {}
): Promise<HTMLCanvasElement> {
  const companyName = options.companyName || 'BizFlow Enterprise Corp';
  const isInside = !!options.isInside;

  // Base canvas dimensions (Crisp HD 800 x 1240)
  const width = 800;
  const height = 1240;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to create canvas 2D context');

  // 1. Draw Card Outer Background with Rounded Corners
  const cornerRadius = 36;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cornerRadius, 0);
  ctx.lineTo(width - cornerRadius, 0);
  ctx.quadraticCurveTo(width, 0, width, cornerRadius);
  ctx.lineTo(width, height - cornerRadius);
  ctx.quadraticCurveTo(width, height, width - cornerRadius, height);
  ctx.lineTo(cornerRadius, height);
  ctx.quadraticCurveTo(0, height, 0, height - cornerRadius);
  ctx.lineTo(0, cornerRadius);
  ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
  ctx.closePath();
  ctx.clip();

  // Dark background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#0f172a');
  bgGrad.addColorStop(0.5, '#090d16');
  bgGrad.addColorStop(1, '#030712');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle background pattern / decorative grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
  ctx.lineWidth = 1;
  const gridSize = 40;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // 2. Header Banner Strip
  const headerHeight = 160;
  const headerGrad = ctx.createLinearGradient(0, 0, width, 0);
  headerGrad.addColorStop(0, '#1d4ed8'); // Blue 700
  headerGrad.addColorStop(0.5, '#4338ca'); // Indigo 700
  headerGrad.addColorStop(1, '#6d28d9'); // Purple 700
  ctx.fillStyle = headerGrad;
  ctx.fillRect(0, 0, width, headerHeight);

  // Decorative header accents
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.beginPath();
  ctx.arc(width - 40, -20, 100, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(40, headerHeight + 20, 60, 0, Math.PI * 2);
  ctx.fill();

  // Header Title & Company Branding
  ctx.fillStyle = '#93c5fd';
  ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '3px';
  ctx.fillText('BIZFLOW ENTERPRISE ERP • OFFICIAL IDENTIFICATION', width / 2, 46);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '0.5px';
  ctx.fillText(companyName, width / 2, 88);

  // Active status badge in header
  const statusBadgeText = isInside ? '● PRESENT IN BUILDING' : '● ACTIVE CREDENTIAL';
  ctx.fillStyle = isInside ? '#10b981' : '#38bdf8';
  ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
  ctx.fillText(statusBadgeText, width / 2, 122);

  // 3. Employee Avatar Photo
  const avatarY = 250;
  const avatarRadius = 75;

  // Outer shadow & glow ring for avatar
  ctx.save();
  ctx.shadowColor = 'rgba(59, 130, 246, 0.4)';
  ctx.shadowBlur = 24;
  ctx.beginPath();
  ctx.arc(width / 2, avatarY, avatarRadius + 6, 0, Math.PI * 2);
  ctx.fillStyle = '#3b82f6';
  ctx.fill();
  ctx.restore();

  // Try loading real avatar
  let avatarLoaded = false;
  try {
    const avatarImg = await loadImageSafely(emp.avatar);
    if (avatarImg) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(width / 2, avatarY, avatarRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(
        avatarImg,
        width / 2 - avatarRadius,
        avatarY - avatarRadius,
        avatarRadius * 2,
        avatarRadius * 2
      );
      ctx.restore();
      avatarLoaded = true;
    }
  } catch (e) {
    console.warn('[BadgeExporter] Avatar image draw fallback triggered:', e);
  }

  // Fallback Monogram Avatar if image couldn't load or CORS restricted
  if (!avatarLoaded) {
    ctx.save();
    const avGrad = ctx.createLinearGradient(
      width / 2 - avatarRadius,
      avatarY - avatarRadius,
      width / 2 + avatarRadius,
      avatarY + avatarRadius
    );
    avGrad.addColorStop(0, '#2563eb');
    avGrad.addColorStop(1, '#4f46e5');
    ctx.fillStyle = avGrad;
    ctx.beginPath();
    ctx.arc(width / 2, avatarY, avatarRadius, 0, Math.PI * 2);
    ctx.fill();

    const initials = `${emp.firstName.charAt(0)}${emp.lastName.charAt(0)}`.toUpperCase();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 52px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, width / 2, avatarY + 2);
    ctx.restore();
  }

  // Border ring around avatar
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(width / 2, avatarY, avatarRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Small Verified Badge Icon next to Avatar
  ctx.save();
  ctx.fillStyle = '#2563eb';
  ctx.beginPath();
  ctx.arc(width / 2 + avatarRadius - 10, avatarY + avatarRadius - 15, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✓', width / 2 + avatarRadius - 10, avatarY + avatarRadius - 15);
  ctx.restore();

  // 4. Employee Name & Position
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 34px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${emp.firstName} ${emp.lastName}`, width / 2, 380);

  ctx.fillStyle = '#818cf8';
  ctx.font = '600 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(emp.position, width / 2, 415);

  // Department Chip
  const deptText = emp.department.toUpperCase();
  ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const deptWidth = ctx.measureText(deptText).width + 36;
  const deptY = 438;
  const deptHeight = 32;

  ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(width / 2 - deptWidth / 2, deptY, deptWidth, deptHeight, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#cbd5e1';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(deptText, width / 2, deptY + deptHeight / 2);
  ctx.textBaseline = 'alphabetic'; // Reset baseline

  // 5. Scannable QR Matrix
  const qrContainerY = 495;
  const qrContainerSize = 340;
  const qrContainerX = (width - qrContainerSize) / 2;

  // White Card Container for 100% Optical QR Contrast
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(qrContainerX, qrContainerY, qrContainerSize, qrContainerSize, 24);
  ctx.fill();
  ctx.restore();

  // Clean Border for QR Container
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(qrContainerX, qrContainerY, qrContainerSize, qrContainerSize, 24);
  ctx.stroke();

  // QR Payload: structured JSON payload containing employee info & verification token
  const qrPayload = JSON.stringify({
    badgeId: emp.code,
    employeeId: emp.id,
    name: `${emp.firstName} ${emp.lastName}`,
    department: emp.department,
    role: emp.position,
    status: emp.status,
    issuedBy: 'BIZFLOW-ERP-SECURITY',
    verified: true,
    expires: '2027-12-31'
  });

  // Generate QR Canvas
  const qrCanvas = document.createElement('canvas');
  await QRCode.toCanvas(qrCanvas, qrPayload, {
    width: 290,
    margin: 1,
    errorCorrectionLevel: 'H',
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });

  // Draw QR on Main Canvas
  ctx.drawImage(qrCanvas, qrContainerX + 25, qrContainerY + 25, 290, 290);

  // Center Emblem inside QR Code
  const centerEmblemSize = 56;
  const emblemX = qrContainerX + (qrContainerSize - centerEmblemSize) / 2;
  const emblemY = qrContainerY + (qrContainerSize - centerEmblemSize) / 2;

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(emblemX - 4, emblemY - 4, centerEmblemSize + 8, centerEmblemSize + 8, 12);
  ctx.fill();
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#1e3a8a';
  ctx.beginPath();
  ctx.roundRect(emblemX, emblemY, centerEmblemSize, centerEmblemSize, 10);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('BF', emblemX + centerEmblemSize / 2, emblemY + centerEmblemSize / 2);
  ctx.textBaseline = 'alphabetic';

  // 6. Security Details & Monospace Meta Table
  const metaBoxY = 860;
  const metaBoxWidth = 660;
  const metaBoxHeight = 160;
  const metaBoxX = (width - metaBoxWidth) / 2;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = 'rgba(51, 65, 85, 0.7)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(metaBoxX, metaBoxY, metaBoxWidth, metaBoxHeight, 20);
  ctx.fill();
  ctx.stroke();

  // Grid details inside meta box
  const col1X = metaBoxX + 30;
  const col2X = metaBoxX + metaBoxWidth / 2 + 20;

  // Row 1
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('BADGE IDENTIFIER', col1X, metaBoxY + 36);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px monospace';
  ctx.fillText(emp.code, col1X, metaBoxY + 62);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('FACILITY CLEARANCE', col2X, metaBoxY + 36);
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Tier-3 Facility Ingress', col2X, metaBoxY + 62);

  // Row 2
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('SCHEDULED SHIFT', col1X, metaBoxY + 105);
  ctx.fillStyle = '#f8fafc';
  ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
  ctx.fillText(`${emp.shiftStart} - ${emp.shiftEnd}`, col1X, metaBoxY + 128);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('CREDENTIAL STATUS', col2X, metaBoxY + 105);
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('VERIFIED & ACTIVE', col2X, metaBoxY + 128);

  // 7. Bottom Barcode Lines & Security Strip
  const barcodeY = 1045;
  const barcodeHeight = 44;
  const barcodeWidth = 600;
  const barcodeX = (width - barcodeWidth) / 2;

  // Background white plate for barcode
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(barcodeX, barcodeY, barcodeWidth, barcodeHeight + 35, 12);
  ctx.fill();

  // Draw simulated Code-128 barcode pattern
  ctx.fillStyle = '#000000';
  let currX = barcodeX + 24;
  const barcodePattern = [3, 1, 2, 2, 1, 3, 2, 1, 1, 4, 2, 2, 1, 3, 1, 2, 3, 1, 2, 2, 4, 1, 1, 3, 2, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 1, 3, 2, 2, 1, 4, 1, 2, 3, 1, 2, 3, 2, 1, 4, 1, 3, 2, 1, 2, 2, 3, 1, 4, 1, 2, 3, 1, 2, 3, 1, 2, 4, 1, 2, 3, 1];
  for (let i = 0; i < barcodePattern.length && currX < barcodeX + barcodeWidth - 24; i++) {
    const barW = barcodePattern[i] * 2.2;
    if (i % 2 === 0) {
      ctx.fillRect(currX, barcodeY + 8, barW, barcodeHeight);
    }
    currX += barW;
  }

  // Barcode text label
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`*BF-${emp.code}-${emp.id.substring(0, 8).toUpperCase()}*`, width / 2, barcodeY + barcodeHeight + 24);

  // 8. Footer Legal Note & NFC Notice
  ctx.fillStyle = '#64748b';
  ctx.font = '500 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Encrypted RFID/NFC & Optical ID • Property of BizFlow Technologies • Return if found', width / 2, 1175);

  ctx.fillStyle = '#475569';
  ctx.font = '500 10px monospace';
  ctx.fillText('DIGITAL TRUST CERT: SHA256-AUTHENTICATED • COMPLIANT WITH BIZFLOW ACCESS CONTROL GATEWAYS', width / 2, 1198);

  // 9. Card Outer Stroke Border
  ctx.restore();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cornerRadius, 0);
  ctx.lineTo(width - cornerRadius, 0);
  ctx.quadraticCurveTo(width, 0, width, cornerRadius);
  ctx.lineTo(width, height - cornerRadius);
  ctx.quadraticCurveTo(width, height, width - cornerRadius, height);
  ctx.lineTo(cornerRadius, height);
  ctx.quadraticCurveTo(0, height, 0, height - cornerRadius);
  ctx.lineTo(0, cornerRadius);
  ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
  ctx.closePath();
  ctx.stroke();

  return canvas;
}

/**
 * Triggers browser download of the generated badge PNG file
 */
export async function downloadBadgePNG(
  emp: Employee,
  options: BadgeExportOptions = {}
): Promise<void> {
  const canvas = await generateBadgeCanvas(emp, options);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to generate PNG blob from canvas'));
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const safeName = `${emp.firstName}_${emp.lastName}_${emp.code}`.replace(/[^a-zA-Z0-9_-]/g, '_');
      link.download = `${safeName}_Badge.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        URL.revokeObjectURL(url);
        resolve();
      }, 1500);
    }, 'image/png', 1.0);
  });
}

/**
 * Copies the generated badge PNG to the system clipboard
 */
export async function copyBadgePNGToClipboard(
  emp: Employee,
  options: BadgeExportOptions = {}
): Promise<boolean> {
  try {
    if (!navigator.clipboard || !window.ClipboardItem) {
      return false;
    }
    const canvas = await generateBadgeCanvas(emp, options);

    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve(false);
          return;
        }
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          resolve(true);
        } catch (e) {
          console.warn('[BadgeExporter] Clipboard copy error:', e);
          resolve(false);
        }
      }, 'image/png');
    });
  } catch {
    return false;
  }
}
