const Branch = require('../models/Branch');

function notFoundError(message = 'Branch not found') {
  const err = new Error(message);
  err.status = 404;
  return err;
}

async function listBranches() {
  return Branch.find().sort({ createdAt: -1 });
}

async function createBranch(payload) {
  return Branch.create(payload);
}

async function updateBranch(id, payload) {
  const branch = await Branch.findById(id);
  if (!branch) throw notFoundError();
  Object.assign(branch, payload);
  await branch.save();
  return branch;
}

async function deleteBranch(id) {
  const branch = await Branch.findByIdAndDelete(id);
  if (!branch) throw notFoundError();
  return branch;
}

module.exports = { listBranches, createBranch, updateBranch, deleteBranch };
