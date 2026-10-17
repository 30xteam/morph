import type {
  Decision,
  Level,
  SegmentKey,
  StageKey,
  TrafficLight,
} from '../types/segmentation.types';
import { THRESHOLDS } from './thresholds';

interface LightInput {
  segment: Decision<SegmentKey>;
  companyStage: Decision<StageKey>;
  urgency: Decision<Level>;
  salesReady: number;
  decisionPower: number;
  fitsOffer: number;
}

export function decideLight(input: LightInput): { light: TrafficLight; reasons: string[] } {
  const { segment, urgency, salesReady, decisionPower, fitsOffer } = input;

  const red: string[] = [];
  if (segment.value === 'other') red.push('Doesn’t match any of our groups');
  if (segment.probability < THRESHOLDS.review)
    red.push('Jev isn’t sure which group they belong to');
  if (fitsOffer < THRESHOLDS.fitsOffer) red.push('Doesn’t look like a fit for 30X');
  if (red.length) return { light: 'red', reasons: red };

  const missing: string[] = [];
  if (salesReady < THRESHOLDS.green) missing.push('Not ready to buy yet');
  if (decisionPower < THRESHOLDS.green) missing.push('Can’t approve a purchase alone');
  if (fitsOffer < THRESHOLDS.green) missing.push('Only a partial fit for 30X');
  if (urgency.value === 0) missing.push('No rush on their side');
  if (segment.probability < THRESHOLDS.act) missing.push('Group needs a quick check');
  if (missing.length) return { light: 'yellow', reasons: missing };

  return {
    light: 'green',
    reasons: ['Ready to buy, can approve the purchase and fits what 30X offers'],
  };
}
