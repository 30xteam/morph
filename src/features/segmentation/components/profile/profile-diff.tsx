import { cx } from '@/core/cx';

import { ACTION_LABELS, LIGHT_LABELS, SEGMENT_LABELS, TRIGGER_LABELS } from '../../config/labels';
import type { SegmentationOutcome } from '../../types/segmentation.types';

interface ProfileDiffProps {
  previous: SegmentationOutcome;
  current: SegmentationOutcome;
}

export function ProfileDiff({ previous, current }: ProfileDiffProps) {
  const rows = [
    {
      label: 'What to do',
      before: LIGHT_LABELS[previous.light],
      after: LIGHT_LABELS[current.light],
    },
    {
      label: 'Group',
      before: SEGMENT_LABELS[previous.segment.value],
      after: SEGMENT_LABELS[current.segment.value],
    },
    {
      label: 'How sure',
      before: `${ACTION_LABELS[previous.action]} · ${Math.round(previous.segment.probability * 100)}%`,
      after: `${ACTION_LABELS[current.action]} · ${Math.round(current.segment.probability * 100)}%`,
    },
  ];
  const changed = rows.some(({ before, after }) => before !== after);

  return (
    <section
      aria-labelledby="diff-heading"
      aria-live="polite"
      className="flex flex-col gap-2 rounded-md border border-border px-4 py-3"
    >
      <h3 id="diff-heading" className="text-label-md text-fg-strong">
        After it {TRIGGER_LABELS[current.trigger]}
      </h3>
      {changed ? null : (
        <p className="text-body-sm text-fg-muted">
          Nothing changed. Jev sees this person the same way.
        </p>
      )}
      <table className="w-full text-body-sm">
        <thead>
          <tr className="text-left text-caption text-fg-muted">
            <th scope="col" className="py-1 pr-3 font-normal">
              <span className="sr-only">Item</span>
            </th>
            <th scope="col" className="py-1 pr-3 font-normal">
              Before
            </th>
            <th scope="col" className="py-1 font-normal">
              Now
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ label, before, after }) => {
            const moved = before !== after;
            return (
              <tr key={label}>
                <th
                  scope="row"
                  className="py-1 pr-3 text-left text-caption font-normal text-fg-muted"
                >
                  {label}
                </th>
                <td className="py-1 pr-3 text-fg-muted">{before}</td>
                <td className={cx('py-1', moved ? 'text-label-sm text-fg-strong' : 'text-fg-soft')}>
                  {after}
                  {moved ? <span className="ml-2 text-caption text-primary">Changed</span> : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
