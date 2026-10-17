import { type ReviewTab, useSegmentationStore } from '../store/segmentation-store';
import type { Profile, ReviewReason, SegmentationOutcome } from '../types/segmentation.types';
import { needsPerson } from '../utils/profile-status';

export interface ReviewItem {
  profile: Profile;
  outcome: SegmentationOutcome;
  reason: ReviewReason;
}

export function useReviewItems() {
  const profiles = useSegmentationStore((state) => state.profiles);
  const history = useSegmentationStore((state) => state.history);
  const flagged = useSegmentationStore((state) => state.flagged);
  const tab = useSegmentationStore((state) => state.reviewTab);

  const all: ReviewItem[] = profiles.flatMap((profile) => {
    const outcome = history[profile.id]?.at(-1);
    if (!outcome || !needsPerson(outcome, flagged.includes(profile.id))) return [];
    return [{ profile, outcome, reason: outcome.reviewReason ?? 'low_confidence' }];
  });
  const count = (reason: ReviewReason) => all.filter((item) => item.reason === reason).length;

  return {
    items: tab === 'all' ? all : all.filter((item) => item.reason === (tab satisfies ReviewTab)),
    total: all.length,
    lowConfidence: count('low_confidence'),
    lowInfo: count('low_info'),
  };
}
