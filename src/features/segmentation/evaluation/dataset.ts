import 'server-only';
import type { GroundTruth } from '../types/evaluation.types';
import { profileSchema } from '../types/profile.schema';
import answersJson from './answers.json';
import profilesJson from './profiles.json';

export const EVALUATION_PROFILES = profileSchema.array().parse(profilesJson);

export const EVALUATION_ANSWERS = answersJson as Record<string, GroundTruth>;
