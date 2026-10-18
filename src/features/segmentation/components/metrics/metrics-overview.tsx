'use client';

import { Button } from '@/ui';

import { SEGMENTATION_QUESTIONS } from '../../config/questions';
import { useConsoleCounts } from '../../hooks/use-console-counts';
import { EVALUATION_SIZE, useEvaluation } from '../../hooks/use-evaluation';
import { useMessages } from '../../hooks/use-messages';
import { useSegmentationStore } from '../../store/segmentation-store';
import { formatPercent, formatUsd } from '../../utils/format';
import { PreferenceToggles } from '../preference-toggles';
import { HonestReading } from './honest-reading';
import { StatTile } from './stat-tile';
import { ThresholdTable } from './threshold-table';

const QUESTION_COUNT = Object.keys(SEGMENTATION_QUESTIONS).length;

export function MetricsOverview() {
  const m = useMessages();
  const evaluation = useSegmentationStore((state) => state.evaluation);
  const counts = useConsoleCounts();
  const { mutate, isPending, isError } = useEvaluation();
  const empty = '—';

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4.5 px-4 py-6 tablet:px-8 desktop:py-7">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-title-lg text-ink">{m.metrics.title}</h1>
          <p className="text-body-md text-ink-soft">
            {evaluation ? m.metrics.subtitle(evaluation.total) : m.metrics.notMeasured}
          </p>
        </div>
        <div className="hidden desktop:block">
          <PreferenceToggles />
        </div>
      </header>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant={evaluation ? 'secondary' : 'primary'}
          disabled={isPending}
          onClick={() => mutate()}
        >
          {isPending ? m.metrics.running : m.metrics.run(EVALUATION_SIZE)}
        </Button>
        {isError ? (
          <p role="alert" className="text-body-sm text-danger">
            {m.metrics.failed}
          </p>
        ) : null}
      </div>
      <dl className="grid gap-3 tablet:grid-cols-2 wide:grid-cols-4">
        <StatTile
          label={m.metrics.medianLatency}
          value={evaluation ? `${evaluation.medianLatencyMs} ms` : empty}
          hint={m.metrics.questions(QUESTION_COUNT)}
        />
        <StatTile
          label={m.metrics.cost}
          value={evaluation ? `≈ ${formatUsd(evaluation.costPerThousandUsd)}` : empty}
          hint={m.metrics.perThousand}
        />
        <StatTile
          label={m.metrics.accuracy}
          value={evaluation ? formatPercent(evaluation.programAccuracy) : empty}
          hint={
            evaluation
              ? m.metrics.baseline(
                  evaluation.baselineAccuracy,
                  m.programs[evaluation.baselineProgram],
                )
              : ''
          }
        />
        <StatTile
          label={m.metrics.profiles}
          value={String(counts.total)}
          hint={evaluation ? m.metrics.tested(evaluation.total) : m.metrics.notTested}
        />
      </dl>
      <ThresholdTable evaluation={evaluation} />
      {evaluation ? <HonestReading evaluation={evaluation} /> : null}
    </div>
  );
}
