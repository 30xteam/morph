'use client';

import {
  ACTION_HINTS,
  MATURITY_LABELS,
  QUESTION_LABELS,
  SEGMENT_LABELS,
  STAGE_LABELS,
  URGENCY_LABELS,
} from '../../config/labels';
import type { SegmentationOutcome } from '../../types/segmentation.types';
import { certaintyLabel } from '../../utils/certainty';
import { ActionBadge } from '../action-badge';
import { ConfidenceBar } from '../confidence-bar';
import { LightBadge } from '../light-badge';
import { ProfileReview } from './profile-review';

function yesNo(probability: number) {
  return probability >= 0.5 ? 'Yes' : 'No';
}

function yesNoCertainty(probability: number) {
  return Math.max(probability, 1 - probability);
}

export function ProfileDecision({ outcome }: { outcome: SegmentationOutcome }) {
  const answers = [
    {
      id: 'segment',
      answer: SEGMENT_LABELS[outcome.segment.value],
      p: outcome.segment.probability,
    },
    {
      id: 'companyStage',
      answer: STAGE_LABELS[outcome.companyStage.value],
      p: outcome.companyStage.probability,
    },
    {
      id: 'aiMaturity',
      answer: MATURITY_LABELS[outcome.aiMaturity.value],
      p: outcome.aiMaturity.probability,
    },
    {
      id: 'urgency',
      answer: URGENCY_LABELS[outcome.urgency.value],
      p: outcome.urgency.probability,
    },
    { id: 'salesReady', answer: yesNo(outcome.salesReady), p: yesNoCertainty(outcome.salesReady) },
    {
      id: 'decisionPower',
      answer: yesNo(outcome.decisionPower),
      p: yesNoCertainty(outcome.decisionPower),
    },
    { id: 'fitsOffer', answer: yesNo(outcome.fitsOffer), p: yesNoCertainty(outcome.fitsOffer) },
    {
      id: 'wantsLearning',
      answer: yesNo(outcome.wantsLearning),
      p: yesNoCertainty(outcome.wantsLearning),
    },
  ] as const;

  return (
    <section aria-label="Jev’s suggestion" className="flex flex-col gap-5">
      <div className="flex flex-col gap-2 rounded-md bg-surface-subtle px-4 py-4">
        <LightBadge light={outcome.light} />
        <h3 className="text-title-md text-fg-strong">{outcome.recommendation.title}</h3>
        <p className="max-w-prose text-body-sm text-fg-soft">{outcome.recommendation.detail}</p>
        <ul className="flex list-disc flex-col gap-0.5 pl-5 text-body-sm text-fg-muted">
          {outcome.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
        <div className="flex flex-col gap-0.5 border-t border-border pt-2">
          <ActionBadge action={outcome.action} probability={outcome.segment.probability} />
          <p className="text-caption text-fg-muted">{ACTION_HINTS[outcome.action]}</p>
        </div>
      </div>

      <ProfileReview outcome={outcome} />

      <div className="flex flex-col gap-2">
        <h3 className="text-label-md text-fg-strong">What Jev understood</h3>
        <dl className="flex flex-col">
          {answers.map(({ id, answer, p }) => (
            <div
              key={id}
              className="grid grid-cols-1 gap-1 border-b border-border py-2 last:border-b-0 tablet:grid-cols-[1fr_auto] tablet:items-center tablet:gap-3"
            >
              <dt className="text-body-sm text-fg-muted">{QUESTION_LABELS[id]}</dt>
              <dd className="flex items-center gap-3">
                <span className="w-28 text-label-sm text-fg-strong">{answer}</span>
                <ConfidenceBar value={p} label={`${QUESTION_LABELS[id]}: ${certaintyLabel(p)}`} />
                <span className="w-20 text-caption text-fg-muted">{certaintyLabel(p)}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <details className="text-caption text-fg-muted">
        <summary className="min-h-11 cursor-pointer content-center rounded-sm text-label-sm text-fg-soft desktop:min-h-0">
          Technical details
        </summary>
        <p className="pt-2 tabular-nums">
          {outcome.meta.latencyMs} ms · {outcome.meta.inputTokens} input tokens · $
          {outcome.meta.costUsd.toFixed(6)} · model {outcome.meta.model}
          {outcome.meta.calibrated ? '' : ' · simulated answers, not real Jev'}
        </p>
      </details>
    </section>
  );
}
