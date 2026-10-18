'use client';

import { useSyncExternalStore } from 'react';

let desktopQuery: MediaQueryList | null = null;

function media() {
  if (!desktopQuery) {
    const width = getComputedStyle(document.documentElement)
      .getPropertyValue('--viewport-desktop')
      .trim();
    desktopQuery = window.matchMedia(`(min-width: ${width})`);
  }
  return desktopQuery;
}

function subscribe(onChange: () => void) {
  const list = media();
  list.addEventListener('change', onChange);
  return () => list.removeEventListener('change', onChange);
}

export function useIsDesktop() {
  return useSyncExternalStore(
    subscribe,
    () => media().matches,
    () => false,
  );
}
