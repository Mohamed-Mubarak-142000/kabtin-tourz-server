const { z } = require('zod');

const createTestimonialSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  text: z.string().min(1, 'Text is required'),
  rating: z.number().min(1).max(5).optional(),
  source: z.enum(['facebook', 'google', 'other']).optional(),
  avatar: z.string().optional(),
});

const updateTestimonialSchema = createTestimonialSchema.partial();

module.exports = { createTestimonialSchema, updateTestimonialSchema };
