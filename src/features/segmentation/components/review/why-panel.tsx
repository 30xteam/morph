'use client';

import { THRESHOLDS } from '../../config/thresholds';
import { useMessages } from '../../hooks/use-messages';
import type { ReviewItem } from '../../hooks/use-review-items';
import { Panel } from '../ui/panel';
import { ProbabilityBars } from '../ui/probability-bars';
import { TagBadge } from '../ui/tag-badge';

export function WhyPanel({ item }: { item: ReviewItem }) {
  const m = useMessages();
  const { program } = item.outcome;
  const bars = [program, ...program.alternatives].map((choice) => ({
    key: choice.value,
    label: m.programs[choice.value],
    probability: choice.probability,
  }));

  return (
    <Panel title={m.review.why}>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-yellow-bg px-3.5 py-2.5">
        <p className="text-label-sm text-yellow-fg">
          {item.reason === 'low_info'
            ? m.review.lowInfoLine
            : m.review.confidenceLine(program.probability, THRESHOLDS.act)}
        </p>
        <TagBadge tone="warning">{m.review.needsHuman}</TagBadge>
      </div>
      <ProbabilityBars bars={bars} label={m.detail.decision} />
    </Panel>
  );
}
