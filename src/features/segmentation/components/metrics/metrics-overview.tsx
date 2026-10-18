'use client';

import { Button } from '@/ui';

import { SEGMENTATION_QUESTIONS } from '../../config/questions';
import { useConsoleCounts } from '../../hooks/use-console-counts';
import { EVALUATION_SIZE, useEvaluation } from '../../hooks/use-evaluation';
import { useMessages } from '../../hooks/use-messages';
import { useSegmentationStore } from '../../store/segmentation-store';
import { formatPercent, formatUsd } from '../../utils/format';
import { PreferenceToggles } from '../preference-toggles';
import { TagBadge } from '../ui/tag-badge';
import { HonestReading } from './honest-reading';
import { StatTile } from './stat-tile';
import { ThresholdTable } from './threshold-table';

const QUESTION_COUNT = Object.keys(SEGMENTATION_QUESTIONS).length;

export function MetricsOverview() {
  const m = useMessages();
  const evaluation = useSegmentationStore((state) => state.evaluation);
  const counts = useConsoleCounts();
  const { mutate, isPending, isError } = useEvaluation();
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
            {isPending ? m.metrics.running : m.metrics.runAgain(EVALUATION_SIZE)}
          </Button>
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
        <dl className="grid gap-3 tablet:grid-cols-2 wide:grid-cols-4">
          <StatTile
            label={m.metrics.medianLatency}
            value={`${evaluation.medianLatencyMs} ms`}
            hint={m.metrics.questions(QUESTION_COUNT)}
          />
          <StatTile
            label={m.metrics.cost}
            value={`≈ ${formatUsd(evaluation.costPerThousandUsd)}`}
            hint={m.metrics.perThousand}
          />
          <StatTile
            label={m.metrics.accuracy}
            value={formatPercent(evaluation.programAccuracy)}
            hint={m.metrics.baseline(
              evaluation.baselineAccuracy,
              m.programs[evaluation.baselineProgram],
            )}
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
