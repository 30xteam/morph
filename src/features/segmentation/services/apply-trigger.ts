import type { Profile, Trigger } from '../types/segmentation.types';

const ROLE_LADDER: Record<string, string> = {
  'Sin dato de rol': 'Gerente o jefe de área',
  'Perfil técnico (ingeniería, datos, producto)': 'Gerente o jefe de área',
  'Gerente o jefe de área': 'Director, VP o C-level (no dueño)',
  'Líder comercial o de ventas': 'Director, VP o C-level (no dueño)',
  'Director, VP o C-level (no dueño)': 'Fundador, socio o CEO',
  'Fundador, socio o CEO': 'Fundador, socio o CEO',
};

export type ActivityTrigger = Extract<Trigger, 'attended_event' | 'role_change' | 'funding_round'>;

export function applyTrigger(profile: Profile, trigger: ActivityTrigger): Profile {
  const signals = { ...profile.signals, daysSinceLastActivity: 0 };

  if (trigger === 'attended_event') {
    return {
      ...profile,
      signals: {
        ...signals,
        eventsAttended: signals.eventsAttended + 1,
        emailsOpened: signals.emailsOpened + 1,
        emailsClicked: signals.emailsClicked + 1,
        programPageVisits: signals.programPageVisits + 1,
      },
    };
  }

  if (trigger === 'role_change') {
    return {
      ...profile,
      role: ROLE_LADDER[profile.role] ?? 'Gerente o jefe de área',
      signals: { ...signals, roleChangedRecently: true },
    };
  }

  return { ...profile, signals: { ...signals, companyRaisedRound: true } };
}
