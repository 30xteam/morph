'use client';

import { cx } from '@/core/cx';
import { useNow } from '@/core/hooks';
import { Button } from '@/ui';

import { useConsoleCounts } from '../../hooks/use-console-counts';
import { useLiveFilters } from '../../hooks/use-live-filters';
import { useMessages } from '../../hooks/use-messages';
import { useSelectedProfile } from '../../hooks/use-selected-profile';
import { useVisibleProfiles } from '../../hooks/use-visible-profiles';
import { useSegmentationStore } from '../../store/segmentation-store';
import { DecideAll } from './decide-all';
import { LightFilter } from './light-filter';
import { LowAffinityToggle } from './low-affinity-toggle';
import { ProfileRow } from './profile-row';
import { ProgramSelect } from './program-select';

export function ProfileList({ className, onOpen }: { className?: string; onOpen: () => void }) {
  const m = useMessages();
  const now = useNow();
  const rows = useVisibleProfiles();
  const counts = useConsoleCounts();
  const { selectedId, select } = useSelectedProfile();
  const pendingIds = useSegmentationStore((state) => state.pendingIds);
  const flagged = useSegmentationStore((state) => state.flagged);
  const { lights, lowAffinityOnly, clearFilters } = useLiveFilters();

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
      <section
        aria-label={m.list.filters}
        className="flex flex-col gap-5 border-y border-line bg-card px-5 py-5"
      >
        <ProgramSelect />
        <LightFilter />
        <LowAffinityToggle />
      </section>
      <div className="flex min-h-8 items-center justify-between gap-3 px-5">
        <p className="text-body-sm text-ink-soft">{m.list.results(rows.length, counts.total)}</p>
        {lights.length || lowAffinityOnly ? (
          <Button variant="ghost" onClick={clearFilters}>
            {m.list.clearFilters}
          </Button>
        ) : null}
      </div>
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
      {rows.length ? null : (
        <p className="px-5 text-body-md text-ink-muted">
          {lights.length || lowAffinityOnly ? m.list.noMatches : m.list.empty}
        </p>
      )}
    </section>
  );
}
