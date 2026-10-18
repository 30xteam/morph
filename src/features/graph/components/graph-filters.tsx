'use client';

import { cx } from '@/core/cx';
import { PRIORITY_LEVELS, type PriorityLevel } from '@/libs/segmentation';
import { SegmentedControl } from '@/ui';

import type { GraphView } from '../hooks/use-graph-view';
import { useMessages } from '../hooks/use-messages';
import type { GraphColorBy } from '../services/create-graph-renderer';
import { GraphKey } from './graph-key';
import { GraphLegend } from './graph-legend';
import { GraphSearch } from './graph-search';

const SECTION = 'text-badge font-semibold tracking-wider text-ink-soft uppercase';

const ROW =
  'flex min-h-11 w-full items-center gap-2.5 rounded-md border px-2.5 text-left text-label-sm transition-colors duration-150 desktop:min-h-9';

const LEVEL_DOT: Record<PriorityLevel, string> = {
  high: 'size-2.5 bg-green-fg',
  medium: 'size-2 bg-yellow-fg',
  low: 'size-2 bg-red-fg',
  pending: 'size-1.5 bg-ink-muted',
};

export function GraphFilters({ view }: { view: GraphView }) {
  const m = useMessages();
  const focusRows = [
    { id: undefined, label: m.graph.focusNone, count: undefined },
    ...view.programs.map((program) => ({
      id: program.id,
      label: program.label,
      count: view.summaries.get(program.id)?.total ?? 0,
    })),
  ];
  const colorOptions = [
    { value: 'priority', label: m.graph.colorPriority },
    { value: 'program', label: m.graph.colorProgram },
    { value: 'none', label: m.graph.colorNone },
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      <GraphSearch nodes={view.graph.nodes} value={view.query} onSearch={view.search} />
      <fieldset className="flex flex-col gap-1">
        <legend className={cx(SECTION, 'pb-2')}>{m.graph.focus}</legend>
        {focusRows.map((row) => {
          const active = row.id === view.focusId;
          return (
            <button
              key={row.id ?? 'none'}
              type="button"
              aria-pressed={active}
              onClick={() => view.select(row.id)}
              className={cx(
                ROW,
                active
                  ? 'border-accent bg-green-bg text-green-fg'
                  : 'border-transparent text-ink-soft hover:bg-raised hover:text-ink',
              )}
            >
              <span className="flex-1 truncate">{row.label}</span>
              {row.count === undefined ? null : (
                <span className="font-normal text-ink-muted tabular-nums">{row.count}</span>
              )}
            </button>
          );
        })}
      </fieldset>
      <fieldset className="flex flex-col gap-1">
        <legend className={cx(SECTION, 'pb-2')}>{m.graph.priority}</legend>
        {PRIORITY_LEVELS.map((level) => (
          <label
            key={level}
            className="flex min-h-11 cursor-pointer items-center gap-2.5 px-1 text-label-sm text-ink-soft desktop:min-h-8"
          >
            <input
              type="checkbox"
              checked={view.levels.includes(level)}
              onChange={() => view.toggleLevel(level)}
              className="size-4 accent-accent"
            />
            <span aria-hidden="true" className={cx('shrink-0 rounded-full', LEVEL_DOT[level])} />
            <span className="flex-1">{m.graph.levels[level]}</span>
            <span className="font-normal text-ink-muted tabular-nums">
              {view.levelCounts[level]}
            </span>
          </label>
        ))}
      </fieldset>
      <div className="flex flex-col gap-2">
        <span className={SECTION}>{m.graph.colorBy}</span>
        <SegmentedControl<GraphColorBy>
          label={m.graph.colorBy}
          value={view.colorBy}
          options={colorOptions}
          onChange={view.setColorBy}
        />
        <GraphKey colorBy={view.colorBy} programs={view.programs} />
      </div>
      <details className="group">
        <summary className="flex min-h-11 cursor-pointer items-center text-label-sm text-ink-soft hover:text-ink desktop:min-h-8">
          {m.graph.legend}
        </summary>
        <GraphLegend />
      </details>
    </div>
  );
}
