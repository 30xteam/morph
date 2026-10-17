import 'server-only';
import { decide } from '@/core/jev';
import type { JevAnswer, JevResult } from '@/core/jev';

import { decideAction } from '../config/action';
import { QUESTION_VARIANTS } from '../config/question-variants';
import { SEGMENTATION_QUESTIONS } from '../config/questions';
import { recommend } from '../config/recommendations';
import { decideLight } from '../config/traffic-light';
import type {
  AffinityBand,
  Decision,
  Profile,
  ProgramKey,
  SegmentationOutcome,
  SegmentKey,
  Trigger,
} from '../types/segmentation.types';
import { mergeResults } from './merge-answers';
import { hasLowInfo, missingSignals, toJevState } from './profile-state';

const AFFINITY_BY_LEVEL: AffinityBand[] = ['low', 'medium', 'high', 'very_high'];

const KNOWN_ROLES: Record<string, SegmentKey> = {
  'Fundador, socio o CEO': 'founder',
  'Director, VP o C-level (no dueño)': 'executive',
  'Líder comercial o de ventas': 'sales_leader',
  'Gerente o jefe de área': 'manager',
  'Perfil técnico (ingeniería, datos, producto)': 'technical',
};

function resolveSegment(profile: Profile, inferred: Decision<SegmentKey>): Decision<SegmentKey> {
  const known = KNOWN_ROLES[profile.role];
  return known ? { value: known, probability: 1, alternatives: [] } : inferred;
}

function toDecision<T>(answer: JevAnswer | undefined, parse: (key: string) => T): Decision<T> {
  if (!answer || answer.type === 'noul') throw new Error('Expected a choice or score answer');
  const ranked = Object.entries(answer.probabilities)
    .map(([key, probability]) => ({ value: parse(key), probability }))
    .toSorted((a, b) => b.probability - a.probability);
  const [best, ...alternatives] = ranked;
  if (!best) throw new Error('Answer has no probabilities');
  return { ...best, alternatives: alternatives.slice(0, 2) };
}

function toProbability(answer: JevAnswer | undefined) {
  if (!answer || answer.type !== 'noul') throw new Error('Expected a noul answer');
  return answer.noul;
}

function toAffinity(key: string): AffinityBand {
  return AFFINITY_BY_LEVEL[Number(key)] ?? 'low';
}

async function askJev(profile: Profile, consensus: boolean): Promise<JevResult> {
  const state = toJevState(profile);
  if (!consensus) return decide({ state, questions: SEGMENTATION_QUESTIONS });
  const results = await Promise.all(
    QUESTION_VARIANTS.map((questions) => decide({ state, questions })),
  );
  return mergeResults(results);
}

export async function segmentProfile(
  profile: Profile,
  trigger: Trigger = 're_run',
  { consensus = false }: { consensus?: boolean } = {},
): Promise<SegmentationOutcome> {
  const result = await askJev(profile, consensus);
  const { answers } = result;

  const segment = resolveSegment(
    profile,
    toDecision(answers.segment, (key) => key as SegmentKey),
  );
  const program = toDecision(answers.program, (key) => key as ProgramKey);
  const affinity = toDecision(answers.affinity, toAffinity);
  const salesReady = toProbability(answers.salesReady);
  const decisionPower = toProbability(answers.decisionPower);
  const wantsLearning = toProbability(answers.wantsLearning);

  const { light, reasons } = decideLight({ program, affinity, salesReady, decisionPower });

  const { action, questionActions, reviewReason } = decideAction({
    segment,
    program,
    affinity,
    salesReady,
    wantsLearning,
    lowInfo: hasLowInfo(profile),
  });

  return {
    profileId: profile.id,
    trigger,
    segment,
    program,
    affinity,
    salesReady,
    decisionPower,
    wantsLearning,
    light,
    action,
    questionActions,
    needsReview: action !== 'auto',
    reviewReason,
    missingSignals: missingSignals(profile),
    reasons,
    recommendation: recommend({ light, program: program.value, wantsLearning }),
    meta: {
      provider: result.provider,
      model: result.model,
      calibrated: result.calibrated,
      latencyMs: result.latencyMs,
      inputTokens: result.inputTokens,
      costUsd: result.costUsd,
      decidedAt: new Date().toISOString(),
    },
  };
}
