import { useEffect, useEffectEvent } from 'react';

interface ReviewShortcuts {
  onMove: (step: 1 | -1) => void;
  onPick: (index: number) => void;
  onConfirm: () => void;
  onSkip: () => void;
}

const TEXT_INPUTS = new Set(['text', 'search', 'email', 'number', 'password', 'tel', 'url']);

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable || target instanceof HTMLTextAreaElement) return true;
  if (target instanceof HTMLSelectElement) return true;
  return target instanceof HTMLInputElement && TEXT_INPUTS.has(target.type);
}

function isActivatable(target: EventTarget | null) {
  return target instanceof HTMLButtonElement || target instanceof HTMLAnchorElement;
}

export function useReviewShortcuts(shortcuts: ReviewShortcuts) {
  const handle = useEffectEvent((event: KeyboardEvent) => {
    if (event.metaKey || event.ctrlKey || event.altKey || isTyping(event.target)) return;
    const key = event.key.toLowerCase();
    if (key === 'j') shortcuts.onMove(1);
    else if (key === 'k') shortcuts.onMove(-1);
    else if (key === 's') shortcuts.onSkip();
    else if (/^[1-4]$/.test(key)) shortcuts.onPick(Number(key) - 1);
    else if (key === 'enter' && !isActivatable(event.target)) shortcuts.onConfirm();
    else return;
    event.preventDefault();
  });

  useEffect(() => {
    const listener = (event: KeyboardEvent) => handle(event);
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);
}
