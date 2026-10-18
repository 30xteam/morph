'use client';

import { useId } from 'react';

import { cx } from '@/core/cx';
import { useSegmentationStore, type ProgramKey } from '@/libs/segmentation';
import { Button, Panel, RadioOption } from '@/ui';

import { useMessages } from '../../hooks/use-messages';
import { choicesFor } from '../../hooks/use-review-flow';
import type { ReviewItem } from '../../hooks/use-review-items';

interface DecisionPanelProps {
  item: ReviewItem;
  choice: ProgramKey;
  onChoose: (program: ProgramKey) => void;
  onConfirm: () => void;
  onSkip: () => void;
}

export function DecisionPanel({ item, choice, onChoose, onConfirm, onSkip }: DecisionPanelProps) {
  const m = useMessages();
  const name = useId();
  const id = item.profile.id;
  const verdict = useSegmentationStore((state) => state.reviews[id]);
  const clearReview = useSegmentationStore((state) => state.clearReview);

  if (verdict) {
    const labeled = verdict.verdict === 'corrected' ? verdict.program : item.outcome.program.value;
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
            <RadioOption
              key={program}
              name={name}
              checked={choice === program}
              onSelect={() => onChoose(program)}
              className={cx(
                'flex min-h-11 items-center rounded-nav border border-line px-3 text-label-sm text-ink-soft transition-colors duration-150 hover:text-ink desktop:min-h-8',
                choice === program && 'border-accent bg-raised font-semibold text-ink',
              )}
            >
              {m.programs[program]}
            </RadioOption>
          ))}
        </fieldset>
        <p className="hidden text-caption text-ink-muted desktop:block">{m.review.shortcuts}</p>
      </Panel>
      <div className="flex flex-wrap items-center gap-2.5">
        <Button onClick={onConfirm}>{m.review.confirm(m.programs[choice])}</Button>
        <Button variant="secondary" onClick={onSkip}>
          {m.review.skip}
        </Button>
        <p className="w-full text-caption text-ink-muted tablet:ml-auto tablet:w-auto">
          {m.review.labelNote}
        </p>
      </div>
    </>
  );
}
