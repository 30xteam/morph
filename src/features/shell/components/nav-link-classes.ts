import { cx } from '@/core/cx';

export function navItemClasses(active: boolean) {
  return cx(
    'flex min-h-11 w-full items-center gap-2 rounded-nav px-2.5 text-left text-label-sm text-ink-soft transition-colors duration-150 hover:bg-raised hover:text-ink desktop:min-h-8',
    active && 'bg-raised font-semibold text-ink',
  );
}
