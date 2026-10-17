import type { Metadata } from 'next';

import { MetricsOverview } from '@/features/segmentation';

export const metadata: Metadata = { title: 'Metrics' };

export default function MetricsPage() {
  return <MetricsOverview />;
}
