'use client';

import { useTopLoader } from './use-top-loader';

/**
 * Thin accent bar at the top of the viewport shown while the next page loads.
 * Render it once, inside a `<Suspense>` boundary, in the root layout.
 */
export function TopLoader() {
  const bar = useTopLoader();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-sticky-high h-0.5"
    >
      <div ref={bar} className="h-full origin-left bg-accent opacity-0" />
    </div>
  );
}
