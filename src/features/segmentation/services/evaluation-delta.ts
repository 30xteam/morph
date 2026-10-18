import { type SegmentationEvaluation, formatUsd } from '@/libs/segmentation';

export interface StatDelta {
  text: string;
  better: boolean;
}

function signed(value: number, text: string) {
  return value > 0 ? `+${text}` : `−${text}`;
}

export function evaluationDeltas(
  current: SegmentationEvaluation,
  previous: SegmentationEvaluation,
) {
  const latency = current.medianLatencyMs - previous.medianLatencyMs;
  const cost = current.costPerThousandUsd - previous.costPerThousandUsd;
  const accuracy = Math.round((current.programAccuracy - previous.programAccuracy) * 100);
  return {
    latency: latency
      ? { text: signed(latency, `${Math.abs(latency)} ms`), better: latency < 0 }
      : undefined,
    cost: cost ? { text: signed(cost, formatUsd(Math.abs(cost))), better: cost < 0 } : undefined,
    accuracy: accuracy
      ? { text: signed(accuracy, `${Math.abs(accuracy)} pts`), better: accuracy > 0 }
      : undefined,
  } satisfies Record<string, StatDelta | undefined>;
}
