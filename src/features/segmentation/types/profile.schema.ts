import { z } from 'zod';

export const ROLE_OPTIONS = [
  'Fundador, socio o CEO',
  'Director, VP o C-level (no dueño)',
  'Líder comercial o de ventas',
  'Gerente o jefe de área',
  'Perfil técnico (ingeniería, datos, producto)',
  'Sin dato de rol',
] as const;

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
  source: z.enum(['crm', 'luma']),
  relation: z.enum(['lead', 'deal']),
  role: z.string().min(1),
  country: z.string().min(1),
  pain: z.string().min(1),
  goal: z.string().min(1),
  topics: z.array(z.string()),
  infoAvailable: z.string().min(1),
  crm: z.object({ status: z.string(), stage: z.string(), program: z.string() }),
  signals: signalsSchema,
});

export const storedProfileSchema = profileSchema.omit({ signals: true });

export type Profile = z.infer<typeof profileSchema>;
export type Signals = z.infer<typeof signalsSchema>;
