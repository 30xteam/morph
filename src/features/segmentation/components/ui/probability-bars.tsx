import { cx } from '@/core/cx';

interface Bar {
  key: string;
  label: string;
  probability: number;
}

export function ProbabilityBars({ bars, label }: { bars: Bar[]; label: string }) {
  return (
    <ul aria-label={label} className="flex flex-col gap-2.25">
      {bars.map((bar, index) => {
        const top = index === 0;
        const percent = Math.round(bar.probability * 100);
        return (
          <li
            key={bar.key}
            className="grid grid-cols-[minmax(6rem,7.5rem)_1fr_2.5rem] items-center gap-3"
          >
            <span className={cx('text-body-sm', top ? 'font-medium text-ink' : 'text-ink-soft')}>
              {bar.label}
            </span>
            <span className="h-1 overflow-hidden rounded-xs bg-line">
              <span
                className={cx('block h-full', top ? 'bg-bar-strong' : 'bg-bar-weak')}
                style={{ width: `${percent}%` }}
              />
            </span>
            <span
              className={cx(
                'text-body-sm tabular-nums',
                top ? 'font-semibold text-ink' : 'text-ink-muted',
              )}
            >
              {percent}%
            </span>
          </li>
        );
      })}
    </ul>
  );
}
