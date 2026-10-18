'use client';

import { useMessages } from '../../hooks/use-messages';
import { sceneDelay } from './scene-delay';

export function SceneSignup() {
  const m = useMessages();
  const copy = m.onboarding.signup;
  return (
    <div className="flex w-full max-w-72 flex-col gap-3">
      <div className="flex flex-col gap-1.5 rounded-md border border-line bg-card p-3.5 motion-safe:animate-slide-in">
        <span className="text-caption text-ink-muted">{copy.event}</span>
        <span className="text-label-md text-ink">{m.roles.sales_leader}</span>
        <span className="text-body-sm text-ink-soft">{copy.country}</span>
        <span
          className="mt-1 flex items-center gap-2 text-caption text-ink-muted motion-safe:animate-enter"
          style={sceneDelay(500)}
        >
          <span className="h-2 w-14 rounded-xs bg-line-strong" />
          {copy.hidden}
        </span>
      </div>
      <span
        className="w-fit self-end rounded-sm bg-green-bg px-2 py-0.75 text-badge text-green-fg uppercase motion-safe:animate-pop"
        style={sceneDelay(1000)}
      >
        {copy.toJev}
      </span>
    </div>
  );
}
