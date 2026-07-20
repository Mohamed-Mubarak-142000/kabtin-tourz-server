const asyncHandler = require('../middlewares/asyncHandler');
const { success } = require('../utils/apiResponse');
const branchService = require('../services/branchService');

const getBranches = asyncHandler(async (req, res) => {
  const branches = await branchService.listBranches(req.query);
  return success(res, branches);
});

const createBranch = asyncHandler(async (req, res) => {
  const branch = await branchService.createBranch(req.body);
  return success(res, branch, 201);
});

const updateBranch = asyncHandler(async (req, res) => {
  const branch = await branchService.updateBranch(req.params.id, req.body);
  return success(res, branch);
});

const deleteBranch = asyncHandler(async (req, res) => {
  await branchService.deleteBranch(req.params.id);
  return success(res, { deleted: true });
});

module.exports = { getBranches, createBranch, updateBranch, deleteBranch };
