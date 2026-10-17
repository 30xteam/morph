'use client';

import { create, useModal } from '@ebay/nice-modal-react';
import * as Dialog from '@radix-ui/react-dialog';

import { describeActivity } from '../../services/profile-state';
import { latestOutcome, useSegmentationStore } from '../../store/segmentation-store';
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
                    {profile.alias} · {profile.event}
                  </p>
                  <Dialog.Title className="text-title-md text-fg-strong">
                    {profile.role} at {profile.company}
                  </Dialog.Title>
                  <Dialog.Description className="text-body-sm text-fg-muted">
                    {profile.industry} · {profile.companySize} people · {profile.country}
                  </Dialog.Description>
                </div>
                <Dialog.Close
                  aria-label="Close"
                  className="grid size-11 shrink-0 place-items-center rounded-sm text-fg-icon hover:bg-state-hover hover:text-fg"
                >
                  <Icon name="close" />
                </Dialog.Close>
              </header>

              <div className="flex flex-col gap-1 text-body-sm">
                <p className="text-fg-soft">“{profile.signupAnswer}”</p>
                <p className="text-caption text-fg-muted">Activity: {describeActivity(profile)}</p>
              </div>

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
