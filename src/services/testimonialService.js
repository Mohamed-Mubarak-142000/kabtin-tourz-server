const Testimonial = require('../models/Testimonial');
const { paginate } = require('../utils/pagination');

function notFoundError(message = 'Testimonial not found') {
  const err = new Error(message);
  err.status = 404;
  return err;
}

async function listTestimonials(query = {}) {
  return paginate(Testimonial, {}, { createdAt: -1 }, query);
}

async function createTestimonial(payload) {
  return Testimonial.create(payload);
}

async function updateTestimonial(id, payload) {
  const testimonial = await Testimonial.findById(id);
  if (!testimonial) throw notFoundError();
  Object.assign(testimonial, payload);
  await testimonial.save();
  return testimonial;
}

async function deleteTestimonial(id) {
  const testimonial = await Testimonial.findByIdAndDelete(id);
  if (!testimonial) throw notFoundError();
  return testimonial;
}

module.exports = { listTestimonials, createTestimonial, updateTestimonial, deleteTestimonial };
