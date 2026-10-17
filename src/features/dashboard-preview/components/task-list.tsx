'use client';

import { useState } from 'react';

import { cx } from '@/core/cx';

import { TASKS } from '../mocks/dashboard.mock';

export function TaskList() {
  const [done, setDone] = useState(() => new Set(TASKS.filter((t) => t.done).map((t) => t.id)));
  const remaining = TASKS.length - done.size;

  const toggle = (id: string) =>
    setDone((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <section
      id="tasks"
      aria-labelledby="tasks-heading"
      className="flex scroll-mt-32 flex-col gap-3"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="tasks-heading" className="text-title-md text-fg-strong">
          My tasks
        </h2>
        <span aria-live="polite" className="text-caption text-fg-muted tabular-nums">
          {remaining === 0 ? 'All done' : `${remaining} open`}
        </span>
      </div>
      <ul className="flex flex-col">
        {TASKS.map((task) => {
          const isDone = done.has(task.id);
          return (
            <li key={task.id}>
              <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-sm px-2 py-2.5 transition-colors duration-150 hover:bg-state-hover">
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => toggle(task.id)}
                  className="mt-0.5 size-4 shrink-0 cursor-pointer accent-primary"
                />
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span
                    className={cx(
                      'text-body-sm transition-colors duration-150',
                      isDone ? 'text-fg-muted line-through' : 'text-fg-strong',
                    )}
                  >
                    {task.title}
                  </span>
                  <span className="text-caption text-fg-muted">
                    {task.project} · {task.due}
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
