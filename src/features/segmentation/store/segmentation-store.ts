import { create } from 'zustand';

import { PROFILES_MOCK } from '../mocks/profiles.mock';
import type {
  Profile,
  ReviewVerdict,
  SegmentationOutcome,
  TrafficLight,
} from '../types/segmentation.types';

export type LightFilter = TrafficLight | 'all' | 'pending';

export interface BatchRun {
  running: boolean;
  total: number;
  done: number;
  failed: number;
  elapsedMs: number;
  jevMs: number;
  costUsd: number;
}

const IDLE_RUN: BatchRun = {
  running: false,
  total: 0,
  done: 0,
  failed: 0,
  elapsedMs: 0,
  jevMs: 0,
  costUsd: 0,
};

interface SegmentationState {
  profiles: Profile[];
  history: Record<string, SegmentationOutcome[]>;
  reviews: Record<string, ReviewVerdict>;
  pendingIds: string[];
  filter: LightFilter;
  run: BatchRun;
  addProfile: (profile: Profile) => void;
  updateProfile: (profile: Profile) => void;
  setPending: (id: string, pending: boolean) => void;
  saveOutcome: (outcome: SegmentationOutcome) => void;
  review: (id: string, verdict: ReviewVerdict) => void;
  clearReview: (id: string) => void;
  setFilter: (filter: LightFilter) => void;
  setRun: (run: Partial<BatchRun>) => void;
}

export const useSegmentationStore = create<SegmentationState>()((set) => ({
  profiles: PROFILES_MOCK,
  history: {},
  reviews: {},
  pendingIds: [],
  filter: 'all',
  run: IDLE_RUN,
  addProfile: (profile) => set((state) => ({ profiles: [profile, ...state.profiles] })),
  updateProfile: (profile) =>
    set((state) => ({
      profiles: state.profiles.map((item) => (item.id === profile.id ? profile : item)),
    })),
  setPending: (id, pending) =>
    set((state) => ({
      pendingIds: pending
        ? [...state.pendingIds, id]
        : state.pendingIds.filter((pendingId) => pendingId !== id),
    })),
  saveOutcome: (outcome) =>
    set((state) => {
      const { [outcome.profileId]: _review, ...reviews } = state.reviews;
      return {
        history: {
          ...state.history,
          [outcome.profileId]: [...(state.history[outcome.profileId] ?? []), outcome],
        },
        reviews,
      };
    }),
  review: (id, verdict) => set((state) => ({ reviews: { ...state.reviews, [id]: verdict } })),
  clearReview: (id) =>
    set((state) => {
      const { [id]: _review, ...reviews } = state.reviews;
      return { reviews };
    }),
  setFilter: (filter) => set({ filter }),
  setRun: (run) => set((state) => ({ run: { ...state.run, ...run } })),
}));

export function latestOutcome(history: SegmentationOutcome[] | undefined) {
  return history?.at(-1);
}
