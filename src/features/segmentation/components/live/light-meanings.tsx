'use client';

import { StatusBadge } from '@/libs/segmentation';

import { LIGHT_ORDER } from '../../hooks/use-light-counts';
import { useMessages } from '../../hooks/use-messages';

export function LightMeanings() {
  const m = useMessages();
  return (
    <dl className="grid grid-cols-[max-content_1fr] gap-y-3">
      {LIGHT_ORDER.map((light) => (
        <div key={light} className="col-span-2 grid grid-cols-subgrid items-start gap-x-3">
          <dt>
            <StatusBadge status={light} />
          </dt>
          <dd className="flex flex-col gap-0.5">
            <span className="text-label-sm text-ink">{m.lightMeanings[light].meaning}</span>
            <span className="text-caption text-ink-muted">{m.lightMeanings[light].action}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
