import type { ReactNode } from 'react';

import { cx } from '@/core/cx';

interface RadioOptionProps {
  name: string;
  checked: boolean;
  onSelect: () => void;
  className?: string;
  children: ReactNode;
}

export function RadioOption({ name, checked, onSelect, className, children }: RadioOptionProps) {
  return (
    <label
      className={cx(
        'cursor-pointer has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent',
        className,
      )}
    >
      <input type="radio" name={name} checked={checked} onChange={onSelect} className="sr-only" />
      {children}
    </label>
  );
}
