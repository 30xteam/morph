import type { ReactNode } from 'react';

import { cx } from '@/core/cx';

interface PanelProps {
  title: string;
  aside?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Panel({ title, aside, className, children }: PanelProps) {
  return (
    <section
      aria-label={title}
      className={cx(
        'flex w-full flex-col gap-3 rounded-lg border border-line bg-card px-5 py-4.5',
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-label-xs text-ink-soft">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}
