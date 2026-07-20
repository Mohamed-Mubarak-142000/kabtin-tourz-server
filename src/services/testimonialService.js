const Testimonial = require('../models/Testimonial');
const Lead = require('../models/Lead');
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

async function createBookingFeedback({ leadId, text, rating }) {
  const lead = await Lead.findById(leadId).select('name');
  if (!lead) throw notFoundError('Booking request not found');

  const existing = await Testimonial.findOne({ lead: lead._id });
  if (existing) {
    const err = new Error('Feedback has already been submitted for this booking');
    err.status = 409;
    throw err;
  }

  return Testimonial.create({
    name: lead.name,
    text,
    rating,
    source: 'other',
    lead: lead._id,
  });
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

module.exports = { listTestimonials, createTestimonial, createBookingFeedback, updateTestimonial, deleteTestimonial };
