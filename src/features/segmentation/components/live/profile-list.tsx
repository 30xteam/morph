'use client';

import { cx } from '@/core/cx';
import { Button } from '@/ui';

import { useConsoleCounts } from '../../hooks/use-console-counts';
import { useMessages } from '../../hooks/use-messages';
import { useNow } from '../../hooks/use-now';
import { useVisibleProfiles } from '../../hooks/use-visible-profiles';
import { type ListTab, useSegmentationStore } from '../../store/segmentation-store';
import { DecideAll } from './decide-all';
import { LightFilter } from './light-filter';
import { ListTabs } from './list-tabs';
import { LiveSignUps } from './live-sign-ups';
import { ProfileRow } from './profile-row';
import { ProgramSelect } from './program-select';

export function ProfileList({ className, onOpen }: { className?: string; onOpen: () => void }) {
  const m = useMessages();
  const now = useNow();
  const rows = useVisibleProfiles();
  const counts = useConsoleCounts();
  const selectedId = useSegmentationStore((state) => state.selectedId);
  const pendingIds = useSegmentationStore((state) => state.pendingIds);
  const flagged = useSegmentationStore((state) => state.flagged);
  const tab = useSegmentationStore((state) => state.listTab);
  const setTab = useSegmentationStore((state) => state.setListTab);
  const select = useSegmentationStore((state) => state.select);
  const lights = useSegmentationStore((state) => state.lights);
  const clearLights = useSegmentationStore((state) => state.clearLights);

  const tabs: { value: ListTab; label: string; count?: number }[] = [
    { value: 'all', label: m.list.all, count: counts.total },
    { value: 'review', label: m.list.review, count: counts.review || undefined },
    { value: 'low_affinity', label: m.list.lowAffinity, count: counts.lowAffinity },
  ];

  return (
    <section
      aria-labelledby="list-heading"
      className={cx(
        'flex min-w-0 flex-col gap-3.5 border-line py-6 desktop:h-dvh desktop:w-list desktop:shrink-0 desktop:border-r',
        className,
      )}
    >
      <header className="flex flex-col gap-1 px-5">
        <h1 id="list-heading" className="text-title-md text-ink">
          {m.list.title}
        </h1>
        <p className="text-body-sm text-ink-soft">{m.list.subtitle}</p>
      </header>
      <DecideAll />
      <LiveSignUps />
      <section
        aria-label={m.list.filters}
        className="flex flex-col gap-5 border-y border-line bg-card px-5 py-5"
      >
        <ProgramSelect />
        <LightFilter />
      </section>
      <div className="flex min-h-8 items-center justify-between gap-3 px-5">
        <p className="text-body-sm text-ink-soft">{m.list.results(rows.length, counts.total)}</p>
        {lights.length ? (
          <Button variant="ghost" onClick={clearLights}>
            {m.list.clearFilters}
          </Button>
        ) : null}
      </div>
      <ListTabs label={m.list.tabs} value={tab} tabs={tabs} onChange={setTab} />
      <ul className="flex flex-col gap-0.5 overflow-y-auto px-3 pb-6">
        {rows.map(({ profile, outcome }) => (
          <ProfileRow
            key={profile.id}
            profile={profile}
            outcome={outcome}
            selected={profile.id === selectedId}
            pending={pendingIds.includes(profile.id)}
            flagged={flagged.includes(profile.id)}
            now={now}
            onSelect={() => {
              select(profile.id);
              onOpen();
            }}
          />
        ))}
      </ul>
      {rows.length ? null : <p className="px-5 text-body-md text-ink-muted">{m.list.empty}</p>}
    </section>
  );
}
