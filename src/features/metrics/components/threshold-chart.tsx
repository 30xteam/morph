'use client';

import { type ThresholdRow, formatPercent } from '@/libs/segmentation';

import { useMessages } from '../hooks/use-messages';

interface ThresholdChartProps {
  rows: ThresholdRow[];
  currentThreshold: number;
}

const Y_TICKS = [1, 0.5, 0];

function segments(rows: ThresholdRow[], pick: (row: ThresholdRow) => number | null) {
  const step = 100 / Math.max(rows.length - 1, 1);
  const runs: string[][] = [[]];
  rows.forEach((row, index) => {
    const value = pick(row);
    if (value === null) {
      runs.push([]);
      return;
    }
    runs.at(-1)!.push(`${index * step},${100 - value * 100}`);
  });
  return runs.filter((run) => run.length > 1).map((run) => run.join(' '));
}

export function ThresholdChart({ rows, currentThreshold }: ThresholdChartProps) {
  const m = useMessages();
  const currentIndex = rows.findIndex((row) => row.threshold === currentThreshold);
  const current = rows[currentIndex];
  const markerX = (currentIndex / Math.max(rows.length - 1, 1)) * 100;
  const summary = current
    ? m.metrics.chartLabel(
        currentThreshold,
        formatPercent(current.decidedAloneShare),
        current.accuracyWhenAlone === null ? '—' : formatPercent(current.accuracyWhenAlone),
      )
    : m.metrics.thresholdTitle;

  return (
    <figure aria-label={summary} className="flex flex-col gap-3 pb-4">
      <div aria-hidden="true" className="grid grid-cols-[2.5rem_1fr] gap-x-2 gap-y-1.5">
        <div className="flex h-36 flex-col justify-between text-right text-caption text-ink-muted tabular-nums">
          {Y_TICKS.map((tick) => (
            <span key={tick}>{formatPercent(tick)}</span>
          ))}
        </div>
        <div className="relative h-36">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 size-full overflow-visible"
          >
            {Y_TICKS.map((tick) => (
              <line
                key={tick}
                x1={0}
                x2={100}
                y1={100 - tick * 100}
                y2={100 - tick * 100}
                className="stroke-line"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {current ? (
              <line
                x1={markerX}
                x2={markerX}
                y1={0}
                y2={100}
                className="stroke-ink-muted"
                strokeDasharray="3 3"
                vectorEffect="non-scaling-stroke"
              />
            ) : null}
            {segments(rows, (row) => row.decidedAloneShare).map((points) => (
              <polyline
                key={points}
                points={points}
                fill="none"
                strokeWidth={2}
                className="stroke-ink-soft"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {segments(rows, (row) => row.accuracyWhenAlone).map((points) => (
              <polyline
                key={points}
                points={points}
                fill="none"
                strokeWidth={2}
                className="stroke-accent"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
        </div>
        <span />
        <div className="flex justify-between text-caption text-ink-muted tabular-nums">
          {rows.map((row) => (
            <span key={row.threshold}>{row.threshold.toFixed(2)}</span>
          ))}
        </div>
      </div>
      <figcaption className="flex flex-wrap gap-x-5 gap-y-1 pl-12 text-caption text-ink-soft">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="h-0.5 w-4 bg-ink-soft" />
          {m.metrics.decidesAlone}
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="h-0.5 w-4 bg-accent" />
          {m.metrics.accuracyAlone}
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="h-3 w-0 border-l border-dashed border-ink-muted" />
          {m.metrics.current}
        </span>
      </figcaption>
    </figure>
  );
}
