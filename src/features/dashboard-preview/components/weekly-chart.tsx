import { cx } from '@/core/cx';

import { LAST_WEEK_TOTAL, WEEK } from '../mocks/dashboard.mock';

const CHART_HEIGHT = 120;

export function WeeklyChart() {
  const total = WEEK.reduce((sum, { completed }) => sum + completed, 0);
  const max = Math.max(...WEEK.map(({ completed }) => completed), 1);
  const delta = total - LAST_WEEK_TOTAL;
  const lastIndex = WEEK.length - 1;

  return (
    <section aria-labelledby="week-heading" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 id="week-heading" className="text-title-md text-fg-strong">
          This week
        </h2>
        <p className="text-body-md text-fg-muted">
          <span className="text-label-md text-fg-strong">{total} tasks completed</span>,{' '}
          {delta >= 0 ? `${delta} more` : `${Math.abs(delta)} fewer`} than last week.
        </p>
      </div>

      <ol
        aria-label="Tasks completed per day"
        className="grid grid-cols-7 items-end gap-2 rounded-md bg-surface-subtle p-4 tablet:gap-4"
      >
        {WEEK.map(({ day, completed }, index) => {
          const isToday = index === lastIndex;
          const height = Math.max((completed / max) * CHART_HEIGHT, 2);
          return (
            <li key={day} className="flex flex-col items-center gap-2">
              <span className="text-caption text-fg-muted tabular-nums">{completed}</span>
              <span
                aria-hidden="true"
                className={cx(
                  'w-full max-w-10 rounded-sm',
                  isToday ? 'bg-fg-strong' : 'bg-fg-subtle',
                )}
                style={{ height }}
              />
              <span className={cx('text-caption', isToday ? 'text-fg-strong' : 'text-fg-muted')}>
                <span className="sr-only">{`${completed} tasks on `}</span>
                {isToday ? 'Today' : day}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
