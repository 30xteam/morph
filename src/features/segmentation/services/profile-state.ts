import type { Profile, Signals } from '../types/segmentation.types';

function describeEvents({ eventsAttended }: Signals) {
  if (eventsAttended === 0) return 'no events attended yet';
  if (eventsAttended === 1) return 'attended one event';
  return 'attended several events';
}

function describeEmail({ emailsOpened, emailsClicked }: Signals) {
  if (emailsClicked > 0) return 'clicked links we sent';
  if (emailsOpened > 0) return 'opened emails only';
  return 'no email engagement';
}

export function describeActivity({ signals }: Profile) {
  const parts = [describeEvents(signals), describeEmail(signals)];
  if (signals.programPageVisits >= 3) parts.push('keeps visiting the program page');
  else if (signals.programPageVisits > 0) parts.push('visited the program page');
  if (signals.roleChangedRecently) parts.push('changed role, new position');
  if (signals.companyRaisedRound) parts.push('company just raised a round and is hiring');
  if (signals.daysSinceLastActivity > 30) parts.push('inactive for over a month');
  return parts.join('; ');
}

export function relationLabel(profile: Profile) {
  return profile.relation === 'deal' ? 'Deal en el CRM' : 'Lead sin oportunidad';
}

export function toJevState(profile: Profile) {
  return {
    topics: profile.topics.join(', ') || 'sin temas declarados',
    goal: profile.goal,
    pain: profile.pain,
    role: profile.role,
    relation: relationLabel(profile),
    country: profile.country,
    information: profile.infoAvailable,
    recentActivity: describeActivity(profile),
  };
}
