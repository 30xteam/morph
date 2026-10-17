'use client';

import { create, useModal } from '@ebay/nice-modal-react';
import * as Dialog from '@radix-ui/react-dialog';

import { profilePriority } from '../../services/profile-priority';
import { describeActivity, relationLabel } from '../../services/profile-state';
import { latestOutcome, useSegmentationStore } from '../../store/segmentation-store';
import { PriorityBadge } from '../priority-badge';
import { Icon } from '../shell/icon';
import { ProfileActions } from './profile-actions';
import { ProfileDecision } from './profile-decision';
import { ProfileHistory } from './profile-history';

export const ProfileDialog = create<{ profileId: string }>(({ profileId }) => {
  const modal = useModal();
  const profile = useSegmentationStore((state) =>
    state.profiles.find((item) => item.id === profileId),
  );
  const history = useSegmentationStore((state) => state.history[profileId]);
  const outcome = latestOutcome(history);
  const priority = profilePriority(outcome);

  return (
    <Dialog.Root
      open={modal.visible}
      onOpenChange={(open) => {
        if (open) return;
        modal.hide();
        modal.remove();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-modal bg-scrim" />
        <Dialog.Content className="fixed inset-x-4 top-6 bottom-6 z-modal mx-auto flex max-w-2xl flex-col gap-5 overflow-y-auto rounded-md bg-surface p-5 shadow-modal tablet:p-6">
          {profile ? (
            <>
              <header className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-caption text-fg-muted">
                    {profile.alias} · {profile.source === 'luma' ? 'Luma sign-up' : '30X CRM'} ·{' '}
                    {relationLabel(profile)}
                  </p>
                  <Dialog.Title className="text-title-md text-fg-strong">
                    {profile.role}
                  </Dialog.Title>
                  <Dialog.Description className="text-body-sm text-fg-muted">
                    {profile.country} · {profile.crm.status} · {profile.crm.stage} ·{' '}
                    {profile.crm.program}
                  </Dialog.Description>
                </div>
                <Dialog.Close
                  aria-label="Close"
                  className="grid size-11 shrink-0 place-items-center rounded-sm text-fg-icon hover:bg-state-hover hover:text-fg"
                >
                  <Icon name="close" />
                </Dialog.Close>
              </header>

              <section
                aria-label="Commercial priority"
                className="flex flex-col gap-2 rounded-md bg-surface-subtle p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-label-sm text-fg-strong">Commercial priority</span>
                  <PriorityBadge priority={priority} />
                </div>
                <p className="text-body-sm text-fg-soft">{priority.reason}</p>
                {priority.needsReview ? (
                  <p className="text-caption text-fg-muted">
                    Human review required before acting on this recommendation.
                  </p>
                ) : null}
              </section>
              <dl className="grid gap-x-4 gap-y-2 text-body-sm tablet:grid-cols-[auto_1fr]">
                <dt className="text-caption text-fg-muted">Goal</dt>
                <dd className="text-fg-soft">{profile.goal}</dd>
                <dt className="text-caption text-fg-muted">Pain</dt>
                <dd className="text-fg-soft">{profile.pain}</dd>
                <dt className="text-caption text-fg-muted">Topics</dt>
                <dd className="text-fg-soft">{profile.topics.join(', ') || '—'}</dd>
                <dt className="text-caption text-fg-muted">Activity</dt>
                <dd className="text-fg-soft">{describeActivity(profile)}</dd>
              </dl>

              <ProfileActions profile={profile} hasOutcome={outcome !== undefined} />
              {outcome ? <ProfileDecision outcome={outcome} /> : null}
              {history && history.length > 1 ? <ProfileHistory history={history} /> : null}
            </>
          ) : (
            <Dialog.Title className="text-title-md text-fg-strong">Profile not found</Dialog.Title>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
});
