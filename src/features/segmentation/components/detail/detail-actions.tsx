'use client';

import { useState } from 'react';

import { useSegmentationStore, type SegmentationOutcome } from '@/libs/segmentation';
import { Button, notify } from '@/ui';

import { useMessages } from '../../hooks/use-messages';
import { TryChangeDialog } from './try-change-dialog';

export function DetailActions({ outcome }: { outcome: SegmentationOutcome }) {
  const m = useMessages();
  const id = outcome.profileId;
  const sent = useSegmentationStore((state) => state.sent[id]);
  const flagged = useSegmentationStore((state) => state.flagged.includes(id));
  const markSent = useSegmentationStore((state) => state.markSent);
  const flag = useSegmentationStore((state) => state.flag);
  const unmarkSent = useSegmentationStore((state) => state.unmarkSent);
  const unflag = useSegmentationStore((state) => state.unflag);
  const { kind, program } = outcome.recommendation;
  const action = m.detail.actions[kind](m.programs[program]);
  const inReview = flagged || outcome.needsReview;
  const [changing, setChanging] = useState(false);

  function send() {
    markSent(id, kind);
    notify.success(m.detail.sentToast(action), {
      description: m.detail.sentToastBody(id),
      action: {
        label: m.detail.undo,
        onClick: () => {
          unmarkSent(id);
          notify.undo(m.detail.sentUndone(id));
        },
      },
    });
  }

  function sendToReview() {
    flag(id);
    notify.info(m.detail.flaggedToast(id), {
      description: m.detail.flaggedToastBody,
      action: {
        label: m.detail.undo,
        onClick: () => {
          unflag(id);
          notify.undo(m.detail.flaggedUndone(id));
        },
      },
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2.5">
        <Button onClick={send} disabled={sent === kind}>
          {action}
        </Button>
        <Button variant="secondary" onClick={sendToReview} disabled={inReview}>
          {inReview ? m.detail.inReview : m.detail.sendToReview}
        </Button>
        <Button variant="ghost" onClick={() => setChanging(true)}>
          {m.detail.tryChange}
        </Button>
        <p className="w-full text-caption text-ink-muted tablet:ml-auto tablet:w-auto">
          {m.detail.simulated}
        </p>
      </div>
      <TryChangeDialog profileId={id} open={changing} onOpenChange={setChanging} />
      <p aria-live="polite" className="text-body-sm text-ink-soft">
        {sent ? m.detail.queued(m.detail.actions[sent](m.programs[program])) : ''}
      </p>
    </div>
  );
}
