import type { Metadata } from 'next';

import { SITE } from '@/core/config/site';
import { AppProviders } from '@/core/providers/app-providers';
import { fontVariables } from '@/design/fonts';

import './globals.css';

export const metadata: Metadata = {
  title: { default: SITE.name, template: `%s · ${SITE.name}` },
  description: SITE.description,
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang={SITE.locale} className={fontVariables}>
      <body className="flex min-h-dvh flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
