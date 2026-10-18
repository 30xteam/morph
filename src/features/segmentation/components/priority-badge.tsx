import { cx } from '@/core/cx';
import type { PriorityLevel, ProfilePriority } from '@/libs/segmentation';

export const PRIORITY_COLOR: Record<PriorityLevel, string> = {
  high: 'text-green-fg',
  medium: 'text-yellow-fg',
  low: 'text-red-fg',
  pending: 'text-ink-muted',
};

export function PriorityBadge({ priority }: { priority: ProfilePriority }) {
  return (
    <span
      title={priority.reason}
      className="inline-flex items-center gap-1.5 rounded-full bg-raised px-2 py-0.5 text-body-sm whitespace-nowrap text-ink-soft"
    >
      <span
        aria-hidden="true"
        className={cx('size-2 rounded-full bg-current', PRIORITY_COLOR[priority.level])}
      />
      {priority.label}
    </span>
  );
}
