'use client';

import { useSegmentationStore, formatUsd } from '@/libs/segmentation';
import { useLumaReceived } from '@/libs/segmentation';
import { Button } from '@/ui';

import { useDecideAll } from '../../hooks/use-decide-all';
import { useMessages } from '../../hooks/use-messages';
import { DecideProgress } from './decide-progress';
import { LiveSignUps } from './live-sign-ups';

export function DecideAll() {
  const m = useMessages();
  const profiles = useSegmentationStore((state) => state.profiles);
  const history = useSegmentationStore((state) => state.history);
  const run = useSegmentationStore((state) => state.run);
  const received = useLumaReceived();
  const { decideAll, cancel } = useDecideAll();
  const undecided = profiles.filter((profile) => !history[profile.id]?.length);
  const targets = undecided.length ? undecided : profiles;

  let status = '';
  if (run.running) status = '';
  else if (run.cancelled) status = m.list.cancelled(run.done, run.total);
  else if (run.total) {
    status = m.list.summary(run.done, (run.elapsedMs / 1000).toFixed(1), formatUsd(run.costUsd));
  }

  let label = m.list.decideAgain(targets.length);
  if (run.running) label = m.list.deciding(run.done, run.total);
  else if (undecided.length) label = m.list.decideAll(targets.length);

  return (
    <div className="flex flex-col gap-2 px-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button
          disabled={run.running}
          aria-busy={run.running}
          onClick={() => decideAll(targets)}
          className="tabular-nums desktop:min-h-8 desktop:px-3.5"
        >
          {label}
        </Button>
        <LiveSignUps />
      </div>
      <DecideProgress open={run.running} run={run} onCancel={cancel} />
      {status ? (
        <p aria-live="polite" className="text-body-sm text-ink-muted tabular-nums">
          {status}
        </p>
      ) : null}
      {run.failed && !run.running ? (
        <p role="alert" className="text-body-sm text-danger">
          {m.list.failed(run.failed)}
        </p>
      ) : null}
      <p className="text-caption text-ink-muted tabular-nums">{m.list.liveHint(received)}</p>
    </div>
  );
}
