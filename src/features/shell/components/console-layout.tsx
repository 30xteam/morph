import 'server-only';
import type { ReactNode } from 'react';

import { PreferencesProvider } from '@/core/preferences';
import { getPreferences } from '@/core/preferences/server';
import { PROFILES_30X } from '@/libs/segmentation/server';

import { ConsoleShell } from './console-shell';

export async function ConsoleLayout({ children }: { children: ReactNode }) {
  const { locale, theme } = await getPreferences();

  return (
    <PreferencesProvider locale={locale} theme={theme}>
      <ConsoleShell profiles={PROFILES_30X}>{children}</ConsoleShell>
    </PreferencesProvider>
  );
}
