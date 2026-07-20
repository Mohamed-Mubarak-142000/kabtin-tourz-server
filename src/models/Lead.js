const mongoose = require('mongoose');

const CATEGORIES = ['hajj', 'umrah', 'flights', 'domestic', 'international', 'visa'];

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    nationality: { type: String, required: true, trim: true },
    identityNumber: { type: String, required: true, trim: true },
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    tripTitle: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    currency: { type: String, required: true },
    serviceCategory: { type: String, enum: CATEGORIES },
    branch: { type: String },
    guests: { type: Number, required: true, min: 1 },
    roomType: { type: String, required: true },
    paymentMethod: { type: String, enum: ['cash', 'bank_transfer', 'instapay', 'vodafone_cash'], required: true },
    paymentProof: { type: String },
    message: { type: String },
    status: { type: String, enum: ['new', 'contacted', 'confirmed', 'payment_pending', 'paid', 'cancelled', 'closed'], default: 'new' },
  },
  { timestamps: true }
);

leadSchema.statics.CATEGORIES = CATEGORIES;

module.exports = mongoose.model('Lead', leadSchema);
