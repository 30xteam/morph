import type { SegmentationOutcome, TrafficLight } from '../types/segmentation.types';

export type ProfileStatus = TrafficLight | 'review' | 'pending';

export function profileStatus(outcome: SegmentationOutcome | undefined, flagged = false) {
  if (!outcome) return 'pending' satisfies ProfileStatus;
  if (flagged || outcome.needsReview) return 'review' satisfies ProfileStatus;
  return outcome.light;
}

export function needsPerson(outcome: SegmentationOutcome | undefined, flagged = false) {
  return Boolean(outcome && (flagged || outcome.needsReview));
}
