import type { AffinityBand, Decision, ProgramKey, TrafficLight } from '../types/segmentation.types';
import { THRESHOLDS } from './thresholds';

interface LightInput {
  program: Decision<ProgramKey>;
  affinity: Decision<AffinityBand>;
  salesReady: number;
  decisionPower: number;
}

const STRONG_AFFINITY = new Set<AffinityBand>(['high', 'very_high']);

function percent(probability: number) {
  return `${Math.round(probability * 100)}%`;
}

export function decideLight({ program, affinity, salesReady, decisionPower }: LightInput): {
  light: TrafficLight;
  reasons: string[];
} {
  const red: string[] = [];
  if (program.value === 'none') red.push('No 30X program fits yet');
  if (affinity.value === 'low') red.push('Affinity is low (0-3)');
  if (program.probability < THRESHOLDS.review) {
    red.push(`Program confidence ${percent(program.probability)} is too low to act`);
  }
  if (red.length) return { light: 'red', reasons: red };

  const missing: string[] = [];
  if (!STRONG_AFFINITY.has(affinity.value)) missing.push('affinity is only medium (4-6)');
  if (salesReady < THRESHOLDS.green) missing.push(`not ready to buy yet (${percent(salesReady)})`);
  if (decisionPower < THRESHOLDS.green) {
    missing.push(`may not decide the purchase (${percent(decisionPower)})`);
  }
  if (program.probability < THRESHOLDS.act) {
    missing.push(`program confidence ${percent(program.probability)}`);
  }
  if (missing.length) return { light: 'yellow', reasons: missing };

  return {
    light: 'green',
    reasons: [
      `Program ${percent(program.probability)} · ready ${percent(salesReady)} · decides ${percent(decisionPower)}`,
    ],
  };
}
