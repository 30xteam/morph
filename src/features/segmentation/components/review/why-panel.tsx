'use client';

import { THRESHOLDS } from '@/libs/segmentation';
import { Panel } from '@/ui';

import { useMessages } from '../../hooks/use-messages';
import type { ReviewItem } from '../../hooks/use-review-items';
import { ProbabilityBars } from '../ui/probability-bars';

export function WhyPanel({ item }: { item: ReviewItem }) {
  const m = useMessages();
  const { program, meta } = item.outcome;
  const reason = item.reason === 'low_info' ? m.reasons.lowInfo : m.reasons.lowConfidence;
  const bars = [program, ...program.alternatives].map((choice) => ({
    key: choice.value,
    label: m.programs[choice.value],
    probability: choice.probability,
  }));

  return (
    <Panel title={m.detail.decision}>
      <div className="flex flex-col gap-0.75">
        <p className="flex items-center gap-2 text-label-lg text-ink">
          <span aria-hidden="true" className="size-1.75 shrink-0 rounded-full bg-yellow-fg" />
          {m.detail.matchLine(reason, program.probability)}
        </p>
        <p className="text-body-sm text-ink-soft">
          {item.reason === 'low_info'
            ? m.review.lowInfoNote
            : m.review.confidenceNote(program.probability, THRESHOLDS.act)}
        </p>
      </div>
      <ProbabilityBars bars={bars} label={m.detail.decision} />
      <p className="text-caption text-ink-muted tabular-nums">
        {m.detail.meta(meta.model, meta.latencyMs)}
      </p>
    </Panel>
  );
}
