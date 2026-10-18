'use client';

import { cx } from '@/core/cx';

import { useMessages } from '../../hooks/use-messages';
import { TagBadge } from '../ui/tag-badge';
import { sceneDelay } from './scene-delay';

const OPTIONS = ['sales_machine', 'ai_sales', 'hardcore_ai', 'none'] as const;

export function SceneReview() {
  const m = useMessages();
  const copy = m.onboarding.review;
  return (
    <div className="flex w-full max-w-80 flex-col gap-3 rounded-md border border-line bg-card p-3.5 motion-safe:animate-enter">
      <div className="flex items-center justify-between gap-2">
        <span className="text-label-sm text-ink">{m.roles.founder}</span>
        <TagBadge tone="warning">{m.review.lowConfidence}</TagBadge>
      </div>
      <p className="text-caption text-ink-soft">{copy.guess}</p>
      <div className="grid grid-cols-2 gap-1.5">
        {OPTIONS.map((option, index) => (
          <span
            key={option}
            className={cx(
              'rounded-sm border border-line px-2.5 py-1.5 text-caption text-ink-soft',
              index === 0 &&
                'motion-safe:animate-highlight motion-reduce:border-accent motion-reduce:bg-selected motion-reduce:text-ink',
            )}
            style={index === 0 ? sceneDelay(900) : undefined}
          >
            {m.programs[option]}
          </span>
        ))}
      </div>
      <span
        className="w-fit self-end rounded-sm bg-green-bg px-2 py-0.75 text-badge text-green-fg uppercase motion-safe:animate-pop"
        style={sceneDelay(1500)}
      >
        {copy.confirmed}
      </span>
    </div>
  );
}
