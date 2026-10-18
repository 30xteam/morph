import { PREFERENCE_MESSAGES } from './preference-messages';
import { usePreferences } from './preferences-provider';

export function usePreferenceMessages() {
  return PREFERENCE_MESSAGES[usePreferences().locale];
}
