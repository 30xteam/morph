import { useSegmentationStore } from '../store/segmentation-store';
import { useSegmentProfile } from './use-segment-profile';

const CONCURRENCY = 4;

export function useRunAll() {
  const profiles = useSegmentationStore((state) => state.profiles);
  const history = useSegmentationStore((state) => state.history);
  const run = useSegmentationStore((state) => state.run);
  const setRun = useSegmentationStore((state) => state.setRun);
  const { mutateAsync } = useSegmentProfile();

  async function runAll() {
    const started = performance.now();
    const totals = { done: 0, failed: 0, jevMs: 0, costUsd: 0 };
    setRun({ running: true, total: profiles.length, elapsedMs: 0, ...totals });

    const queue = [...profiles];
    const worker = async () => {
      for (let profile = queue.shift(); profile; profile = queue.shift()) {
        const trigger = history[profile.id]?.length ? 're_run' : 'sign_up';
        try {
          // oxlint-disable-next-line no-await-in-loop -- each worker processes its share sequentially
          const outcome = await mutateAsync({ profile, trigger });
          totals.jevMs += outcome.meta.latencyMs;
          totals.costUsd += outcome.meta.costUsd;
        } catch {
          totals.failed += 1;
        }
        totals.done += 1;
        setRun({ ...totals });
      }
    };
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    setRun({ running: false, elapsedMs: Math.round(performance.now() - started) });
  }

  return { runAll, run };
}
