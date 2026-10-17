import { LIGHT_LABELS, PROGRAM_LABELS, TRIGGER_LABELS } from '../../config/labels';
import type { SegmentationOutcome } from '../../types/segmentation.types';
import { timeAgo } from '../../utils/format';

export function ProfileHistory({ history }: { history: SegmentationOutcome[] }) {
  return (
    <section aria-labelledby="history-heading" className="flex flex-col gap-2">
      <h3 id="history-heading" className="text-label-md text-fg-strong">
        How the decision changed
      </h3>
      <ol className="flex flex-col gap-2">
        {history.toReversed().map((outcome) => (
          <li key={outcome.meta.decidedAt} className="flex flex-col text-body-sm">
            <span className="text-fg-soft">
              {PROGRAM_LABELS[outcome.program.value]} · {LIGHT_LABELS[outcome.light]}
            </span>
            <span className="text-caption text-fg-muted">
              After it {TRIGGER_LABELS[outcome.trigger]} · {timeAgo(outcome.meta.decidedAt)}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
