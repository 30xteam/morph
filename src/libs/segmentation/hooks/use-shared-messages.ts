import { usePreferences } from '@/core/preferences';

import { sharedEn } from '../i18n/en';
import { sharedEs } from '../i18n/es';

const MESSAGES = { en: sharedEn, es: sharedEs };

export function useSharedMessages() {
  return MESSAGES[usePreferences().locale];
}
