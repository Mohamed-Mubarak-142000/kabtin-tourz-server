const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    text: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    source: { type: String, enum: ['facebook', 'google', 'other'], default: 'facebook' },
    avatar: { type: String },
    lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', unique: true, sparse: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
