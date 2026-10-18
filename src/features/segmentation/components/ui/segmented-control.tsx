'use client';

import { useId } from 'react';

import { cx } from '@/core/cx';

import { RadioOption } from './radio-option';

interface SegmentedControlProps<T extends string> {
  label: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: SegmentedControlProps<T>) {
  const name = useId();
  return (
    <fieldset className="flex gap-0.5 rounded-nav border border-line p-0.5">
      <legend className="sr-only">{label}</legend>
      {options.map((option) => (
        <RadioOption
          key={option.value}
          name={name}
          checked={option.value === value}
          onSelect={() => onChange(option.value)}
          className={cx(
            'flex min-h-11 items-center rounded-sm px-2.5 text-label-sm text-ink-muted transition-colors duration-150 hover:text-ink desktop:min-h-6 desktop:text-caption desktop:font-medium',
            option.value === value && 'bg-raised text-ink',
          )}
        >
          {option.label}
        </RadioOption>
      ))}
    </fieldset>
  );
}
