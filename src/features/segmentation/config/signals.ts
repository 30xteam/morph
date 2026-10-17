import type { Signals } from '../types/profile.schema';

export const NO_ACTIVITY: Signals = {
  eventsAttended: 0,
  emailsOpened: 0,
  emailsClicked: 0,
  programPageVisits: 0,
  roleChangedRecently: false,
  companyRaisedRound: false,
  daysSinceLastActivity: 3,
};
