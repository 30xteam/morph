'use client';

import { usePathname } from 'next/navigation';

import { useProgressRouter } from '@/ui';

import { useConsoleCounts } from '../../hooks/use-console-counts';
import { useMessages } from '../../hooks/use-messages';
import { type ProgramFilter, useSegmentationStore } from '../../store/segmentation-store';
import type { NavIconName } from './nav-icon';
import { PROGRAM_ORDER } from './program-order';

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
  const program = useSegmentationStore((state) => state.program);
  const setProgram = useSegmentationStore((state) => state.setProgram);

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
    setProgram(value);
    if (pathname !== '/') router.push('/');
  };

  return { segments, workflow, openSegment };
}
