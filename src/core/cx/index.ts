import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * Custom theme keys must be registered, otherwise tailwind-merge reads `text-display-xl`
 * as a text color and drops it when combined with `text-fg`. Keep in sync with theme.css.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        'logo',
        'title-lg',
        'title-md',
        'title-sm',
        'label-lg',
        'body-lg',
        'label-md',
        'body-md',
        'label-sm',
        'body-sm',
        'label-xs',
        'caption',
        'badge',
      ],
      radius: ['xs', 'sm', 'nav', 'md', 'lg', 'full'],
      shadow: ['raised', 'modal'],
    },
    classGroups: {
      z: [
        {
          z: [
            'base',
            'raised',
            'floating',
            'popover',
            'dropdown',
            'sticky',
            'sticky-high',
            'modal',
          ],
        },
      ],
    },
  },
});

export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
