import { Suspense } from 'react';

import { LumaFeedSync } from '@/features/luma';
import { ConsoleLayout } from '@/features/segmentation/server';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <Suspense>
      <ConsoleLayout>
        <LumaFeedSync />
        {children}
      </ConsoleLayout>
    </Suspense>
  );
}
