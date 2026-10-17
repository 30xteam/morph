import 'server-only';
import type { BatchItem, Profile, Trigger } from '../types/segmentation.types';
import { mapWithLimit } from '../utils/map-with-limit';
import { segmentProfile } from './segment-profile';

const CONCURRENCY = 8;

export function segmentBatch(profiles: Profile[], trigger: Trigger): Promise<BatchItem[]> {
  return mapWithLimit(profiles, CONCURRENCY, async (profile) => {
    try {
      return { outcome: await segmentProfile(profile, trigger) };
    } catch (error) {
      console.error(error);
      return {
        profileId: profile.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });
}
