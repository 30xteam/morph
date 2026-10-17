'use client';

import { cx } from '@/core/cx';

import { latestOutcome, useSegmentationStore } from '../store/segmentation-store';
import type { TrafficLight } from '../types/segmentation.types';

const CHART_HEIGHT = 120;

const COLUMNS: { key: TrafficLight | 'pending'; label: string; bar: string }[] = [
  { key: 'green', label: 'Green', bar: 'bg-success' },
  { key: 'yellow', label: 'Yellow', bar: 'bg-warning' },
  { key: 'red', label: 'Red', bar: 'bg-danger' },
  { key: 'pending', label: 'Not decided', bar: 'bg-fg-subtle' },
];

export function TrafficLightChart() {
  const profiles = useSegmentationStore((state) => state.profiles);
  const history = useSegmentationStore((state) => state.history);

  const counts = { green: 0, yellow: 0, red: 0, pending: 0 };
  for (const profile of profiles) {
    counts[latestOutcome(history[profile.id])?.light ?? 'pending'] += 1;
  }
  const decided = profiles.length - counts.pending;
  const max = Math.max(...Object.values(counts), 1);

  return (
    <section
      id="overview"
      aria-labelledby="light-heading"
      className="flex scroll-mt-32 flex-col gap-4"
    >
      <div className="flex flex-col gap-1">
        <h2 id="light-heading" className="text-title-md text-fg-strong">
          Today’s traffic light
        </h2>
        <p className="text-body-md text-fg-muted">
          <span className="text-label-md text-fg-strong">{decided} sign-ups decided</span>,{' '}
          {counts.green} ready for a seller today.
        </p>
      </div>

      <ol
        aria-label="Sign-ups per traffic light"
        className="grid grid-cols-4 items-end gap-2 rounded-md bg-surface-subtle p-4 tablet:gap-4"
      >
        {COLUMNS.map(({ key, label, bar }) => {
          const value = counts[key];
          const height = Math.max((value / max) * CHART_HEIGHT, 2);
          return (
            <li key={key} className="flex flex-col items-center gap-2">
              <span className="text-caption text-fg-muted tabular-nums">{value}</span>
              <span
                aria-hidden="true"
                className={cx('w-full max-w-10 rounded-sm', bar)}
                style={{ height }}
              />
              <span className="text-caption text-fg-muted">
                <span className="sr-only">{`${value} sign-ups `}</span>
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
