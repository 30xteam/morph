import { useMutation } from '@tanstack/react-query';

import { SegmentationService } from '../services/segmentation.service';
import { latestOutcome, useSegmentationStore } from '../store/segmentation-store';
import type { Profile } from '../types/segmentation.types';

export function useRecalculateProfile() {
  const setPending = useSegmentationStore((state) => state.setPending);
  const saveOutcome = useSegmentationStore((state) => state.saveOutcome);

  return useMutation({
    mutationFn: async (profile: Profile) => {
      const previous = latestOutcome(useSegmentationStore.getState().history[profile.id]);
      if (previous) return (await SegmentationService.recalculate(profile, previous)).current;
      return SegmentationService.segment(profile, 'manual_edit');
    },
    onMutate: (profile) => setPending(profile.id, true),
    onSuccess: saveOutcome,
    onSettled: (_data, _error, profile) => setPending(profile.id, false),
  });
}
