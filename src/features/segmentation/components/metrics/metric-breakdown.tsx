import { cx } from '@/core/cx';

interface MetricBreakdownProps {
  title: string;
  description: string;
  denominator: number;
  rows: { key: string; label: string; count: number; color: string }[];
}

export function MetricBreakdown({ title, description, denominator, rows }: MetricBreakdownProps) {
  return (
    <section
      aria-label={title}
      className="flex min-w-0 flex-col gap-4 rounded-md border border-border p-4"
    >
      <div>
        <h3 className="text-title-md text-fg-strong">{title}</h3>
        <p className="text-caption text-fg-muted">{description}</p>
      </div>
      <ul className="flex flex-col gap-3">
        {rows.map((row) => {
          const percent = denominator ? (row.count / denominator) * 100 : null;
          return (
            <li key={row.key} data-breakdown={row.key} className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between gap-3 text-body-sm">
                <span className="text-fg">{row.label}</span>
                <span className="shrink-0 text-caption text-fg-muted tabular-nums">
                  {row.count} · {percent === null ? '—' : `${percent.toFixed(1)}%`}
                </span>
              </div>
              <div aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-surface-muted">
                <div
                  className={cx('h-full rounded-full', row.color)}
                  style={{ width: `${percent ?? 0}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
