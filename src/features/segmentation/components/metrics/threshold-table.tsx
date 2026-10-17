'use client';

import { cx } from '@/core/cx';

import { THRESHOLD_STEPS, THRESHOLDS } from '../../config/thresholds';
import { EVALUATION_SIZE } from '../../hooks/use-evaluation';
import { useMessages } from '../../hooks/use-messages';
import type { SegmentationEvaluation, ThresholdRow } from '../../types/evaluation.types';
import { formatPercent } from '../../utils/format';

const CELL = 'px-3 text-right';

type Row = Pick<ThresholdRow, 'threshold'> & Partial<ThresholdRow>;

export function ThresholdTable({ evaluation }: { evaluation: SegmentationEvaluation | null }) {
  const m = useMessages();
  const rows: Row[] = evaluation?.thresholds ?? THRESHOLD_STEPS.map((threshold) => ({ threshold }));
  const currentThreshold = evaluation?.currentThreshold ?? THRESHOLDS.act;
  const value = (share: number | null | undefined) => {
    if (share === undefined) return m.metrics.pending;
    return share === null ? '—' : formatPercent(share);
  };

  return (
    <section
      aria-labelledby="threshold-heading"
      className="flex flex-col gap-1 rounded-lg border border-line bg-card px-5 pt-5 pb-3"
    >
      <h2 id="threshold-heading" className="text-label-md text-ink">
        {m.metrics.thresholdTitle}
      </h2>
      <p className="pb-3.5 text-body-sm text-ink-muted">
        {evaluation ? m.metrics.thresholdHint : m.metrics.thresholdPending(EVALUATION_SIZE)}
      </p>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-line text-caption font-medium text-ink-muted">
            <th scope="col" className="px-3 py-2 text-left font-medium">
              {m.metrics.threshold}
            </th>
            <th scope="col" className={cx(CELL, 'py-2 font-medium')}>
              {m.metrics.decidesAlone}
            </th>
            <th scope="col" className={cx(CELL, 'py-2 font-medium')}>
              {m.metrics.accuracyAlone}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const current = row.threshold === currentThreshold;
            return (
              <tr
                key={row.threshold}
                className={cx(
                  'border-b border-line text-body-md tabular-nums',
                  current && 'bg-raised',
                  evaluation ? 'text-ink' : 'text-ink-muted',
                )}
              >
                <th scope="row" className="px-3 py-3.5 text-left font-normal">
                  <span className="text-label-sm text-ink">{row.threshold.toFixed(2)}</span>
                  {current ? (
                    <span className="ml-2 text-caption text-ink-muted">{m.metrics.current}</span>
                  ) : null}
                </th>
                <td className={cx(CELL, 'py-3.5')}>{value(row.decidedAloneShare)}</td>
                <td className={cx(CELL, 'py-3.5')}>{value(row.accuracyWhenAlone)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
