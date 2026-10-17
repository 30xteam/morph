import { cx } from '@/core/cx';

export function MorphMark({ className, size }: { className?: string; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cx('size-6 shrink-0', className)}
    >
      <circle cx="4.5" cy="12" r="3.5" fill="currentColor" opacity="0.45" />
      <rect x="9" y="8.5" width="7" height="7" rx="2.4" fill="currentColor" opacity="0.72" />
      <rect x="17.5" y="8.5" width="6.5" height="7" rx="0.8" fill="currentColor" />
    </svg>
  );
}

export function MorphLogo({ className }: { className?: string }) {
  return (
    <span className={cx('flex items-center gap-2 text-logo text-ink', className)}>
      <MorphMark className="text-accent" />
      Morph
    </span>
  );
}
