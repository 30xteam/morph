import type { SegmentationMetrics } from '../../services/segmentation-metrics';

export function ActivityChart({ metrics }: { metrics: SegmentationMetrics }) {
  const rows = [
    { key: 'events', label: 'Events', count: metrics.activity.events },
    { key: 'opens', label: 'Email opens', count: metrics.activity.opens },
    { key: 'clicks', label: 'Email clicks', count: metrics.activity.clicks },
    { key: 'visits', label: 'Page visits', count: metrics.activity.visits },
  ];
  const max = Math.max(4, ...rows.map((row) => row.count));
  const ticks = [0, Math.ceil(max / 2), max];

  return (
    <section
      aria-label="Activity by channel"
      className="flex min-w-0 flex-col gap-4 rounded-md border border-border p-5"
    >
      <div>
        <h3 className="text-title-md text-fg-strong">Activity by channel</h3>
        <p className="text-caption text-fg-muted">
          Profiles with at least one recorded signal per channel.
        </p>
      </div>
      <figure
        className="flex h-56 gap-3"
        aria-label={rows.map((row) => `${row.label}: ${row.count} profiles`).join('; ')}
      >
        <div className="relative w-6 shrink-0 text-caption text-fg-muted">
          {ticks.map((tick) => (
            <span
              key={tick}
              className="absolute right-0 -translate-y-1/2"
              style={{ top: `${(1 - tick / max) * 100}%` }}
            >
              {tick}
            </span>
          ))}
        </div>
        <div className="relative grid flex-1 grid-cols-4 items-end gap-4 border-b border-border">
          {ticks.map((tick) => (
            <div
              key={tick}
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 border-t border-border"
              style={{ bottom: `${(tick / max) * 100}%` }}
            />
          ))}
          {rows.map((row) => (
            <div key={row.key} className="relative flex h-full items-end justify-center">
              <div
                data-activity-bar={row.key}
                data-count={row.count}
                title={`${row.label}: ${row.count} profiles`}
                className="relative w-full max-w-12 rounded-t-sm bg-accent-1"
                style={{ height: `${(row.count / max) * 100}%` }}
              >
                <span className="absolute inset-x-0 -top-6 text-center text-caption text-fg tabular-nums">
                  {row.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </figure>
      <div className="ml-9 grid grid-cols-4 gap-2 text-center text-caption text-fg-muted">
        {rows.map((row) => (
          <span key={row.key}>{row.label}</span>
        ))}
      </div>
      <p className="text-caption text-fg-muted">
        Each bar counts people, not total events. One person can appear in several channels; these
        bars are not a conversion funnel.
      </p>
    </section>
  );
}
