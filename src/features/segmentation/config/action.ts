import type {
  ActionQuestion,
  Decision,
  DecisionAction,
  Level,
  SegmentKey,
  StageKey,
} from '../types/segmentation.types';
import { THRESHOLDS } from './thresholds';

interface ActionInput {
  segment: Decision<SegmentKey>;
  companyStage: Decision<StageKey>;
  aiMaturity: Decision<Level>;
  salesReady: number;
  wantsLearning: number;
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
    segment: input.segment.value === 'other' ? 'escalate' : actionFor(input.segment.probability),
    companyStage: actionFor(input.companyStage.probability),
    aiMaturity: actionFor(input.aiMaturity.probability),
    salesReady: actionFor(yesNoConfidence(input.salesReady)),
    wantsLearning: actionFor(yesNoConfidence(input.wantsLearning)),
  };
  return { action: questionActions.segment, questionActions };
}
