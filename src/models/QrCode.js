const mongoose = require('mongoose');

// Singleton collection: the site QR never varies per-client, so only one
// document should ever exist, always with _id = "singleton".
const SINGLETON_ID = 'singleton';

const qrCodeSchema = new mongoose.Schema(
  {
    _id: { type: String, default: SINGLETON_ID },
    targetUrl: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

qrCodeSchema.statics.SINGLETON_ID = SINGLETON_ID;

module.exports = mongoose.model('QrCode', qrCodeSchema);
