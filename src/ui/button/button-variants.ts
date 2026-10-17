import { cx } from '@/core/cx';

import type { ButtonVariant } from './button.types';

const BASE =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4.5 text-label-sm font-semibold whitespace-nowrap transition-colors duration-150 ease-out-strong select-none disabled:cursor-not-allowed disabled:opacity-60 desktop:min-h-10';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary hover:bg-primary-hover',
  secondary: 'border border-line-strong text-ink hover:bg-raised',
  ghost: 'font-medium text-ink-soft hover:bg-raised hover:text-ink',
};

export function buttonVariants(variant: ButtonVariant = 'primary', className?: string) {
  return cx(BASE, VARIANT_CLASSES[variant], className);
}
