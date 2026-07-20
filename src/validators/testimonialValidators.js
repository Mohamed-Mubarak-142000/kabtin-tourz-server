const { z } = require('zod');

const createTestimonialSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  text: z.string().min(1, 'Text is required'),
  rating: z.number().min(1).max(5).optional(),
  source: z.enum(['facebook', 'google', 'other']).optional(),
  avatar: z.string().optional(),
});

const updateTestimonialSchema = createTestimonialSchema.partial();

const bookingFeedbackSchema = z.object({
  leadId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid booking request'),
  text: z.string().trim().min(3, 'Feedback is required').max(1000, 'Feedback is too long'),
  rating: z.number().int().min(1).max(5),
});

module.exports = { createTestimonialSchema, updateTestimonialSchema, bookingFeedbackSchema };
