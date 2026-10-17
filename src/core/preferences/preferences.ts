export const LOCALES = ['en', 'es'] as const;
export const THEMES = ['dark', 'light'] as const;

export type Locale = (typeof LOCALES)[number];
export type Theme = (typeof THEMES)[number];

export const LOCALE_COOKIE = 'locale';
export const THEME_COOKIE = 'theme';
export const DEFAULT_LOCALE: Locale = 'en';
export const DEFAULT_THEME: Theme = 'dark';

const ONE_YEAR = 60 * 60 * 24 * 365;

export function parseLocale(value: string | undefined): Locale {
  return LOCALES.find((locale) => locale === value) ?? DEFAULT_LOCALE;
}

export function parseTheme(value: string | undefined): Theme {
  return THEMES.find((theme) => theme === value) ?? DEFAULT_THEME;
}

export function preferenceCookie(name: string, value: string) {
  return `${name}=${value}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
}
