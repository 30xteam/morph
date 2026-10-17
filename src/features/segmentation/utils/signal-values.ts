import type { Locale } from '@/core/preferences';

import type { Messages } from '../i18n/en';
import { countryName, translateValue } from '../i18n/values';
import type { Profile, SignalKey } from '../types/segmentation.types';

export const DETAIL_SIGNALS: SignalKey[] = [
  'relation',
  'crmStage',
  'role',
  'pain',
  'goal',
  'topics',
  'currentProgram',
];

export const SIGNAL_LABELS: Record<Locale, Record<SignalKey, string>> = {
  en: {
    relation: 'Relationship',
    crmStage: 'CRM stage',
    role: 'Role',
    pain: 'Main pain',
    goal: 'Goal',
    topics: 'Topics',
    country: 'Country',
    currentProgram: 'Current program',
  },
  es: {
    relation: 'Relación',
    crmStage: 'Etapa CRM',
    role: 'Rol',
    pain: 'Dolor principal',
    goal: 'Objetivo',
    topics: 'Temas',
    country: 'País',
    currentProgram: 'Programa actual',
  },
};

function rawValue(profile: Profile, key: SignalKey, locale: Locale, m: Messages) {
  const translate = (value: string) => translateValue(value, locale);
  switch (key) {
    case 'relation':
      return profile.relation === 'deal' ? m.detail.deal : m.detail.lead;
    case 'crmStage':
      return translate(profile.crm.stage);
    case 'role':
      return translate(profile.role);
    case 'pain':
      return translate(profile.pain);
    case 'goal':
      return translate(profile.goal);
    case 'topics':
      return profile.topics.map(translate).join(' · ');
    case 'country':
      return countryName(profile.country, locale) ?? '';
    case 'currentProgram':
      return translate(profile.crm.program);
    default:
      return '';
  }
}

export function signalValue(
  profile: Profile,
  key: SignalKey,
  missing: boolean,
  locale: Locale,
  m: Messages,
) {
  const text = rawValue(profile, key, locale, m);
  return missing || !text ? { text: m.detail.noData, missing: true } : { text, missing: false };
}
