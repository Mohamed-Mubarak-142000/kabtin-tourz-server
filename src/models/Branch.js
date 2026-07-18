const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String },
    phone: { type: String },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    googleRating: { type: Number },
    mapLink: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Branch', branchSchema);
