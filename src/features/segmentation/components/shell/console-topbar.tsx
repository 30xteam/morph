'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cx } from '@/core/cx';

import { useMessages } from '../../hooks/use-messages';
import { PreferenceToggles } from '../preference-toggles';

const LINKS = [
  { href: '/', key: 'allProfiles' },
  { href: '/review', key: 'review' },
  { href: '/metrics', key: 'metrics' },
  { href: '/graph', key: 'graph' },
] as const;

export function ConsoleTopbar() {
  const m = useMessages();
  const pathname = usePathname();

  return (
    <header className="flex flex-col gap-2 border-b border-line px-4 pt-4 desktop:hidden">
      <div className="flex items-center justify-between gap-3">
        <p className="text-logo text-ink">30X</p>
        <PreferenceToggles />
      </div>
      <nav aria-label={m.nav.label} className="-mx-4 flex gap-1 overflow-x-auto px-4">
        {LINKS.map(({ href, key }) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname === href ? 'page' : undefined}
            className={cx(
              'flex min-h-11 shrink-0 items-center border-b-2 border-transparent px-2 text-label-sm text-ink-muted',
              pathname === href && 'border-accent font-semibold text-ink',
            )}
          >
            {m.nav[key]}
          </Link>
        ))}
      </nav>
    </header>
  );
}
