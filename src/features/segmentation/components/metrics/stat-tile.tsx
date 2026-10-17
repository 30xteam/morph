import { cx } from '@/core/cx';

interface StatTileProps {
  label: string;
  value: string;
  hint: string;
  highlight?: boolean;
}

export function StatTile({ label, value, hint, highlight = false }: StatTileProps) {
  return (
    <div
      className={cx(
        'flex flex-col gap-1.5 rounded-lg border bg-card px-5 py-4.5',
        highlight ? 'border-line-strong' : 'border-line',
      )}
    >
      <dt className="text-badge text-ink-muted uppercase">{label}</dt>
      <dd className={cx('text-title-lg tabular-nums', highlight ? 'text-accent' : 'text-ink')}>
        {value}
      </dd>
      <dd className="text-body-sm text-ink-soft">{hint}</dd>
    </div>
  );
}
