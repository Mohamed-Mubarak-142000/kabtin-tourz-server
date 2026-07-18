const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { loginSchema } = require('../validators/authValidators');
const { loginLimiter } = require('../middlewares/rateLimiters');

const router = express.Router();

router.post('/login', loginLimiter, validate(loginSchema), authController.login);

module.exports = router;
