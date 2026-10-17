import { usePreferences } from '@/core/preferences';

import { en } from '../i18n/en';
import { es } from '../i18n/es';

const MESSAGES = { en, es };

export function useMessages() {
  return MESSAGES[usePreferences().locale];
}
