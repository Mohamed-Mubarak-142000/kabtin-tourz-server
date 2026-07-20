const asyncHandler = require('../middlewares/asyncHandler');
const { success } = require('../utils/apiResponse');
const testimonialService = require('../services/testimonialService');

const getTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await testimonialService.listTestimonials(req.query);
  return success(res, testimonials);
});

const createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await testimonialService.createTestimonial(req.body);
  return success(res, testimonial, 201);
});

const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await testimonialService.updateTestimonial(req.params.id, req.body);
  return success(res, testimonial);
});

const deleteTestimonial = asyncHandler(async (req, res) => {
  await testimonialService.deleteTestimonial(req.params.id);
  return success(res, { deleted: true });
});

module.exports = { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial };
