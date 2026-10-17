import { THRESHOLDS } from '../config/thresholds';

export function certaintyLabel(probability: number) {
  if (probability >= THRESHOLDS.act) return 'Very sure';
  if (probability >= THRESHOLDS.review) return 'Fairly sure';
  return 'Not sure';
}
