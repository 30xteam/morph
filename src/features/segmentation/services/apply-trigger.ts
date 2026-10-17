import { COMPANY_SIZES } from '../types/profile.schema';
import type { Profile, Trigger } from '../types/segmentation.types';

const ROLE_LADDER: { match: RegExp; next: string }[] = [
  { match: /student|graduate|intern|bootcamp/i, next: 'Junior Data Analyst' },
  { match: /investor|venture|fund|angel/i, next: 'Partner at a venture fund' },
  { match: /founder|ceo|owner|managing/i, next: 'Founder & CEO' },
  { match: /director|head|chief/i, next: 'Chief Operating Officer' },
  { match: /lead|manager/i, next: 'Director of Operations' },
];

function promote(role: string) {
  return ROLE_LADDER.find(({ match }) => match.test(role))?.next ?? 'Team Lead';
}

function growCompany(size: Profile['companySize']) {
  const index = COMPANY_SIZES.indexOf(size);
  return COMPANY_SIZES[Math.min(index + 1, COMPANY_SIZES.length - 1)] ?? size;
}

export type ActivityTrigger = Extract<Trigger, 'attended_event' | 'role_change' | 'funding_round'>;

/** Simulates the activity that, in production, would arrive from Luma, the CRM or LinkedIn. */
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
      role: promote(profile.role),
      signals: { ...signals, roleChangedRecently: true },
    };
  }

  return {
    ...profile,
    companySize: growCompany(profile.companySize),
    signals: { ...signals, companyRaisedRound: true },
  };
}
