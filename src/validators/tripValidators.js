const { z } = require('zod');

const CATEGORIES = ['hajj', 'umrah', 'flights', 'domestic', 'international', 'visa'];

const locationSchema = z
  .object({
    lat: z.number().optional(),
    lng: z.number().optional(),
    address: z.string().optional(),
  })
  .optional();

const createTripSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().optional(),
  category: z.enum(CATEGORIES, { errorMap: () => ({ message: `category must be one of ${CATEGORIES.join(', ')}` }) }),
  price: z.number({ invalid_type_error: 'price must be a number' }),
  currency: z.string().optional(),
  duration: z.string().optional(),
  hotelInfo: z.string().optional(),
  includes: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  location: locationSchema,
  description: z.string().optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

const updateTripSchema = createTripSchema.partial();

module.exports = { createTripSchema, updateTripSchema, CATEGORIES };
