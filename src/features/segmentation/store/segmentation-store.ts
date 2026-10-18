import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { SegmentationEvaluation } from '../types/evaluation.types';
import type {
  Profile,
  ProgramKey,
  RecommendationKind,
  ReviewReason,
  ReviewVerdict,
  SegmentationOutcome,
} from '../types/segmentation.types';

export type ProgramFilter = ProgramKey | 'all';
export type ReviewTab = ReviewReason | 'all';

export interface BatchRun {
  running: boolean;
  cancelled: boolean;
  total: number;
  done: number;
  failed: number;
  batch: number;
  batches: number;
  green: number;
  yellow: number;
  elapsedMs: number;
  costUsd: number;
}

const IDLE_RUN: BatchRun = {
  running: false,
  cancelled: false,
  total: 0,
  done: 0,
  failed: 0,
  batch: 0,
  batches: 0,
  green: 0,
  yellow: 0,
  elapsedMs: 0,
  costUsd: 0,
};

interface SegmentationState {
  profiles: Profile[];
  history: Record<string, SegmentationOutcome[]>;
  reviews: Record<string, ReviewVerdict>;
  flagged: string[];
  sent: Record<string, RecommendationKind>;
  pendingIds: string[];
  run: BatchRun;
  evaluation: SegmentationEvaluation | null;
  previousEvaluation: SegmentationEvaluation | null;
  hydrate: (profiles: Profile[]) => void;
  addProfile: (profile: Profile) => void;
  updateProfile: (profile: Profile) => void;
  setPending: (ids: string[], pending: boolean) => void;
  saveOutcome: (outcome: SegmentationOutcome) => void;
  review: (id: string, verdict: ReviewVerdict) => void;
  clearReview: (id: string) => void;
  flag: (id: string) => void;
  markSent: (id: string, kind: RecommendationKind) => void;
  setRun: (run: Partial<BatchRun>) => void;
  setEvaluation: (evaluation: SegmentationEvaluation) => void;
}

const KEEP_PER_PROFILE = 2;

const consoleStorage = {
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    if (!useSegmentationStore.persist.hasHydrated()) return;
    try {
      localStorage.setItem(key, value);
    } catch {
      return;
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch {
      return;
    }
  },
};

function without<T>(record: Record<string, T>, id: string) {
  const { [id]: _removed, ...rest } = record;
  return rest;
}

export const useSegmentationStore = create<SegmentationState>()(
  persist(
    (set) => ({
      profiles: [],
      history: {},
      reviews: {},
      flagged: [],
      sent: {},
      pendingIds: [],
      run: IDLE_RUN,
      evaluation: null,
      previousEvaluation: null,
      hydrate: (profiles) => set((state) => (state.profiles.length ? state : { profiles })),
      addProfile: (profile) =>
        set((state) =>
          state.profiles.some((item) => item.id === profile.id)
            ? { profiles: state.profiles.map((item) => (item.id === profile.id ? profile : item)) }
            : { profiles: [profile, ...state.profiles] },
        ),
      updateProfile: (profile) =>
        set((state) => ({
          profiles: state.profiles.map((item) => (item.id === profile.id ? profile : item)),
        })),
      setPending: (ids, pending) =>
        set((state) => ({
          pendingIds: pending
            ? [...state.pendingIds, ...ids]
            : state.pendingIds.filter((pendingId) => !ids.includes(pendingId)),
        })),
      saveOutcome: (outcome) =>
        set((state) => ({
          history: {
            ...state.history,
            [outcome.profileId]: [...(state.history[outcome.profileId] ?? []), outcome],
          },
          reviews: without(state.reviews, outcome.profileId),
          flagged: state.flagged.filter((id) => id !== outcome.profileId),
        })),
      review: (id, verdict) => set((state) => ({ reviews: { ...state.reviews, [id]: verdict } })),
      clearReview: (id) => set((state) => ({ reviews: without(state.reviews, id) })),
      flag: (id) =>
        set((state) => (state.flagged.includes(id) ? state : { flagged: [...state.flagged, id] })),
      markSent: (id, kind) => set((state) => ({ sent: { ...state.sent, [id]: kind } })),
      setRun: (run) => set((state) => ({ run: { ...state.run, ...run } })),
      setEvaluation: (evaluation) =>
        set((state) => ({ evaluation, previousEvaluation: state.evaluation })),
    }),
    {
      name: 'segmentation-console',
      version: 1,
      storage: createJSONStorage(() => consoleStorage),
      skipHydration: true,
      partialize: (state) => ({
        history: Object.fromEntries(
          Object.entries(state.history).map(([id, outcomes]) => [
            id,
            outcomes.slice(-KEEP_PER_PROFILE),
          ]),
        ),
        reviews: state.reviews,
        flagged: state.flagged,
        sent: state.sent,
        evaluation: state.evaluation,
      }),
    },
  ),
);

export function hydrateProfiles(profiles: Profile[]) {
  useSegmentationStore.getState().hydrate(profiles);
  return true;
}

export function latestOutcome(history: SegmentationOutcome[] | undefined) {
  return history?.at(-1);
}
