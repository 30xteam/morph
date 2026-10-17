'use client';

import { show } from '@ebay/nice-modal-react';

import { Button } from '@/ui';

import { SEGMENT_LABELS } from '../config/labels';
import { latestOutcome, useSegmentationStore } from '../store/segmentation-store';
import { ActionBadge } from './action-badge';
import { ProfileDialog } from './profile/profile-dialog';

export function ReviewQueue() {
  const profiles = useSegmentationStore((state) => state.profiles);
  const history = useSegmentationStore((state) => state.history);
  const reviews = useSegmentationStore((state) => state.reviews);
  const review = useSegmentationStore((state) => state.review);
  const clearReview = useSegmentationStore((state) => state.clearReview);

  const queue = profiles.flatMap((profile) => {
    const outcome = latestOutcome(history[profile.id]);
    return outcome?.needsReview ? [{ profile, outcome }] : [];
  });
  const open = queue.filter(({ profile }) => !reviews[profile.id]).length;

  return (
    <section
      id="review"
      aria-labelledby="review-heading"
      className="flex scroll-mt-32 flex-col gap-3"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="review-heading" className="text-title-md text-fg-strong">
            Needs your check
          </h2>
          <span aria-live="polite" className="text-caption text-fg-muted tabular-nums">
            {open === 0 ? 'All checked' : `${open} to check`}
          </span>
        </div>
        <p className="text-body-sm text-fg-muted">
          Jev wasn’t sure enough about these people. Confirm the group or change it.
        </p>
      </div>
      {queue.length === 0 ? (
        <p className="text-body-sm text-fg-muted">Nothing to check yet.</p>
      ) : (
        <ul className="flex flex-col">
          {queue.map(({ profile, outcome }) => {
            const verdict = reviews[profile.id];
            return (
              <li
                key={profile.id}
                className="flex flex-col gap-2 border-b border-border py-3 last:border-b-0"
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-body-sm text-fg-strong">
                    {profile.role} at {profile.company}
                  </span>
                  <span className="text-caption text-fg-muted">
                    Jev thinks: {SEGMENT_LABELS[outcome.segment.value]} · {outcome.reasons[0] ?? ''}
                  </span>
                  <ActionBadge action={outcome.action} probability={outcome.segment.probability} />
                </div>
                {verdict ? (
                  <div className="flex flex-wrap items-center gap-2 text-caption text-fg-soft">
                    <span>
                      {verdict.verdict === 'approved'
                        ? 'Confirmed'
                        : `Changed to ${SEGMENT_LABELS[verdict.segment]}`}
                    </span>
                    <Button variant="ghost" onClick={() => clearReview(profile.id)}>
                      Undo
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => review(profile.id, { verdict: 'approved' })}
                    >
                      Looks right
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => show(ProfileDialog, { profileId: profile.id })}
                    >
                      Open and change
                    </Button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
