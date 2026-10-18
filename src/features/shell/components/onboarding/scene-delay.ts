import type { CSSProperties } from 'react';

export function sceneDelay(ms: number): CSSProperties {
  return { animationDelay: `${ms}ms` };
}
