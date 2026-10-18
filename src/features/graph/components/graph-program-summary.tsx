'use client';

import { cx } from '@/core/cx';
import { PRIORITY_LEVELS, type PriorityLevel } from '@/libs/segmentation';

import { useMessages } from '../hooks/use-messages';
import type { ProgramSummary } from '../services/graph-summary';

const BAR: Record<PriorityLevel, string> = {
  high: 'bg-green-fg',
  medium: 'bg-yellow-fg',
  low: 'bg-red-fg',
  pending: 'bg-line-strong',
};

const COUNT: Record<PriorityLevel, string> = {
  high: 'text-green-fg',
  medium: 'text-yellow-fg',
  low: 'text-red-fg',
  pending: 'text-ink-soft',
};

interface GraphProgramSummaryProps {
  summary: ProgramSummary;
  onSelect: (id: string) => void;
}

export function GraphProgramSummary({ summary, onSelect }: GraphProgramSummaryProps) {
  const m = useMessages();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div aria-hidden="true" className="flex h-2 gap-0.5 overflow-hidden rounded-full bg-line">
          {PRIORITY_LEVELS.map((level) =>
            summary.levels[level] ? (
              <span
                key={level}
                className={BAR[level]}
                style={{ flexGrow: summary.levels[level] }}
              />
            ) : null,
          )}
        </div>
        <dl className="grid grid-cols-4 gap-1">
          {PRIORITY_LEVELS.map((level) => (
            <div key={level} className="flex flex-col-reverse justify-end">
              <dt className="text-caption text-ink-muted">{m.graph.levelsShort[level]}</dt>
              <dd className={cx('text-label-sm tabular-nums', COUNT[level])}>
                {summary.levels[level]}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <section className="flex flex-col gap-2" aria-labelledby="graph-first-contacts">
        <h3 id="graph-first-contacts" className="text-label-sm text-ink">
          {m.graph.firstContacts}
        </h3>
        {summary.firstContacts.length ? (
          <ul className="flex flex-col gap-1.5">
            {summary.firstContacts.map((node) => (
              <li key={node.id}>
                <button
                  type="button"
                  onClick={() => onSelect(node.id)}
                  className="flex min-h-11 w-full items-center gap-2.5 rounded-md border border-line px-3 text-left text-label-sm text-ink transition-colors duration-150 hover:bg-raised"
                >
                  <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-green-fg" />
                  <span className="flex-1 truncate">{node.label}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-body-sm text-ink-muted">{m.graph.noFirstContacts}</p>
        )}
      </section>
    </div>
  );
}
