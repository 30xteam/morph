import { cx } from '@/core/cx';

const SHAPE = 'animate-loader-pulse motion-reduce:animate-none';

/**
 * Morph mark whose three shapes pulse in sequence, with a visible status label.
 * @param label Text announced to screen readers and shown under the mark.
 */
export function MarkLoader({ label, className }: { label: string; className?: string }) {
  return (
    <output className={cx('flex flex-col items-center gap-3', className)}>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-10 text-accent">
        <circle cx="4.5" cy="12" r="3.5" fill="currentColor" className={SHAPE} />
        <rect
          x="9"
          y="8.5"
          width="7"
          height="7"
          rx="2.4"
          fill="currentColor"
          className={cx(SHAPE, '[animation-delay:150ms]')}
        />
        <rect
          x="17.5"
          y="8.5"
          width="6.5"
          height="7"
          rx="0.8"
          fill="currentColor"
          className={cx(SHAPE, '[animation-delay:300ms]')}
        />
      </svg>
      <span className="text-body-sm text-ink-muted">{label}</span>
    </output>
  );
}
