'use client';

import { useMessages } from '../../hooks/use-messages';
import { StatusBadge } from '../ui/status-badge';
import { sceneDelay } from './scene-delay';

const STATUSES = ['green', 'yellow', 'red', 'pending'] as const;

export function SceneLights() {
  const m = useMessages();
  const rows = m.list.lightMeanings;
  return (
    <ul className="grid w-full max-w-80 grid-cols-[max-content_1fr] gap-y-1.5">
      {STATUSES.map((status, index) => (
        <li
          key={status}
          className="col-span-2 grid grid-cols-subgrid items-center gap-x-3 rounded-md border border-line bg-card px-3 py-2 motion-safe:animate-slide-in"
          style={sceneDelay(index * 150)}
        >
          <span className="motion-safe:animate-pop" style={sceneDelay(500 + index * 200)}>
            <StatusBadge status={status} />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="text-label-sm text-ink">{rows[status].meaning}</span>
            {rows[status].action ? (
              <span className="text-caption text-ink-muted">{rows[status].action}</span>
            ) : null}
          </span>
        </li>
      ))}
    </ul>
  );
}
