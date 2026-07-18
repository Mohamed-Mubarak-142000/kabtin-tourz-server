const asyncHandler = require('../middlewares/asyncHandler');
const { success } = require('../utils/apiResponse');
const settingsService = require('../services/settingsService');

const getSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.getSettings();
  return success(res, settings);
});

const updateSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.updateSettings(req.body);
  return success(res, settings);
});

module.exports = { getSettings, updateSettings };
