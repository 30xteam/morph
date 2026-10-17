import { useMutation } from '@tanstack/react-query';
import { useRef } from 'react';

import { generateSignUp } from '../mocks/generate-sign-up';
import { lumaFromProfile } from '../services/luma-mapping';
import { SegmentationService } from '../services/segmentation.service';
import { useSegmentationStore } from '../store/segmentation-store';

export function useSimulateSignUp() {
  const addProfile = useSegmentationStore((state) => state.addProfile);
  const saveOutcome = useSegmentationStore((state) => state.saveOutcome);
  const seed = useRef(0);

  return useMutation({
    mutationFn: () => {
      seed.current += 1;
      const guestId = `gst_${Date.now().toString(36)}${seed.current}`;
      const draft = { ...generateSignUp(seed.current), id: guestId, alias: guestId };
      return SegmentationService.receiveLumaSignUp(lumaFromProfile(draft, guestId));
    },
    onSuccess: ({ profile, outcome }) => {
      addProfile(profile);
      saveOutcome(outcome);
    },
  });
}
