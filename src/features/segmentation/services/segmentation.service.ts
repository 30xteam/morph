import { createHttpClient } from '@/core/http';

import type { EvaluationMode, SegmentationEvaluation } from '../types/evaluation.types';
import type { LumaRegistration } from '../types/luma.schema';
import type { Profile, SegmentationOutcome, Trigger } from '../types/segmentation.types';

const api = createHttpClient();

export const SegmentationService = {
  async segment(profile: Profile, trigger: Trigger) {
    const { data } = await api.post<SegmentationOutcome>('/api/segment', { profile, trigger });
    return data;
  },
  async receiveLumaSignUp(registration: LumaRegistration) {
    const { data } = await api.post<{ profile: Profile; outcome: SegmentationOutcome }>(
      '/api/luma/webhook',
      registration,
    );
    return data;
  },
  async evaluate(mode: EvaluationMode = 'single') {
    const { data } = await api.post<SegmentationEvaluation>('/api/segment/evaluate', { mode });
    return data;
  },
};
