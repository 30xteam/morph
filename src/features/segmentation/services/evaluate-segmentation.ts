import 'server-only';
import { jevEnv } from '@/core/jev/jev-env';

import { LIGHT_LABELS, SEGMENT_LABELS } from '../config/labels';
import { EVALUATION_ANSWERS, EVALUATION_PROFILES } from '../evaluation/dataset';
import type {
  EvaluatedField,
  EvaluationMode,
  GroundTruth,
  LevelLabel,
  SegmentationEvaluation,
} from '../types/evaluation.types';
import type { Level, SegmentationOutcome, TrafficLight } from '../types/segmentation.types';
import { mapWithLimit } from '../utils/map-with-limit';
import { segmentProfile } from './segment-profile';

const LIGHTS: TrafficLight[] = ['green', 'yellow', 'red'];
const LEVELS: Record<Level, LevelLabel> = { 0: 'low', 1: 'medium', 2: 'high' };
const FIELDS: EvaluatedField[] = [
  'segment',
  'companyStage',
  'aiMaturity',
  'urgency',
  'salesReady',
  'decisionPower',
  'fitsOffer',
  'wantsLearning',
  'light',
];
const CONCURRENCY = 8;

function predicted(outcome: SegmentationOutcome): Record<EvaluatedField, string | boolean> {
  return {
    segment: outcome.segment.value,
    companyStage: outcome.companyStage.value,
    aiMaturity: LEVELS[outcome.aiMaturity.value],
    urgency: LEVELS[outcome.urgency.value],
    salesReady: outcome.salesReady >= 0.5,
    decisionPower: outcome.decisionPower >= 0.5,
    fitsOffer: outcome.fitsOffer >= 0.5,
    wantsLearning: outcome.wantsLearning >= 0.5,
    light: outcome.light,
  };
}

function wrongFields(outcome: SegmentationOutcome, truth: GroundTruth) {
  const got = predicted(outcome);
  return FIELDS.filter((field) => got[field] !== truth[field]);
}

function percentile(values: number[], p: number) {
  const sorted = values.toSorted((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))] ?? 0;
}

function share<T>(items: T[], test: (item: T) => boolean) {
  return items.length ? items.filter(test).length / items.length : 0;
}

export async function evaluateSegmentation(
  mode: EvaluationMode = 'single',
): Promise<SegmentationEvaluation> {
  const rows = await mapWithLimit(EVALUATION_PROFILES, CONCURRENCY, async (profile) => {
    const truth = EVALUATION_ANSWERS[profile.id];
    if (!truth) throw new Error(`No annotated answer for ${profile.id}`);
    const outcome = await segmentProfile(profile, 're_run', { consensus: mode === 'consensus' });
    return { profile, truth, outcome, wrong: wrongFields(outcome, truth) };
  });

  const lightConfusion = Object.fromEntries(
    LIGHTS.map((expected) => [expected, Object.fromEntries(LIGHTS.map((light) => [light, 0]))]),
  ) as SegmentationEvaluation['lightConfusion'];
  for (const { truth, outcome } of rows) lightConfusion[truth.light][outcome.light] += 1;

  const fieldAccuracy = Object.fromEntries(
    FIELDS.map((field) => [field, share(rows, (row) => !row.wrong.includes(field))]),
  ) as Record<EvaluatedField, number>;

  const alone = rows.filter(({ outcome }) => !outcome.needsReview);
  const latencies = rows.map(({ outcome }) => outcome.meta.latencyMs);
  const totalCost = rows.reduce((total, { outcome }) => total + outcome.meta.costUsd, 0);

  return {
    provider: jevEnv.JEV_PROVIDER,
    calibrated: rows.every(({ outcome }) => outcome.meta.calibrated),
    mode,
    total: rows.length,
    jevCalls: rows.length * (mode === 'consensus' ? 3 : 1),
    segmentAccuracy: fieldAccuracy.segment,
    lightAccuracy: fieldAccuracy.light,
    fieldAccuracy,
    lightConfusion,
    decidedAloneShare: alone.length / rows.length,
    accuracyWhenAlone: share(
      alone,
      (row) => !row.wrong.includes('segment') && !row.wrong.includes('light'),
    ),
    lightShare: Object.fromEntries(
      LIGHTS.map((light) => [light, share(rows, (row) => row.outcome.light === light)]),
    ) as Record<TrafficLight, number>,
    avgLatencyMs: Math.round(latencies.reduce((total, value) => total + value, 0) / rows.length),
    p95LatencyMs: percentile(latencies, 0.95),
    costPerThousandUsd: (totalCost / rows.length) * 1000,
    misses: rows
      .filter(({ wrong }) => wrong.includes('segment') || wrong.includes('light'))
      .map(({ profile, truth, outcome, wrong }) => ({
        alias: `${profile.alias} · ${profile.role}`,
        expected: `${SEGMENT_LABELS[truth.segment]} · ${LIGHT_LABELS[truth.light]}`,
        got: `${SEGMENT_LABELS[outcome.segment.value]} · ${LIGHT_LABELS[outcome.light]}`,
        note: truth.note,
        fields: wrong,
      })),
  };
}
