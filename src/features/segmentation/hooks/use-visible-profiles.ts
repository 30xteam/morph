import { useSegmentationStore } from '../store/segmentation-store';
import { needsPerson } from '../utils/profile-status';

export function useVisibleProfiles() {
  const profiles = useSegmentationStore((state) => state.profiles);
  const history = useSegmentationStore((state) => state.history);
  const flagged = useSegmentationStore((state) => state.flagged);
  const program = useSegmentationStore((state) => state.program);
  const tab = useSegmentationStore((state) => state.listTab);

  return profiles.flatMap((profile) => {
    const outcome = history[profile.id]?.at(-1);
    if (program !== 'all' && outcome?.program.value !== program) return [];
    if (tab === 'review' && !needsPerson(outcome, flagged.includes(profile.id))) return [];
    if (tab === 'low_affinity' && outcome?.affinity.value !== 'low') return [];
    return [{ profile, outcome }];
  });
}
