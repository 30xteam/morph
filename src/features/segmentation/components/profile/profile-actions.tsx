'use client';

import { useState } from 'react';

import { Button } from '@/ui';

import { useRecalculateProfile } from '../../hooks/use-recalculate-profile';
import { useSegmentProfile } from '../../hooks/use-segment-profile';
import { type ActivityTrigger, applyTrigger } from '../../services/apply-trigger';
import { useSegmentationStore } from '../../store/segmentation-store';
import type { Profile, Trigger } from '../../types/segmentation.types';
import { EditProfileForm } from '../edit-profile-form';

const ACTIVITY_ACTIONS: { trigger: ActivityTrigger; label: string }[] = [
  { trigger: 'attended_event', label: 'Attends another event' },
  { trigger: 'role_change', label: 'Changes role' },
  { trigger: 'funding_round', label: 'Company raises a round' },
];

interface ProfileActionsProps {
  profile: Profile;
  hasOutcome: boolean;
}

export function ProfileActions({ profile, hasOutcome }: ProfileActionsProps) {
  const updateProfile = useSegmentationStore((state) => state.updateProfile);
  const { mutate, isPending: segmenting } = useSegmentProfile();
  const recalculate = useRecalculateProfile();
  const isPending = segmenting || recalculate.isPending;
  const [editing, setEditing] = useState(false);

  function rerun(next: Profile, trigger: Trigger) {
    updateProfile(next);
    mutate({ profile: next, trigger });
  }

  if (editing) {
    return (
      <EditProfileForm
        profile={profile}
        onCancel={() => setEditing(false)}
        onSubmit={(next) => {
          setEditing(false);
          updateProfile(next);
          recalculate.mutate(next);
        }}
      />
    );
  }

  return (
    <section aria-labelledby="try-change-heading" className="flex flex-col gap-2">
      <h3 id="try-change-heading" className="text-label-md text-fg-strong">
        Try a change
      </h3>
      <p className="text-body-sm text-fg-muted">
        Pretend something happened to this person. Jev reads them again and you see what changed.
      </p>
      <div className="flex flex-wrap gap-2">
        {ACTIVITY_ACTIONS.map(({ trigger, label }) => (
          <Button
            key={trigger}
            variant="secondary"
            disabled={isPending}
            onClick={() => rerun(applyTrigger(profile, trigger), trigger)}
          >
            {label}
          </Button>
        ))}
        <Button variant="secondary" disabled={isPending} onClick={() => setEditing(true)}>
          Edit role or company
        </Button>
        {hasOutcome ? null : (
          <Button
            variant="ghost"
            disabled={isPending}
            onClick={() => mutate({ profile, trigger: 'sign_up' })}
          >
            Sort this person
          </Button>
        )}
      </div>
      {isPending ? (
        <p aria-live="polite" className="text-caption text-fg-muted">
          Jev is reading this person again…
        </p>
      ) : null}
      {recalculate.isError ? (
        <p role="alert" className="text-caption text-danger">
          Jev couldn’t read the changes. Try again in a moment.
        </p>
      ) : null}
    </section>
  );
}
