import type { Metadata } from 'next';

import { ReviewQueue } from '@/features/segmentation';

export const metadata: Metadata = { title: 'Review queue' };

export default function ReviewPage() {
  return <ReviewQueue />;
}
