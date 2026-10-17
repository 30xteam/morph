'use client';

import { show } from '@ebay/nice-modal-react';

import { cx } from '@/core/cx';

import { SEGMENT_LABELS } from '../config/labels';
import { useFilteredSignups } from '../hooks/use-filtered-signups';
import { useSegmentationStore } from '../store/segmentation-store';
import { ActionBadge } from './action-badge';
import { LightBadge } from './light-badge';
import { ProfileDialog } from './profile/profile-dialog';
import { SignupsList } from './signups-list';

const HEAD = 'px-3 py-2 text-left text-caption text-fg-muted';
const CELL = 'px-3 py-3 align-middle';

export function SignupsTable() {
  const { rows, total, filter } = useFilteredSignups();
  const pendingIds = useSegmentationStore((state) => state.pendingIds);
  const setFilter = useSegmentationStore((state) => state.setFilter);

  return (
    <section
      id="signups"
      aria-labelledby="signups-heading"
      className="flex scroll-mt-32 flex-col gap-3"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="signups-heading" className="text-title-md text-fg-strong">
          Sign-ups
        </h2>
        <p
          aria-live="polite"
          className="flex items-center gap-3 text-caption text-fg-muted tabular-nums"
        >
          Showing {rows.length} of {total}
          {filter === 'all' ? null : (
            <button
              type="button"
              onClick={() => setFilter('all')}
              className="min-h-11 rounded-sm px-1 text-label-sm text-link underline underline-offset-4 hover:text-link-hover desktop:min-h-0"
            >
              Show everyone
            </button>
          )}
        </p>
      </div>
      <div className="tablet:hidden">
        <SignupsList />
      </div>
      <div className="-mx-3 hidden overflow-x-auto tablet:block">
        <table className="w-full min-w-200 border-collapse text-body-sm">
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className={HEAD}>
                Person
              </th>
              <th scope="col" className={HEAD}>
                What to do
              </th>
              <th scope="col" className={HEAD}>
                Why
              </th>
              <th scope="col" className={HEAD}>
                Group
              </th>
              <th scope="col" className={HEAD}>
                How sure Jev is
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ profile, outcome }) => {
              const pending = pendingIds.includes(profile.id);
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
                      <span className="text-label-sm whitespace-nowrap text-fg-strong underline-offset-4 hover:underline">
                        {profile.role}
                      </span>
                      <span className="text-caption whitespace-nowrap text-fg-muted">
                        {profile.company}
                      </span>
                    </button>
                  </th>
                  <td className={CELL}>
                    {pending ? (
                      <span className="text-caption text-fg-muted">Jev is reading…</span>
                    ) : null}
                    {!pending && outcome ? <LightBadge light={outcome.light} /> : null}
                    {!pending && !outcome ? (
                      <span className="text-caption text-fg-muted">Not sorted yet</span>
                    ) : null}
                  </td>
                  <td className={cx(CELL, 'max-w-64 text-caption text-fg-soft')}>
                    {outcome?.reasons[0] ?? ''}
                  </td>
                  <td className={cx(CELL, 'whitespace-nowrap text-fg-soft')}>
                    {outcome ? SEGMENT_LABELS[outcome.segment.value] : ''}
                  </td>
                  <td className={CELL}>
                    {outcome ? (
                      <ActionBadge
                        action={outcome.action}
                        probability={outcome.segment.probability}
                      />
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {rows.length === 0 ? (
        <p className="py-6 text-body-sm text-fg-muted">Nobody in this group right now.</p>
      ) : null}
    </section>
  );
}
