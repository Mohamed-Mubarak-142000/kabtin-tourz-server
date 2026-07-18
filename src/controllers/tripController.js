const asyncHandler = require('../middlewares/asyncHandler');
const { success } = require('../utils/apiResponse');
const tripService = require('../services/tripService');

const getTrips = asyncHandler(async (req, res) => {
  const { category, published } = req.query;
  const trips = await tripService.listTrips({ category, published }, req.admin);
  return success(res, trips);
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

module.exports = { getTrips, getTripBySlug, createTrip, updateTrip, deleteTrip };
