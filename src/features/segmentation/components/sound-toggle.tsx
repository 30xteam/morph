'use client';

import { useSoundOn } from '@/ui';

import { useMessages } from '../hooks/use-messages';

export function SoundToggle() {
  const m = useMessages();
  const [on, setOn] = useSoundOn();
  const label = on ? m.preferences.soundOn : m.preferences.soundOff;

  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={label}
      title={label}
      onClick={() => setOn(!on)}
      className="flex min-h-11 min-w-11 items-center justify-center rounded-nav border border-line text-ink-muted transition-colors duration-150 hover:text-ink aria-pressed:text-ink-soft desktop:min-h-7 desktop:min-w-7"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4"
      >
        <path d="M11 5 6 9H3v6h3l5 4z" />
        {on ? (
          <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
        ) : (
          <path d="m22 9-6 6M16 9l6 6" />
        )}
      </svg>
    </button>
  );
}
