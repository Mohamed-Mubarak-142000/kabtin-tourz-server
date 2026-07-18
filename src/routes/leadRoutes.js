const express = require('express');
const leadController = require('../controllers/leadController');
const { requireAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createLeadSchema, updateLeadSchema } = require('../validators/leadValidators');
const { leadsLimiter } = require('../middlewares/rateLimiters');

const router = express.Router();

router.post('/', leadsLimiter, validate(createLeadSchema), leadController.createLead);
router.get('/', requireAuth, leadController.getLeads);
router.patch('/:id', requireAuth, validate(updateLeadSchema), leadController.updateLead);
router.delete('/:id', requireAuth, leadController.deleteLead);

module.exports = router;
