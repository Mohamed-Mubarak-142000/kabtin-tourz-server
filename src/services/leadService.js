const Lead = require('../models/Lead');

function notFoundError(message = 'Lead not found') {
  const err = new Error(message);
  err.status = 404;
  return err;
}

async function listLeads() {
  return Lead.find().sort({ createdAt: -1 });
}

async function createLead(payload) {
  return Lead.create(payload);
}

async function updateLeadStatus(id, status) {
  const lead = await Lead.findById(id);
  if (!lead) throw notFoundError();
  lead.status = status;
  await lead.save();
  return lead;
}

async function deleteLead(id) {
  const lead = await Lead.findByIdAndDelete(id);
  if (!lead) throw notFoundError();
  return lead;
}

module.exports = { listLeads, createLead, updateLeadStatus, deleteLead };
