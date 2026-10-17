'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useConsoleCounts } from '../../hooks/use-console-counts';
import { useMessages } from '../../hooks/use-messages';
import { type ProgramFilter, useSegmentationStore } from '../../store/segmentation-store';
import { navItemClasses } from './nav-link-classes';
import { PROGRAM_ORDER } from './program-order';

const WORKFLOW = [
  { href: '/review', key: 'review' },
  { href: '/metrics', key: 'metrics' },
  { href: '/graph', key: 'graph' },
] as const;

export function ConsoleSidebar() {
  const m = useMessages();
  const pathname = usePathname();
  const router = useRouter();
  const counts = useConsoleCounts();
  const program = useSegmentationStore((state) => state.program);
  const setProgram = useSegmentationStore((state) => state.setProgram);

  const segments: { value: ProgramFilter; label: string; count: number }[] = [
    { value: 'all', label: m.nav.allProfiles, count: counts.total },
    ...PROGRAM_ORDER.map((key) => ({
      value: key,
      label: m.programs[key],
      count: counts.programs[key],
    })),
  ];

  const openSegment = (value: ProgramFilter) => {
    setProgram(value);
    if (pathname !== '/') router.push('/');
  };

  return (
    <aside className="sticky top-0 hidden h-dvh w-sidebar shrink-0 flex-col gap-0.5 overflow-y-auto border-r border-line px-3 py-6 desktop:flex">
      <p className="px-2.5 pb-5 text-logo text-ink">30X</p>
      <nav aria-label={m.nav.label} className="flex flex-1 flex-col gap-0.5">
        <h2 className="px-2.5 pb-1.5 text-caption font-medium text-ink-muted">{m.nav.segments}</h2>
        {segments.map(({ value, label, count }) => (
          <button
            key={value}
            type="button"
            aria-current={pathname === '/' && program === value ? 'true' : undefined}
            onClick={() => openSegment(value)}
            className={navItemClasses(pathname === '/' && program === value)}
          >
            <span className="flex-1 truncate">{label}</span>
            <span className="text-body-sm font-normal text-ink-muted tabular-nums">{count}</span>
          </button>
        ))}
        <h2 className="mt-auto px-2.5 pt-6 pb-1.5 text-caption font-medium text-ink-muted desktop:mt-25">
          {m.nav.workflow}
        </h2>
        {WORKFLOW.map(({ href, key }) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname === href ? 'page' : undefined}
            className={navItemClasses(pathname === href)}
          >
            <span className="flex-1">{m.nav[key]}</span>
            {key === 'review' && counts.review ? (
              <span className="text-body-sm font-normal text-ink-muted tabular-nums">
                {counts.review}
              </span>
            ) : null}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
