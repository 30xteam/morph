/**
 * SAMPLE DATA for the /preview dashboard. Synthetic, never real; deleted together with the
 * dashboard-preview feature once the product exists.
 */
import type { Activity, DayCount, Member, Project, Task } from '../types/dashboard.types';

export const WORKSPACE_NAME = 'Northwind Studio';
export const TODAY_LABEL = 'Thursday, October 16';

export const MEMBERS: Member[] = [
  { id: 'm1', name: 'Ana Ruiz', initials: 'AR' },
  { id: 'm2', name: 'Theo Park', initials: 'TP' },
  { id: 'm3', name: 'Lena Fischer', initials: 'LF' },
  { id: 'm4', name: 'Omar Haddad', initials: 'OH' },
  { id: 'm5', name: 'Grace Okafor', initials: 'GO' },
];

export const WEEK: DayCount[] = [
  { day: 'Fri', completed: 4 },
  { day: 'Sat', completed: 1 },
  { day: 'Sun', completed: 0 },
  { day: 'Mon', completed: 7 },
  { day: 'Tue', completed: 9 },
  { day: 'Wed', completed: 6 },
  { day: 'Thu', completed: 5 },
];

export const LAST_WEEK_TOTAL = 24;

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Website relaunch',
    ownerId: 'm1',
    status: 'on-track',
    progress: 72,
    due: 'Nov 4',
  },
  {
    id: 'p2',
    name: 'Mobile onboarding',
    ownerId: 'm2',
    status: 'at-risk',
    progress: 41,
    due: 'Oct 28',
  },
  {
    id: 'p3',
    name: 'Billing migration',
    ownerId: 'm4',
    status: 'blocked',
    progress: 18,
    due: 'Dec 2',
  },
  {
    id: 'p4',
    name: 'Q4 content calendar',
    ownerId: 'm3',
    status: 'on-track',
    progress: 55,
    due: 'Nov 15',
  },
  {
    id: 'p5',
    name: 'Design system audit',
    ownerId: 'm5',
    status: 'done',
    progress: 100,
    due: 'Oct 10',
  },
];

export const TASKS: Task[] = [
  {
    id: 't1',
    title: 'Review homepage copy with legal',
    project: 'Website relaunch',
    due: 'Today',
    done: false,
  },
  {
    id: 't2',
    title: 'Send onboarding survey to beta users',
    project: 'Mobile onboarding',
    due: 'Today',
    done: false,
  },
  {
    id: 't3',
    title: 'Unblock Stripe webhook access',
    project: 'Billing migration',
    due: 'Tomorrow',
    done: false,
  },
  {
    id: 't4',
    title: 'Draft November newsletter outline',
    project: 'Q4 content calendar',
    due: 'Oct 20',
    done: false,
  },
  {
    id: 't5',
    title: 'Export audit findings to the wiki',
    project: 'Design system audit',
    due: 'Oct 15',
    done: true,
  },
];

export const ACTIVITY: Activity[] = [
  {
    id: 'a1',
    memberId: 'm2',
    action: 'moved',
    target: 'Onboarding flow v2 to In review',
    time: '12 min ago',
  },
  {
    id: 'a2',
    memberId: 'm1',
    action: 'commented on',
    target: 'Homepage hero copy',
    time: '48 min ago',
  },
  {
    id: 'a3',
    memberId: 'm4',
    action: 'flagged',
    target: 'Billing migration as blocked',
    time: '2 h ago',
  },
  { id: 'a4', memberId: 'm3', action: 'created', target: 'November newsletter', time: '3 h ago' },
  {
    id: 'a5',
    memberId: 'm5',
    action: 'completed',
    target: 'Design system audit',
    time: 'Yesterday',
  },
];

export function memberById(id: string): Member {
  return MEMBERS.find((member) => member.id === id) ?? { id, name: 'Unknown', initials: '?' };
}
