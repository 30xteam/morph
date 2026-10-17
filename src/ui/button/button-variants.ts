import { cx } from '@/core/cx';

import type { ButtonVariant } from './button.types';

const BASE =
  'inline-flex h-11 items-center justify-center gap-2 rounded-md px-3.75 text-label-md whitespace-nowrap transition-colors duration-150 ease-out-strong select-none disabled:cursor-not-allowed disabled:bg-disabled disabled:text-on-disabled desktop:h-9.5';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-active',
  secondary:
    'bg-secondary text-on-secondary hover:bg-secondary-hover active:bg-secondary-active active:text-on-secondary-active',
  ghost: 'text-body-md text-fg hover:bg-state-hover active:bg-state-pressed desktop:h-9',
};

export function buttonVariants(variant: ButtonVariant = 'primary', className?: string) {
  return cx(BASE, VARIANT_CLASSES[variant], className);
}
