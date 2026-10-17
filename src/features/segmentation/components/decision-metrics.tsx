'use client';

import { Button } from '@/ui';

import { useEvaluation } from '../hooks/use-evaluation';
import { latestOutcome, useSegmentationStore } from '../store/segmentation-store';
import { formatPercent, formatUsd } from '../utils/format';

export function DecisionMetrics() {
  const history = useSegmentationStore((state) => state.history);
  const { mutate, data, isPending, isError } = useEvaluation();

  const outcomes = Object.values(history)
    .map(latestOutcome)
    .filter((outcome) => outcome !== undefined);
  const avg = (pick: (outcome: (typeof outcomes)[number]) => number) =>
    outcomes.length
      ? outcomes.reduce((total, outcome) => total + pick(outcome), 0) / outcomes.length
      : 0;
  const meta = outcomes[0]?.meta;

  return (
    <div className="flex flex-col gap-2 text-body-sm text-fg-muted">
      <p className="tabular-nums">
        <span className="text-fg-strong">
          {Math.round(avg((outcome) => outcome.meta.latencyMs))} ms
        </span>{' '}
        average Jev decision ·{' '}
        <span className="text-fg-strong">
          {formatUsd(avg((outcome) => outcome.meta.costUsd) * 1000)}
        </span>{' '}
        per 1,000 sign-ups · one call answers eight typed questions
        {meta && !meta.calibrated ? ` · provider ${meta.provider}, probabilities emulated` : ''}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {data ? (
          <p className="tabular-nums">
            Measured on {data.total} annotated profiles:{' '}
            <span className="text-fg-strong">{formatPercent(data.segmentAccuracy)}</span> segment ·{' '}
            <span className="text-fg-strong">{formatPercent(data.lightAccuracy)}</span> traffic
            light
          </p>
        ) : (
          <p>Accuracy not measured yet.</p>
        )}
        <Button variant="ghost" onClick={() => mutate()} disabled={isPending}>
          {isPending ? 'Measuring…' : 'Measure accuracy'}
        </Button>
        {isError ? (
          <span role="alert" className="text-danger">
            Could not run the evaluation.
          </span>
        ) : null}
      </div>
      {data?.misses.length ? (
        <ul className="flex flex-col gap-1 text-caption">
          {data.misses.map((miss) => (
            <li key={miss.alias}>
              {miss.alias}: expected {miss.expected}, got {miss.got}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
