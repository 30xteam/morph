'use client';

import { show } from '@ebay/nice-modal-react';

import { SEGMENT_LABELS } from '../config/labels';
import { useFilteredSignups } from '../hooks/use-filtered-signups';
import { useSegmentationStore } from '../store/segmentation-store';
import { ActionBadge } from './action-badge';
import { LightBadge } from './light-badge';
import { ProfileDialog } from './profile/profile-dialog';

export function SignupsList() {
  const { rows } = useFilteredSignups();
  const pendingIds = useSegmentationStore((state) => state.pendingIds);

  return (
    <ul className="flex flex-col">
      {rows.map(({ profile, outcome }) => (
        <li key={profile.id} className="border-b border-border">
          <button
            type="button"
            onClick={() => show(ProfileDialog, { profileId: profile.id })}
            className="flex w-full flex-col items-start gap-1.5 rounded-sm py-3 text-left hover:bg-state-hover focus-visible:outline-2 focus-visible:outline-primary"
          >
            <span className="flex flex-col">
              <span className="text-label-sm text-fg-strong">{profile.role}</span>
              <span className="text-caption text-fg-muted">{profile.company}</span>
            </span>
            {pendingIds.includes(profile.id) ? (
              <span className="text-caption text-fg-muted">Jev is reading…</span>
            ) : null}
            {outcome ? (
              <>
                <LightBadge light={outcome.light} />
                <span className="text-caption text-fg-soft">
                  {SEGMENT_LABELS[outcome.segment.value]} · {outcome.reasons[0] ?? ''}
                </span>
                <ActionBadge action={outcome.action} probability={outcome.segment.probability} />
              </>
            ) : (
              <span className="text-caption text-fg-muted">Not sorted yet</span>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}
