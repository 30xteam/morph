import { playToastSound } from '@/ui';

import { SegmentationService } from '../services/segmentation.service';
import { useSegmentationStore } from '../store/segmentation-store';
import { BATCH_LIMIT } from '../types/segment-batch-request.schema';
import type { Profile } from '../types/segmentation.types';
import { profileStatus } from '../utils/profile-status';

function chunks<T>(items: T[], size: number) {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, index * size + size),
  );
}

const OPEN_PAUSE_MS = 250;
const CLOSE_PAUSE_MS = 600;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isCancelled() {
  return useSegmentationStore.getState().run.cancelled;
}

export function useDecideAll() {
  const setRun = useSegmentationStore((state) => state.setRun);
  const setPending = useSegmentationStore((state) => state.setPending);
  const saveOutcome = useSegmentationStore((state) => state.saveOutcome);

  async function decideAll(profiles: Profile[]) {
    const startedAt = performance.now();
    const batches = chunks(profiles, BATCH_LIMIT);
    const tally = { done: 0, failed: 0, costUsd: 0, green: 0, yellow: 0 };
    setRun({
      ...tally,
      running: true,
      cancelled: false,
      total: profiles.length,
      batch: 0,
      batches: batches.length,
    });
    await wait(OPEN_PAUSE_MS);
    for (const [index, batch] of batches.entries()) {
      if (isCancelled()) break;
      const ids = batch.map((profile) => profile.id);
      setRun({ batch: index + 1 });
      setPending(ids, true);
      // oxlint-disable-next-line no-await-in-loop -- batches run in order so progress stays readable and cancellable
      const items = await SegmentationService.segmentBatch(batch, 're_run').catch(() => null);
      setPending(ids, false);
      for (const item of items ?? []) {
        if (!('outcome' in item)) {
          tally.failed += 1;
          continue;
        }
        saveOutcome(item.outcome);
        tally.costUsd += item.outcome.meta.costUsd;
        tally.done += 1;
        const status = profileStatus(item.outcome);
        if (status === 'green') tally.green += 1;
        if (status === 'yellow') tally.yellow += 1;
      }
      if (!items) tally.failed += batch.length;
      setRun({ ...tally, done: tally.done + tally.failed });
    }
    const elapsedMs = performance.now() - startedAt;
    if (!isCancelled()) setRun({ batch: batches.length + 1 });
    await wait(CLOSE_PAUSE_MS);
    setRun({ ...tally, running: false, elapsedMs });
    if (tally.failed) playToastSound('error');
    else if (!isCancelled()) playToastSound('success');
  }

  return { decideAll, cancel: () => setRun({ cancelled: true }) };
}
