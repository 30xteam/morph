import { cx } from '@/core/cx';

import { memberById, PROJECTS } from '../mocks/dashboard.mock';
import { Avatar } from './avatar';
import { ProgressBar } from './progress-bar';
import { StatusBadge } from './status-badge';

const HEAD = 'px-3 py-2 text-left text-caption text-fg-muted';
const CELL = 'px-3 py-3 align-middle';

export function ProjectsTable() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="flex scroll-mt-32 flex-col gap-3"
    >
      <h2 id="projects-heading" className="text-title-md text-fg-strong">
        Projects
      </h2>
      <div className="-mx-3 overflow-x-auto">
        <table className="w-full min-w-160 border-collapse text-body-sm">
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className={HEAD}>
                Name
              </th>
              <th scope="col" className={HEAD}>
                Owner
              </th>
              <th scope="col" className={HEAD}>
                Status
              </th>
              <th scope="col" className={HEAD}>
                Progress
              </th>
              <th scope="col" className={HEAD}>
                Due
              </th>
            </tr>
          </thead>
          <tbody>
            {PROJECTS.map((project) => {
              const owner = memberById(project.ownerId);
              return (
                <tr
                  key={project.id}
                  className="border-b border-border transition-colors duration-150 hover:bg-state-hover"
                >
                  <th
                    scope="row"
                    className={cx(CELL, 'text-left text-label-sm whitespace-nowrap text-fg-strong')}
                  >
                    {project.name}
                  </th>
                  <td className={CELL}>
                    <span className="flex items-center gap-2 whitespace-nowrap text-fg-soft">
                      <Avatar member={owner} />
                      {owner.name}
                    </span>
                  </td>
                  <td className={CELL}>
                    <StatusBadge status={project.status} />
                  </td>
                  <td className={CELL}>
                    <ProgressBar value={project.progress} label={`${project.name} progress`} />
                  </td>
                  <td className={cx(CELL, 'whitespace-nowrap text-fg-muted tabular-nums')}>
                    {project.due}
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
