import { useSegmentationStore } from '../store/segmentation-store';
import { profileStatus } from '../utils/profile-status';

export function useVisibleProfiles() {
  const profiles = useSegmentationStore((state) => state.profiles);
  const history = useSegmentationStore((state) => state.history);
  const flagged = useSegmentationStore((state) => state.flagged);
  const program = useSegmentationStore((state) => state.program);
  const lowAffinityOnly = useSegmentationStore((state) => state.lowAffinityOnly);
  const lights = useSegmentationStore((state) => state.lights);

  return profiles.flatMap((profile) => {
    const outcome = history[profile.id]?.at(-1);
    const isFlagged = flagged.includes(profile.id);
    if (program !== 'all' && outcome?.program.value !== program) return [];
    if (lights.length && !lights.includes(profileStatus(outcome, isFlagged))) return [];
    if (lowAffinityOnly && outcome?.affinity.value !== 'low') return [];
    return [{ profile, outcome }];
  });
}
