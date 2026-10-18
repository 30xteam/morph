import {
  createSerializer,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsString,
  parseAsStringLiteral,
} from 'nuqs';

import { PRIORITY_LEVELS } from '../services/profile-priority';
import type { ProgramKey } from '../types/segmentation.types';
import type { ProfileStatus } from '../utils/profile-status';
import { PROGRAM_LABELS } from './labels';

const PROGRAM_FILTERS = ['all', ...Object.keys(PROGRAM_LABELS)] as ('all' | ProgramKey)[];
const LIGHTS: readonly ProfileStatus[] = ['green', 'yellow', 'red', 'review', 'pending'];
const REVIEW_TABS = ['all', 'low_confidence', 'low_info'] as const;
const COLOR_MODES = ['priority', 'program', 'none'] as const;

export const liveParams = {
  program: parseAsStringLiteral(PROGRAM_FILTERS).withDefault('all'),
  light: parseAsArrayOf(parseAsStringLiteral(LIGHTS)).withDefault([]),
  low: parseAsBoolean.withDefault(false),
};

export const reviewParams = {
  tab: parseAsStringLiteral(REVIEW_TABS).withDefault('all'),
};

export const graphParams = {
  q: parseAsString.withDefault(''),
  node: parseAsString,
  local: parseAsBoolean.withDefault(false),
  priority: parseAsArrayOf(parseAsStringLiteral(PRIORITY_LEVELS)).withDefault([...PRIORITY_LEVELS]),
  color: parseAsStringLiteral(COLOR_MODES).withDefault('priority'),
};

export const profileParams = {
  profile: parseAsString,
};

export const PROFILE_URL_KEYS = { profile: 'profile-id' };

export const liveHref = createSerializer(
  { ...liveParams, ...profileParams },
  { urlKeys: PROFILE_URL_KEYS },
);
