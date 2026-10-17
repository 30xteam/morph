'use client';

import { cx } from '@/core/cx';

interface ListTabsProps<T extends string> {
  label: string;
  value: T;
  tabs: { value: T; label: string; count?: number }[];
  onChange: (value: T) => void;
}

export function ListTabs<T extends string>({ label, value, tabs, onChange }: ListTabsProps<T>) {
  return (
    <fieldset className="flex gap-4.5 overflow-x-auto px-5">
      <legend className="sr-only">{label}</legend>
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(tab.value)}
            className={cx(
              'flex min-h-11 shrink-0 flex-col justify-end gap-1.5 text-label-xs font-medium whitespace-nowrap text-ink-muted transition-colors duration-150 hover:text-ink desktop:min-h-0',
              active && 'font-semibold text-ink',
            )}
          >
            <span>
              {tab.label}
              {tab.count === undefined ? '' : ` ${tab.count}`}
            </span>
            <span aria-hidden="true" className={cx('h-0.5 w-full', active && 'bg-accent')} />
          </button>
        );
      })}
    </fieldset>
  );
}
