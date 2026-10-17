import Link from 'next/link';

import { cx } from '@/core/cx';

import { WORKSPACE_NAME } from '../mocks/dashboard.mock';
import { Icon } from './icon';
import { NAV_ITEMS } from './nav-items';

/** Below desktop the sidebar becomes a top bar with a scrollable tab row (no JS needed). */
export function PreviewMobileNav() {
  return (
    <header className="sticky top-0 z-sticky bg-surface-subtle desktop:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <span className="truncate text-label-sm text-fg-strong">{WORKSPACE_NAME}</span>
        <Link
          href="/"
          aria-label="Back to coming soon"
          className="grid size-11 place-items-center rounded-sm text-fg-icon hover:bg-state-hover hover:text-fg"
        >
          <Icon name="arrowLeft" />
        </Link>
      </div>
      <nav aria-label="Workspace" className="flex gap-1 overflow-x-auto px-3 pb-2">
        {NAV_ITEMS.map(({ label, icon, href, active }) => (
          <Link
            key={label}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cx(
              'flex h-11 shrink-0 items-center gap-2 rounded-sm px-3 text-body-sm text-fg-muted hover:bg-state-hover',
              active && 'bg-surface text-label-sm text-fg-strong',
            )}
          >
            <Icon name={icon} />
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
