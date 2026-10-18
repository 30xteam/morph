type Listener = () => void;

const listeners = new Set<Listener>();

function isNewPage(href: string) {
  const target = new URL(href, window.location.href);
  return target.origin === window.location.origin && target.pathname !== window.location.pathname;
}

/**
 * Starts the top loader when `href` leads to another page of this app.
 * Call it before a programmatic `router.push`; link clicks are detected on their own.
 */
export function startNavigation(href: string) {
  if (!isNewPage(href)) return;
  listeners.forEach((listener) => listener());
}

export function onNavigationStart(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function navigationHref(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0) return undefined;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return undefined;
  const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
  if (!(anchor instanceof HTMLAnchorElement)) return undefined;
  if (anchor.target && anchor.target !== '_self') return undefined;
  if (anchor.hasAttribute('download')) return undefined;
  return anchor.href;
}
