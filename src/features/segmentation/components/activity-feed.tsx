'use client';

import { LIGHT_LABELS, SEGMENT_LABELS, TRIGGER_LABELS } from '../config/labels';
import { useSegmentationStore } from '../store/segmentation-store';
import { timeAgo } from '../utils/format';

const MAX_ITEMS = 12;

function initials(role: string) {
  return role
    .split(/\s+/)
    .filter((word) => /^[a-z]/i.test(word))
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('');
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
        <p className="text-body-sm text-fg-muted">
          Nothing yet. Sort the sign-ups or add a test sign-up to start.
        </p>
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
                  {initials(profile.role)}
                </span>
                <p className="flex min-w-0 flex-col gap-0.5 text-body-sm">
                  <span className="text-fg-soft">
                    <span className="text-label-sm text-fg-strong">{profile.role}</span>{' '}
                    {TRIGGER_LABELS[outcome.trigger]}
                    {changed ? (
                      <>
                        {' '}
                        and moved from {LIGHT_LABELS[previous.light]} to{' '}
                        <span className="text-fg-strong">{LIGHT_LABELS[outcome.light]}</span>
                      </>
                    ) : (
                      <>
                        {'. Jev suggests: '}
                        <span className="text-fg-strong">{LIGHT_LABELS[outcome.light]}</span>
                      </>
                    )}
                    {` (${SEGMENT_LABELS[outcome.segment.value]})`}
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
