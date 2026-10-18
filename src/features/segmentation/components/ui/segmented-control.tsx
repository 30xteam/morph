'use client';

import { cx } from '@/core/cx';

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
  return (
    <fieldset className="flex gap-0.5 rounded-nav border border-line p-0.5">
      <legend className="sr-only">{label}</legend>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className={cx(
            'min-h-11 rounded-sm px-2.5 text-label-sm text-ink-muted transition-colors duration-150 hover:text-ink desktop:min-h-6 desktop:py-1 desktop:text-caption desktop:font-medium',
            option.value === value && 'bg-raised text-ink',
          )}
        >
          {option.label}
        </button>
      ))}
    </fieldset>
  );
}
