'use client';

import { useSegmentationStore } from '../store/segmentation-store';
import { RunAllButton } from './run-all-button';

const STEPS = [
  'Sort all sign-ups. Jev reads each person and suggests what to do next.',
  'Open a person to see why, and how sure Jev is.',
  'Change something about them, like their role, and watch the suggestion update.',
];

export function GettingStarted() {
  const started = useSegmentationStore(
    (state) => Object.keys(state.history).length > 0 || state.run.running,
  );

  if (started) return null;

  return (
    <section
      aria-labelledby="getting-started-heading"
      className="flex flex-col gap-4 rounded-md bg-surface-subtle px-5 py-5 tablet:px-6"
    >
      <h2 id="getting-started-heading" className="text-title-md text-fg-strong">
        Start here
      </h2>
      <ol className="flex list-decimal flex-col gap-2 pl-5 text-body-md text-fg-soft marker:text-fg-muted">
        {STEPS.map((step) => (
          <li key={step} className="max-w-prose">
            {step}
          </li>
        ))}
      </ol>
      <RunAllButton className="self-start" />
    </section>
  );
}
