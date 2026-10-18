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
  const role = roleKey(profile);
  const code = countryCode(profile.country);

  return (
    <li className="border-b border-line [contain-intrinsic-size:auto_76px] [content-visibility:auto] last:border-b-0 has-[[aria-current=true]]:border-transparent">
      <button
        type="button"
        aria-current={selected ? 'true' : undefined}
        onClick={onSelect}
        className={cx(
          'relative flex w-full items-start gap-3 overflow-hidden rounded-md py-3 pr-3.5 pl-4.5 text-left transition-colors duration-150 hover:bg-selected',
          selected && 'bg-selected shadow-raised',
          labeled && 'opacity-60',
        )}
      >
        {selected ? (
          <span aria-hidden="true" className="absolute inset-y-0 left-0 w-0.75 bg-accent" />
        ) : null}
        <span className="flex min-w-0 flex-1 flex-col gap-0.75">
          <span
            className={cx(
              'truncate',
              role === 'unknown' ? 'text-body-md text-ink-muted' : 'text-label-md text-ink',
            )}
          >
            {m.roles[role]}
          </span>
          <span className="truncate text-body-sm text-ink-muted">
            {profile.alias}
            {code ? ` · ${code}` : ''}
          </span>
          <span className="truncate text-body-sm text-ink-soft">
            {m.review.jevGuess(m.programs[outcome.program.value], outcome.program.probability)}
          </span>
        </span>
        <span className="flex shrink-0 flex-col items-end gap-1.5">
          <TagBadge tone="warning">
            {reason === 'low_info'
              ? m.review.lowInfoBadge(outcome.missingSignals.length)
              : m.review.lowConfidence}
          </TagBadge>
          <span className="text-caption text-ink-muted">
            {timeAgo(outcome.meta.decidedAt, now, locale)}
          </span>
        </span>
      </button>
    </li>
  );
}
