import { SegmentationService } from '../services/segmentation.service';
import { useSegmentationStore } from '../store/segmentation-store';
import { BATCH_LIMIT } from '../types/segment-batch-request.schema';
import type { Profile } from '../types/segmentation.types';

function chunks<T>(items: T[], size: number) {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, index * size + size),
  );
}

export function useDecideAll() {
  const setRun = useSegmentationStore((state) => state.setRun);
  const setPending = useSegmentationStore((state) => state.setPending);
  const saveOutcome = useSegmentationStore((state) => state.saveOutcome);

  return async function decideAll(profiles: Profile[]) {
    const startedAt = performance.now();
    setRun({ running: true, total: profiles.length, done: 0, failed: 0, costUsd: 0 });
    let done = 0;
    let failed = 0;
    let costUsd = 0;
    for (const batch of chunks(profiles, BATCH_LIMIT)) {
      const ids = batch.map((profile) => profile.id);
      setPending(ids, true);
      // oxlint-disable-next-line no-await-in-loop -- batches run in order so progress stays readable
      const items = await SegmentationService.segmentBatch(batch, 're_run').catch(() => null);
      setPending(ids, false);
      for (const item of items ?? []) {
        if ('outcome' in item) {
          saveOutcome(item.outcome);
          costUsd += item.outcome.meta.costUsd;
          done += 1;
        } else failed += 1;
      }
      if (!items) failed += batch.length;
      setRun({ done: done + failed, failed, costUsd });
    }
    setRun({ running: false, done, failed, costUsd, elapsedMs: performance.now() - startedAt });
  };
}
