const STORAGE_KEY = 'morph.sound';

type Listener = () => void;

const listeners = new Set<Listener>();

/**
 * Whether interface sounds are on. Defaults to on; the choice lives in localStorage per browser.
 */
export function isSoundOn() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== 'off';
  } catch {
    return true;
  }
}

export function setSoundOn(on: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
  } catch {
    return;
  }
  listeners.forEach((listener) => listener());
}

export function subscribeSound(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
