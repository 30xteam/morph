'use client';

import { SegmentedControl } from '@/ui';

import { usePreferences } from './preferences-provider';
import { SoundToggle } from './sound-toggle';
import { usePreferenceMessages } from './use-preference-messages';

const LANGUAGES = [
  { value: 'en', label: 'EN' },
  { value: 'es', label: 'ES' },
] as const;

export function PreferenceToggles() {
  const m = usePreferenceMessages();
  const { locale, theme, setLocale, setTheme } = usePreferences();

  return (
    <div className="flex shrink-0 gap-2">
      <SegmentedControl
        label={m.language}
        value={locale}
        options={LANGUAGES}
        onChange={setLocale}
      />
      <SegmentedControl
        label={m.theme}
        value={theme}
        options={[
          { value: 'dark', label: m.dark },
          { value: 'light', label: m.light },
        ]}
        onChange={setTheme}
      />
      <SoundToggle />
    </div>
  );
}
