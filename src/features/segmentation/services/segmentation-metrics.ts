import type {
  Profile,
  ProgramKey,
  ReviewVerdict,
  SegmentationOutcome,
} from '../types/segmentation.types';
import { profilePriority } from './profile-priority';

export type MetricsSource = 'all' | Profile['source'];

function percentile(values: number[], fraction: number) {
  if (!values.length) return null;
  const sorted = values.toSorted((a, b) => a - b);
  return sorted[Math.max(0, Math.ceil(sorted.length * fraction) - 1)] ?? null;
}

export function segmentationMetrics(
  profiles: Profile[],
  history: Record<string, SegmentationOutcome[]>,
  reviews: Record<string, ReviewVerdict>,
  source: MetricsSource = 'all',
) {
  const scoped = profiles.filter((profile) => source === 'all' || profile.source === source);
  const priorities = { high: 0, medium: 0, low: 0, pending: 0 };
  const programs: Record<ProgramKey, number> = {
    ai_sales: 0,
    inmersion_ejecutiva: 0,
    sales_machine: 0,
    hardcore_ai: 0,
    achievers: 0,
    none: 0,
  };
  const runs: SegmentationOutcome[] = [];
  let reviewRequired = 0;
  let reviewed = 0;
  let engaged = 0;
  let priorityChanges = 0;
  let reevaluations = 0;
  let leads = 0;
  const activity = { events: 0, opens: 0, clicks: 0, visits: 0 };
  for (const profile of scoped) {
    const decisions = history[profile.id] ?? [];
    const latest = decisions.at(-1);
    priorities[profilePriority(latest).level] += 1;
    if (latest) programs[latest.program.value] += 1;
    if (latest?.needsReview) {
      reviewRequired += 1;
      if (reviews[profile.id]) reviewed += 1;
    }
    if (profile.relation === 'lead') leads += 1;
    const signals = profile.signals;
    if (signals.eventsAttended > 0) activity.events += 1;
    if (signals.emailsOpened > 0) activity.opens += 1;
    if (signals.emailsClicked > 0) activity.clicks += 1;
    if (signals.programPageVisits > 0) activity.visits += 1;
    if (
      signals.eventsAttended +
        signals.emailsOpened +
        signals.emailsClicked +
        signals.programPageVisits >
      0
    )
      engaged += 1;
    for (let index = 1; index < decisions.length; index += 1) {
      reevaluations += 1;
      if (decisions[index - 1]?.light !== decisions[index]?.light) priorityChanges += 1;
    }
    runs.push(...decisions);
  }
  const evaluated = scoped.length - priorities.pending;
  const latency = runs.map((run) => run.meta.latencyMs);
  const timestamps = new Map<string, number>();
  for (const run of runs) {
    const timestamp = run.meta.decidedAt;
    if (Number.isFinite(Date.parse(timestamp)))
      timestamps.set(timestamp, (timestamps.get(timestamp) ?? 0) + 1);
  }
  let cumulative = 0;
  const timeline = [...timestamps.entries()]
    .toSorted(([a], [b]) => Date.parse(a) - Date.parse(b))
    .map(([at, count]) => {
      cumulative += count;
      return { at, count: cumulative };
    });
  return {
    total: scoped.length,
    leads,
    deals: scoped.length - leads,
    evaluated,
    coverage: scoped.length ? evaluated / scoped.length : null,
    priorities,
    programs,
    reviewRequired,
    reviewed,
    openReviews: reviewRequired - reviewed,
    engaged,
    activity,
    timeline,
    priorityChanges,
    reevaluations,
    runs: runs.length,
    totalCostUsd: runs.reduce((sum, run) => sum + run.meta.costUsd, 0),
    medianLatencyMs: percentile(latency, 0.5),
    p95LatencyMs: percentile(latency, 0.95),
    calibratedRuns: runs.filter((run) => run.meta.calibrated).length,
    providers: [...new Set(runs.map((run) => run.meta.provider))].toSorted(),
  };
}

export type SegmentationMetrics = ReturnType<typeof segmentationMetrics>;
