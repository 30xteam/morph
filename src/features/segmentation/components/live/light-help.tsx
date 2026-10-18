'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as Popover from '@radix-ui/react-popover';

import { Button } from '@/ui';

import { useIsDesktop } from '../../hooks/use-is-desktop';
import { useMessages } from '../../hooks/use-messages';
import { HelpIcon } from './help-icon';
import { LightMeanings } from './light-meanings';

const TRIGGER =
  'inline-flex size-11 items-center justify-center rounded-full text-ink-muted transition-colors duration-150 hover:bg-raised hover:text-ink data-[state=open]:bg-raised data-[state=open]:text-ink desktop:size-7';

export function LightHelp() {
  const m = useMessages();
  const desktop = useIsDesktop();
  const trigger = (
    <button type="button" aria-label={m.list.lightsHelp} className={TRIGGER}>
      <HelpIcon />
    </button>
  );

  if (desktop) {
    return (
      <Popover.Root>
        <Popover.Trigger asChild>{trigger}</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            side="bottom"
            align="start"
            sideOffset={8}
            collisionPadding={16}
            aria-label={m.list.lightsHelp}
            className="z-popover flex w-88 max-w-(--radix-popover-content-available-width) flex-col gap-3 rounded-lg border border-line bg-card p-4 shadow-modal outline-none motion-safe:animate-enter"
          >
            <p className="text-label-sm text-ink">{m.list.lightsHelp}</p>
            <LightMeanings />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-modal bg-canvas/70 motion-safe:animate-enter" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 bottom-0 z-modal flex max-h-[85dvh] flex-col gap-4 overflow-y-auto rounded-t-lg border-t border-line bg-card px-5 pt-5 pb-[max(--spacing(8),env(safe-area-inset-bottom))] shadow-modal outline-none motion-safe:animate-sheet"
        >
          <div className="flex items-center justify-between gap-3">
            <Dialog.Title className="text-title-sm text-ink">{m.list.lightsHelp}</Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost">{m.list.lightsHelpClose}</Button>
            </Dialog.Close>
          </div>
          <LightMeanings />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
