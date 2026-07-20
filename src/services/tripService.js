const Trip = require('../models/Trip');
const { paginate } = require('../utils/pagination');

function notFoundError(message = 'Trip not found') {
  const err = new Error(message);
  err.status = 404;
  return err;
}

// Lists trips. If the caller is not authenticated (admin === null/undefined),
// published:true is forced regardless of any ?published= query param.
// If authenticated, all trips are returned unless ?published=true|false is
// explicitly passed.
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function listTrips({ category, tripType, published, search, page, limit }, admin) {
  const filter = {};
  if (category) filter.category = category;
  if (tripType === 'religious') {
    filter.$and = [{
      $or: [
        { tripType: 'religious' },
        { tripType: { $exists: false }, category: { $in: ['hajj', 'umrah'] } },
      ],
    }];
  } else if (tripType === 'tourism') {
    filter.$and = [{
      $or: [
        { tripType: 'tourism' },
        { tripType: { $exists: false }, category: { $nin: ['hajj', 'umrah'] } },
      ],
    }];
  }
  if (search && search.trim()) {
    const pattern = new RegExp(escapeRegex(search.trim()), 'i');
    filter.$or = [
      { title: pattern },
      { description: pattern },
      { hotelInfo: pattern },
      { 'location.address': pattern },
    ];
  }

  if (!admin) {
    filter.published = true;
  } else if (published === 'true') {
    filter.published = true;
  } else if (published === 'false') {
    filter.published = false;
  }

  return paginate(Trip, filter, { createdAt: -1 }, { page, limit });
}

async function getTripById(id) {
  const trip = await Trip.findById(id).catch(() => null);
  if (!trip) throw notFoundError();
  return trip;
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

module.exports = { listTrips, getTripById, getTripBySlug, createTrip, updateTrip, deleteTrip };
