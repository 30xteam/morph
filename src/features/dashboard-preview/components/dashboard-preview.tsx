import { TODAY_LABEL } from '../mocks/dashboard.mock';
import { ActivityFeed } from './activity-feed';
import { PreviewMobileNav } from './preview-mobile-nav';
import { PreviewSidebar } from './preview-sidebar';
import { ProjectsTable } from './projects-table';
import { SampleDataNotice } from './sample-data-notice';
import { TaskList } from './task-list';
import { WeeklyChart } from './weekly-chart';

export function DashboardPreview() {
  return (
    <div className="flex min-h-dvh flex-col desktop:flex-row">
      <PreviewSidebar />
      <PreviewMobileNav />

      <main className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-10 px-4 py-6 tablet:px-8 desktop:gap-12 desktop:px-12 desktop:py-10">
        <SampleDataNotice />

        <header className="flex flex-col gap-1">
          <h1 className="text-headline-sm text-fg-strong">Home</h1>
          <p className="text-body-sm text-fg-muted">{TODAY_LABEL}</p>
        </header>

        <WeeklyChart />
        <ProjectsTable />

        <div className="grid gap-10 desktop:grid-cols-[3fr_2fr] desktop:gap-12">
          <TaskList />
          <ActivityFeed />
        </div>
      </main>
    </div>
  );
}
