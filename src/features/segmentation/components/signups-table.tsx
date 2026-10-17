'use client';

import { show } from '@ebay/nice-modal-react';

import { cx } from '@/core/cx';

import { RECOMMENDATION_LABELS, SEGMENT_LABELS } from '../config/labels';
import { latestOutcome, useSegmentationStore } from '../store/segmentation-store';
import type { SegmentationOutcome } from '../types/segmentation.types';
import { ConfidenceBar } from './confidence-bar';
import { LightBadge } from './light-badge';
import { ProfileDialog } from './profile/profile-dialog';

const HEAD = 'px-3 py-2 text-left text-caption text-fg-muted';
const CELL = 'px-3 py-3 align-middle';

function segmentText(pending: boolean, outcome: SegmentationOutcome | undefined) {
  if (pending) return 'Deciding…';
  return outcome ? SEGMENT_LABELS[outcome.segment.value] : '—';
}

export function SignupsTable() {
  const profiles = useSegmentationStore((state) => state.profiles);
  const history = useSegmentationStore((state) => state.history);
  const pendingIds = useSegmentationStore((state) => state.pendingIds);

  return (
    <section
      id="signups"
      aria-labelledby="signups-heading"
      className="flex scroll-mt-32 flex-col gap-3"
    >
      <h2 id="signups-heading" className="text-title-md text-fg-strong">
        Sign-ups
      </h2>
      <div className="-mx-3 overflow-x-auto">
        <table className="w-full min-w-160 border-collapse text-body-sm">
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className={HEAD}>
                Person
              </th>
              <th scope="col" className={HEAD}>
                Segment
              </th>
              <th scope="col" className={HEAD}>
                Traffic light
              </th>
              <th scope="col" className={HEAD}>
                Confidence
              </th>
              <th scope="col" className={HEAD}>
                Next step
              </th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => {
              const outcome = latestOutcome(history[profile.id]);
              return (
                <tr
                  key={profile.id}
                  className="border-b border-border transition-colors duration-150 hover:bg-state-hover"
                >
                  {/* oxlint-disable-next-line jsx-a11y/control-has-associated-label -- labelled by its button text */}
                  <th scope="row" className={cx(CELL, 'text-left')}>
                    <button
                      type="button"
                      onClick={() => show(ProfileDialog, { profileId: profile.id })}
                      className="flex min-h-11 flex-col items-start rounded-sm text-left focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      <span className="text-label-sm whitespace-nowrap text-fg-strong">
                        {profile.role}
                      </span>
                      <span className="text-caption whitespace-nowrap text-fg-muted">
                        {profile.company} · {profile.alias}
                      </span>
                    </button>
                  </th>
                  <td className={cx(CELL, 'whitespace-nowrap text-fg-soft')}>
                    {segmentText(pendingIds.includes(profile.id), outcome)}
                  </td>
                  <td className={CELL}>{outcome ? <LightBadge light={outcome.light} /> : null}</td>
                  <td className={CELL}>
                    {outcome ? (
                      <ConfidenceBar
                        value={outcome.segment.probability}
                        label={`${profile.alias} segment confidence`}
                      />
                    ) : null}
                  </td>
                  <td className={cx(CELL, 'whitespace-nowrap text-fg-muted')}>
                    {outcome ? RECOMMENDATION_LABELS[outcome.recommendation.kind] : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
