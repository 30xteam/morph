'use client';

import { cx } from '@/core/cx';

import { useMessages } from '../../hooks/use-messages';

const PRIORITY_DOTS = [
  'size-3 bg-green-fg',
  'size-2.5 bg-yellow-fg',
  'size-2 bg-red-fg',
  'size-2 bg-ink-muted',
] as const;

export function GraphLegend() {
  const m = useMessages();

  return (
    <dl className="mt-auto flex flex-col gap-2.5 border-t border-line pt-4 text-body-sm text-ink-muted">
      <dt className="text-label-sm text-ink">{m.graph.legend}</dt>
      <dd className="flex items-start gap-3">
        <span aria-hidden="true" className="flex h-5 w-12 shrink-0 items-center gap-1">
          {PRIORITY_DOTS.map((dot) => (
            <span key={dot} className={cx('shrink-0 rounded-full', dot)} />
          ))}
        </span>
        {m.graph.legendPriority}
      </dd>
      <dd className="flex items-center gap-3">
        <span aria-hidden="true" className="h-px w-12 shrink-0 bg-line-strong" />
        {m.graph.legendCrm}
      </dd>
      <dd className="flex items-center gap-3">
        <span aria-hidden="true" className="h-0.75 w-12 shrink-0 rounded-full bg-accent" />
        {m.graph.legendRecommendation}
      </dd>
      <dd>{m.graph.legendShared}</dd>
    </dl>
  );
}
