'use client';

import { useLiveSignUps } from '../../hooks/use-live-sign-ups';
import { useLumaReceived } from '../../hooks/use-luma-feed';
import { useMessages } from '../../hooks/use-messages';

export function LiveSignUps() {
  const m = useMessages();
  const signUps = useLiveSignUps();
  const received = useLumaReceived();

  return (
    <div className="flex flex-wrap items-center gap-x-3 px-5">
      <button
        type="button"
        aria-pressed={signUps.live}
        onClick={signUps.toggle}
        className="flex min-h-11 items-center gap-2 text-label-sm text-ink-soft hover:text-ink desktop:min-h-6"
      >
        <span
          aria-hidden="true"
          className={
            signUps.live ? 'size-2 rounded-full bg-accent' : 'size-2 rounded-full bg-line-strong'
          }
        />
        {signUps.live ? m.list.liveOn : m.list.liveOff}
      </button>
      <p className="text-caption text-ink-muted tabular-nums">{m.list.liveHint(received)}</p>
    </div>
  );
}
