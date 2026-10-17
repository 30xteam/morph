import { NO_ACTIVITY } from '../config/signals';
import { storedProfileSchema } from '../types/profile.schema';
import type { Profile } from '../types/segmentation.types';
import crmSample from './crm-sample.json';

export const CRM_SAMPLE: Profile[] = storedProfileSchema
  .array()
  .parse(crmSample)
  .map((profile) => Object.assign({}, profile, { signals: NO_ACTIVITY }));
