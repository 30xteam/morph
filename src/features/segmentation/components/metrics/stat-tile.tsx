import { cx } from '@/core/cx';

import type { StatDelta } from '../../services/evaluation-delta';

interface StatTileProps {
  label: string;
  value: string;
  hint: string;
  delta?: StatDelta;
}

export function StatTile({ label, value, hint, delta }: StatTileProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-line bg-card px-5 py-4.5">
      <dt className="text-body-sm font-medium text-ink-soft">{label}</dt>
      <dd className="flex items-baseline gap-2">
        <span className="text-title-lg text-ink tabular-nums">{value}</span>
        {delta ? (
          <span
            className={cx(
              'text-body-sm tabular-nums motion-safe:animate-enter',
              delta.better ? 'text-green-fg' : 'text-red-fg',
            )}
          >
            {delta.text}
          </span>
        ) : null}
      </dd>
      <dd className="text-body-sm text-ink-muted">{hint}</dd>
    </div>
  );
}
