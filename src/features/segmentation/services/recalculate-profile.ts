import 'server-only';
import type { RecalculateRequest } from '../types/recalculate-request.schema';
import type { Profile, RecalculateResult, SegmentationOutcome } from '../types/segmentation.types';
import { segmentProfile } from './segment-profile';

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
      light: previous.light !== current.light,
      action: previous.action !== current.action,
    },
  };
}
