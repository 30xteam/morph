import { z } from 'zod';

export const evaluateRequestSchema = z.object({
  mode: z.enum(['single', 'consensus']).default('single'),
  limit: z.number().int().min(1).max(1000).optional(),
});

export const simulateRequestSchema = z.object({
  days: z.number().int().min(1).max(90).default(30),
  seed: z.number().int().default(30),
  consensus: z.boolean().default(false),
});
