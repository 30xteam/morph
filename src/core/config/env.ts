import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url().optional(),
});

/** Validated at import time so a misconfigured deploy fails fast instead of at the first request. */
export const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});
