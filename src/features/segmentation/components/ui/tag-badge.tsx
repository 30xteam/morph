import type { ReactNode } from 'react';

import { cx } from '@/core/cx';

const TONE = {
  warning: 'bg-yellow-bg text-yellow-fg',
  neutral: 'bg-review-bg text-review-fg',
} as const;

interface TagBadgeProps {
  tone?: keyof typeof TONE;
  children: ReactNode;
}

export function TagBadge({ tone = 'neutral', children }: TagBadgeProps) {
  return (
    <span
      className={cx(
        'inline-flex w-fit items-center rounded-sm px-2 py-0.75 text-badge whitespace-nowrap uppercase',
        TONE[tone],
      )}
    >
      {children}
    </span>
  );
}
