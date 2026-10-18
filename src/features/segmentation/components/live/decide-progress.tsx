'use client';

import { cx } from '@/core/cx';
import { Button } from '@/ui';

import { useMessages } from '../../hooks/use-messages';
import type { BatchRun } from '../../store/segmentation-store';

interface DecideProgressProps {
  run: BatchRun;
  onCancel: () => void;
}

function segmentClass(index: number, run: BatchRun) {
  if (index < run.batch - 1) return 'bg-accent';
  if (index === run.batch - 1) return 'bg-primary motion-safe:animate-loader-pulse';
  return 'bg-line';
}

export function DecideProgress({ run, onCancel }: DecideProgressProps) {
  const m = useMessages();

  return (
    <output
      aria-live="polite"
      className="flex flex-col gap-2.5 rounded-lg border border-line bg-card p-3.5 motion-safe:animate-enter"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-label-sm text-ink">
          {m.list.decidingBatch(Math.max(run.batch, 1), run.batches)}
        </p>
        <Button variant="secondary" onClick={onCancel} disabled={run.cancelled}>
          {m.list.cancel}
        </Button>
      </div>
      <div
        aria-hidden="true"
        className="grid gap-0.75"
        style={{ gridTemplateColumns: `repeat(${run.batches}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: run.batches }, (_, index) => (
          <span
            key={index}
            className={cx(
              'h-1.5 rounded-full transition-colors duration-200',
              segmentClass(index, run),
            )}
          />
        ))}
      </div>
      <p className="text-caption text-ink-muted tabular-nums">
        {m.list.progress(run.done, run.total, run.green, run.yellow)}
      </p>
    </output>
  );
}
