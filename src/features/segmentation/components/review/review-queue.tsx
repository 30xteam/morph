'use client';

import { useState } from 'react';

import { cx } from '@/core/cx';

import { useMessages } from '../../hooks/use-messages';
import { useNow } from '../../hooks/use-now';
import { useReviewItems } from '../../hooks/use-review-items';
import { type ReviewTab, useSegmentationStore } from '../../store/segmentation-store';
import { ListTabs } from '../live/list-tabs';
import { ReviewDetail } from './review-detail';
import { ReviewRow } from './review-row';

export function ReviewQueue() {
  const m = useMessages();
  const now = useNow();
  const { items, total, lowConfidence, lowInfo } = useReviewItems();
  const reviews = useSegmentationStore((state) => state.reviews);
  const selectedId = useSegmentationStore((state) => state.reviewSelectedId);
  const select = useSegmentationStore((state) => state.selectReview);
  const tab = useSegmentationStore((state) => state.reviewTab);
  const setTab = useSegmentationStore((state) => state.setReviewTab);
  const [detailOpen, setDetailOpen] = useState(false);
  const selected = items.find((item) => item.profile.id === selectedId) ?? items[0];

  const next = () => {
    const index = items.findIndex((item) => item.profile.id === selected?.profile.id);
    const upcoming = [...items.slice(index + 1), ...items.slice(0, index)].find(
      (item) => !reviews[item.profile.id] && item.profile.id !== selected?.profile.id,
    );
    if (upcoming) select(upcoming.profile.id);
  };

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
          <p className="text-body-sm text-ink-soft">{m.review.subtitle(total)}</p>
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
              onSelect={() => {
                select(item.profile.id);
                setDetailOpen(true);
              }}
            />
          ))}
        </ul>
      </section>
      <ReviewDetail
        item={selected}
        className={cx('flex-1 desktop:flex', detailOpen ? 'flex' : 'hidden')}
        onBack={() => setDetailOpen(false)}
        onNext={next}
      />
    </div>
  );
}
