'use client';

import type { SegmentationOutcome } from '@/libs/segmentation';
import { Panel } from '@/ui';

import { useMessages } from '../../hooks/use-messages';
import { ProbabilityBars } from '../ui/probability-bars';

export function DecisionCard({ outcome }: { outcome: SegmentationOutcome }) {
  const m = useMessages();
  const { program, affinity } = outcome;
  const bars = [program, ...program.alternatives].map((choice) => ({
    key: choice.value,
    label: m.programs[choice.value],
    probability: choice.probability,
  }));
  const reason = outcome.reviewReason === 'low_info' ? m.reasons.lowInfo : m.reasons.lowConfidence;

  return (
    <Panel title={m.detail.decision}>
      <div className="flex flex-col gap-0.75">
        <p className="text-label-lg text-ink">
          {m.detail.matchLine(m.match[affinity.value], program.probability)}
        </p>
        <p className="text-body-sm text-ink-muted">
          {outcome.needsReview ? m.detail.sentToReview(reason) : m.detail.decidedAlone}
        </p>
      </div>
      <ProbabilityBars bars={bars} label={m.detail.decision} />
      <p className="text-caption text-ink-muted tabular-nums">
        {m.detail.meta(outcome.meta.model, outcome.meta.latencyMs)}
      </p>
    </Panel>
  );
}
