import { useMutation } from '@tanstack/react-query';

import { SegmentationService } from '../services/segmentation.service';

export function useEvaluation() {
  return useMutation({
    mutationKey: ['segmentation', 'evaluate'],
    mutationFn: SegmentationService.evaluate,
  });
}
