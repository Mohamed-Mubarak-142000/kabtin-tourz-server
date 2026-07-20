const Lead = require('../models/Lead');
const Trip = require('../models/Trip');
const { paginate } = require('../utils/pagination');

function notFoundError(message = 'Lead not found') {
  const err = new Error(message);
  err.status = 404;
  return err;
}

async function listLeads(query = {}) {
  return paginate(Lead, {}, { createdAt: -1 }, query);
}

async function getLeadById(id) {
  const lead = await Lead.findById(id).catch(() => null);
  if (!lead) throw notFoundError();
  return lead;
}

async function createLead(payload, admin) {
  const trip = await Trip.findOne({ _id: payload.tripId, ...(admin ? {} : { published: true }) });
  if (!trip) throw notFoundError('Trip not found or unavailable');
  const guests = payload.guests;
  return Lead.create({
    ...payload,
    tripId: undefined,
    trip: trip._id,
    tripTitle: trip.title,
    serviceCategory: trip.category,
    unitPrice: trip.price,
    totalPrice: trip.price * guests,
    currency: trip.currency,
  });
}

async function updateLeadStatus(id, status) {
  const lead = await Lead.findById(id);
  if (!lead) throw notFoundError();
  const transitions = {
    new: ['contacted', 'cancelled'],
    contacted: ['confirmed', 'cancelled'],
    confirmed: ['payment_pending', 'cancelled'],
    payment_pending: ['paid', 'cancelled'],
    paid: [],
    cancelled: [],
    closed: [],
  };
  if (!transitions[lead.status].includes(status)) {
    const err = new Error(`Invalid status transition from ${lead.status} to ${status}`);
    err.status = 400;
    throw err;
  }
  lead.status = status;
  await lead.save();
  return lead;
}

async function deleteLead(id) {
  const lead = await Lead.findByIdAndDelete(id);
  if (!lead) throw notFoundError();
  return lead;
}

module.exports = { listLeads, getLeadById, createLead, updateLeadStatus, deleteLead };
