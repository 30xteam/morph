'use client';

import { useState } from 'react';

import { cx } from '@/core/cx';
import { useNow } from '@/core/hooks';
import { usePreferences } from '@/core/preferences';

import { useMessages } from '../../hooks/use-messages';
import { useReviewFlow } from '../../hooks/use-review-flow';
import { useReviewItems } from '../../hooks/use-review-items';
import { useReviewShortcuts } from '../../hooks/use-review-shortcuts';
import { useReviewTab } from '../../hooks/use-review-tab';
import { type ReviewTab, useSegmentationStore } from '../../store/segmentation-store';
import { timeAgo } from '../../utils/format';
import { ListTabs } from '../live/list-tabs';
import { ReviewDetail } from './review-detail';
import { ReviewRow } from './review-row';

export function ReviewQueue() {
  const m = useMessages();
  const now = useNow();
  const { locale } = usePreferences();
  const { items, total, labeled, lowConfidence, lowInfo } = useReviewItems();
  const reviews = useSegmentationStore((state) => state.reviews);
  const [tab, setTab] = useReviewTab();
  const [detailOpen, setDetailOpen] = useState(false);
  const flow = useReviewFlow(items);
  const { selected } = flow;
  useReviewShortcuts({
    onMove: flow.move,
    onPick: flow.pick,
    onConfirm: flow.confirm,
    onSkip: flow.skip,
  });

  const showTime =
    new Set(items.map((item) => timeAgo(item.outcome.meta.decidedAt, now, locale))).size > 1;

  const tabs: { value: ReviewTab; label: string; count: number }[] = [
    { value: 'all', label: m.review.all, count: total },
    { value: 'low_confidence', label: m.review.lowConfidence, count: lowConfidence },
    { value: 'low_info', label: m.review.lowInfo, count: lowInfo },
  ];

  return (
    <div className="flex min-w-0 flex-1 desktop:h-dvh">
      <section
        aria-labelledby="review-heading"
        className={cx(
          'min-w-0 flex-1 flex-col gap-3.5 border-line py-6 desktop:flex desktop:h-dvh desktop:w-list desktop:flex-none desktop:border-r',
          detailOpen ? 'hidden' : 'flex',
        )}
      >
        <header className="flex flex-col gap-1 px-5">
          <h1 id="review-heading" className="text-title-md text-ink">
            {m.review.title}
          </h1>
          <p className="text-body-sm text-ink-soft">
            <span className="tablet:hidden">{m.review.subtitleShort(total)}</span>
            <span className="hidden tablet:inline">{m.review.subtitle(total)}</span>
          </p>
          <div className="flex min-h-8 flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-label-sm text-ink tabular-nums">
              {m.review.progress(labeled, total)}
            </p>
          </div>
        </header>
        <ListTabs label={m.review.title} value={tab} tabs={tabs} onChange={setTab} />
        <ul className="flex flex-col gap-0.5 overflow-y-auto px-3 pb-6">
          {items.map((item) => (
            <ReviewRow
              key={item.profile.id}
              item={item}
              selected={item.profile.id === selected?.profile.id}
              labeled={Boolean(reviews[item.profile.id])}
              now={now}
              showTime={showTime}
              onSelect={() => {
                flow.goTo(item.profile.id);
                setDetailOpen(true);
              }}
            />
          ))}
        </ul>
      </section>
      <ReviewDetail
        item={selected}
        titleRef={flow.titleRef}
        choice={flow.choice}
        className={cx('flex-1 desktop:flex', detailOpen ? 'flex' : 'hidden')}
        onBack={() => setDetailOpen(false)}
        onChoose={flow.choose}
        onConfirm={flow.confirm}
        onSkip={flow.skip}
      />
    </div>
  );
}
