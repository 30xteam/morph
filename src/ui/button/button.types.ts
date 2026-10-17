import type { ComponentProps } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps extends ComponentProps<'button'> {
  /** Visual style; resolved through a lookup in `button-variants.ts`. */
  variant?: ButtonVariant;
  /** Render the single child (e.g. `<Link>`) with button styles instead of a `<button>`. */
  asChild?: boolean;
}
