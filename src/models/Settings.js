const mongoose = require('mongoose');

// Singleton collection: only one document should ever exist, always
// with _id = "singleton". Use Settings.getSingleton() / upsertSingleton()
// in the service layer rather than creating new documents.
const SINGLETON_ID = 'singleton';

const settingsSchema = new mongoose.Schema(
  {
    _id: { type: String, default: SINGLETON_ID },
    hero: {
      title: { type: String },
      subtitle: { type: String },
      images: { type: [String], default: [] },
    },
    phones: { type: [String], default: [] },
    whatsappNumbers: { type: [String], default: [] },
    socialLinks: {
      facebook: { type: String },
      instagram: { type: String },
      youtube: { type: String },
      tiktok: { type: String },
    },
    stats: {
      years: { type: Number },
      clients: { type: Number },
      branchesCount: { type: Number },
      googleRating: { type: Number },
    },
    about: { type: String },
  },
  { timestamps: true }
);

settingsSchema.statics.SINGLETON_ID = SINGLETON_ID;

module.exports = mongoose.model('Settings', settingsSchema);
