'use client';

import { cx } from '@/core/cx';
import { usePreferences } from '@/core/preferences';

import { useMessages } from '../../hooks/use-messages';
import type { ReviewItem } from '../../hooks/use-review-items';
import { countryCode } from '../../i18n/values';
import { timeAgo } from '../../utils/format';
import { roleKey } from '../../utils/role-key';
import { TagBadge } from '../ui/tag-badge';

interface ReviewRowProps {
  item: ReviewItem;
  selected: boolean;
  labeled: boolean;
  now: number;
  onSelect: () => void;
}

export function ReviewRow({ item, selected, labeled, now, onSelect }: ReviewRowProps) {
  const m = useMessages();
  const { locale } = usePreferences();
  const { profile, outcome, reason } = item;
  const code = countryCode(profile.country);

  return (
    <li className="[contain-intrinsic-size:auto_64px] [content-visibility:auto]">
      <button
        type="button"
        aria-current={selected ? 'true' : undefined}
        onClick={onSelect}
        className={cx(
          'relative flex w-full flex-col gap-2 overflow-hidden rounded-md border border-line px-4 py-3 text-left transition-colors duration-150 hover:bg-selected',
          selected && 'border-transparent bg-selected shadow-raised',
          labeled && 'opacity-60',
        )}
      >
        {selected ? (
          <span aria-hidden="true" className="absolute inset-y-0 left-0 w-0.75 bg-accent" />
        ) : null}
        <span className="flex items-baseline gap-2">
          <span className="text-label-md text-ink">{profile.alias}</span>
          <span className="truncate text-body-sm text-ink-soft">
            {m.roles[roleKey(profile)]}
            {code ? ` · ${code}` : ''}
          </span>
          <span className="ml-auto shrink-0 text-caption text-ink-muted">
            {timeAgo(outcome.meta.decidedAt, now, locale)}
          </span>
        </span>
        <span className="flex flex-wrap items-center gap-2">
          <TagBadge tone="warning">
            {reason === 'low_info'
              ? m.review.lowInfoBadge(outcome.missingSignals.length)
              : m.review.lowConfidence}
          </TagBadge>
          <span className="text-body-sm text-ink-soft">
            {m.review.jevGuess(m.programs[outcome.program.value], outcome.program.probability)}
          </span>
        </span>
      </button>
    </li>
  );
}
