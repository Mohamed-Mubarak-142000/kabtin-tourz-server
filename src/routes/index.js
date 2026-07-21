const express = require('express');

const authRoutes = require('./authRoutes');
const tripRoutes = require('./tripRoutes');
const branchRoutes = require('./branchRoutes');
const testimonialRoutes = require('./testimonialRoutes');
const faqRoutes = require('./faqRoutes');
const leadRoutes = require('./leadRoutes');
const settingsRoutes = require('./settingsRoutes');
const uploadRoutes = require('./uploadRoutes');
const qrRoutes = require('./qrRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/trips', tripRoutes);
router.use('/branches', branchRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/faqs', faqRoutes);
router.use('/leads', leadRoutes);
router.use('/settings', settingsRoutes);
router.use('/upload', uploadRoutes);
router.use('/qr-codes', qrRoutes);

module.exports = router;
