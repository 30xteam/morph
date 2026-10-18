import { useSegmentationStore } from '../store/segmentation-store';
import type { ProgramKey } from '../types/segmentation.types';
import { needsPerson } from '../utils/profile-status';

const EMPTY: Record<ProgramKey, number> = {
  ai_sales: 0,
  inmersion_ejecutiva: 0,
  sales_machine: 0,
  hardcore_ai: 0,
  achievers: 0,
  none: 0,
};

export function useConsoleCounts() {
  const profiles = useSegmentationStore((state) => state.profiles);
  const history = useSegmentationStore((state) => state.history);
  const flagged = useSegmentationStore((state) => state.flagged);

  const programs = { ...EMPTY };
  let review = 0;
  let lowAffinity = 0;
  let decided = 0;
  for (const profile of profiles) {
    const outcome = history[profile.id]?.at(-1);
    if (!outcome) continue;
    decided += 1;
    programs[outcome.program.value] += 1;
    if (needsPerson(outcome, flagged.includes(profile.id))) review += 1;
    if (outcome.affinity.value === 'low') lowAffinity += 1;
  }
  return { total: profiles.length, decided, programs, review, lowAffinity };
}
