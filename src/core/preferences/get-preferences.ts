import 'server-only';
import { cookies } from 'next/headers';

import { LOCALE_COOKIE, parseLocale, parseTheme, THEME_COOKIE } from './preferences';

export async function getPreferences() {
  const store = await cookies();
  return {
    locale: parseLocale(store.get(LOCALE_COOKIE)?.value),
    theme: parseTheme(store.get(THEME_COOKIE)?.value),
  };
}
