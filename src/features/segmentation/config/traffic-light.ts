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

function percent(probability: number) {
  return `${Math.round(probability * 100)}%`;
}

export function decideLight(input: LightInput): { light: TrafficLight; reasons: string[] } {
  const { segment, urgency, salesReady, decisionPower, fitsOffer } = input;

  const red: string[] = [];
  if (segment.value === 'other') red.push('Segment is “Other”');
  if (segment.probability < THRESHOLDS.review) {
    red.push(`Segment confidence ${percent(segment.probability)} is too low to act`);
  }
  if (fitsOffer < THRESHOLDS.fitsOffer) red.push(`Fit with 30X is low (${percent(fitsOffer)})`);
  if (red.length) return { light: 'red', reasons: red };

  const missing: string[] = [];
  if (salesReady < THRESHOLDS.green) missing.push(`not ready to buy yet (${percent(salesReady)})`);
  if (decisionPower < THRESHOLDS.green) {
    missing.push(`cannot decide a purchase (${percent(decisionPower)})`);
  }
  if (fitsOffer < THRESHOLDS.green) missing.push(`partial fit (${percent(fitsOffer)})`);
  if (urgency.value === 0) missing.push('low urgency');
  if (segment.probability < THRESHOLDS.act) {
    missing.push(`segment confidence ${percent(segment.probability)}`);
  }
  if (missing.length) return { light: 'yellow', reasons: missing };

  return {
    light: 'green',
    reasons: [
      `Ready ${percent(salesReady)} · decides ${percent(decisionPower)} · fit ${percent(fitsOffer)}`,
    ],
  };
}
