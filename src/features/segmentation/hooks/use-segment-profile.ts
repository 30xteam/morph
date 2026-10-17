import { useMutation } from '@tanstack/react-query';

import { SegmentationService } from '../services/segmentation.service';
import { latestOutcome, useSegmentationStore } from '../store/segmentation-store';
import type { Profile, Trigger } from '../types/segmentation.types';

interface SegmentVariables {
  profile: Profile;
  trigger: Trigger;
}

async function decide({ profile, trigger }: SegmentVariables) {
  const previous = latestOutcome(useSegmentationStore.getState().history[profile.id]);
  if (trigger === 'manual_edit' && previous) {
    const { current } = await SegmentationService.recalculate(profile, previous);
    return current;
  }
  return SegmentationService.segment(profile, trigger);
}

export function useSegmentProfile() {
  const setPending = useSegmentationStore((state) => state.setPending);
  const saveOutcome = useSegmentationStore((state) => state.saveOutcome);
  const updateProfile = useSegmentationStore((state) => state.updateProfile);

  return useMutation({
    mutationFn: decide,
    onMutate: ({ profile }) => {
      updateProfile(profile);
      setPending([profile.id], true);
    },
    onSuccess: saveOutcome,
    onSettled: (_data, _error, { profile }) => setPending([profile.id], false),
  });
}
