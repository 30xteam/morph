'use client';

import { useMessages } from '../../hooks/use-messages';
import { sceneDelay } from './scene-delay';

const PROBABILITIES = [0.71, 0.78, 0.88, 0.82, 0.31];

export function SceneDecide() {
  const m = useMessages();
  const copy = m.onboarding.decide;
  return (
    <div className="flex w-full max-w-80 flex-col gap-2.5">
      {copy.questions.map((question, index) => (
        <div
          key={question.label}
          className="grid grid-cols-[7rem_1fr] items-center gap-x-3 gap-y-1"
        >
          <span className="text-caption text-ink-soft">{question.label}</span>
          <span
            className="text-right text-caption font-medium text-ink motion-safe:animate-enter"
            style={sceneDelay(300 + index * 180 + 600)}
          >
            {question.answer}
          </span>
          <span className="col-span-2 h-1 overflow-hidden rounded-xs bg-line">
            <span
              className="block h-full origin-left bg-accent motion-safe:animate-fill"
              style={{
                width: `${(PROBABILITIES[index] ?? 0) * 100}%`,
                ...sceneDelay(300 + index * 180),
              }}
            />
          </span>
        </div>
      ))}
      <span
        className="mt-1 w-fit self-end rounded-sm bg-green-bg px-2 py-0.75 text-badge text-green-fg motion-safe:animate-pop"
        style={sceneDelay(1700)}
      >
        {copy.latency}
      </span>
    </div>
  );
}
