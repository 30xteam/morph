'use client';

import { cx } from '@/core/cx';

import { LIGHT_HINTS, LIGHT_LABELS } from '../config/labels';
import { type LightFilter, latestOutcome, useSegmentationStore } from '../store/segmentation-store';
import type { TrafficLight } from '../types/segmentation.types';

const LIGHTS: TrafficLight[] = ['green', 'yellow', 'red'];

const DOT: Record<TrafficLight, string> = {
  green: 'bg-success',
  yellow: 'bg-warning',
  red: 'bg-danger',
};

function FilterButton({
  value,
  active,
  onSelect,
  children,
}: {
  value: LightFilter;
  active: boolean;
  onSelect: (value: LightFilter) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => onSelect(value)}
      className={cx(
        'inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-body-sm transition-colors duration-150 desktop:min-h-9.5',
        active
          ? 'bg-surface text-label-sm text-fg-strong shadow-dropdown'
          : 'text-fg-muted hover:bg-state-hover hover:text-fg',
      )}
    >
      {children}
    </button>
  );
}

export function OutcomeSummary() {
  const profiles = useSegmentationStore((state) => state.profiles);
  const history = useSegmentationStore((state) => state.history);
  const filter = useSegmentationStore((state) => state.filter);
  const setFilter = useSegmentationStore((state) => state.setFilter);

  const counts = { green: 0, yellow: 0, red: 0, pending: 0 };
  for (const profile of profiles) {
    counts[latestOutcome(history[profile.id])?.light ?? 'pending'] += 1;
  }

  return (
    <section
      id="overview"
      aria-labelledby="summary-heading"
      className="flex scroll-mt-32 flex-col gap-3"
    >
      <div className="flex flex-col gap-1">
        <h2 id="summary-heading" className="text-title-md text-fg-strong">
          {counts.green} {counts.green === 1 ? 'person' : 'people'} to talk to today
        </h2>
        <p className="text-body-sm text-fg-muted">Pick a group to see only those people.</p>
      </div>

      <fieldset className="m-0 flex min-w-0 flex-wrap gap-1 rounded-md border-0 bg-surface-subtle p-1">
        <legend className="sr-only">Show people by what to do</legend>
        <FilterButton value="all" active={filter === 'all'} onSelect={setFilter}>
          Everyone <span className="text-fg-muted tabular-nums">{profiles.length}</span>
        </FilterButton>
        {LIGHTS.map((light) => (
          <FilterButton key={light} value={light} active={filter === light} onSelect={setFilter}>
            <span aria-hidden="true" className={cx('size-2 rounded-full', DOT[light])} />
            {LIGHT_LABELS[light]}
            <span className="text-fg-muted tabular-nums">{counts[light]}</span>
          </FilterButton>
        ))}
        {counts.pending ? (
          <FilterButton value="pending" active={filter === 'pending'} onSelect={setFilter}>
            Not sorted yet <span className="text-fg-muted tabular-nums">{counts.pending}</span>
          </FilterButton>
        ) : null}
      </fieldset>

      {filter === 'all' || filter === 'pending' ? null : (
        <p className="max-w-prose text-body-sm text-fg-soft">{LIGHT_HINTS[filter]}</p>
      )}
    </section>
  );
}
