import type { Metadata } from 'next';

import { DashboardPreview } from '@/features/dashboard-preview';

export const metadata: Metadata = {
  title: 'Dashboard preview',
  robots: { index: false, follow: false },
};

export default function PreviewPage() {
  return <DashboardPreview />;
}
