import { ActivityFeed } from './activity-feed';
import { DecisionMetrics } from './decision-metrics';
import { GettingStarted } from './getting-started';
import { HeaderActions } from './header-actions';
import { OutcomeSummary } from './outcome-summary';
import { ReviewQueue } from './review-queue';
import { SampleDataNotice } from './sample-data-notice';
import { SegmentationMobileNav } from './shell/segmentation-mobile-nav';
import { SegmentationSidebar } from './shell/segmentation-sidebar';
import { SignupsTable } from './signups-table';

export function SegmentationDashboard() {
  return (
    <div className="flex min-h-dvh flex-col desktop:flex-row">
      <SegmentationSidebar />
      <SegmentationMobileNav />

      <main className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-10 px-4 py-6 tablet:px-8 desktop:gap-12 desktop:px-12 desktop:py-10">
        <SampleDataNotice />

        <header className="flex flex-col gap-4 tablet:flex-row tablet:items-end tablet:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-headline-sm text-fg-strong">Live segments</h1>
            <p className="text-body-sm text-fg-muted">
              Jev reads every event sign-up and suggests who to talk to today, who to keep warm and
              who a person should look at. The suggestion updates when the person changes.
            </p>
          </div>
          <HeaderActions />
        </header>

        <GettingStarted />
        <OutcomeSummary />
        <SignupsTable />

        <div className="grid gap-10 desktop:grid-cols-[3fr_2fr] desktop:gap-12">
          <ReviewQueue />
          <ActivityFeed />
        </div>

        <DecisionMetrics />
      </main>
    </div>
  );
}
