import { ActivityFeed } from './activity-feed';
import { DecisionMetrics } from './decision-metrics';
import { HeaderActions } from './header-actions';
import { SegmentationStatistics } from './metrics/segmentation-statistics';
import { ProfileViews } from './profile-views';
import { ReviewQueue } from './review-queue';
import { SampleDataNotice } from './sample-data-notice';
import { SegmentationMobileNav } from './shell/segmentation-mobile-nav';
import { SegmentationSidebar } from './shell/segmentation-sidebar';
import { TrafficLightChart } from './traffic-light-chart';

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
              Every CRM profile and Luma sign-up gets a 30X program, an affinity and a traffic light
              in milliseconds, and all three change when the person does.
            </p>
          </div>
          <HeaderActions />
        </header>

        <div className="flex flex-col gap-4">
          <TrafficLightChart />
          <DecisionMetrics />
        </div>

        <ProfileViews />

        <SegmentationStatistics />

        <div className="grid gap-10 desktop:grid-cols-[3fr_2fr] desktop:gap-12">
          <ReviewQueue />
          <ActivityFeed />
        </div>
      </main>
    </div>
  );
}
