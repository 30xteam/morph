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
    <details className="group flex flex-col gap-2 text-body-sm text-fg-muted">
      <summary className="min-h-11 cursor-pointer content-center rounded-sm text-label-md text-fg-strong desktop:min-h-9.5">
        How Jev is performing
      </summary>
      <div className="flex flex-col gap-2 pt-1">
        <p className="tabular-nums">
          <span className="text-fg-strong">
            {Math.round(avg((outcome) => outcome.meta.latencyMs))} ms
          </span>{' '}
          average Jev decision ·{' '}
          <span className="text-fg-strong">
            {formatUsd(avg((outcome) => outcome.meta.costUsd) * 1000)}
          </span>{' '}
          per 1,000 sign-ups · one call answers eight questions
          {meta && !meta.calibrated ? ' · simulated answers, not real Jev' : ''}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {data ? (
            <p className="tabular-nums">
              Checked against {data.total} people with known answers: right group{' '}
              <span className="text-fg-strong">{formatPercent(data.segmentAccuracy)}</span> of the
              time, right next step{' '}
              <span className="text-fg-strong">{formatPercent(data.lightAccuracy)}</span>
            </p>
          ) : (
            <p>Accuracy not checked yet.</p>
          )}
          <Button variant="ghost" onClick={() => mutate()} disabled={isPending}>
            {isPending ? 'Checking…' : 'Check accuracy'}
          </Button>
          {isError ? (
            <span role="alert" className="text-danger">
              The accuracy check didn’t finish. Try again in a moment.
            </span>
          ) : null}
        </div>
        {data?.misses.length ? (
          <ul className="flex flex-col gap-1 text-caption">
            {data.misses.map((miss) => (
              <li key={miss.alias}>
                {miss.alias}: should be {miss.expected}, Jev said {miss.got}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </details>
  );
}
