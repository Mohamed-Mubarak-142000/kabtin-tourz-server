const { z } = require('zod');

const createFaqSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  order: z.number().optional(),
});

const updateFaqSchema = createFaqSchema.partial();

const reorderFaqSchema = z.array(
  z.object({
    id: z.string().min(1),
    order: z.number(),
  })
);

module.exports = { createFaqSchema, updateFaqSchema, reorderFaqSchema };
