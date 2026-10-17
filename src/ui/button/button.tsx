import { Slot } from '@radix-ui/react-slot';

import { buttonVariants } from './button-variants';
import type { ButtonProps } from './button.types';

/**
 * `<Button asChild variant="primary"><Link href="/x">Label</Link></Button>` renders the link
 * with button styles, so actions and navigations share one visual vocabulary.
 */
export function Button({
  variant = 'primary',
  asChild = false,
  className,
  type,
  ...props
}: ButtonProps) {
  if (asChild) return <Slot className={buttonVariants(variant, className)} {...props} />;
  return (
    <button type={type ?? 'button'} className={buttonVariants(variant, className)} {...props} />
  );
}
