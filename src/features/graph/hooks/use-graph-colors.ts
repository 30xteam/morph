import { useSyncExternalStore } from 'react';

import type { GraphColorKey } from '../services/create-graph-renderer';

export type GraphColors = Record<GraphColorKey, string>;

const TOKENS = {
  'ink-muted': '--color-ink-muted',
  'ink-soft': '--color-ink-soft',
  accent: '--color-accent',
  'yellow-fg': '--color-yellow-fg',
  'green-fg': '--color-green-fg',
  'red-fg': '--color-red-fg',
  'blue-fg': '--color-blue-fg',
  'violet-fg': '--color-violet-fg',
  ink: '--color-ink',
  line: '--color-line-strong',
  font: '--font-sans',
} satisfies GraphColors;

let cached: { theme: string | null; colors: GraphColors } | undefined;

function readColors(): GraphColors {
  const theme = document.documentElement.getAttribute('data-theme');
  if (cached?.theme === theme) return cached.colors;
  const style = getComputedStyle(document.documentElement);
  const entries = Object.entries(TOKENS).map(([key, token]) => [
    key,
    style.getPropertyValue(token).trim(),
  ]);
  cached = { theme, colors: Object.fromEntries(entries) as GraphColors };
  return cached.colors;
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

export function useGraphColors(): GraphColors | undefined {
  return useSyncExternalStore(subscribe, readColors, () => undefined);
}
