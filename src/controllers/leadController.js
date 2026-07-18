const asyncHandler = require('../middlewares/asyncHandler');
const { success } = require('../utils/apiResponse');
const leadService = require('../services/leadService');

const getLeads = asyncHandler(async (req, res) => {
  const leads = await leadService.listLeads();
  return success(res, leads);
});

const createLead = asyncHandler(async (req, res) => {
  const lead = await leadService.createLead(req.body);
  return success(res, lead, 201);
});

const updateLead = asyncHandler(async (req, res) => {
  const lead = await leadService.updateLeadStatus(req.params.id, req.body.status);
  return success(res, lead);
});

const deleteLead = asyncHandler(async (req, res) => {
  await leadService.deleteLead(req.params.id);
  return success(res, { deleted: true });
});

module.exports = { getLeads, createLead, updateLead, deleteLead };
