'use client';

import { usePreferences } from '@/core/preferences';
import { Panel } from '@/ui';

import { useMessages } from '../../hooks/use-messages';
import type { SegmentationOutcome } from '../../types/segmentation.types';
import { timeAgo } from '../../utils/format';

interface SegmentChangeCardProps {
  previous: SegmentationOutcome | undefined;
  current: SegmentationOutcome;
  now: number;
}

export function SegmentChangeCard({ previous, current, now }: SegmentChangeCardProps) {
  const m = useMessages();
  const { locale } = usePreferences();

  if (!previous) {
    return (
      <Panel title={m.detail.segmentChange}>
        <div className="flex flex-col gap-0.75">
          <span className="text-caption text-ink-muted">{m.detail.now}</span>
          <span className="text-title-sm text-ink">{m.programs[current.program.value]}</span>
        </div>
        <p className="text-body-sm text-ink-muted">{m.detail.firstDecision}</p>
      </Panel>
    );
  }

  const changed = previous.program.value !== current.program.value;
  return (
    <Panel title={m.detail.segmentChange}>
      <div className="flex flex-wrap items-center gap-4.5">
        <div className="flex flex-col gap-0.75">
          <span className="text-caption text-ink-muted">{m.detail.before}</span>
          <span className="text-body-lg text-ink-muted">{m.programs[previous.program.value]}</span>
        </div>
        <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 text-ink-muted" fill="none">
          <path
            d="M3 8h10m0 0L9 4m4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="flex flex-col gap-0.75">
          <span className="text-caption text-ink-muted">{m.detail.now}</span>
          <span className="text-title-sm text-ink">{m.programs[current.program.value]}</span>
        </div>
      </div>
      <p className="text-body-sm text-ink-muted">
        {m.detail.changeSentence(
          m.triggers[current.trigger],
          timeAgo(current.meta.decidedAt, now, locale),
          changed,
        )}
      </p>
    </Panel>
  );
}
