const { z } = require('zod');

const CATEGORIES = ['hajj', 'umrah', 'flights', 'domestic', 'international', 'visa'];

const createLeadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  whatsapp: z.string().min(1, 'WhatsApp number is required'),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  nationality: z.string().min(2),
  identityNumber: z.string().min(5),
  tripId: z.string().min(1),
  branch: z.string().optional(),
  guests: z.number().int().min(1),
  roomType: z.string().min(1),
  paymentMethod: z.enum(['cash', 'bank_transfer', 'instapay', 'vodafone_cash']),
  paymentProof: z.string().url().optional(),
  message: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.paymentMethod !== 'cash' && !data.paymentProof) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['paymentProof'], message: 'Payment proof is required for transfers' });
  }
});

const updateLeadSchema = z.object({
  status: z.enum(['new', 'contacted', 'confirmed', 'payment_pending', 'paid', 'cancelled', 'closed']),
});

module.exports = { createLeadSchema, updateLeadSchema };
