import type { Metadata } from 'next';

import { MetricsOverview } from '@/features/metrics';

export const metadata: Metadata = { title: 'Metrics' };

export default function MetricsPage() {
  return <MetricsOverview />;
}
