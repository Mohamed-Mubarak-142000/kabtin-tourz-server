const asyncHandler = require('../middlewares/asyncHandler');
const { success } = require('../utils/apiResponse');
const qrService = require('../services/qrService');

const getSiteQrCode = asyncHandler(async (req, res) => {
  const qrCode = await qrService.getSiteQrCode();
  return success(res, qrCode);
});

module.exports = { getSiteQrCode };
