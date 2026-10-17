import { cx } from '@/core/cx';

import type { PriorityLevel, ProfilePriority } from '../services/profile-priority';

export const PRIORITY_COLOR: Record<PriorityLevel, string> = {
  high: 'text-success',
  medium: 'text-warning',
  low: 'text-danger',
  pending: 'text-fg-muted',
};

export function PriorityBadge({ priority }: { priority: ProfilePriority }) {
  return (
    <span
      title={priority.reason}
      className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-2 py-0.5 text-caption whitespace-nowrap text-fg-soft"
    >
      <span aria-hidden="true" className={cx('text-label-sm', PRIORITY_COLOR[priority.level])}>
        ●
      </span>
      {priority.label}
    </span>
  );
}
