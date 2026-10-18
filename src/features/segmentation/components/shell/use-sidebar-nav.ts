'use client';

import { usePathname } from 'next/navigation';

import {
  liveHref,
  useConsoleCounts,
  useLiveFilters,
  type ProgramFilter,
  PROGRAM_ORDER,
} from '@/libs/segmentation';
import { useProgressRouter } from '@/ui';

import { useMessages } from '../../hooks/use-messages';
import type { NavIconName } from './nav-icon';

const WORKFLOW = [
  { href: '/review', key: 'review' },
  { href: '/metrics', key: 'metrics' },
  { href: '/graph', key: 'graph' },
] as const satisfies readonly { href: string; key: NavIconName }[];

export interface SegmentLink {
  value: ProgramFilter;
  label: string;
  count: number;
  active: boolean;
}

export interface WorkflowLink {
  href: string;
  icon: NavIconName;
  label: string;
  count: number | null;
  active: boolean;
}

export function useSidebarNav() {
  const m = useMessages();
  const pathname = usePathname();
  const router = useProgressRouter();
  const counts = useConsoleCounts();
  const { program, setProgram } = useLiveFilters();

  const isActive = (value: ProgramFilter) => pathname === '/' && program === value;
  const segments: SegmentLink[] = [
    { value: 'all', label: m.nav.allProfiles, count: counts.total, active: isActive('all') },
    ...PROGRAM_ORDER.map((key) => ({
      value: key,
      label: m.programs[key],
      count: counts.programs[key],
      active: isActive(key),
    })),
  ];

  const workflow: WorkflowLink[] = WORKFLOW.map(({ href, key }) => ({
    href,
    icon: key,
    label: m.nav[key],
    count: key === 'review' && counts.review ? counts.review : null,
    active: pathname === href,
  }));

  const openSegment = (value: ProgramFilter) => {
    if (pathname === '/') setProgram(value);
    else router.push(liveHref('/', { program: value }));
  };

  return { segments, workflow, openSegment };
}
