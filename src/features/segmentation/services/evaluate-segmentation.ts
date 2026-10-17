import 'server-only';
import { jevEnv } from '@/core/jev/jev-env';

import { PROGRAM_LABELS } from '../config/labels';
import { THRESHOLD_STEPS, THRESHOLDS } from '../config/thresholds';
import { LABELS_30X, PROFILES_30X } from '../data/dataset';
import type { EvaluationMode, SegmentationEvaluation } from '../types/evaluation.types';
import type { AffinityBand, ProgramKey, TrafficLight } from '../types/segmentation.types';
import { mapWithLimit } from '../utils/map-with-limit';
import { segmentProfile } from './segment-profile';

const PROGRAMS: ProgramKey[] = [
  'ai_sales',
  'inmersion_ejecutiva',
  'sales_machine',
  'hardcore_ai',
  'achievers',
  'none',
];
const BANDS: AffinityBand[] = ['low', 'medium', 'high', 'very_high'];
const LIGHTS: TrafficLight[] = ['green', 'yellow', 'red'];
const CONCURRENCY = 8;
const MAX_MISSES = 40;

function share<T>(items: T[], test: (item: T) => boolean) {
  return items.length ? items.filter(test).length / items.length : 0;
}

function percentile(values: number[], p: number) {
  const sorted = values.toSorted((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))] ?? 0;
}

export async function evaluateSegmentation(
  mode: EvaluationMode = 'single',
  limit?: number,
): Promise<SegmentationEvaluation> {
  const profiles = limit ? PROFILES_30X.slice(0, limit) : PROFILES_30X;
  const rows = await mapWithLimit(profiles, CONCURRENCY, async (profile) => {
    const truth = LABELS_30X[profile.id];
    if (!truth) throw new Error(`No 30X label for ${profile.id}`);
    const outcome = await segmentProfile(profile, 're_run', { consensus: mode === 'consensus' });
    return { profile, truth, outcome };
  });

  const programConfusion = Object.fromEntries(
    PROGRAMS.map((expected) => [expected, Object.fromEntries(PROGRAMS.map((key) => [key, 0]))]),
  ) as SegmentationEvaluation['programConfusion'];
  for (const { truth, outcome } of rows)
    programConfusion[truth.program][outcome.program.value] += 1;

  const programOk = (row: (typeof rows)[number]) => row.outcome.program.value === row.truth.program;
  const known = rows.filter(({ truth }) => truth.role !== 'unknown');
  const alone = rows.filter(({ outcome }) => !outcome.needsReview);
  const latencies = rows.map(({ outcome }) => outcome.meta.latencyMs);
  const totalCost = rows.reduce((total, { outcome }) => total + outcome.meta.costUsd, 0);

  const labelCounts = PROGRAMS.map((program) => ({
    program,
    count: rows.filter(({ truth }) => truth.program === program).length,
  }));
  const baseline = labelCounts.reduce((best, item) => (item.count > best.count ? item : best));
  const lowInfoRows = rows.filter(({ outcome }) => outcome.reviewReason === 'low_info');
  const thresholds = THRESHOLD_STEPS.map((threshold) => {
    const decided = rows.filter(
      ({ outcome }) =>
        outcome.reviewReason !== 'low_info' && outcome.program.probability >= threshold,
    );
    return {
      threshold,
      decidedAloneShare: decided.length / rows.length,
      accuracyWhenAlone: decided.length ? share(decided, programOk) : null,
    };
  });

  const byInfo: SegmentationEvaluation['programAccuracyByInfo'] = {};
  for (const level of ['Alta', 'Media', 'Baja']) {
    const group = rows.filter(({ truth }) => truth.infoLevel === level);
    byInfo[level] = { total: group.length, accuracy: share(group, programOk) };
  }

  return {
    provider: jevEnv.JEV_PROVIDER,
    calibrated: rows.every(({ outcome }) => outcome.meta.calibrated),
    mode,
    total: rows.length,
    jevCalls: rows.length * (mode === 'consensus' ? 3 : 1),
    programAccuracy: share(rows, programOk),
    baselineProgram: baseline.program,
    baselineAccuracy: baseline.count / rows.length,
    reviewCount: {
      lowConfidence: rows.filter(({ outcome }) => outcome.reviewReason === 'low_confidence').length,
      lowInfo: lowInfoRows.length,
    },
    lowInfoLowAffinity: {
      lowInfo: lowInfoRows.length,
      alsoLowAffinity: lowInfoRows.filter(({ truth }) => truth.affinityBand === 'low').length,
    },
    thresholds,
    currentThreshold: THRESHOLDS.act,
    affinityAccuracy: share(rows, (row) => row.outcome.affinity.value === row.truth.affinityBand),
    affinityWithinOneBand: share(
      rows,
      (row) =>
        Math.abs(
          BANDS.indexOf(row.outcome.affinity.value) - BANDS.indexOf(row.truth.affinityBand),
        ) <= 1,
    ),
    roleAccuracyKnown: share(known, (row) => row.outcome.segment.value === row.truth.role),
    knownRoles: known.length,
    decidedAloneShare: alone.length / rows.length,
    programAccuracyWhenAlone: share(alone, programOk),
    programAccuracyByInfo: byInfo,
    programConfusion,
    lightShare: Object.fromEntries(
      LIGHTS.map((light) => [light, share(rows, (row) => row.outcome.light === light)]),
    ) as Record<TrafficLight, number>,
    avgLatencyMs: Math.round(latencies.reduce((total, value) => total + value, 0) / rows.length),
    medianLatencyMs: percentile(latencies, 0.5),
    p95LatencyMs: percentile(latencies, 0.95),
    costPerThousandUsd: (totalCost / rows.length) * 1000,
    misses: rows
      .filter((row) => !programOk(row))
      .slice(0, MAX_MISSES)
      .map(({ profile, truth, outcome }) => ({
        alias: `${profile.alias} · ${profile.goal}`,
        expected: `${PROGRAM_LABELS[truth.program]} (affinity ${truth.affinity})`,
        got: `${PROGRAM_LABELS[outcome.program.value]} (${Math.round(outcome.program.probability * 100)}%)`,
        note: `info ${truth.infoLevel} · topics ${profile.topics.join(', ') || '—'}`,
      })),
  };
}
