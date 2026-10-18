import { sharedEn } from '@/libs/segmentation';

const percent = (p: number) => `${Math.round(p * 100)}%`;

export const en = {
  ...sharedEn,
  metrics: {
    title: 'Metrics',
    subtitle: (count: number) => `Measured on ${count} profiles against the organizers’ labels`,
    run: (count: number) => `Measure on ${count} profiles`,
    running: 'Measuring…',
    runningCount: (count: number) => `Measuring ${count} profiles…`,
    updating: 'Showing the previous measurement while the new one arrives.',
    comparedPrevious: 'Compared with the previous measurement.',
    runAgain: (count: number) => `Measure again on ${count} profiles`,
    emptyTitle: 'Nothing measured yet',
    emptyBody: (count: number) =>
      `Run Jev on ${count} profiles labeled by 30X to see latency, cost, accuracy and how each threshold behaves.`,
    measuredWith: (provider: string, calibrated: boolean) =>
      `Provider: ${provider}${calibrated ? '' : ' · not calibrated'}`,
    notRealJev: 'Not real Jev',
    chartLabel: (threshold: number, decided: string, accuracy: string) =>
      `At the current threshold ${threshold.toFixed(2)}, Jev decides ${decided} alone with ${accuracy} accuracy.`,
    failed: 'The measurement failed. Try again.',
    medianLatency: 'Median latency',
    questions: (count: number) => `${count} questions in 1 call`,
    cost: 'Cost',
    perThousand: 'per 1,000 profiles',
    accuracy: 'Program accuracy',
    baseline: (p: number, program: string) => `baseline ${percent(p)} (always ${program})`,
    profiles: 'Profiles',
    tested: (count: number) => `${count} tested with Jev`,
    pending: 'Pending',
    thresholdPending: (count: number) =>
      `Pending: measure on ${count} profiles to fill this table.`,
    thresholdTitle: 'Threshold: when Jev decides alone',
    thresholdHint:
      'Program confidence needed to act without a person. Low-info profiles never act alone.',
    threshold: 'Threshold',
    decidesAlone: 'Decides alone',
    accuracyAlone: 'Accuracy when alone',
    current: 'current',
    honest: 'Honest reading',
    filterTitle: (aboveBaseline: boolean): string =>
      aboveBaseline
        ? 'Jev is a first filter, not the judge'
        : 'Jev is not beating the baseline yet',
    filterBody: (accuracy: number, baseline: number) =>
      `${percent(accuracy)} on program against a ${percent(baseline)} baseline. Good to sort, not enough to act alone on everyone.`,
    lowInfoTitle: 'Low info means low affinity',
    lowInfoBody: (lowInfo: number, alsoLow: number) =>
      `${alsoLow} of ${lowInfo} low-info profiles are also low affinity for 30X: the label mostly reflects how much data exists.`,
    policyTitle: 'Policy',
    policyBody: 'Low info or low confidence goes to a person. The rest is automatic.',
  },
};

export type Messages = typeof en;
