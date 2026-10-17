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
        'display-xl',
        'display-lg',
        'headline-lg',
        'headline-md',
        'headline-sm',
        'title-lg',
        'title-md',
        'body-md',
        'label-md',
        'body-sm',
        'label-sm',
        'caption',
      ],
      radius: ['sm', 'md', 'input', 'input-lg'],
      shadow: ['nav', 'dropdown', 'modal', 'elevated', 'search'],
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
