import {
  useSegmentationStore,
  type ProfileStatus,
  profileStatus,
  useLiveFilters,
} from '@/libs/segmentation';

export const LIGHT_ORDER: ProfileStatus[] = ['green', 'yellow', 'red', 'review', 'pending'];

export function useLightCounts() {
  const profiles = useSegmentationStore((state) => state.profiles);
  const history = useSegmentationStore((state) => state.history);
  const flagged = useSegmentationStore((state) => state.flagged);
  const { program, lights, lowAffinityOnly } = useLiveFilters();

  const counts: Record<ProfileStatus, number> = {
    green: 0,
    yellow: 0,
    red: 0,
    review: 0,
    pending: 0,
  };
  let total = 0;
  let lowAffinity = 0;
  for (const profile of profiles) {
    const outcome = history[profile.id]?.at(-1);
    if (program !== 'all' && outcome?.program.value !== program) continue;
    const status = profileStatus(outcome, flagged.includes(profile.id));
    const low = outcome?.affinity.value === 'low';
    if (low && (!lights.length || lights.includes(status))) lowAffinity += 1;
    if (lowAffinityOnly && !low) continue;
    counts[status] += 1;
    total += 1;
  }
  return { counts, total, lowAffinity };
}
