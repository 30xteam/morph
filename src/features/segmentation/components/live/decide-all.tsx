'use client';

import { Button } from '@/ui';

import { useDecideAll } from '../../hooks/use-decide-all';
import { useMessages } from '../../hooks/use-messages';
import { useSegmentationStore } from '../../store/segmentation-store';
import { formatUsd } from '../../utils/format';
import { DecideProgress } from './decide-progress';

export function DecideAll() {
  const m = useMessages();
  const profiles = useSegmentationStore((state) => state.profiles);
  const history = useSegmentationStore((state) => state.history);
  const run = useSegmentationStore((state) => state.run);
  const { decideAll, cancel } = useDecideAll();
  const undecided = profiles.filter((profile) => !history[profile.id]?.length);
  const targets = undecided.length ? undecided : profiles;

  let status = '';
  if (run.cancelled) status = m.list.cancelled(run.done, run.total);
  else if (run.total) {
    status = m.list.summary(run.done, (run.elapsedMs / 1000).toFixed(1), formatUsd(run.costUsd));
  }

  if (run.running) {
    return (
      <div className="px-5">
        <DecideProgress run={run} onCancel={cancel} />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-5">
      <Button onClick={() => decideAll(targets)} className="desktop:min-h-8 desktop:px-3.5">
        {undecided.length ? m.list.decideAll(targets.length) : m.list.decideAgain(targets.length)}
      </Button>
      <p aria-live="polite" className="text-body-sm text-ink-muted tabular-nums">
        {status}
      </p>
      {run.failed ? (
        <p role="alert" className="w-full text-body-sm text-danger">
          {m.list.failed(run.failed)}
        </p>
      ) : null}
    </div>
  );
}
