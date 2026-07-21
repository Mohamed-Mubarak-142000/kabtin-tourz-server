const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const QRCode = require('qrcode');
const env = require('../config/env');
const QrCode = require('../models/QrCode');
const uploadService = require('./uploadService');

const NAVY = '#163b76';
const CARD = 1200;
const QR_SIZE = 1020;
const QR_OFFSET = 90;
const BADGE = 220;
const BADGE_OFFSET = (CARD - BADGE) / 2;
const ASSETS_DIR = path.join(__dirname, '../assets/qr');

// Pre-baked opaque brand assets (rounded frame + logo badge). Loaded once
// and cached — no per-request disk reads, no image-resizing dependency.
let assetsPromise = null;
function loadAssets() {
  if (!assetsPromise) {
    assetsPromise = Promise.all([
      fs.promises.readFile(path.join(ASSETS_DIR, 'frame.png')),
      fs.promises.readFile(path.join(ASSETS_DIR, 'badge.png')),
    ]);
  }
  return assetsPromise;
}

// Copies a fully-opaque `src` PNG onto `dst` at (dstX, dstY) row by row.
// Both pre-baked assets and the generated QR are opaque, so a byte-range
// copy is sufficient — no alpha blending needed.
function blit(dst, src, dstX, dstY) {
  const bytesPerPixel = 4;
  for (let row = 0; row < src.height; row += 1) {
    const srcStart = row * src.width * bytesPerPixel;
    const dstRowOffset = ((dstY + row) * dst.width + dstX) * bytesPerPixel;
    src.data.copy(dst.data, dstRowOffset, srcStart, srcStart + src.width * bytesPerPixel);
  }
}

async function buildQrCardBuffer(url) {
  const [frameBuffer, badgeBuffer] = await loadAssets();
  const qrBuffer = await QRCode.toBuffer(url, {
    errorCorrectionLevel: 'H',
    type: 'png',
    margin: 1,
    width: QR_SIZE,
    color: { dark: NAVY, light: '#ffffff' },
  });

  const frame = PNG.sync.read(frameBuffer);
  const badge = PNG.sync.read(badgeBuffer);
  const qr = PNG.sync.read(qrBuffer);

  blit(frame, qr, QR_OFFSET, QR_OFFSET);
  blit(frame, badge, BADGE_OFFSET, BADGE_OFFSET);

  return PNG.sync.write(frame);
}

// Returns the single site-wide QR code, generating (or regenerating, if
// the target URL has changed) on demand and caching the result.
async function getSiteQrCode() {
  const targetUrl = env.PUBLIC_SITE_URL;
  const existing = await QrCode.findById(QrCode.SINGLETON_ID);
  if (existing && existing.targetUrl === targetUrl) return existing;

  const buffer = await buildQrCardBuffer(targetUrl);
  const uploaded = await uploadService.uploadBuffer(buffer, { folder: 'kabtin-brez/qr-codes' });

  return QrCode.findByIdAndUpdate(
    QrCode.SINGLETON_ID,
    { $set: { targetUrl, imageUrl: uploaded.secure_url } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
}

module.exports = { getSiteQrCode };
