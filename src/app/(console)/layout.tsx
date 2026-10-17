import { Suspense } from 'react';

import { ConsoleLayout } from '@/features/segmentation/server';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <Suspense>
      <ConsoleLayout>{children}</ConsoleLayout>
    </Suspense>
  );
}
