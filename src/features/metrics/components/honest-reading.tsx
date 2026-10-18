'use client';

import type { SegmentationEvaluation } from '@/libs/segmentation';
import { Panel } from '@/ui';

import { useMessages } from '../hooks/use-messages';

export function HonestReading({ evaluation }: { evaluation: SegmentationEvaluation }) {
  const m = useMessages();
  const { programAccuracy, baselineAccuracy, lowInfoLowAffinity } = evaluation;
  const notes = [
    {
      title: m.metrics.filterTitle(programAccuracy > baselineAccuracy),
      body: m.metrics.filterBody(programAccuracy, baselineAccuracy),
    },
    ...(lowInfoLowAffinity.alsoLowAffinity * 2 >= lowInfoLowAffinity.lowInfo &&
    lowInfoLowAffinity.lowInfo
      ? [
          {
            title: m.metrics.lowInfoTitle,
            body: m.metrics.lowInfoBody(
              lowInfoLowAffinity.lowInfo,
              lowInfoLowAffinity.alsoLowAffinity,
            ),
          },
        ]
      : []),
    { title: m.metrics.policyTitle, body: m.metrics.policyBody },
  ];

  return (
    <Panel title={m.metrics.honest}>
      <dl className="flex flex-col gap-4">
        {notes.map((note) => (
          <div key={note.title} className="flex flex-col gap-1">
            <dt className="text-label-sm font-semibold text-ink">{note.title}</dt>
            <dd className="text-body-sm text-ink-soft">{note.body}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}
