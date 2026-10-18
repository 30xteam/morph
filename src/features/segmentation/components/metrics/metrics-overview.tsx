'use client';

import { cx } from '@/core/cx';
import {
  SEGMENTATION_QUESTIONS,
  useConsoleCounts,
  useSegmentationStore,
  formatPercent,
  formatUsd,
} from '@/libs/segmentation';
import { Button, TagBadge } from '@/ui';

import { EVALUATION_SIZE, useEvaluation } from '../../hooks/use-evaluation';
import { useMessages } from '../../hooks/use-messages';
import { evaluationDeltas } from '../../services/evaluation-delta';
import { PreferenceToggles } from '../preference-toggles';
import { HonestReading } from './honest-reading';
import { StatTile } from './stat-tile';
import { ThresholdTable } from './threshold-table';

const QUESTION_COUNT = Object.keys(SEGMENTATION_QUESTIONS).length;

export function MetricsOverview() {
  const m = useMessages();
  const evaluation = useSegmentationStore((state) => state.evaluation);
  const previous = useSegmentationStore((state) => state.previousEvaluation);
  const counts = useConsoleCounts();
  const { mutate, isPending, isError } = useEvaluation();
  const deltas =
    evaluation && previous && !isPending ? evaluationDeltas(evaluation, previous) : null;
  let measureNote = '';
  if (isPending) measureNote = m.metrics.updating;
  else if (deltas && Object.values(deltas).some(Boolean)) measureNote = m.metrics.comparedPrevious;
  const error = isError ? (
    <p role="alert" className="text-body-sm text-danger">
      {m.metrics.failed}
    </p>
  ) : null;

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4.5 px-4 py-6 tablet:px-8 desktop:py-7">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-title-lg text-ink">{m.metrics.title}</h1>
          {evaluation ? (
            <p className="text-body-md text-ink-soft">{m.metrics.subtitle(evaluation.total)}</p>
          ) : null}
          {evaluation ? (
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-body-sm text-ink-muted">
                {m.metrics.measuredWith(evaluation.provider, evaluation.calibrated)}
              </p>
              {evaluation.provider === 'typesafe' ? null : (
                <TagBadge tone="warning">{m.metrics.notRealJev}</TagBadge>
              )}
            </div>
          ) : null}
        </div>
        <div className="hidden desktop:block">
          <PreferenceToggles />
        </div>
      </header>
      {evaluation ? (
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" disabled={isPending} onClick={() => mutate()}>
            {isPending
              ? m.metrics.runningCount(EVALUATION_SIZE)
              : m.metrics.runAgain(EVALUATION_SIZE)}
          </Button>
          <p aria-live="polite" className="text-body-sm text-ink-muted">
            {measureNote}
          </p>
          {error}
        </div>
      ) : (
        <section
          aria-labelledby="metrics-empty"
          className="flex flex-col items-start gap-3 rounded-lg border border-line bg-card px-5 py-4.5"
        >
          <h2 id="metrics-empty" className="text-label-md text-ink">
            {m.metrics.emptyTitle}
          </h2>
          <p className="text-body-sm text-ink-soft">{m.metrics.emptyBody(EVALUATION_SIZE)}</p>
          <Button disabled={isPending} onClick={() => mutate()}>
            {isPending ? m.metrics.running : m.metrics.run(EVALUATION_SIZE)}
          </Button>
          {error}
        </section>
      )}
      {evaluation ? (
        <div aria-hidden="true" className="relative -my-2 h-0.5 overflow-hidden rounded-full">
          {isPending ? (
            <span className="absolute inset-y-0 left-0 w-2/5 bg-accent motion-safe:animate-indeterminate" />
          ) : null}
        </div>
      ) : null}
      {evaluation ? (
        <dl
          aria-busy={isPending}
          className={cx(
            'grid gap-3 transition-opacity duration-200 tablet:grid-cols-2 wide:grid-cols-4',
            isPending && 'opacity-45',
          )}
        >
          <StatTile
            label={m.metrics.medianLatency}
            value={`${evaluation.medianLatencyMs} ms`}
            hint={m.metrics.questions(QUESTION_COUNT)}
            delta={deltas?.latency}
          />
          <StatTile
            label={m.metrics.cost}
            value={`≈ ${formatUsd(evaluation.costPerThousandUsd)}`}
            hint={m.metrics.perThousand}
            delta={deltas?.cost}
          />
          <StatTile
            label={m.metrics.accuracy}
            value={formatPercent(evaluation.programAccuracy)}
            hint={m.metrics.baseline(
              evaluation.baselineAccuracy,
              m.programs[evaluation.baselineProgram],
            )}
            delta={deltas?.accuracy}
          />
          <StatTile
            label={m.metrics.profiles}
            value={String(counts.total)}
            hint={m.metrics.tested(evaluation.total)}
          />
        </dl>
      ) : null}
      <ThresholdTable evaluation={evaluation} />
      {evaluation ? <HonestReading evaluation={evaluation} /> : null}
    </div>
  );
}
