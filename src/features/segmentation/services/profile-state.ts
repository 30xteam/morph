import type { Profile, Signals, StageKey } from '../types/segmentation.types';

const STAGE_HINT_TEXT: Record<Exclude<StageKey, 'other'>, string> = {
  idea: 'Idea or side project, no product yet',
  early_stage: 'Early stage startup with first customers',
  scale_up: 'Scale-up that raised a round and is growing fast',
  corporate: 'Established corporate or large company',
};

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

/**
 * Jev cannot count or compare dates, so raw counters become categories in code before the
 * state reaches it.
 */
export function describeActivity({ signals }: Profile) {
  const parts = [describeEvents(signals), describeEmail(signals)];
  if (signals.programPageVisits >= 3) parts.push('keeps visiting the program page');
  else if (signals.programPageVisits > 0) parts.push('visited the program page');
  if (signals.roleChangedRecently) parts.push('changed role, new position');
  if (signals.companyRaisedRound) parts.push('company just raised a round and is hiring');
  if (signals.daysSinceLastActivity > 30) parts.push('inactive for over a month');
  return parts.join('; ');
}

export function toJevState(profile: Profile) {
  return {
    role: profile.role,
    company: profile.company,
    industry: profile.industry,
    companySize: profile.companySize,
    country: profile.country,
    event: profile.event,
    signupAnswer: profile.signupAnswer,
    recentActivity: describeActivity(profile),
    ...(profile.stageHint ? { companyStageHint: STAGE_HINT_TEXT[profile.stageHint] } : {}),
  };
}
