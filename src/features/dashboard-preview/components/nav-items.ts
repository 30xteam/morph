import type { IconName } from './icon';

export interface NavItem {
  label: string;
  icon: IconName;
  href: string;
  active?: boolean;
}

/** Each item jumps to a real section of the preview, so nothing on the page is a dead link. */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', icon: 'home', href: '/preview', active: true },
  { label: 'Projects', icon: 'folder', href: '/preview#projects' },
  { label: 'My tasks', icon: 'check', href: '/preview#tasks' },
  { label: 'Activity', icon: 'inbox', href: '/preview#activity' },
];
