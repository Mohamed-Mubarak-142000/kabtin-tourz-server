const asyncHandler = require('../middlewares/asyncHandler');
const { success } = require('../utils/apiResponse');
const tripService = require('../services/tripService');

const getTrips = asyncHandler(async (req, res) => {
  const { category, tripType, published, search, page, limit } = req.query;
  const trips = await tripService.listTrips({ category, tripType, published, search, page, limit }, req.admin);
  return success(res, trips);
});

const getTripById = asyncHandler(async (req, res) => {
  const trip = await tripService.getTripById(req.params.id);
  return success(res, trip);
});

const getTripBySlug = asyncHandler(async (req, res) => {
  const trip = await tripService.getTripBySlug(req.params.slug, req.admin);
  return success(res, trip);
});

const createTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.createTrip(req.body);
  return success(res, trip, 201);
});

const updateTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.updateTrip(req.params.id, req.body);
  return success(res, trip);
});

const deleteTrip = asyncHandler(async (req, res) => {
  await tripService.deleteTrip(req.params.id);
  return success(res, { deleted: true });
});

module.exports = { getTrips, getTripById, getTripBySlug, createTrip, updateTrip, deleteTrip };
