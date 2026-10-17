import { z } from 'zod';

import { profileSchema } from './profile.schema';

export const previousOutcomeSchema = z.looseObject({
  profileId: z.string(),
  segment: z.looseObject({ value: z.string(), probability: z.number() }),
  program: z.looseObject({ value: z.string(), probability: z.number() }),
  affinity: z.looseObject({ value: z.string(), probability: z.number() }),
  light: z.enum(['green', 'yellow', 'red']),
  action: z.enum(['auto', 'review', 'escalate']),
});

export const recalculateRequestSchema = z
  .object({
    profile: profileSchema,
    previous: previousOutcomeSchema,
  })
  .refine(({ profile, previous }) => profile.id === previous.profileId, {
    message: 'Previous outcome belongs to another profile',
    path: ['previous', 'profileId'],
  });

export type RecalculateRequest = z.infer<typeof recalculateRequestSchema>;
