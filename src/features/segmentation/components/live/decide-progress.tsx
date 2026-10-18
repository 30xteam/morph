'use client';

import { cx } from '@/core/cx';
import type { BatchRun } from '@/libs/segmentation';
import { Button } from '@/ui';

import { useMessages } from '../../hooks/use-messages';

interface DecideProgressProps {
  open: boolean;
  run: BatchRun;
  onCancel: () => void;
}

function segmentClass(index: number, run: BatchRun) {
  if (index < run.batch - 1) return 'bg-accent';
  if (index === run.batch - 1) return 'bg-primary motion-safe:animate-loader-pulse';
  return 'bg-line';
}

export function DecideProgress({ open, run, onCancel }: DecideProgressProps) {
  const m = useMessages();
  const batch = Math.min(Math.max(run.batch, 1), run.batches);

  return (
    <div
      inert={!open}
      className={cx(
        'grid transition-[grid-template-rows,opacity] duration-300 ease-out-strong motion-reduce:transition-none',
        open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
      )}
    >
      <div className="min-h-0 overflow-hidden">
        <output
          aria-live="polite"
          className="mt-1 flex flex-col gap-2.5 rounded-lg border border-line bg-card p-3.5"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-label-sm text-ink">{m.list.decidingBatch(batch, run.batches)}</p>
            <Button variant="secondary" onClick={onCancel} disabled={run.cancelled}>
              {m.list.cancel}
            </Button>
          </div>
          <div
            aria-hidden="true"
            className="grid gap-0.75"
            style={{ gridTemplateColumns: `repeat(${Math.max(run.batches, 1)}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: run.batches }, (_, index) => (
              <span
                key={index}
                className={cx(
                  'h-1.5 rounded-full transition-colors duration-300',
                  segmentClass(index, run),
                )}
              />
            ))}
          </div>
          <p className="text-caption text-ink-muted tabular-nums">
            {m.list.progress(run.done, run.total, run.green, run.yellow)}
          </p>
        </output>
      </div>
    </div>
  );
}
