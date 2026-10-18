import 'server-only';
import type { Profile, RecalculateResult, SegmentationOutcome } from '@/libs/segmentation';
import { segmentProfile } from '@/libs/segmentation/server';

import type { RecalculateRequest } from '../types/recalculate-request.schema';

export async function recalculateProfile(
  profile: Profile,
  previous: RecalculateRequest['previous'],
): Promise<RecalculateResult> {
  const current = await segmentProfile(profile, 'manual_edit');
  return {
    previous: previous as unknown as SegmentationOutcome,
    current,
    changed: {
      segment: previous.segment.value !== current.segment.value,
      program: previous.program.value !== current.program.value,
      affinity: previous.affinity.value !== current.affinity.value,
      light: previous.light !== current.light,
      action: previous.action !== current.action,
    },
  };
}
