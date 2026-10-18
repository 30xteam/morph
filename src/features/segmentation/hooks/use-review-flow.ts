import { useRef, useState } from 'react';

import { notify } from '@/ui';

import { useSegmentationStore } from '../store/segmentation-store';
import type { ProgramKey } from '../types/segmentation.types';
import { useMessages } from './use-messages';
import type { ReviewItem } from './use-review-items';
import { useSelectedProfile } from './use-selected-profile';

export function choicesFor({ outcome }: ReviewItem): ProgramKey[] {
  const ranked = [outcome.program, ...outcome.program.alternatives].map((choice) => choice.value);
  return [...new Set<ProgramKey>([...ranked, 'none'])];
}

export function useReviewFlow(items: ReviewItem[]) {
  const m = useMessages();
  const reviews = useSegmentationStore((state) => state.reviews);
  const { requestedId: selectedId, select } = useSelectedProfile();
  const review = useSegmentationStore((state) => state.review);
  const clearReview = useSegmentationStore((state) => state.clearReview);
  const [choices, setChoices] = useState<Record<string, ProgramKey>>({});
  const titleRef = useRef<HTMLHeadingElement>(null);
  const selected = items.find((item) => item.profile.id === selectedId) ?? items[0];
  const choice = selected
    ? (choices[selected.profile.id] ?? selected.outcome.program.value)
    : undefined;

  const focusTitle = () => requestAnimationFrame(() => titleRef.current?.focus());

  const goTo = (id: string) => {
    select(id);
    focusTitle();
  };

  const move = (step: 1 | -1) => {
    const index = items.findIndex((item) => item.profile.id === selected?.profile.id);
    const target = items[index + step];
    if (target) goTo(target.profile.id);
  };

  const next = () => {
    const index = items.findIndex((item) => item.profile.id === selected?.profile.id);
    const upcoming = [...items.slice(index + 1), ...items.slice(0, index)].find(
      (item) => !reviews[item.profile.id] && item.profile.id !== selected?.profile.id,
    );
    if (upcoming) goTo(upcoming.profile.id);
  };

  const choose = (program: ProgramKey) => {
    if (selected) setChoices((current) => ({ ...current, [selected.profile.id]: program }));
  };

  const pick = (index: number) => {
    const program = selected ? choicesFor(selected)[index] : undefined;
    if (program) choose(program);
  };

  const confirm = () => {
    if (!selected || !choice || reviews[selected.profile.id]) return;
    const id = selected.profile.id;
    review(
      id,
      choice === selected.outcome.program.value
        ? { verdict: 'approved' }
        : { verdict: 'corrected', program: choice },
    );
    const left = Math.max(items.filter((item) => !reviews[item.profile.id]).length - 1, 0);
    const show = left ? notify.success : notify.complete;
    show(left ? m.review.labeled(m.programs[choice]) : m.review.queueDone, {
      description: left ? m.review.labeledBody(id, left) : m.review.queueDoneBody,
      action: { label: m.review.undoLast, onClick: () => undo(id) },
    });
    next();
  };

  const skip = () => {
    if (selected) {
      notify.info(m.review.skipped, { description: m.review.skippedBody(selected.profile.id) });
    }
    next();
  };

  const undo = (id: string) => {
    clearReview(id);
    goTo(id);
    notify.undo(m.review.undone(id));
  };

  return { selected, choice, titleRef, move, choose, pick, confirm, skip, goTo };
}
