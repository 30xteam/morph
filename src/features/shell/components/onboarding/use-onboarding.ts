'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'morph.onboarding.done';
const IDLE_TIMEOUT_MS = 2000;

const subscribe = () => () => {};

function whenPageSettles(callback: () => void) {
  let idle = 0;
  const schedule = () => {
    idle =
      typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback(callback, { timeout: IDLE_TIMEOUT_MS })
        : window.setTimeout(callback, IDLE_TIMEOUT_MS / 4);
  };
  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, { once: true });
  return () => {
    window.removeEventListener('load', schedule);
    if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idle);
    window.clearTimeout(idle);
  };
}

function readSeen() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return true;
  }
}

export function useOnboarding() {
  const seen = useSyncExternalStore(subscribe, readSeen, () => true);
  const [ready, setReady] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => whenPageSettles(() => setReady(true)), []);

  const dismiss = () => setDismissed(true);

  const complete = () => {
    dismiss();
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      return;
    }
  };

  return { open: ready && !seen && !dismissed, dismiss, complete };
}
