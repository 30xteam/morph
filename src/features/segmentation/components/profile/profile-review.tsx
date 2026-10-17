'use client';

import { Button } from '@/ui';

import { SEGMENT_LABELS } from '../../config/labels';
import { useSegmentationStore } from '../../store/segmentation-store';
import type { SegmentationOutcome, SegmentKey } from '../../types/segmentation.types';

const SEGMENT_KEYS = Object.keys(SEGMENT_LABELS) as SegmentKey[];

export function ProfileReview({ outcome }: { outcome: SegmentationOutcome }) {
  const review = useSegmentationStore((state) => state.review);
  const clearReview = useSegmentationStore((state) => state.clearReview);
  const verdict = useSegmentationStore((state) => state.reviews[outcome.profileId]);

  if (!outcome.needsReview) return null;

  if (verdict) {
    return (
      <div className="flex flex-wrap items-center gap-3 text-body-sm text-fg-soft">
        <p aria-live="polite">
          {verdict.verdict === 'approved'
            ? `You confirmed ${SEGMENT_LABELS[outcome.segment.value]}.`
            : `You changed the group to ${SEGMENT_LABELS[verdict.segment]}.`}
        </p>
        <Button variant="ghost" onClick={() => clearReview(outcome.profileId)}>
          Undo
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-label-md text-fg-strong">
        Is “{SEGMENT_LABELS[outcome.segment.value]}” right?
      </h3>
      <div className="flex flex-wrap items-end gap-3">
        <Button
          variant="secondary"
          onClick={() => review(outcome.profileId, { verdict: 'approved' })}
        >
          Yes, looks right
        </Button>
        <label className="flex flex-col gap-1 text-caption text-fg-muted">
          No, change it to
          <select
            defaultValue=""
            onChange={(event) =>
              review(outcome.profileId, {
                verdict: 'corrected',
                segment: event.target.value as SegmentKey,
              })
            }
            className="h-11 w-full max-w-xs rounded-input border border-border-input bg-surface px-2 text-body-sm text-fg desktop:h-9.5"
          >
            <option value="" disabled>
              Choose a group…
            </option>
            {SEGMENT_KEYS.filter((key) => key !== outcome.segment.value).map((key) => (
              <option key={key} value={key}>
                {SEGMENT_LABELS[key]}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
