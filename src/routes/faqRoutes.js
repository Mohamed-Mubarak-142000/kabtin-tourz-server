const express = require('express');
const faqController = require('../controllers/faqController');
const { requireAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createFaqSchema, updateFaqSchema, reorderFaqSchema } = require('../validators/faqValidators');

const router = express.Router();

router.get('/', faqController.getFaqs);
// NOTE: /reorder must be registered before /:id routes so it isn't
// swallowed as an :id param.
router.patch('/reorder', requireAuth, validate(reorderFaqSchema), faqController.reorderFaqs);
router.post('/', requireAuth, validate(createFaqSchema), faqController.createFaq);
router.put('/:id', requireAuth, validate(updateFaqSchema), faqController.updateFaq);
router.delete('/:id', requireAuth, faqController.deleteFaq);

module.exports = router;
