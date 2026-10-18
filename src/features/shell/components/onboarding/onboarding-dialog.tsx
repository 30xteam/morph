'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';

import { cx } from '@/core/cx';
import { Button } from '@/ui';

import { useMessages } from '../../hooks/use-messages';
import { SceneDecide } from './scene-decide';
import { SceneLights } from './scene-lights';
import { SceneReview } from './scene-review';
import { SceneSignup } from './scene-signup';
import { useOnboarding } from './use-onboarding';

const SCENES = [
  { key: 'signup', Scene: SceneSignup },
  { key: 'decide', Scene: SceneDecide },
  { key: 'lights', Scene: SceneLights },
  { key: 'review', Scene: SceneReview },
] as const;

export function OnboardingDialog() {
  const m = useMessages();
  const copy = m.onboarding;
  const { open, dismiss, complete } = useOnboarding();
  const [step, setStep] = useState(0);

  const { key, Scene } = SCENES[step] ?? SCENES[0];
  const last = step === SCENES.length - 1;

  return (
    <Dialog.Root open={open} onOpenChange={(next) => (next ? null : dismiss())}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-modal bg-canvas/70 motion-safe:animate-enter" />
        <Dialog.Content
          aria-label={copy.label}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            (event.currentTarget as HTMLElement | null)?.focus();
          }}
          className="fixed inset-x-4 top-[8vh] z-modal mx-auto flex max-w-md flex-col gap-5 rounded-lg border border-line bg-card p-5 shadow-modal outline-none motion-safe:animate-enter tablet:p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-caption text-ink-muted">{copy.step(step + 1, SCENES.length)}</p>
            <Button variant="ghost" onClick={dismiss}>
              {copy.skip}
            </Button>
          </div>
          <div
            key={key}
            aria-hidden="true"
            className="flex h-64 items-center justify-center overflow-hidden rounded-md border border-line bg-canvas px-4"
          >
            <Scene />
          </div>
          <div key={`${key}-copy`} className="flex flex-col gap-1.5 motion-safe:animate-enter">
            <Dialog.Title className="text-title-md text-ink">{copy[key].title}</Dialog.Title>
            <Dialog.Description className="text-body-md text-ink-soft">
              {copy[key].body}
            </Dialog.Description>
          </div>
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="flex flex-1 gap-1.5">
              {SCENES.map((scene, index) => (
                <span
                  key={scene.key}
                  className={cx(
                    'h-1.5 rounded-full transition-all duration-300 ease-out-strong',
                    index === step ? 'w-5 bg-accent' : 'w-1.5 bg-line-strong',
                  )}
                />
              ))}
            </span>
            {step > 0 ? (
              <Button variant="secondary" onClick={() => setStep(step - 1)}>
                {copy.back}
              </Button>
            ) : null}
            <Button onClick={last ? complete : () => setStep(step + 1)}>
              {last ? copy.start : copy.next}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
