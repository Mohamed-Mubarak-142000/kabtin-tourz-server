const express = require('express');
const settingsController = require('../controllers/settingsController');
const { requireAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { settingsSchema } = require('../validators/settingsValidators');

const router = express.Router();

router.get('/', settingsController.getSettings);
router.put('/', requireAuth, validate(settingsSchema), settingsController.updateSettings);

module.exports = router;
