'use client';

import { usePreferences } from '@/core/preferences';

import { useMessages } from '../hooks/use-messages';
import { SegmentedControl } from './ui/segmented-control';

const LANGUAGES = [
  { value: 'en', label: 'EN' },
  { value: 'es', label: 'ES' },
] as const;

export function PreferenceToggles() {
  const m = useMessages();
  const { locale, theme, setLocale, setTheme } = usePreferences();

  return (
    <div className="flex shrink-0 gap-2">
      <SegmentedControl
        label={m.preferences.language}
        value={locale}
        options={LANGUAGES}
        onChange={setLocale}
      />
      <SegmentedControl
        label={m.preferences.theme}
        value={theme}
        options={[
          { value: 'dark', label: m.preferences.dark },
          { value: 'light', label: m.preferences.light },
        ]}
        onChange={setTheme}
      />
    </div>
  );
}
