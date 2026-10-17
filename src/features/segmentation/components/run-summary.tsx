'use client';

import { useSegmentationStore } from '../store/segmentation-store';
import { formatUsd } from '../utils/format';

function summary(done: number, failed: number, elapsedMs: number, jevMs: number, costUsd: number) {
  const sorted = done - failed;
  const average = sorted ? Math.round(jevMs / sorted) : 0;
  return `${sorted} people sorted in ${(elapsedMs / 1000).toFixed(1)} s · about ${average} ms each · total cost ${formatUsd(costUsd)}`;
}

export function RunSummary() {
  const { running, total, done, failed, elapsedMs, jevMs, costUsd } = useSegmentationStore(
    (state) => state.run,
  );

  if (!running && done === 0) return null;

  return (
    <div className="flex flex-col gap-1 text-caption tabular-nums tablet:items-end">
      <p aria-live="polite" className="text-fg-muted">
        {running
          ? `Jev is sorting ${done} of ${total} people…`
          : summary(done, failed, elapsedMs, jevMs, costUsd)}
      </p>
      {!running && failed ? (
        <p role="alert" className="text-danger">
          Jev couldn’t sort {failed} {failed === 1 ? 'person' : 'people'}. Try again in a moment.
        </p>
      ) : null}
    </div>
  );
}
