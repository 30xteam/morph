'use client';

import { createContext, use, useMemo, useState, type ReactNode } from 'react';

import {
  LOCALE_COOKIE,
  preferenceCookie,
  THEME_COOKIE,
  type Locale,
  type Theme,
} from './preferences';

interface PreferencesValue {
  locale: Locale;
  theme: Theme;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: Theme) => void;
}

const PreferencesContext = createContext<PreferencesValue | null>(null);

interface PreferencesProviderProps {
  locale: Locale;
  theme: Theme;
  children: ReactNode;
}

export function PreferencesProvider({ locale, theme, children }: PreferencesProviderProps) {
  const [current, setCurrent] = useState({ locale, theme });

  const value = useMemo<PreferencesValue>(
    () => ({
      ...current,
      setLocale: (next) => {
        document.cookie = preferenceCookie(LOCALE_COOKIE, next);
        document.documentElement.lang = next;
        setCurrent((state) => ({ ...state, locale: next }));
      },
      setTheme: (next) => {
        document.cookie = preferenceCookie(THEME_COOKIE, next);
        document.documentElement.dataset.theme = next;
        setCurrent((state) => ({ ...state, theme: next }));
      },
    }),
    [current],
  );

  return <PreferencesContext value={value}>{children}</PreferencesContext>;
}

export function usePreferences() {
  const value = use(PreferencesContext);
  if (!value) throw new Error('usePreferences must be used inside <PreferencesProvider>');
  return value;
}
