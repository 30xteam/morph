'use client';

import { cx } from '@/core/cx';
import { usePreferences } from '@/core/preferences';
import {
  countryCode,
  type Profile,
  type SegmentationOutcome,
  timeAgo,
  profileStatus,
  StatusBadge,
} from '@/libs/segmentation';

import { useMessages } from '../../hooks/use-messages';
import { roleKey } from '../../utils/role-key';

interface ProfileRowProps {
  profile: Profile;
  outcome: SegmentationOutcome | undefined;
  selected: boolean;
  pending: boolean;
  flagged: boolean;
  now: number;
  onSelect: () => void;
}

export function ProfileRow({
  profile,
  outcome,
  selected,
  pending,
  flagged,
  now,
  onSelect,
}: ProfileRowProps) {
  const m = useMessages();
  const { locale } = usePreferences();
  const role = roleKey(profile);
  const code = countryCode(profile.country);

  return (
    <li className="[contain-intrinsic-size:auto_78px] [content-visibility:auto]">
      <button
        type="button"
        aria-current={selected ? 'true' : undefined}
        onClick={onSelect}
        className={cx(
          'relative flex w-full items-start gap-3 overflow-hidden border-b border-line py-3 pr-3.5 pl-4.5 text-left transition-colors duration-150 hover:bg-selected',
          selected && 'rounded-md border-transparent bg-selected shadow-raised',
        )}
      >
        {selected ? (
          <span aria-hidden="true" className="absolute inset-y-0 left-0 w-0.75 bg-accent" />
        ) : null}
        <span className="flex min-w-0 flex-1 flex-col gap-0.75">
          <span
            className={cx(
              'truncate text-label-md',
              role === 'unknown' ? 'font-normal text-ink-muted' : 'text-ink',
            )}
          >
            {m.roles[role]}
          </span>
          <span className="truncate text-body-sm text-ink-muted">
            {profile.alias}
            {code ? ` · ${code}` : ''}
          </span>
          <span className="truncate text-body-sm text-ink-soft">
            {outcome
              ? `${m.programs[outcome.program.value]} · ${m.affinity[outcome.affinity.value]}`
              : m.status.pending}
          </span>
        </span>
        <span className="flex shrink-0 flex-col items-end gap-1.5">
          <StatusBadge status={pending ? 'deciding' : profileStatus(outcome, flagged)} />
          {outcome ? (
            <span className="text-caption text-ink-muted">
              {timeAgo(outcome.meta.decidedAt, now, locale)}
            </span>
          ) : null}
        </span>
      </button>
    </li>
  );
}
