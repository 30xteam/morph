import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { SegmentationService } from '../services/segmentation.service';
import { useSegmentationStore } from '../store/segmentation-store';

const POLL_MS = 1500;
const LUMA_FEED_KEY = ['segmentation', 'luma-feed'];

export function useLumaFeed() {
  const addProfile = useSegmentationStore((state) => state.addProfile);
  const saveOutcome = useSegmentationStore((state) => state.saveOutcome);
  const cursor = useRef(0);

  const query = useQuery({
    queryKey: LUMA_FEED_KEY,
    queryFn: () => SegmentationService.lumaFeed(cursor.current),
    refetchInterval: POLL_MS,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (!query.data) return;
    for (const entry of query.data.entries) {
      if (entry.seq <= cursor.current) continue;
      addProfile(entry.profile);
      saveOutcome(entry.outcome);
      cursor.current = entry.seq;
    }
  }, [query.data, addProfile, saveOutcome]);

  return query;
}

export function useLumaReceived() {
  const query = useQuery({
    queryKey: LUMA_FEED_KEY,
    queryFn: () => SegmentationService.lumaFeed(0),
    enabled: false,
  });
  return query.data?.received ?? 0;
}
