'use client';

import { MorphLogo } from '@/ui';

import { useMessages } from '../hooks/use-messages';
import { SectionLabel, SegmentList, WorkflowList } from './sidebar-lists';
import { useSidebarNav } from './use-sidebar-nav';

export function ConsoleSidebar() {
  const m = useMessages();
  const { segments, workflow, openSegment } = useSidebarNav();

  return (
    <aside className="sticky top-0 hidden h-dvh w-sidebar shrink-0 flex-col overflow-y-auto border-r border-line px-3 py-6 desktop:flex">
      <MorphLogo className="px-2.5 pb-5" />
      <nav aria-label={m.nav.label} className="flex flex-col gap-0.5">
        <SectionLabel id="nav-segments">{m.nav.segments}</SectionLabel>
        <SegmentList segments={segments} onOpen={openSegment} />
        <div className="h-4" />
        <SectionLabel id="nav-workflow">{m.nav.workflow}</SectionLabel>
        <WorkflowList workflow={workflow} />
      </nav>
    </aside>
  );
}
