'use client';

import { LIGHT_LABELS, SEGMENT_LABELS, TRIGGER_LABELS } from '../config/labels';
import { useSegmentationStore } from '../store/segmentation-store';
import { timeAgo } from '../utils/format';

const MAX_ITEMS = 12;

function initials(alias: string) {
  return alias
    .replace(/[^A-Z0-9]/gi, '')
    .slice(-2)
    .toUpperCase();
}

export function ActivityFeed() {
  const profiles = useSegmentationStore((state) => state.profiles);
  const history = useSegmentationStore((state) => state.history);

  const items = profiles
    .flatMap((profile) =>
      (history[profile.id] ?? []).map((outcome, index, list) => ({
        profile,
        outcome,
        previous: list[index - 1],
      })),
    )
    .toSorted((a, b) => b.outcome.meta.decidedAt.localeCompare(a.outcome.meta.decidedAt))
    .filter(({ outcome, previous }) => outcome.trigger !== 're_run' || !previous)
    .slice(0, MAX_ITEMS);

  return (
    <section
      id="activity"
      aria-labelledby="activity-heading"
      className="flex scroll-mt-32 flex-col gap-3"
    >
      <h2 id="activity-heading" className="text-title-md text-fg-strong">
        Recent activity
      </h2>
      {items.length === 0 ? (
        <p className="text-body-sm text-fg-muted">Run Jev or simulate a sign-up to start.</p>
      ) : (
        <ol className="flex flex-col gap-4">
          {items.map(({ profile, outcome, previous }) => {
            const changed =
              previous &&
              (previous.segment.value !== outcome.segment.value ||
                previous.light !== outcome.light);
            return (
              <li
                key={`${profile.id}-${outcome.meta.decidedAt}`}
                className="flex items-start gap-3"
              >
                <span
                  aria-hidden="true"
                  className="grid size-6 shrink-0 place-items-center rounded-full bg-surface-muted text-caption text-fg-soft"
                >
                  {initials(profile.alias)}
                </span>
                <p className="flex min-w-0 flex-col gap-0.5 text-body-sm">
                  <span className="text-fg-soft">
                    <span className="text-label-sm text-fg-strong">{profile.alias}</span>{' '}
                    {TRIGGER_LABELS[outcome.trigger]}
                    {changed ? (
                      <>
                        {' '}
                        and moved from {SEGMENT_LABELS[previous.segment.value]} ·{' '}
                        {LIGHT_LABELS[previous.light]} to{' '}
                      </>
                    ) : (
                      ' → '
                    )}
                    <span className="text-fg-strong">
                      {SEGMENT_LABELS[outcome.segment.value]} · {LIGHT_LABELS[outcome.light]}
                    </span>
                  </span>
                  <span className="text-caption text-fg-muted">
                    {timeAgo(outcome.meta.decidedAt)}
                  </span>
                </p>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
