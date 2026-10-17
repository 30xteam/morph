'use client';

import { useState } from 'react';

import { Button } from '@/ui';

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
  const { mutate, isPending } = useSegmentProfile();
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
          rerun(next, 'manual_edit');
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-caption text-fg-muted">
        Simulate what happens next. Jev re-decides on every change.
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
        <Button
          variant="ghost"
          disabled={isPending}
          onClick={() => mutate({ profile, trigger: hasOutcome ? 're_run' : 'sign_up' })}
        >
          {hasOutcome ? 'Re-run Jev' : 'Run Jev'}
        </Button>
        <Button variant="ghost" onClick={() => setEditing(true)}>
          Edit profile
        </Button>
      </div>
    </div>
  );
}
