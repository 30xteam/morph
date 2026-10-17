'use client';

import { useState } from 'react';

import { cx } from '@/core/cx';

interface MetricBreakdownProps {
  title: string;
  description: string;
  denominator: number;
  rows: { key: string; label: string; count: number; color: string }[];
}

export function MetricBreakdown({ title, description, denominator, rows }: MetricBreakdownProps) {
  const [selected, setSelected] = useState<string>();
  const ranked = rows.toSorted((a, b) => b.count - a.count);
  return (
    <section
      aria-label={title}
      className="flex min-w-0 flex-col gap-4 rounded-md border border-border p-4"
    >
      <div>
        <h3 className="text-title-md text-fg-strong">{title}</h3>
        <p className="text-caption text-fg-muted">{description}</p>
      </div>
      <div className="flex justify-between text-caption text-fg-muted" aria-hidden="true">
        {[0, 25, 50, 75, 100].map((tick) => (
          <span key={tick}>{tick}%</span>
        ))}
      </div>
      <ul className="flex flex-col gap-4" aria-label="Program share bar chart">
        {ranked.map((row) => {
          const percent = denominator ? (row.count / denominator) * 100 : null;
          return (
            <li key={row.key} data-breakdown={row.key} className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between gap-3 text-body-sm">
                <span className="text-fg">{row.label}</span>
                <span className="shrink-0 text-caption text-fg-muted tabular-nums">
                  {row.count} · {percent === null ? '—' : `${percent.toFixed(1)}%`}
                </span>
              </div>
              <button
                type="button"
                aria-label={`${row.label}: ${row.count} profiles, ${percent === null ? 'not evaluated' : `${percent.toFixed(1)} percent`}`}
                aria-pressed={selected === row.key}
                onClick={() => setSelected(selected === row.key ? undefined : row.key)}
                className="relative h-9 w-full rounded-sm bg-surface-muted focus-visible:outline-2 focus-visible:outline-primary"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 grid grid-cols-4"
                >
                  {[0, 1, 2, 3].map((tick) => (
                    <span key={tick} className="border-l border-border" />
                  ))}
                </span>
                <span
                  aria-hidden="true"
                  data-program-bar={row.key}
                  data-count={row.count}
                  className={cx(
                    'absolute inset-y-0 left-0 rounded-sm',
                    row.color,
                    selected && selected !== row.key ? 'opacity-25' : 'opacity-100',
                  )}
                  style={{ width: `${percent ?? 0}%` }}
                />
              </button>
            </li>
          );
        })}
      </ul>
      <p className="text-caption text-fg-muted">
        {denominator
          ? 'Bars share a 0–100% axis. Select a bar to highlight it.'
          : 'No evaluated profiles yet. Run Jev to populate the chart.'}
      </p>
    </section>
  );
}
