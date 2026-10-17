'use client';

import { cx } from '@/core/cx';

import { LIGHT_LABELS, PROGRAM_LABELS } from '../config/labels';
import { latestOutcome, useSegmentationStore } from '../store/segmentation-store';

export function ReviewQueue() {
  const profiles = useSegmentationStore((state) => state.profiles);
  const history = useSegmentationStore((state) => state.history);
  const reviews = useSegmentationStore((state) => state.reviews);
  const review = useSegmentationStore((state) => state.review);

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
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="review-heading" className="text-title-md text-fg-strong">
          Review queue
        </h2>
        <span aria-live="polite" className="text-caption text-fg-muted tabular-nums">
          {open === 0 ? 'All reviewed' : `${open} open`}
        </span>
      </div>
      {queue.length === 0 ? (
        <p className="text-body-sm text-fg-muted">Nothing needs a person yet.</p>
      ) : (
        <ul className="flex flex-col">
          {queue.map(({ profile, outcome }) => {
            const verdict = reviews[profile.id];
            const done = verdict !== undefined;
            return (
              <li key={profile.id}>
                <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-sm px-2 py-2.5 transition-colors duration-150 hover:bg-state-hover">
                  <input
                    type="checkbox"
                    checked={done}
                    disabled={done}
                    onChange={() => review(profile.id, { verdict: 'approved' })}
                    className="mt-0.5 size-4 shrink-0 cursor-pointer accent-primary"
                  />
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span
                      className={cx(
                        'text-body-sm transition-colors duration-150',
                        done ? 'text-fg-muted line-through' : 'text-fg-strong',
                      )}
                    >
                      {profile.alias} · {profile.role} · {PROGRAM_LABELS[outcome.program.value]}
                    </span>
                    <span className="text-caption text-fg-muted">
                      {verdict?.verdict === 'corrected'
                        ? `Corrected to ${PROGRAM_LABELS[verdict.program]}`
                        : `${LIGHT_LABELS[outcome.light]} · ${outcome.reasons[0] ?? ''}`}
                    </span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
