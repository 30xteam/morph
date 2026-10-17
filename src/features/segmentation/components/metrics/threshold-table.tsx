'use client';

import { cx } from '@/core/cx';

import { useMessages } from '../../hooks/use-messages';
import type { SegmentationEvaluation } from '../../types/evaluation.types';
import { formatPercent } from '../../utils/format';
import { Panel } from '../ui/panel';

const CELL = 'px-3 py-3 text-left';

export function ThresholdTable({ evaluation }: { evaluation: SegmentationEvaluation | null }) {
  const m = useMessages();
  const rows = evaluation?.thresholds ?? [];

  return (
    <Panel title={m.metrics.thresholdTitle} className="h-full">
      <p className="text-body-sm text-ink-muted">{m.metrics.thresholdHint}</p>
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-badge text-ink-muted uppercase">
            <th scope="col" className={CELL}>
              {m.metrics.threshold}
            </th>
            <th scope="col" className={CELL}>
              {m.metrics.decidesAlone}
            </th>
            <th scope="col" className={CELL}>
              {m.metrics.accuracyAlone}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const current = row.threshold === evaluation?.currentThreshold;
            return (
              <tr
                key={row.threshold}
                className={cx(
                  'text-label-sm tabular-nums',
                  current ? 'bg-green-bg text-green-fg' : 'text-ink',
                )}
              >
                <th scope="row" className={cx(CELL, 'rounded-l-md font-semibold')}>
                  {row.threshold.toFixed(2)}
                  {current ? ` · ${m.metrics.current}` : ''}
                </th>
                <td className={CELL}>{formatPercent(row.decidedAloneShare)}</td>
                <td className={cx(CELL, 'rounded-r-md')}>
                  {row.accuracyWhenAlone === null ? '—' : formatPercent(row.accuracyWhenAlone)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Panel>
  );
}
