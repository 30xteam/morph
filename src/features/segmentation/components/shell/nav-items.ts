import type { IconName } from './icon';

export interface NavItem {
  label: string;
  icon: IconName;
  href: string;
  active?: boolean;
}

export const WORKSPACE_NAME = '30X · Live segments';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', icon: 'home', href: '/segmentation', active: true },
  { label: 'Sign-ups', icon: 'users', href: '/segmentation#signups' },
  { label: 'Needs your check', icon: 'check', href: '/segmentation#review' },
  { label: 'Activity', icon: 'inbox', href: '/segmentation#activity' },
];
