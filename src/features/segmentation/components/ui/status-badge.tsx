import { cx } from '@/core/cx';

import { useMessages } from '../../hooks/use-messages';
import type { ProfileStatus } from '../../utils/profile-status';

const TONE: Record<ProfileStatus | 'deciding', string> = {
  green: 'bg-green-bg text-green-fg',
  yellow: 'bg-yellow-bg text-yellow-fg',
  red: 'bg-red-bg text-red-fg',
  review: 'bg-review-bg text-review-fg',
  pending: 'border border-line text-ink-muted',
  deciding: 'border border-line text-ink-muted',
};

export function StatusBadge({ status }: { status: ProfileStatus | 'deciding' }) {
  const m = useMessages();
  return (
    <span
      className={cx(
        'inline-flex w-fit items-center rounded-sm px-2 py-0.75 text-badge whitespace-nowrap uppercase',
        TONE[status],
      )}
    >
      {m.status[status]}
    </span>
  );
}
