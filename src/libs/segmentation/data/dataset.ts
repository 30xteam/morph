import 'server-only';
import { NO_ACTIVITY } from '../config/signals';
import type { GroundTruth } from '../types/evaluation.types';
import { storedProfileSchema } from '../types/profile.schema';
import type { Profile } from '../types/segmentation.types';
import labels from './labels-30x.json';
import profiles from './profiles-30x.json';

export const PROFILES_30X: Profile[] = storedProfileSchema
  .array()
  .parse(profiles)
  .map((profile) => Object.assign({}, profile, { signals: NO_ACTIVITY }));

export const LABELS_30X = labels as Record<string, GroundTruth>;
