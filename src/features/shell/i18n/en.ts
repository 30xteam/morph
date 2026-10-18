import { sharedEn } from '@/libs/segmentation';

import { onboardingEn } from './onboarding-en';

export const en = {
  ...sharedEn,
  onboarding: onboardingEn,
};

export type Messages = typeof en;
