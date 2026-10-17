import { cx } from '@/core/cx';

import type { ProjectStatus } from '../types/dashboard.types';

const STATUS: Record<ProjectStatus, { label: string; dot: string }> = {
  'on-track': { label: 'On track', dot: 'bg-success' },
  'at-risk': { label: 'At risk', dot: 'bg-warning' },
  blocked: { label: 'Blocked', dot: 'bg-danger' },
  done: { label: 'Done', dot: 'bg-fg-subtle' },
};

/** The accent lives in the dot; the label stays ink so it passes contrast at caption size. */
export function StatusBadge({ status }: { status: ProjectStatus }) {
  const { label, dot } = STATUS[status];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-2 py-0.5 text-caption whitespace-nowrap text-fg-soft">
      <span aria-hidden="true" className={cx('size-1.5 rounded-full', dot)} />
      {label}
    </span>
  );
}
