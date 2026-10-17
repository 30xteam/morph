import type {
  AffinityBand,
  Decision,
  ProgramKey,
  Reason,
  TrafficLight,
} from '../types/segmentation.types';
import { THRESHOLDS } from './thresholds';

interface LightInput {
  program: Decision<ProgramKey>;
  affinity: Decision<AffinityBand>;
  salesReady: number;
  decisionPower: number;
}

const STRONG_AFFINITY = new Set<AffinityBand>(['high', 'very_high']);

export function decideLight({ program, affinity, salesReady, decisionPower }: LightInput): {
  light: TrafficLight;
  reasons: Reason[];
} {
  const red: Reason[] = [];
  if (program.value === 'none') red.push({ code: 'no_program' });
  if (affinity.value === 'low') red.push({ code: 'low_affinity' });
  if (program.probability < THRESHOLDS.review) {
    red.push({ code: 'program_unsure', probability: program.probability });
  }
  if (red.length) return { light: 'red', reasons: red };

  const missing: Reason[] = [];
  if (!STRONG_AFFINITY.has(affinity.value)) missing.push({ code: 'medium_affinity' });
  if (salesReady < THRESHOLDS.green) missing.push({ code: 'not_ready', probability: salesReady });
  if (decisionPower < THRESHOLDS.green) {
    missing.push({ code: 'may_not_decide', probability: decisionPower });
  }
  if (program.probability < THRESHOLDS.act) {
    missing.push({ code: 'program_check', probability: program.probability });
  }
  if (missing.length) return { light: 'yellow', reasons: missing };

  return { light: 'green', reasons: [{ code: 'strong_fit', probability: program.probability }] };
}
