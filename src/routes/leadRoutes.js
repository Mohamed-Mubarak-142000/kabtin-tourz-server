const express = require('express');
const leadController = require('../controllers/leadController');
const { requireAuth, optionalAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createLeadSchema, updateLeadSchema } = require('../validators/leadValidators');
const { leadsLimiter } = require('../middlewares/rateLimiters');
const multer = require('multer');
const uploadController = require('../controllers/uploadController');

const proofUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter(req, file, cb) {
    if (!file.mimetype?.startsWith('image/')) return cb(Object.assign(new Error('Only image files are allowed'), { status: 400 }));
    return cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});

const router = express.Router();

router.post('/', leadsLimiter, optionalAuth, validate(createLeadSchema), leadController.createLead);
router.post('/payment-proof', leadsLimiter, proofUpload.array('images', 1), uploadController.uploadImages);
router.get('/', requireAuth, leadController.getLeads);
router.patch('/:id', requireAuth, validate(updateLeadSchema), leadController.updateLead);
router.delete('/:id', requireAuth, leadController.deleteLead);

module.exports = router;
