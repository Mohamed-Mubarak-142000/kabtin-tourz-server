const mongoose = require('mongoose');

const CATEGORIES = ['hajj', 'umrah', 'flights', 'domestic', 'international', 'visa'];

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, trim: true },
    serviceCategory: { type: String, enum: CATEGORIES },
    branch: { type: String },
    guests: { type: Number },
    roomType: { type: String },
    message: { type: String },
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
  },
  { timestamps: true }
);

leadSchema.statics.CATEGORIES = CATEGORIES;

module.exports = mongoose.model('Lead', leadSchema);
