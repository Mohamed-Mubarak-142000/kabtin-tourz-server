const asyncHandler = require('../middlewares/asyncHandler');
const { success, fail } = require('../utils/apiResponse');
const uploadService = require('../services/uploadService');

const uploadImages = asyncHandler(async (req, res) => {
  const files = req.files;
  if (!files || files.length === 0) {
    return fail(res, 'No image files were provided (field name: images)', 400);
  }

  const urls = await uploadService.uploadImages(files);
  return success(res, { urls }, 201);
});

module.exports = { uploadImages };
