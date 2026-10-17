import type { Metadata } from 'next';

import { SegmentationDashboard } from '@/features/segmentation';

export const metadata: Metadata = {
  title: 'Live segments',
};

export default function SegmentationPage() {
  return <SegmentationDashboard />;
}
