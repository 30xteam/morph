import { z } from 'zod';

export const COMPANY_SIZES = ['1', '2-10', '11-50', '51-200', '201-1000', '1000+'] as const;

export const STAGE_HINTS = ['idea', 'early_stage', 'scale_up', 'corporate'] as const;

const count = z.number().int().min(0);

export const signalsSchema = z.object({
  eventsAttended: count,
  emailsOpened: count,
  emailsClicked: count,
  programPageVisits: count,
  roleChangedRecently: z.boolean(),
  companyRaisedRound: z.boolean(),
  daysSinceLastActivity: count,
});

export const profileSchema = z.object({
  id: z.string().min(1),
  alias: z.string().min(1),
  role: z.string().trim().min(2, 'Add a role'),
  company: z.string().trim().min(2, 'Add a company'),
  industry: z.string().trim().min(2, 'Add an industry'),
  companySize: z.enum(COMPANY_SIZES),
  country: z.string().trim().min(2),
  event: z.string().trim().min(2),
  signupAnswer: z.string().trim().min(10, 'Write at least 10 characters'),
  stageHint: z.enum(STAGE_HINTS).optional(),
  signals: signalsSchema,
});

export type Profile = z.infer<typeof profileSchema>;
export type Signals = z.infer<typeof signalsSchema>;
