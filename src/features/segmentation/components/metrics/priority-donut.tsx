'use client';

/* oxlint-disable jsx-a11y/prefer-tag-over-role -- SVG charts need an explicit img role for accessible summaries. */

import { useState } from 'react';

import { cx } from '@/core/cx';

import type { SegmentationMetrics } from '../../services/segmentation-metrics';

const SERIES = [
  { key: 'high', label: 'P1 · High', stroke: 'stroke-success', dot: 'bg-success' },
  { key: 'medium', label: 'P2 · Medium', stroke: 'stroke-warning', dot: 'bg-warning' },
  { key: 'low', label: 'P3 · Low', stroke: 'stroke-danger', dot: 'bg-danger' },
  { key: 'pending', label: 'Not evaluated', stroke: 'stroke-fg-muted', dot: 'bg-fg-muted' },
] as const;

export function PriorityDonut({ metrics }: { metrics: SegmentationMetrics }) {
  const [selected, setSelected] = useState<string>();
  const rows = SERIES.map((item, index) => {
    const count = metrics.priorities[item.key];
    const percent = metrics.total ? (count / metrics.total) * 100 : 0;
    const offset = metrics.total
      ? (SERIES.slice(0, index).reduce(
          (sum, previous) => sum + metrics.priorities[previous.key],
          0,
        ) /
          metrics.total) *
        100
      : 0;
    return Object.assign({}, item, { count, percent, offset });
  });
  const active = rows.find((row) => row.key === selected);

  return (
    <section
      aria-label="Commercial priorities"
      className="flex min-w-0 flex-col gap-4 rounded-md border border-border p-5"
    >
      <div>
        <h3 className="text-title-md text-fg-strong">Commercial priorities</h3>
        <p className="text-caption text-fg-muted">
          Latest decision per person · all {metrics.total} scoped profiles.
        </p>
      </div>
      <div className="relative mx-auto w-full max-w-64">
        <svg
          viewBox="0 0 240 240"
          role="img"
          aria-label="Priority distribution donut"
          className="w-full"
        >
          <title>{rows.map((row) => `${row.label}: ${row.count}`).join('; ')}</title>
          <circle
            cx={120}
            cy={120}
            r={88}
            fill="none"
            strokeWidth={30}
            className="stroke-surface-muted"
          />
          {rows
            .filter((row) => row.count > 0)
            .map((row) => (
              <circle
                key={row.key}
                data-priority-segment={row.key}
                cx={120}
                cy={120}
                r={88}
                fill="none"
                pathLength={100}
                strokeWidth={30}
                strokeDasharray={`${row.percent} ${100 - row.percent}`}
                strokeDashoffset={-row.offset}
                transform="rotate(-90 120 120)"
                className={cx(
                  row.stroke,
                  active && active.key !== row.key ? 'opacity-25' : 'opacity-100',
                )}
              >
                <title>{`${row.label}: ${row.count} (${row.percent.toFixed(1)}%)`}</title>
              </circle>
            ))}
          <text x={120} y={117} textAnchor="middle" className="fill-fg-strong text-headline-sm">
            {metrics.total ? (active?.count ?? metrics.total) : '—'}
          </text>
          <text x={120} y={144} textAnchor="middle" className="fill-fg-muted text-body-sm">
            {active?.label ?? 'loaded profiles'}
          </text>
        </svg>
      </div>
      <ul className="grid grid-cols-2 gap-2">
        {rows.map((row) => (
          <li key={row.key} data-breakdown={row.key}>
            <button
              type="button"
              aria-pressed={active?.key === row.key}
              onClick={() => setSelected(selected === row.key ? undefined : row.key)}
              className="flex min-h-11 w-full flex-col gap-1 rounded-sm px-2 py-2 text-left hover:bg-state-hover focus-visible:outline-2 focus-visible:outline-primary"
            >
              <span className="flex items-center gap-2 text-body-sm text-fg">
                <span aria-hidden="true" className={cx('size-2 rounded-full', row.dot)} />
                {row.label}
              </span>
              <span className="text-caption text-fg-muted tabular-nums">
                {row.count} · {metrics.total ? `${row.percent.toFixed(1)}%` : '—'}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="text-caption text-fg-muted">
        Select a legend item to highlight it. Unevaluated profiles stay separate from low priority.
      </p>
    </section>
  );
}
