'use client';

import { useSyncExternalStore } from 'react';

import { isSoundOn, setSoundOn, subscribeSound } from './sound-settings';

/**
 * Reads and toggles the interface sound preference.
 * @returns `[on, setOn]`; the server render assumes sound is on.
 */
export function useSoundOn() {
  const on = useSyncExternalStore(subscribeSound, isSoundOn, () => true);
  return [on, setSoundOn] as const;
}
