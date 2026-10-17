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
  const providers = [...new Set(outcomes.map((outcome) => outcome.meta.provider))]
    .toSorted()
    .join(', ');
  const uncalibrated = outcomes.filter((outcome) => !outcome.meta.calibrated).length;

  return (
    <div className="flex flex-col gap-2 text-body-sm text-fg-muted">
      <p className="tabular-nums">
        <span className="text-fg-strong">
          {outcomes.length ? `${Math.round(avg((outcome) => outcome.meta.latencyMs))} ms` : '—'}
        </span>{' '}
        average Jev decision ·{' '}
        <span className="text-fg-strong">
          {outcomes.length ? formatUsd(avg((outcome) => outcome.meta.costUsd) * 1000) : '—'}
        </span>{' '}
        estimated per 1,000 decisions · latest decision per profile
        {outcomes.length
          ? ` · providers ${providers} · ${uncalibrated}/${outcomes.length} decisions have uncalibrated probabilities`
          : ''}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {data ? (
          <p className="tabular-nums">
            Against 30X’s own labels on {data.total} profiles:{' '}
            <span className="text-fg-strong">{formatPercent(data.programAccuracy)}</span> same
            program ·{' '}
            <span className="text-fg-strong">{formatPercent(data.affinityWithinOneBand)}</span>{' '}
            affinity within one band ·{' '}
            <span className="text-fg-strong">{formatPercent(data.decidedAloneShare)}</span> decided
            without a person
          </p>
        ) : (
          <p>Accuracy against 30X’s labels not measured yet.</p>
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
          {data.misses.slice(0, 8).map((miss) => (
            <li key={miss.alias}>
              {miss.alias}: expected {miss.expected}, got {miss.got}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
