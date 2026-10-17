import { z } from 'zod';

import { profileSchema } from './profile.schema';
import { TRIGGERS } from './segment-request.schema';

export const BATCH_LIMIT = 50;

export const segmentBatchRequestSchema = z.object({
  profiles: z.array(profileSchema).min(1).max(BATCH_LIMIT),
  trigger: z.enum(TRIGGERS).default('re_run'),
});

export type SegmentBatchRequest = z.infer<typeof segmentBatchRequestSchema>;
