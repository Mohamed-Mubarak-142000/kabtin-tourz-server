const { z } = require('zod');

const createBranchSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().optional(),
  phone: z.string().optional(),
  location: z.object({
    lat: z.number({ invalid_type_error: 'lat must be a number' }),
    lng: z.number({ invalid_type_error: 'lng must be a number' }),
  }),
  googleRating: z.number().optional(),
  mapLink: z.string().optional(),
});

const updateBranchSchema = createBranchSchema.partial();

module.exports = { createBranchSchema, updateBranchSchema };
