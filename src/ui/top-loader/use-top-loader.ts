import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { navigationHref, onNavigationStart, startNavigation } from './navigation-progress';

const TRICKLE_MS = 8000;
const FINISH_MS = 500;
const TRICKLE_TO = 'scaleX(0.9)';

function easing() {
  const value = getComputedStyle(document.documentElement).getPropertyValue(
    '--ds-motion-ease-out-strong',
  );
  return value.trim() || 'ease-out';
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Drives the top loader bar: grows while a page loads, fills and fades once the path changes.
 * Returns the ref for the bar element.
 */
export function useTopLoader() {
  const bar = useRef<HTMLDivElement>(null);
  const running = useRef<Animation>(undefined);
  const pathname = usePathname();
  const lastPathname = useRef(pathname);

  useEffect(() => {
    function start() {
      const element = bar.current;
      if (!element) return;
      running.current?.cancel();
      const still = prefersReducedMotion();
      running.current = element.animate(
        still
          ? [{ transform: 'scaleX(1)', opacity: 1 }]
          : [
              { transform: 'scaleX(0)', opacity: 1 },
              { transform: TRICKLE_TO, opacity: 1 },
            ],
        { duration: still ? 1 : TRICKLE_MS, easing: easing(), fill: 'forwards' },
      );
    }
    function onClick(event: MouseEvent) {
      const href = navigationHref(event);
      if (href) startNavigation(href);
    }
    const stop = onNavigationStart(start);
    document.addEventListener('click', onClick, { capture: true });
    return () => {
      stop();
      document.removeEventListener('click', onClick, { capture: true });
    };
  }, []);

  useEffect(() => {
    if (lastPathname.current === pathname) return;
    lastPathname.current = pathname;
    const element = bar.current;
    const current = running.current;
    if (!element || !current) return;
    const from = getComputedStyle(element).transform;
    current.cancel();
    running.current = undefined;
    element.animate(
      [
        { transform: from, opacity: 1 },
        { transform: 'scaleX(1)', opacity: 1, offset: 0.4 },
        { transform: 'scaleX(1)', opacity: 0 },
      ],
      { duration: FINISH_MS, easing: easing(), fill: 'none' },
    );
  }, [pathname]);

  return bar;
}
