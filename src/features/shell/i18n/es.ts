import { sharedEs } from '@/libs/segmentation';

import type { Messages } from './en';
import { onboardingEs } from './onboarding-es';

export const es: Messages = {
  ...sharedEs,
  onboarding: onboardingEs,
};
