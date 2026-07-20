const express = require('express');
const testimonialController = require('../controllers/testimonialController');
const { requireAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  createTestimonialSchema,
  updateTestimonialSchema,
  bookingFeedbackSchema,
} = require('../validators/testimonialValidators');

const router = express.Router();

router.get('/', testimonialController.getTestimonials);
router.post('/feedback', validate(bookingFeedbackSchema), testimonialController.createBookingFeedback);
router.post('/', requireAuth, validate(createTestimonialSchema), testimonialController.createTestimonial);
router.put('/:id', requireAuth, validate(updateTestimonialSchema), testimonialController.updateTestimonial);
router.delete('/:id', requireAuth, testimonialController.deleteTestimonial);

module.exports = router;
