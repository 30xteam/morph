import { useState } from 'react';

import { useSegmentationStore } from '../store/segmentation-store';
import { useSegmentProfile } from './use-segment-profile';

const CONCURRENCY = 4;

export function useRunAll() {
  const profiles = useSegmentationStore((state) => state.profiles);
  const history = useSegmentationStore((state) => state.history);
  const { mutateAsync } = useSegmentProfile();
  const [running, setRunning] = useState(false);
  const [failed, setFailed] = useState(0);

  async function runAll() {
    setRunning(true);
    setFailed(0);
    const queue = [...profiles];
    const worker = async () => {
      for (let profile = queue.shift(); profile; profile = queue.shift()) {
        const trigger = history[profile.id]?.length ? 're_run' : 'sign_up';
        // oxlint-disable-next-line no-await-in-loop -- each worker processes its share sequentially
        await mutateAsync({ profile, trigger }).catch(() => setFailed((count) => count + 1));
      }
    };
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    setRunning(false);
  }

  return { runAll, running, failed };
}
