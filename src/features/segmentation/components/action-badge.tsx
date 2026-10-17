import { cx } from '@/core/cx';

import { ACTION_LABELS } from '../config/labels';
import type { DecisionAction } from '../types/segmentation.types';

const DOT: Record<DecisionAction, string> = {
  auto: 'bg-accent-4',
  review: 'bg-accent-3',
  escalate: 'bg-accent-2',
};

interface ActionBadgeProps {
  action: DecisionAction;
  probability?: number;
}

export function ActionBadge({ action, probability }: ActionBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-caption whitespace-nowrap text-fg-soft">
      <span aria-hidden="true" className={cx('size-1.5 rounded-full', DOT[action])} />
      {ACTION_LABELS[action]}
      {probability === undefined ? null : (
        <span className="text-fg-muted tabular-nums">{Math.round(probability * 100)}% sure</span>
      )}
    </span>
  );
}
