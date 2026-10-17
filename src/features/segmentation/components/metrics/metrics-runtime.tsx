import type { SegmentationMetrics } from '../../services/segmentation-metrics';
import { formatUsd } from '../../utils/format';

export function MetricsRuntime({ metrics }: { metrics: SegmentationMetrics }) {
  const values = [
    { key: 'runs', label: 'Recorded decision runs', value: metrics.runs },
    { key: 'cost', label: 'Recorded decision cost', value: formatUsd(metrics.totalCostUsd) },
    {
      key: 'median',
      label: 'Median latency',
      value: metrics.medianLatencyMs === null ? '—' : `${metrics.medianLatencyMs} ms`,
    },
    {
      key: 'p95',
      label: 'p95 latency',
      value: metrics.p95LatencyMs === null ? '—' : `${metrics.p95LatencyMs} ms`,
    },
  ];
  return (
    <section
      aria-label="Decision statistics"
      className="flex flex-col gap-3 rounded-md bg-surface-subtle p-4"
    >
      <dl className="grid grid-cols-2 gap-4 desktop:grid-cols-4">
        {values.map((item) => (
          <div key={item.key}>
            <dt className="text-caption text-fg-muted">{item.label}</dt>
            <dd data-metric={item.key} className="text-title-md text-fg-strong tabular-nums">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="text-caption text-fg-muted">
        {metrics.priorityChanges} priority changes across {metrics.reevaluations} re-evaluations in
        the loaded history. Latency uses the nearest-rank percentile across all recorded runs in
        this scope.
      </p>
      <p className="text-caption text-fg-muted">
        {metrics.runs
          ? `Providers: ${metrics.providers.join(', ')} · ${metrics.calibratedRuns}/${metrics.runs} runs report calibrated probabilities.`
          : 'No decision telemetry yet.'}{' '}
        Recorded cost excludes failed or unrecorded requests; it is not a billing total. Mock costs
        are simulated estimates.
      </p>
    </section>
  );
}
