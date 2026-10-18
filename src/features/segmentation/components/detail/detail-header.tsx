'use client';

import { usePreferences } from '@/core/preferences';
import { PreferenceToggles } from '@/core/preferences';
import { countryName, type Profile } from '@/libs/segmentation';

import { useMessages } from '../../hooks/use-messages';
import { roleKey } from '../../utils/role-key';

export function DetailHeader({ profile }: { profile: Profile | undefined }) {
  const m = useMessages();
  const { locale } = usePreferences();
  const meta = profile
    ? [
        profile.alias,
        countryName(profile.country, locale),
        profile.relation === 'deal' ? m.detail.deal : m.detail.lead,
      ]
        .filter(Boolean)
        .join(' · ')
    : '';

  return (
    <header className="flex items-start justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-1">
        <h2 className="text-title-lg text-ink">{profile ? m.roles[roleKey(profile)] : ''}</h2>
        <p className="text-body-md text-ink-soft">{meta}</p>
      </div>
      <div className="hidden desktop:block">
        <PreferenceToggles />
      </div>
    </header>
  );
}
