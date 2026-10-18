import type { Metadata } from 'next';
import { Suspense } from 'react';

import { SITE } from '@/core/config/site';
import { DEFAULT_THEME, PreferencesScript } from '@/core/preferences';
import { AppProviders } from '@/core/providers/app-providers';
import { fontVariables } from '@/design/fonts';
import { TopLoader } from '@/ui';

import './globals.css';

export const metadata: Metadata = {
  title: { default: SITE.name, template: `%s · ${SITE.name}` },
  description: SITE.description,
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang={SITE.locale}
      data-theme={DEFAULT_THEME}
      className={fontVariables}
      suppressHydrationWarning
    >
      <head>
        <PreferencesScript />
      </head>
      <body className="flex min-h-dvh flex-col">
        <Suspense>
          <TopLoader />
        </Suspense>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
