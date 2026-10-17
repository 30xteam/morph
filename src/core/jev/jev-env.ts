import 'server-only';
import { z } from 'zod';

const jevEnvSchema = z.object({
  JEV_PROVIDER: z.enum(['mock', 'typesafe', 'openrouter']).default('mock'),
  TYPESAFE_API_KEY: z.string().optional(),
  TYPESAFE_BASE_URL: z.url().default('https://api.typesafe.ai'),
  TYPESAFE_MODEL: z.string().default('jev-latest'),
  OPENROUTER_API_KEY: z.string().optional(),
  OPENROUTER_MODEL: z.string().default('typesafe/jev-router'),
});

export const jevEnv = jevEnvSchema.parse({
  JEV_PROVIDER: process.env.JEV_PROVIDER || undefined,
  TYPESAFE_API_KEY: process.env.TYPESAFE_API_KEY || undefined,
  TYPESAFE_BASE_URL: process.env.TYPESAFE_BASE_URL || undefined,
  TYPESAFE_MODEL: process.env.TYPESAFE_MODEL || undefined,
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || undefined,
  OPENROUTER_MODEL: process.env.OPENROUTER_MODEL || undefined,
});
