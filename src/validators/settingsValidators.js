const { z } = require('zod');

const settingsSchema = z.object({
  hero: z
    .object({
      title: z.string().optional(),
      subtitle: z.string().optional(),
      images: z.array(z.string()).optional(),
    })
    .optional(),
  phones: z.array(z.string()).optional(),
  whatsappNumbers: z.array(z.string()).optional(),
  socialLinks: z
    .object({
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      youtube: z.string().optional(),
      tiktok: z.string().optional(),
    })
    .optional(),
  stats: z
    .object({
      years: z.number().optional(),
      clients: z.number().optional(),
      branchesCount: z.number().optional(),
      googleRating: z.number().optional(),
    })
    .optional(),
  about: z.string().optional(),
});

module.exports = { settingsSchema };
