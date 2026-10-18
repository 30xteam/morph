import type { ProgramKey, Recommendation, TrafficLight } from '../types/segmentation.types';
import { THRESHOLDS } from './thresholds';

interface RecommendationInput {
  light: TrafficLight;
  program: ProgramKey;
  wantsLearning: number;
}

export function recommend({ light, program, wantsLearning }: RecommendationInput): Recommendation {
  if (light === 'red') return { kind: 'human_review', program };
  if (light === 'green') return { kind: 'sales_conversation', program };
  if (wantsLearning >= THRESHOLDS.wantsLearning) return { kind: 'event', program };
  return { kind: 'nurture', program };
}
