'use client';

import * as Dialog from '@radix-ui/react-dialog';

import { Button } from '@/ui';

import { useMessages } from '../../hooks/use-messages';
import { useSegmentProfile } from '../../hooks/use-segment-profile';
import { type ActivityTrigger, applyTrigger } from '../../services/apply-trigger';
import { useSegmentationStore } from '../../store/segmentation-store';
import { EditProfileForm } from './edit-profile-form';

const ACTIVITIES: ActivityTrigger[] = ['attended_event', 'role_change', 'funding_round'];

interface TryChangeDialogProps {
  profileId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TryChangeDialog({ profileId, open, onOpenChange }: TryChangeDialogProps) {
  const m = useMessages();
  const profile = useSegmentationStore((state) =>
    state.profiles.find((item) => item.id === profileId),
  );
  const { mutate } = useSegmentProfile();

  const close = () => onOpenChange(false);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-modal bg-canvas/70" />
        <Dialog.Content className="fixed inset-x-4 top-[10vh] z-modal mx-auto flex max-w-md flex-col gap-5 rounded-lg border border-line bg-card p-5 shadow-modal tablet:p-6">
          <div className="flex flex-col gap-1">
            <Dialog.Title className="text-title-md text-ink">{m.change.title}</Dialog.Title>
            <Dialog.Description className="text-body-md text-ink-soft">
              {m.change.description}
            </Dialog.Description>
          </div>
          {profile ? (
            <>
              <fieldset className="flex flex-col gap-2">
                <legend className="pb-2 text-label-xs text-ink-soft">{m.change.simulate}</legend>
                {ACTIVITIES.map((trigger) => (
                  <Button
                    key={trigger}
                    variant="secondary"
                    className="justify-start"
                    onClick={() => {
                      mutate({ profile: applyTrigger(profile, trigger), trigger });
                      close();
                    }}
                  >
                    {m.change[trigger]}
                  </Button>
                ))}
              </fieldset>
              <section aria-label={m.change.edit} className="flex flex-col gap-3">
                <h3 className="text-label-xs text-ink-soft">{m.change.edit}</h3>
                <EditProfileForm
                  profile={profile}
                  onCancel={close}
                  onSubmit={(next) => {
                    mutate({ profile: next, trigger: 'manual_edit' });
                    close();
                  }}
                />
              </section>
            </>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
