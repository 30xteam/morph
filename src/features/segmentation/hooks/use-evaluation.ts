import { useMutation } from '@tanstack/react-query';

import { SegmentationService } from '../services/segmentation.service';
import { useSegmentationStore } from '../store/segmentation-store';

export const EVALUATION_SIZE = 150;

export function useEvaluation() {
  const setEvaluation = useSegmentationStore((state) => state.setEvaluation);
  return useMutation({
    mutationKey: ['segmentation', 'evaluate'],
    mutationFn: () => SegmentationService.evaluate('single', EVALUATION_SIZE),
    onSuccess: setEvaluation,
  });
}
