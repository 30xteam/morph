import type { IconName } from './icon';

export interface NavItem {
  label: string;
  icon: IconName;
  href: string;
  active?: boolean;
}

export const WORKSPACE_NAME = '30X · Live segments';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', icon: 'home', href: '/', active: true },
  { label: 'Sign-ups', icon: 'users', href: '/#signups' },
  { label: 'Review', icon: 'check', href: '/#review' },
  { label: 'Activity', icon: 'inbox', href: '/#activity' },
];
