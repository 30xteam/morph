export type ProjectStatus = 'on-track' | 'at-risk' | 'blocked' | 'done';

export interface Member {
  id: string;
  name: string;
  initials: string;
}

export interface Project {
  id: string;
  name: string;
  ownerId: string;
  status: ProjectStatus;
  /** 0–100 */
  progress: number;
  due: string;
}

export interface Task {
  id: string;
  title: string;
  project: string;
  due: string;
  done: boolean;
}

export interface Activity {
  id: string;
  memberId: string;
  action: string;
  target: string;
  time: string;
}

export interface DayCount {
  day: string;
  completed: number;
}
