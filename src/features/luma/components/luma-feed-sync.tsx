'use client';

import { useLumaFeed } from '../hooks/use-luma-feed';

export function LumaFeedSync() {
  useLumaFeed();
  return null;
}
