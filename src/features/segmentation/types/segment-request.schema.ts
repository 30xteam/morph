import { z } from 'zod';

import { profileSchema } from '@/libs/segmentation';

export const TRIGGERS = [
  'sign_up',
  'manual_edit',
  'attended_event',
  'role_change',
  'funding_round',
  're_run',
] as const;

export const segmentRequestSchema = z.object({
  profile: profileSchema,
  trigger: z.enum(TRIGGERS).default('re_run'),
});

export type SegmentRequest = z.infer<typeof segmentRequestSchema>;
