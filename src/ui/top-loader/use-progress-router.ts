'use client';

import { useRouter } from 'next/navigation';

import { startNavigation } from './navigation-progress';

/**
 * `useRouter` whose `push` also starts the top loader.
 */
export function useProgressRouter() {
  const router = useRouter();
  return {
    ...router,
    push: (href: string) => {
      startNavigation(href);
      router.push(href);
    },
  };
}
