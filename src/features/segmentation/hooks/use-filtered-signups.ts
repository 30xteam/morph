import { latestOutcome, useSegmentationStore } from '../store/segmentation-store';

export function useFilteredSignups() {
  const profiles = useSegmentationStore((state) => state.profiles);
  const history = useSegmentationStore((state) => state.history);
  const filter = useSegmentationStore((state) => state.filter);

  const rows = profiles
    .map((profile) => ({ profile, outcome: latestOutcome(history[profile.id]) }))
    .filter(({ outcome }) => {
      if (filter === 'all') return true;
      if (filter === 'pending') return outcome === undefined;
      return outcome?.light === filter;
    });

  return { rows, total: profiles.length, filter };
}
