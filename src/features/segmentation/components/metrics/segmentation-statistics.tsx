'use client';

import { useMemo, useState } from 'react';

import { PROGRAM_LABELS } from '../../config/labels';
import { segmentationMetrics } from '../../services/segmentation-metrics';
import type { MetricsSource } from '../../services/segmentation-metrics';
import { useSegmentationStore } from '../../store/segmentation-store';
import type { ProgramKey } from '../../types/segmentation.types';
import { MetricBreakdown } from './metric-breakdown';
import { MetricsRuntime } from './metrics-runtime';

export function SegmentationStatistics() {
  const profiles = useSegmentationStore((state) => state.profiles);
  const history = useSegmentationStore((state) => state.history);
  const reviews = useSegmentationStore((state) => state.reviews);
  const [source, setSource] = useState<MetricsSource>('all');
  const metrics = useMemo(
    () => segmentationMetrics(profiles, history, reviews, source),
    [profiles, history, reviews, source],
  );
  const cards = [
    {
      key: 'loaded',
      label: 'Loaded profiles',
      value: metrics.total,
      detail: `${metrics.leads} leads · ${metrics.deals} deals`,
    },
    {
      key: 'coverage',
      label: 'Evaluation coverage',
      value: metrics.coverage === null ? '—' : `${Math.round(metrics.coverage * 100)}%`,
      detail: `${metrics.evaluated}/${metrics.total} profiles have a decision`,
    },
    {
      key: 'open-reviews',
      label: 'Open human reviews',
      value: metrics.openReviews,
      detail: `${metrics.reviewed}/${metrics.reviewRequired} required reviews completed`,
    },
    {
      key: 'engaged',
      label: 'Profiles with activity',
      value: metrics.engaged,
      detail: 'At least one event, email open/click or program-page visit',
    },
  ];
  const priorityRows = [
    { key: 'high', label: 'P1 · High', count: metrics.priorities.high, color: 'bg-success' },
    { key: 'medium', label: 'P2 · Medium', count: metrics.priorities.medium, color: 'bg-warning' },
    { key: 'low', label: 'P3 · Low', count: metrics.priorities.low, color: 'bg-danger' },
    {
      key: 'pending',
      label: 'Not evaluated',
      count: metrics.priorities.pending,
      color: 'bg-fg-muted',
    },
  ];
  const programRows = (Object.keys(PROGRAM_LABELS) as ProgramKey[]).map((key) => ({
    key,
    label: PROGRAM_LABELS[key],
    count: metrics.programs[key],
    color: 'bg-primary',
  }));

  return (
    <section
      id="metrics"
      aria-labelledby="metrics-heading"
      className="flex scroll-mt-32 flex-col gap-5"
    >
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="metrics-heading" className="text-title-md text-fg-strong">
            Metrics & statistics
          </h2>
          <p className="text-body-sm text-fg-muted">
            Live snapshot of loaded profiles and their recorded decision history.
          </p>
        </div>
        <label className="flex flex-col gap-1 text-caption text-fg-muted">
          Metrics source
          <select
            aria-label="Metrics source"
            value={source}
            onChange={(event) => setSource(event.target.value as MetricsSource)}
            className="h-11 rounded-input border border-border-input bg-surface px-3 text-body-sm text-fg focus-visible:outline-2 focus-visible:outline-primary"
          >
            <option value="all">All profiles</option>
            <option value="crm">CRM</option>
            <option value="luma">Luma</option>
          </select>
        </label>
      </header>
      <dl className="grid gap-3 tablet:grid-cols-2 desktop:grid-cols-4" aria-live="polite">
        {cards.map((card) => (
          <div key={card.key} className="flex flex-col gap-1 rounded-md border border-border p-4">
            <dt className="text-caption text-fg-muted">{card.label}</dt>
            <dd data-metric={card.key} className="text-headline-sm text-fg-strong tabular-nums">
              {card.value}
            </dd>
            <dd className="text-caption text-fg-muted">{card.detail}</dd>
          </div>
        ))}
      </dl>
      {!metrics.total ? (
        <p className="text-body-sm text-fg-muted">
          No profiles in this source yet. Percentages and latency are unavailable.
        </p>
      ) : null}
      <div className="grid gap-4 desktop:grid-cols-2">
        <MetricBreakdown
          title="Commercial priorities"
          description={`Latest decision per person; denominator: all ${metrics.total} loaded profiles in this scope.`}
          denominator={metrics.total}
          rows={priorityRows}
        />
        <MetricBreakdown
          title="Recommended programs"
          description={`Latest Jev recommendation; denominator: ${metrics.evaluated} evaluated profiles. CRM program assignments are excluded.`}
          denominator={metrics.evaluated}
          rows={programRows}
        />
      </div>
      <MetricsRuntime metrics={metrics} />
      <p className="text-caption text-fg-muted">
        Scope follows the source filter, not the table or graph filters. Counts update on new Luma
        profiles, decisions and human reviews. This is loaded dashboard data, not all 697 evaluation
        profiles or a daily report. No conversion or revenue measurement is connected. Reloading the
        page resets the browser history; the demo Luma feed may replay available entries.
      </p>
    </section>
  );
}
