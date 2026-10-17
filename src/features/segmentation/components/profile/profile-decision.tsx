'use client';

import {
  AFFINITY_LABELS,
  describeReason,
  PROGRAM_LABELS,
  recommendationTitle,
  SEGMENT_LABELS,
} from '../../config/labels';
import { useSegmentationStore } from '../../store/segmentation-store';
import type { ProgramKey, SegmentationOutcome } from '../../types/segmentation.types';
import { ConfidenceBar } from '../confidence-bar';
import { LightBadge } from '../light-badge';

const PROGRAM_KEYS = Object.keys(PROGRAM_LABELS) as ProgramKey[];

function yesNo(probability: number) {
  return probability >= 0.5 ? 'Yes' : 'No';
}

export function ProfileDecision({ outcome }: { outcome: SegmentationOutcome }) {
  const review = useSegmentationStore((state) => state.review);
  const verdict = useSegmentationStore((state) => state.reviews[outcome.profileId]);

  const answers = [
    {
      question: 'Program',
      type: 'choice',
      answer: PROGRAM_LABELS[outcome.program.value],
      p: outcome.program.probability,
    },
    {
      question: 'Affinity',
      type: 'score',
      answer: AFFINITY_LABELS[outcome.affinity.value],
      p: outcome.affinity.probability,
    },
    {
      question: 'Role',
      type: 'choice',
      answer: SEGMENT_LABELS[outcome.segment.value],
      p: outcome.segment.probability,
    },
    {
      question: 'Ready to buy',
      type: 'noul',
      answer: yesNo(outcome.salesReady),
      p: outcome.salesReady,
    },
    {
      question: 'Can decide the purchase',
      type: 'noul',
      answer: yesNo(outcome.decisionPower),
      p: outcome.decisionPower,
    },
    {
      question: 'Wants to learn',
      type: 'noul',
      answer: yesNo(outcome.wantsLearning),
      p: outcome.wantsLearning,
    },
  ];

  return (
    <section aria-label="Jev decision" className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 rounded-md bg-surface-subtle px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-label-md text-fg-strong">
            {recommendationTitle(outcome.recommendation)}
          </h3>
          <LightBadge light={outcome.light} />
        </div>
        <p className="text-caption text-fg-muted">
          {outcome.reasons.map(describeReason).join(' · ')}
        </p>
      </div>

      <dl className="flex flex-col">
        {answers.map(({ question, type, answer, p }) => (
          <div
            key={question}
            className="flex items-center justify-between gap-3 border-b border-border py-2 last:border-b-0"
          >
            <dt className="text-caption text-fg-muted">
              {question} <span className="text-fg-soft">· {type}</span>
            </dt>
            <dd className="flex items-center gap-3">
              <span className="text-label-sm text-fg-strong">{answer}</span>
              <ConfidenceBar value={p} label={`${question} probability`} />
            </dd>
          </div>
        ))}
      </dl>

      {outcome.needsReview ? (
        <label className="flex flex-col gap-1 text-caption text-fg-muted">
          {verdict?.verdict === 'corrected'
            ? `Corrected to ${PROGRAM_LABELS[verdict.program]}`
            : 'Correct the program if Jev got it wrong'}
          <select
            defaultValue=""
            onChange={(event) =>
              review(outcome.profileId, {
                verdict: 'corrected',
                program: event.target.value as ProgramKey,
              })
            }
            className="h-11 w-full max-w-xs rounded-input border border-border-input bg-surface px-2 text-body-sm text-fg desktop:h-9.5"
          >
            <option value="" disabled>
              Choose a program…
            </option>
            {PROGRAM_KEYS.map((key) => (
              <option key={key} value={key}>
                {PROGRAM_LABELS[key]}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <p className="text-caption text-fg-muted tabular-nums">
        {outcome.meta.latencyMs} ms · {outcome.meta.inputTokens} input tokens · {outcome.meta.model}
      </p>
    </section>
  );
}
