'use client';

import { Toaster as SonnerToaster } from 'sonner';

const TOAST_CLASSES = {
  toast:
    'flex w-(--width) items-start gap-3 rounded-lg border border-line-strong bg-raised p-4 text-ink shadow-modal',
  content: 'flex min-w-0 flex-1 flex-col gap-0.5',
  title: 'text-label-sm text-ink',
  description: 'text-body-sm text-ink-soft',
  icon: 'mt-0.5 flex size-4 shrink-0 items-center justify-center',
  success: '[&_[data-icon]]:text-green-fg',
  info: '[&_[data-icon]]:text-ink-soft',
  actionButton:
    'shrink-0 cursor-pointer self-center rounded-sm border border-line-strong px-2.5 py-1 text-label-sm text-ink transition-colors duration-150 hover:bg-selected',
};

/**
 * Toast outlet styled with the design tokens. Render it once per layout and call `toast` from `@/ui`.
 * @param theme The active color theme, so toasts follow the app instead of the OS.
 */
export function Toaster({ theme }: { theme: 'dark' | 'light' }) {
  return (
    <SonnerToaster
      theme={theme}
      position="bottom-right"
      offset={24}
      mobileOffset={16}
      gap={10}
      visibleToasts={3}
      toastOptions={{ unstyled: true, classNames: TOAST_CLASSES }}
    />
  );
}
