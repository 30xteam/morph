import { DEFAULT_LOCALE, DEFAULT_THEME, LOCALE_COOKIE, THEME_COOKIE } from './preferences';

const SCRIPT = `(function(){var c=document.cookie,d=document.documentElement;
var t=(c.match(/(?:^|; )${THEME_COOKIE}=(dark|light)/)||[])[1]||'${DEFAULT_THEME}';
var l=(c.match(/(?:^|; )${LOCALE_COOKIE}=(en|es)/)||[])[1]||'${DEFAULT_LOCALE}';
d.dataset.theme=t;d.lang=l;})();`;

/** Applies the saved theme and language before first paint, so a static layout never flashes. */
export function PreferencesScript() {
  // oxlint-disable-next-line react/no-danger -- static inline script built from constants, no user input
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
