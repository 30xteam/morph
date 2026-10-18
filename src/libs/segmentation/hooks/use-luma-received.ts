import { useQuery } from '@tanstack/react-query';

import { SegmentationService } from '../services/segmentation.service';

export const LUMA_FEED_KEY = ['segmentation', 'luma-feed'];

export function useLumaReceived() {
  const query = useQuery({
    queryKey: LUMA_FEED_KEY,
    queryFn: () => SegmentationService.lumaFeed(0),
    enabled: false,
  });
  return query.data?.received ?? 0;
}
