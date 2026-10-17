import { ACTIVITY, memberById } from '../mocks/dashboard.mock';
import { Avatar } from './avatar';

export function ActivityFeed() {
  return (
    <section
      id="activity"
      aria-labelledby="activity-heading"
      className="flex scroll-mt-32 flex-col gap-3"
    >
      <h2 id="activity-heading" className="text-title-md text-fg-strong">
        Recent activity
      </h2>
      <ol className="flex flex-col gap-4">
        {ACTIVITY.map((item) => {
          const member = memberById(item.memberId);
          return (
            <li key={item.id} className="flex items-start gap-3">
              <Avatar member={member} />
              <p className="flex min-w-0 flex-col gap-0.5 text-body-sm">
                <span className="text-fg-soft">
                  <span className="text-label-sm text-fg-strong">{member.name}</span> {item.action}{' '}
                  <span className="text-fg-strong">{item.target}</span>
                </span>
                <span className="text-caption text-fg-muted">{item.time}</span>
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
