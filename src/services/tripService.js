const Trip = require('../models/Trip');

function notFoundError(message = 'Trip not found') {
  const err = new Error(message);
  err.status = 404;
  return err;
}

// Lists trips. If the caller is not authenticated (admin === null/undefined),
// published:true is forced regardless of any ?published= query param.
// If authenticated, all trips are returned unless ?published=true|false is
// explicitly passed.
async function listTrips({ category, published }, admin) {
  const filter = {};
  if (category) filter.category = category;

  if (!admin) {
    filter.published = true;
  } else if (published === 'true') {
    filter.published = true;
  } else if (published === 'false') {
    filter.published = false;
  }

  return Trip.find(filter).sort({ createdAt: -1 });
}

// Fetches a single trip by slug. When unauthenticated, only published
// trips are visible; anything else (missing or unpublished) is a 404.
async function getTripBySlug(slug, admin) {
  const trip = await Trip.findOne({ slug });
  if (!trip) throw notFoundError();
  if (!admin && !trip.published) throw notFoundError();
  return trip;
}

async function createTrip(payload) {
  return Trip.create(payload);
}

async function updateTrip(id, payload) {
  const trip = await Trip.findById(id);
  if (!trip) throw notFoundError();
  Object.assign(trip, payload);
  await trip.save();
  return trip;
}

async function deleteTrip(id) {
  const trip = await Trip.findByIdAndDelete(id);
  if (!trip) throw notFoundError();
  return trip;
}

module.exports = { listTrips, getTripBySlug, createTrip, updateTrip, deleteTrip };
