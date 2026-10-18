import type {
  ActionQuestion,
  AffinityBand,
  Decision,
  DecisionAction,
  ProgramKey,
  ReviewReason,
  SegmentKey,
} from '../types/segmentation.types';
import { THRESHOLDS } from './thresholds';

interface ActionInput {
  segment: Decision<SegmentKey>;
  program: Decision<ProgramKey>;
  affinity: Decision<AffinityBand>;
  salesReady: number;
  wantsLearning: number;
  lowInfo: boolean;
}

export function yesNoConfidence(probability: number) {
  return Math.max(probability, 1 - probability);
}

export function actionFor(confidence: number): DecisionAction {
  if (confidence >= THRESHOLDS.act) return 'auto';
  if (confidence >= THRESHOLDS.review) return 'review';
  return 'escalate';
}

export function decideAction(input: ActionInput) {
  const questionActions: Record<ActionQuestion, DecisionAction> = {
    segment: input.segment.value === 'unknown' ? 'escalate' : actionFor(input.segment.probability),
    program: actionFor(input.program.probability),
    affinity: actionFor(input.affinity.probability),
    salesReady: actionFor(yesNoConfidence(input.salesReady)),
    wantsLearning: actionFor(yesNoConfidence(input.wantsLearning)),
  };
  const byConfidence = questionActions.program;
  const action: DecisionAction = input.lowInfo && byConfidence === 'auto' ? 'review' : byConfidence;
  let reviewReason: ReviewReason | null = null;
  if (action !== 'auto') reviewReason = input.lowInfo ? 'low_info' : 'low_confidence';
  return { action, questionActions, reviewReason };
}
