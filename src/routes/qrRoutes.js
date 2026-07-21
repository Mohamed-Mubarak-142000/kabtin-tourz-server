const express = require('express');
const qrController = require('../controllers/qrController');
const { requireAuth } = require('../middlewares/auth');

const router = express.Router();

router.get('/', requireAuth, qrController.getSiteQrCode);

module.exports = router;
