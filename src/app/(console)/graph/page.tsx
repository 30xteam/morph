import type { Metadata } from 'next';

import { ProfileGraph } from '@/features/segmentation';

export const metadata: Metadata = { title: 'Graph' };

export default function GraphPage() {
  return <ProfileGraph />;
}
