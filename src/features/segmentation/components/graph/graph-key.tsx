'use client';

import { cx } from '@/core/cx';

import { useMessages } from '../../hooks/use-messages';
import type { GraphColorBy } from '../../services/create-graph-renderer';
import type { GraphNode } from '../../types/graph.types';

const PROGRAM_DOT: Record<string, string> = {
  'program:ai_sales': 'bg-accent',
  'program:sales_machine': 'bg-blue-fg',
  'program:inmersion_ejecutiva': 'bg-violet-fg',
  'program:achievers': 'bg-yellow-fg',
  'program:hardcore_ai': 'bg-red-fg',
};

function KeyItem({ dot, label }: { dot: string; label: string }) {
  return (
    <li className="flex items-center gap-1.5">
      <span aria-hidden="true" className={cx('shrink-0', dot)} />
      {label}
    </li>
  );
}

export function GraphKey({ colorBy, programs }: { colorBy: GraphColorBy; programs: GraphNode[] }) {
  const m = useMessages();
  const interest = <KeyItem dot="size-2 rotate-45 bg-ink-soft" label={m.graph.keyInterest} />;

  return (
    <ul
      aria-label={m.graph.legend}
      className="flex flex-wrap gap-x-4 gap-y-1 text-body-sm text-ink-soft"
    >
      {colorBy === 'priority' ? (
        <>
          <KeyItem dot="size-2.5 rounded-full bg-green-fg" label="P1" />
          <KeyItem dot="size-2 rounded-full bg-yellow-fg opacity-50" label="P2" />
          <KeyItem dot="size-2 rounded-full bg-red-fg opacity-40" label="P3" />
          <KeyItem dot="size-1.5 rounded-full bg-ink-muted" label={m.status.pending} />
        </>
      ) : null}
      {colorBy === 'program'
        ? programs.map((program) => (
            <KeyItem
              key={program.id}
              dot={cx('size-2 rounded-full', PROGRAM_DOT[program.id] ?? 'bg-ink-muted')}
              label={program.label}
            />
          ))
        : null}
      {colorBy === 'none' ? (
        <KeyItem dot="size-2 rounded-full bg-ink-muted" label={m.graph.keyStructure} />
      ) : null}
      {interest}
    </ul>
  );
}
