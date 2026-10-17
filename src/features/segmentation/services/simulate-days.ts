import 'server-only';
import { jevEnv } from '@/core/jev/jev-env';

import { PROFILES_30X } from '../data/dataset';
import type {
  Profile,
  SegmentationOutcome,
  TrafficLight,
  Trigger,
} from '../types/segmentation.types';
import type { SimulationResult } from '../types/simulation.types';
import { mapWithLimit } from '../utils/map-with-limit';
import { type ActivityTrigger, applyTrigger } from './apply-trigger';
import { segmentProfile } from './segment-profile';

const DAILY_PROBABILITY: Record<ActivityTrigger, number> = {
  attended_event: 0.05,
  role_change: 0.006,
  funding_round: 0.004,
};
const INACTIVE_AFTER_DAYS = 30;
const CONCURRENCY = 8;
const SAMPLE_EVERY = 5;

function mulberry32(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function nextDay(
  profile: Profile,
  random: () => number,
): { profile: Profile; trigger: Trigger | null } {
  for (const trigger of Object.keys(DAILY_PROBABILITY) as ActivityTrigger[]) {
    if (random() < DAILY_PROBABILITY[trigger])
      return { profile: applyTrigger(profile, trigger), trigger };
  }
  const days = profile.signals.daysSinceLastActivity + 1;
  const aged = { ...profile, signals: { ...profile.signals, daysSinceLastActivity: days } };
  return { profile: aged, trigger: days === INACTIVE_AFTER_DAYS + 1 ? 're_run' : null };
}

function countLights(outcomes: SegmentationOutcome[]) {
  const counts: Record<TrafficLight, number> = { green: 0, yellow: 0, red: 0 };
  for (const outcome of outcomes) counts[outcome.light] += 1;
  return counts;
}

export async function simulateDays(
  days: number,
  seed: number,
  consensus: boolean,
): Promise<SimulationResult> {
  const random = mulberry32(seed);
  let profiles: Profile[] = PROFILES_30X.filter((_, index) => index % SAMPLE_EVERY === 0);
  const outcomes = await mapWithLimit(profiles, CONCURRENCY, (profile) =>
    segmentProfile(profile, 'sign_up', { consensus }),
  );
  const firstLights = outcomes.map((outcome) => outcome.light);

  let jevCalls = outcomes.length;
  let totalCost = outcomes.reduce((total, outcome) => total + outcome.meta.costUsd, 0);
  const timeline: SimulationResult['timeline'] = [
    { day: 0, decisions: outcomes.length, ...countLights(outcomes) },
  ];
  const transitions: SimulationResult['transitions'] = [];

  for (let day = 1; day <= days; day += 1) {
    const steps = profiles.map((profile) => nextDay(profile, random));
    profiles = steps.map((step) => step.profile);
    const changed = steps.flatMap((step, index) =>
      step.trigger ? [{ index, trigger: step.trigger }] : [],
    );

    // oxlint-disable-next-line no-await-in-loop -- each simulated day depends on the previous one
    const fresh = await mapWithLimit(changed, CONCURRENCY, ({ index, trigger }) =>
      segmentProfile(profiles[index] as Profile, trigger, { consensus }),
    );

    fresh.forEach((outcome, position) => {
      const { index, trigger } = changed[position] as { index: number; trigger: Trigger };
      const before = outcomes[index] as SegmentationOutcome;
      if (before.light !== outcome.light || before.program.value !== outcome.program.value) {
        transitions.push({
          day,
          alias: `${profiles[index]?.alias} · ${profiles[index]?.role}`,
          trigger,
          from: `${before.program.value} · ${before.light}`,
          to: `${outcome.program.value} · ${outcome.light}`,
        });
      }
      outcomes[index] = outcome;
      totalCost += outcome.meta.costUsd;
    });
    jevCalls += fresh.length * (consensus ? 3 : 1);
    timeline.push({ day, decisions: fresh.length, ...countLights(outcomes) });
  }

  const finalLights = outcomes.map((outcome) => outcome.light);
  const newGreens = finalLights.filter(
    (light, index) => light === 'green' && firstLights[index] !== 'green',
  );

  return {
    provider: jevEnv.JEV_PROVIDER,
    calibrated: outcomes.every((outcome) => outcome.meta.calibrated),
    days,
    profiles: profiles.length,
    decisions: timeline.reduce((total, row) => total + row.decisions, 0),
    jevCalls,
    totalCostUsd: totalCost,
    changedLight: finalLights.filter((light, index) => light !== firstLights[index]).length,
    newGreens: newGreens.length,
    timeline,
    transitions,
  };
}
