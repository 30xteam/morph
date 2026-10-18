'use client';

import type { Ref } from 'react';

import { cx } from '@/core/cx';
import { usePreferences } from '@/core/preferences';
import { Button } from '@/ui';

import { useMessages } from '../../hooks/use-messages';
import type { ReviewItem } from '../../hooks/use-review-items';
import { countryName } from '../../i18n/values';
import type { ProgramKey } from '../../types/segmentation.types';
import { roleKey } from '../../utils/role-key';
import { SignalsCard } from '../detail/signals-card';
import { PreferenceToggles } from '../preference-toggles';
import { DecisionPanel } from './decision-panel';
import { WhyPanel } from './why-panel';

interface ReviewDetailProps {
  item: ReviewItem | undefined;
  className?: string;
  titleRef: Ref<HTMLHeadingElement>;
  choice: ProgramKey | undefined;
  onBack: () => void;
  onChoose: (program: ProgramKey) => void;
  onConfirm: () => void;
  onSkip: () => void;
}

export function ReviewDetail({
  item,
  className,
  titleRef,
  choice,
  onBack,
  onChoose,
  onConfirm,
  onSkip,
}: ReviewDetailProps) {
  const m = useMessages();
  const { locale } = usePreferences();
  const profile = item?.profile;

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
      <header className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <h2 ref={titleRef} tabIndex={-1} className="text-title-lg text-ink">
            {profile ? m.roles[roleKey(profile)] : ''}
          </h2>
          <p className="text-body-md text-ink-soft">
            {profile
              ? [
                  profile.alias,
                  countryName(profile.country, locale),
                  profile.relation === 'deal' ? m.detail.deal : m.detail.lead,
                ]
                  .filter(Boolean)
                  .join(' · ')
              : ''}
          </p>
        </div>
        <div className="hidden desktop:block">
          <PreferenceToggles />
        </div>
      </header>
      {item ? (
        <>
          <WhyPanel item={item} />
          <SignalsCard profile={item.profile} flagMissing />
          {choice ? (
            <DecisionPanel
              item={item}
              choice={choice}
              onChoose={onChoose}
              onConfirm={onConfirm}
              onSkip={onSkip}
            />
          ) : null}
        </>
      ) : (
        <p className="text-body-md text-ink-muted">{m.review.empty}</p>
      )}
    </section>
  );
}
