import { cx } from '@/core/cx';

const MARK_PATH = 'M12 3h6a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-6a9 9 0 0 1 0-18z';

export function MorphMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={cx('size-6 shrink-0', className)}>
      <path d={MARK_PATH} fill="currentColor" />
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
