import { useMutation } from '@tanstack/react-query';

import { SegmentationService } from '../services/segmentation.service';
import { useSegmentationStore } from '../store/segmentation-store';
import type { Profile, Trigger } from '../types/segmentation.types';

interface SegmentVariables {
  profile: Profile;
  trigger: Trigger;
}

export function useSegmentProfile() {
  const setPending = useSegmentationStore((state) => state.setPending);
  const saveOutcome = useSegmentationStore((state) => state.saveOutcome);

  return useMutation({
    mutationFn: ({ profile, trigger }: SegmentVariables) =>
      SegmentationService.segment(profile, trigger),
    onMutate: ({ profile }) => setPending(profile.id, true),
    onSuccess: saveOutcome,
    onSettled: (_data, _error, { profile }) => setPending(profile.id, false),
  });
}
