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

const TRACK_BY_MATURITY: Record<Level, string> = {
  0: 'AI foundations',
  1: 'Applied AI for teams',
  2: 'Advanced AI in production',
};

export function recommend(input: RecommendationInput): Recommendation {
  const { light, segment, stage, maturity, urgency, wantsLearning, activity } = input;
  const track = TRACK_BY_MATURITY[maturity];

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
      detail: `${SEGMENT_LABELS[segment]} at a ${STAGE_LABELS[stage].toLowerCase()} company · ${MATURITY_LABELS[maturity].toLowerCase()} AI maturity · ${URGENCY_LABELS[urgency].toLowerCase()} urgency. Why now: ${activity}. Open with the ${track} track for their team.`,
    };
  }

  if (segment === 'investor') {
    return {
      kind: 'event',
      title: 'Invite to the next founders & investors session',
      detail: 'Networking value comes first; no sales outreach.',
    };
  }

  if (wantsLearning >= THRESHOLDS.wantsLearning) {
    return {
      kind: 'program',
      title: `Educational sequence: ${track} program`,
      detail: 'Send the syllabus and next cohort date; re-decide when their activity changes.',
    };
  }

  return {
    kind: 'content',
    title: `Educational sequence: ${track} content`,
    detail: 'Nurture with content matched to their AI maturity until intent changes.',
  };
}
