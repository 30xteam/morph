'use client';

import { useEffect, useRef } from 'react';

import { cx } from '@/core/cx';
import { useNow } from '@/core/hooks';
import { Button } from '@/ui';

import { useMessages } from '../../hooks/use-messages';
import { useSegmentProfile } from '../../hooks/use-segment-profile';
import { useSelectedProfile } from '../../hooks/use-selected-profile';
import { useSegmentationStore } from '../../store/segmentation-store';
import { DecisionCard } from './decision-card';
import { DetailActions } from './detail-actions';
import { DetailHeader } from './detail-header';
import { SegmentChangeCard } from './segment-change-card';
import { SignalsCard } from './signals-card';

interface ProfileDetailProps {
  className?: string;
  onBack: () => void;
}

export function ProfileDetail({ className, onBack }: ProfileDetailProps) {
  const m = useMessages();
  const now = useNow();
  const { selectedId } = useSelectedProfile();
  const profile = useSegmentationStore((state) =>
    state.profiles.find((item) => item.id === selectedId),
  );
  const history = useSegmentationStore((state) => state.history[selectedId ?? '']);
  const pending = useSegmentationStore((state) =>
    selectedId ? state.pendingIds.includes(selectedId) : false,
  );
  const { mutate } = useSegmentProfile();
  const requested = useRef(new Set<string>());
  const current = history?.at(-1);
  const previous = history?.at(-2);

  useEffect(() => {
    if (!profile || current || pending || requested.current.has(profile.id)) return;
    requested.current.add(profile.id);
    mutate({ profile, trigger: 're_run' });
  }, [profile, current, pending, mutate]);

  return (
    <section
      aria-label={m.detail.region}
      className={cx(
        'min-w-0 flex-col gap-4 overflow-y-auto px-4 py-6 tablet:px-8 desktop:h-dvh desktop:py-7',
        className,
      )}
    >
      <Button variant="ghost" onClick={onBack} className="w-fit px-2 desktop:hidden">
        {m.detail.back}
      </Button>
      <DetailHeader profile={profile} />
      {!profile ? <p className="text-body-md text-ink-muted">{m.detail.placeholder}</p> : null}
      {profile && !current ? (
        <p aria-live="polite" className="text-body-md text-ink-muted">
          {pending ? m.detail.deciding : m.detail.notDecided}
        </p>
      ) : null}
      {profile && current ? (
        <>
          <SegmentChangeCard previous={previous} current={current} now={now} />
          <DecisionCard outcome={current} />
          <SignalsCard profile={profile} />
          <DetailActions outcome={current} />
        </>
      ) : null}
    </section>
  );
}
