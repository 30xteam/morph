import 'server-only';
import { decide } from '@/core/jev';
import type { JevAnswer, JevResult } from '@/core/jev';

import { decideAction } from '../config/action';
import { QUESTION_VARIANTS } from '../config/question-variants';
import { SEGMENTATION_QUESTIONS } from '../config/questions';
import { recommend } from '../config/recommendations';
import { decideLight } from '../config/traffic-light';
import type {
  Decision,
  Level,
  Profile,
  SegmentationOutcome,
  SegmentKey,
  StageKey,
  Trigger,
} from '../types/segmentation.types';
import { mergeResults } from './merge-answers';
import { describeActivity, toJevState } from './profile-state';

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

function toLevel(key: string): Level {
  const level = Number(key);
  return level === 1 || level === 2 ? level : 0;
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

  const segment = toDecision(answers.segment, (key) => key as SegmentKey);
  const companyStage = toDecision(answers.companyStage, (key) => key as StageKey);
  const aiMaturity = toDecision(answers.aiMaturity, toLevel);
  const urgency = toDecision(answers.urgency, toLevel);
  const salesReady = toProbability(answers.salesReady);
  const wantsLearning = toProbability(answers.wantsLearning);
  const decisionPower = toProbability(answers.decisionPower);
  const fitsOffer = toProbability(answers.fitsOffer);

  const { light, reasons } = decideLight({
    segment,
    companyStage,
    urgency,
    salesReady,
    decisionPower,
    fitsOffer,
  });

  const { action, questionActions } = decideAction({
    segment,
    companyStage,
    aiMaturity,
    salesReady,
    wantsLearning,
  });

  return {
    profileId: profile.id,
    trigger,
    segment,
    companyStage,
    aiMaturity,
    urgency,
    salesReady,
    wantsLearning,
    decisionPower,
    fitsOffer,
    light,
    action,
    questionActions,
    needsReview: action !== 'auto' || light === 'red',
    reasons,
    recommendation: recommend({
      light,
      segment: segment.value,
      stage: companyStage.value,
      maturity: aiMaturity.value,
      urgency: urgency.value,
      wantsLearning,
      activity: describeActivity(profile),
    }),
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
