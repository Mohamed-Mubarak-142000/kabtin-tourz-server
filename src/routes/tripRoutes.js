const express = require('express');
const tripController = require('../controllers/tripController');
const { requireAuth, optionalAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createTripSchema, updateTripSchema } = require('../validators/tripValidators');

const router = express.Router();

router.get('/', optionalAuth, tripController.getTrips);
router.get('/:slug', optionalAuth, tripController.getTripBySlug);
router.post('/', requireAuth, validate(createTripSchema), tripController.createTrip);
router.put('/:id', requireAuth, validate(updateTripSchema), tripController.updateTrip);
router.delete('/:id', requireAuth, tripController.deleteTrip);

module.exports = router;
