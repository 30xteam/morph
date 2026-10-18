import type { Profile, SignalKey, Signals } from '../types/segmentation.types';

const STAGE_HINT_TEXT: Record<NonNullable<Profile['stageHint']>, string> = {
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

export function describeActivity({ signals }: Profile) {
  const parts = [describeEvents(signals), describeEmail(signals)];
  if (signals.programPageVisits >= 3) parts.push('keeps visiting the program page');
  else if (signals.programPageVisits > 0) parts.push('visited the program page');
  if (signals.roleChangedRecently) parts.push('changed role, new position');
  if (signals.companyRaisedRound) parts.push('company just raised a round and is hiring');
  if (signals.daysSinceLastActivity > 30) parts.push('inactive for over a month');
  return parts.join('; ');
}

const IS_MISSING: Record<SignalKey, (profile: Profile) => boolean> = {
  relation: () => false,
  crmStage: (profile) => profile.crm.stage === 'Sin etapa',
  role: (profile) => profile.role === 'Sin dato de rol',
  pain: (profile) => profile.pain === 'No declaró ningún dolor',
  goal: () => false,
  topics: (profile) => profile.topics.length === 0,
  country: (profile) => profile.country === 'Sin dato',
  currentProgram: (profile) => profile.crm.program === 'Sin programa',
};

export const SIGNAL_KEYS = Object.keys(IS_MISSING) as SignalKey[];

export function missingSignals(profile: Profile) {
  return SIGNAL_KEYS.filter((key) => IS_MISSING[key](profile));
}

export function hasLowInfo(profile: Profile) {
  return profile.infoAvailable === 'Sin información';
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
    ...(profile.stageHint ? { companyStageHint: STAGE_HINT_TEXT[profile.stageHint] } : {}),
  };
}
