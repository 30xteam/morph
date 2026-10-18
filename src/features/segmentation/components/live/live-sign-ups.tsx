'use client';

import { useState } from 'react';

import { cx } from '@/core/cx';

import { useLiveSignUps } from '../../hooks/use-live-sign-ups';
import { useLumaReceived } from '../../hooks/use-luma-feed';
import { useMessages } from '../../hooks/use-messages';

const PILL =
  'inline-flex min-h-11 items-center gap-2 rounded-full border px-3.5 text-label-sm font-medium transition-colors duration-150 desktop:min-h-8';

export function LiveSignUps() {
  const m = useMessages();
  const signUps = useLiveSignUps();
  const received = useLumaReceived();
  const [since, setSince] = useState(0);
  const live = signUps.live;

  function toggle() {
    if (!live) setSince(received);
    signUps.toggle();
  }

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-5">
      <button
        type="button"
        aria-pressed={live}
        title={live ? m.list.livePause : undefined}
        onClick={toggle}
        className={cx(
          PILL,
          live
            ? 'border-accent bg-green-bg text-green-fg'
            : 'border-line-strong bg-raised text-ink hover:bg-selected',
        )}
      >
        <span aria-hidden="true" className="relative size-2">
          <span
            className={cx('absolute inset-0 rounded-full', live ? 'bg-accent' : 'bg-ink-muted')}
          />
          {live ? (
            <span className="absolute inset-0 rounded-full bg-accent motion-safe:animate-live-ping" />
          ) : null}
        </span>
        {live ? m.list.liveOn : m.list.liveOff}
        {live ? (
          <span className="rounded-full bg-primary px-1.5 text-badge text-on-primary tabular-nums">
            {Math.max(received - since, 0)}
          </span>
        ) : null}
      </button>
      <p aria-live="polite" className="text-caption text-ink-muted tabular-nums">
        {m.list.liveHint(received)}
      </p>
    </div>
  );
}
