import { type ReviewTab, useSegmentationStore } from '../store/segmentation-store';
import type { Profile, ReviewReason, SegmentationOutcome } from '../types/segmentation.types';
import { needsPerson } from '../utils/profile-status';
import { useReviewTab } from './use-review-tab';

export interface ReviewItem {
  profile: Profile;
  outcome: SegmentationOutcome;
  reason: ReviewReason;
}

export function useReviewItems() {
  const profiles = useSegmentationStore((state) => state.profiles);
  const history = useSegmentationStore((state) => state.history);
  const flagged = useSegmentationStore((state) => state.flagged);
  const [tab] = useReviewTab();
  const reviews = useSegmentationStore((state) => state.reviews);

  const all: ReviewItem[] = profiles
    .flatMap((profile) => {
      const outcome = history[profile.id]?.at(-1);
      if (!outcome || !needsPerson(outcome, flagged.includes(profile.id))) return [];
      return [{ profile, outcome, reason: outcome.reviewReason ?? 'low_confidence' }];
    })
    .toSorted((a, b) => a.outcome.program.probability - b.outcome.program.probability);
  const count = (reason: ReviewReason) => all.filter((item) => item.reason === reason).length;

  return {
    items: tab === 'all' ? all : all.filter((item) => item.reason === (tab satisfies ReviewTab)),
    total: all.length,
    labeled: all.filter((item) => reviews[item.profile.id]).length,
    lowConfidence: count('low_confidence'),
    lowInfo: count('low_info'),
  };
}
