'use client';

/* oxlint-disable jsx-a11y/prefer-tag-over-role -- SVG charts need an explicit img role for accessible summaries. */

import { useId, useState } from 'react';

import type { SegmentationMetrics } from '../../services/segmentation-metrics';

function time(at: string) {
  return new Date(at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function DecisionTimeline({ metrics }: { metrics: SegmentationMetrics }) {
  const id = useId();
  const [cursor, setCursor] = useState<number>();
  const points = metrics.timeline;
  const first = points[0];
  const last = points.at(-1);
  const start = first ? Date.parse(first.at) : 0;
  const duration = last ? Date.parse(last.at) - start : 0;
  const x = (at: string) => (duration ? 24 + ((Date.parse(at) - start) / duration) * 552 : 300);
  const y = (count: number) => 212 - (count / Math.max(last?.count ?? 0, 1)) * 184;
  const path = points
    .map((point, index) =>
      index ? `H ${x(point.at)} V ${y(point.count)}` : `M ${x(point.at)} ${y(point.count)}`,
    )
    .join(' ');
  const index = Math.min(cursor ?? points.length - 1, points.length - 1);
  const selected = points[index];

  return (
    <section
      aria-label="Recorded decisions over time"
      className="flex min-w-0 flex-col gap-4 rounded-md border border-border p-5"
    >
      <div>
        <h3 className="text-title-md text-fg-strong">Recorded decisions over time</h3>
        <p className="text-caption text-fg-muted">
          Cumulative successful decision runs in the selected source; re-evaluations included.
        </p>
      </div>
      <div className="flex items-center justify-between text-caption text-fg-muted">
        <span>{last?.count ?? 0} recorded runs</span>
        <span>Count starts at 0</span>
      </div>
      <svg
        viewBox="0 0 600 240"
        role="img"
        aria-label="Cumulative decision runs"
        className="w-full"
      >
        <title>
          {last
            ? `${last.count} decision runs across ${points.length} observed timestamps`
            : 'No recorded decisions yet'}
        </title>
        {[28, 120, 212].map((line) => (
          <line key={line} x1={24} x2={576} y1={line} y2={line} className="stroke-border" />
        ))}
        {points.length > 1 ? (
          <path d={path} fill="none" strokeWidth={3} className="stroke-primary" />
        ) : null}
        {selected ? (
          <circle cx={x(selected.at)} cy={y(selected.count)} r={6} className="fill-primary">
            <title>{`${time(selected.at)}: ${selected.count} runs`}</title>
          </circle>
        ) : null}
        {!first ? (
          <text x={300} y={120} textAnchor="middle" className="fill-fg-muted text-title-md">
            Run Jev to start the chart
          </text>
        ) : null}
        <text x={8} y={228} className="fill-fg-muted text-body-sm">
          0
        </text>
        <text x={8} y={22} className="fill-fg-muted text-body-sm">
          {last?.count ?? 0}
        </text>
      </svg>
      {first && last ? (
        <div className="flex justify-between gap-2 text-caption text-fg-muted">
          <span>{time(first.at)}</span>
          <span>{time(last.at)}</span>
        </div>
      ) : null}
      {selected ? (
        <div className="flex flex-col gap-2">
          <label htmlFor={id} className="text-caption text-fg-muted">
            Inspect recorded checkpoint
          </label>
          <input
            id={id}
            type="range"
            min={0}
            max={Math.max(points.length - 1, 0)}
            value={index}
            disabled={points.length < 2}
            onChange={(event) => setCursor(Number(event.target.value))}
            className="min-h-11 w-full accent-primary"
            aria-valuetext={`${selected.count} runs at ${time(selected.at)}`}
          />
          <output className="text-body-sm text-fg">
            {selected.count} runs at {time(selected.at)}
          </output>
        </div>
      ) : null}
      <p className="text-caption text-fg-muted">
        Time labels use your browser timezone. Only observed timestamps are plotted; this is session
        history, not a daily growth forecast.
      </p>
    </section>
  );
}
