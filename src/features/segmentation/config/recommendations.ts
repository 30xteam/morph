import type {
  Level,
  Recommendation,
  SegmentKey,
  StageKey,
  TrafficLight,
} from '../types/segmentation.types';
import { MATURITY_LABELS, SEGMENT_LABELS, STAGE_LABELS, URGENCY_LABELS } from './labels';
import { THRESHOLDS } from './thresholds';

interface RecommendationInput {
  light: TrafficLight;
  segment: SegmentKey;
  stage: StageKey;
  maturity: Level;
  urgency: Level;
  wantsLearning: number;
  activity: string;
}

export function recommend(input: RecommendationInput): Recommendation {
  const { light, segment, stage, maturity, urgency, wantsLearning, activity } = input;
  const level = MATURITY_LABELS[maturity].toLowerCase();

  if (light === 'red') {
    return {
      kind: 'human_review',
      title: 'A person reviews this sign-up',
      detail: 'Jev is not confident enough, or the person does not fit. No automatic outreach.',
    };
  }

  if (light === 'green') {
    return {
      kind: 'sales_conversation',
      title: 'Hand to a seller today',
      detail: `${SEGMENT_LABELS[segment]} at a ${STAGE_LABELS[stage].toLowerCase()} company · ${level} AI maturity · ${URGENCY_LABELS[urgency].toLowerCase()} urgency. Why now: ${activity}. Start a sales conversation about a program for their team.`,
    };
  }

  if (segment === 'investor') {
    return {
      kind: 'event',
      title: 'Invite to an upcoming event',
      detail: 'Networking value comes first; no sales outreach.',
    };
  }

  if (wantsLearning >= THRESHOLDS.wantsLearning) {
    return {
      kind: 'program',
      title: 'Educational sequence: program',
      detail: `Share a program that matches ${level} AI maturity; re-decide when their activity changes.`,
    };
  }

  return {
    kind: 'content',
    title: 'Educational sequence: content',
    detail: `Send content for ${level} AI maturity until their intent changes.`,
  };
}
