import { z } from 'zod';

/**
 * Simplified shape of a Luma "guest registered" webhook. Name and email are accepted but never
 * forwarded to Jev.
 */
export const lumaRegistrationSchema = z.object({
  event: z.object({ name: z.string().min(1) }),
  guest: z.object({
    api_id: z.string().min(1),
    name: z.string().optional(),
    email: z.string().optional(),
    registration_answers: z.array(z.object({ label: z.string(), answer: z.string() })),
  }),
});

export type LumaRegistration = z.infer<typeof lumaRegistrationSchema>;
