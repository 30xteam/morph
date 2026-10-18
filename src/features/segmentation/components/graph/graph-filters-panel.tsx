'use client';

import { useState } from 'react';

import { cx } from '@/core/cx';

import type { GraphView } from '../../hooks/use-graph-view';
import { useMessages } from '../../hooks/use-messages';
import { GraphFilters } from './graph-filters';
import { PanelIcon } from './graph-icons';

const TOGGLE =
  'inline-flex size-9 shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors duration-150 hover:bg-raised hover:text-ink';

export function GraphFiltersPanel({ view }: { view: GraphView }) {
  const m = useMessages();
  const [open, setOpen] = useState(true);
  const toggleLabel = open ? m.graph.hideFilters : m.graph.showFilters;

  return (
    <aside
      aria-label={m.graph.filtersLabel}
      className={cx(
        'hidden shrink-0 flex-col gap-6 overflow-y-auto border-r border-line bg-card desktop:flex',
        open ? 'w-72 px-5 py-7' : 'w-14 items-center px-2 py-7',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className={cx('flex min-w-0 flex-col gap-1', !open && 'sr-only')}>
          <h1 className="text-title-md text-ink">{m.graph.title}</h1>
          <p className="text-body-sm text-ink-muted" aria-live="polite">
            {m.graph.stats(view.visibleProfiles, view.visible.edges.length)}
          </p>
        </div>
        <button
          type="button"
          aria-label={toggleLabel}
          title={toggleLabel}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className={TOGGLE}
        >
          <PanelIcon />
        </button>
      </div>
      {open ? <GraphFilters view={view} /> : null}
    </aside>
  );
}
