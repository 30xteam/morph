import 'server-only';
import { mapWithLimit } from '@/core/async';
import type { BatchItem, Profile, Trigger } from '@/libs/segmentation';
import { segmentProfile } from '@/libs/segmentation/server';

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
