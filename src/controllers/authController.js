const asyncHandler = require('../middlewares/asyncHandler');
const { success } = require('../utils/apiResponse');
const authService = require('../services/authService');

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const result = await authService.login(username, password);
  return success(res, result);
});

module.exports = { login };
