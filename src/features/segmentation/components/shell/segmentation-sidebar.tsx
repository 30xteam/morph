import Link from 'next/link';

import { cx } from '@/core/cx';

import { Icon } from './icon';
import { NAV_ITEMS, WORKSPACE_NAME } from './nav-items';

export function SegmentationSidebar() {
  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col gap-6 bg-surface-subtle px-3 py-4 desktop:flex">
      <div className="flex items-center gap-2 px-2">
        <span className="grid size-6 place-items-center rounded-sm bg-fg-strong text-caption text-surface">
          J
        </span>
        <span className="truncate text-label-sm text-fg-strong">{WORKSPACE_NAME}</span>
      </div>

      <nav aria-label="Workspace" className="flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ label, icon, href, active }) => (
          <Link
            key={label}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cx(
              'flex h-8 items-center gap-2.5 rounded-sm px-2 text-body-sm text-fg-muted transition-colors duration-150 hover:bg-state-hover hover:text-fg-strong',
              active && 'bg-state-hover text-label-sm text-fg-strong',
            )}
          >
            <Icon name={icon} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
