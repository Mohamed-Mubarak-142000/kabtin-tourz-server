const mongoose = require('mongoose');
const { slugify } = require('../utils/slugify');

const CATEGORIES = ['hajj', 'umrah', 'flights', 'domestic', 'international', 'visa'];
const TRIP_TYPES = ['religious', 'tourism'];

const tripSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    category: { type: String, enum: CATEGORIES, required: true },
    tripType: {
      type: String,
      enum: TRIP_TYPES,
      required: true,
      default() {
        return ['hajj', 'umrah'].includes(this.category) ? 'religious' : 'tourism';
      },
    },
    price: { type: Number, required: true },
    currency: { type: String, default: 'EGP' },
    duration: { type: String },
    hotelInfo: { type: String },
    includes: { type: [String], default: [] },
    images: { type: [String], default: [] },
    location: {
      lat: { type: Number, min: -90, max: 90 },
      lng: { type: Number, min: -180, max: 180 },
      address: { type: String, trim: true },
    },
    description: { type: String },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Auto-generate a unique, Arabic-safe slug from the title when one isn't
// provided (or when the title changes and no explicit slug was set).
tripSchema.pre('validate', async function preValidate(next) {
  if (this.slug && this.slug.trim()) {
    this.slug = this.slug.trim().toLowerCase();
    return next();
  }

  const base = slugify(this.title);
  let candidate = base;
  let counter = 1;

  const Trip = this.constructor;
  // Ensure uniqueness by appending a counter suffix if needed.
  // eslint-disable-next-line no-await-in-loop
  while (await Trip.exists({ slug: candidate, _id: { $ne: this._id } })) {
    candidate = `${base}-${counter}`;
    counter += 1;
  }

  this.slug = candidate;
  return next();
});

tripSchema.statics.CATEGORIES = CATEGORIES;

module.exports = mongoose.model('Trip', tripSchema);
