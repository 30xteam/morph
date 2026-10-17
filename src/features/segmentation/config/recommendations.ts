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
      title: 'Someone on the team should look at this person',
      detail:
        'Jev isn’t confident enough, or the person may not fit. Nobody is contacted automatically.',
    };
  }

  if (light === 'green') {
    return {
      kind: 'sales_conversation',
      title: 'A seller should reach out today',
      detail: `${SEGMENT_LABELS[segment]}, company stage: ${STAGE_LABELS[stage].toLowerCase()}, ${level} use of AI, ${URGENCY_LABELS[urgency].toLowerCase()} urgency. Why now: ${activity}. Talk about a program for their team.`,
    };
  }

  if (segment === 'investor') {
    return {
      kind: 'event',
      title: 'Invite them to an upcoming event',
      detail: 'They come to meet people, so no sales outreach for now.',
    };
  }

  if (wantsLearning >= THRESHOLDS.wantsLearning) {
    return {
      kind: 'program',
      title: 'Send a program that matches their level',
      detail: `They want to learn and use AI at a ${level} level. Jev checks again when their activity changes.`,
    };
  }

  return {
    kind: 'content',
    title: 'Send content that matches their level',
    detail: `They use AI at a ${level} level. Keep sharing content until they show more interest.`,
  };
}
