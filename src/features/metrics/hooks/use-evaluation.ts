import { useMutation } from '@tanstack/react-query';

import { SegmentationService, useSegmentationStore } from '@/libs/segmentation';
import { playToastSound } from '@/ui';

export const EVALUATION_SIZE = 150;

export function useEvaluation() {
  const setEvaluation = useSegmentationStore((state) => state.setEvaluation);
  return useMutation({
    mutationKey: ['segmentation', 'evaluate'],
    mutationFn: () => SegmentationService.evaluate('single', EVALUATION_SIZE),
    onSuccess: (evaluation) => {
      setEvaluation(evaluation);
      playToastSound('success');
    },
    onError: () => playToastSound('error'),
  });
}
