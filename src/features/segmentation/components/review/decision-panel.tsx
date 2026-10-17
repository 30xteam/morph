'use client';

import { useState } from 'react';

import { cx } from '@/core/cx';
import { Button } from '@/ui';

import { useMessages } from '../../hooks/use-messages';
import type { ReviewItem } from '../../hooks/use-review-items';
import { useSegmentationStore } from '../../store/segmentation-store';
import type { ProgramKey } from '../../types/segmentation.types';
import { Panel } from '../ui/panel';

interface DecisionPanelProps {
  item: ReviewItem;
  onDone: () => void;
}

function choicesFor({ outcome }: ReviewItem): ProgramKey[] {
  const ranked = [outcome.program, ...outcome.program.alternatives].map((c) => c.value);
  return [...new Set<ProgramKey>([...ranked, 'none'])];
}

export function DecisionPanel({ item, onDone }: DecisionPanelProps) {
  const m = useMessages();
  const id = item.profile.id;
  const verdict = useSegmentationStore((state) => state.reviews[id]);
  const review = useSegmentationStore((state) => state.review);
  const clearReview = useSegmentationStore((state) => state.clearReview);
  const [choice, setChoice] = useState<ProgramKey>(item.outcome.program.value);
  const jevProgram = item.outcome.program.value;

  if (verdict) {
    const labeled = verdict.verdict === 'corrected' ? verdict.program : jevProgram;
    return (
      <Panel title={m.review.yourDecision}>
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-label-sm text-ink">{m.review.labeled(m.programs[labeled])}</p>
          <Button variant="ghost" onClick={() => clearReview(id)}>
            {m.review.undo}
          </Button>
        </div>
      </Panel>
    );
  }

  return (
    <>
      <Panel title={m.review.yourDecision}>
        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">{m.review.yourDecision}</legend>
          {choicesFor(item).map((program) => (
            <button
              key={program}
              type="button"
              aria-pressed={choice === program}
              onClick={() => setChoice(program)}
              className={cx(
                'min-h-11 rounded-nav border border-line px-3 text-label-sm text-ink-soft transition-colors duration-150 hover:text-ink desktop:min-h-8',
                choice === program && 'border-accent bg-raised font-semibold text-ink',
              )}
            >
              {m.programs[program]}
            </button>
          ))}
        </fieldset>
      </Panel>
      <div className="flex flex-wrap items-center gap-2.5">
        <Button
          onClick={() => {
            review(
              id,
              choice === jevProgram
                ? { verdict: 'approved' }
                : { verdict: 'corrected', program: choice },
            );
            onDone();
          }}
        >
          {m.review.confirm(m.programs[choice])}
        </Button>
        <Button variant="secondary" onClick={onDone}>
          {m.review.skip}
        </Button>
        <p className="w-full text-caption text-ink-muted tablet:ml-auto tablet:w-auto">
          {m.review.labelNote}
        </p>
      </div>
    </>
  );
}
