const { z } = require('zod');

const CATEGORIES = ['hajj', 'umrah', 'flights', 'domestic', 'international', 'visa'];

const createLeadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  whatsapp: z.string().min(1, 'WhatsApp number is required'),
  serviceCategory: z.enum(CATEGORIES).optional(),
  branch: z.string().optional(),
  guests: z.number().optional(),
  roomType: z.string().optional(),
  message: z.string().optional(),
});

const updateLeadSchema = z.object({
  status: z.enum(['new', 'contacted', 'closed']),
});

module.exports = { createLeadSchema, updateLeadSchema };
