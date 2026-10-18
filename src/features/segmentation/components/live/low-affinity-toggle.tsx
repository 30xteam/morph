'use client';

import { useLightCounts } from '../../hooks/use-light-counts';
import { useMessages } from '../../hooks/use-messages';
import { useSegmentationStore } from '../../store/segmentation-store';

export function LowAffinityToggle() {
  const m = useMessages();
  const { lowAffinity } = useLightCounts();
  const checked = useSegmentationStore((state) => state.lowAffinityOnly);
  const setLowAffinityOnly = useSegmentationStore((state) => state.setLowAffinityOnly);

  return (
    <label className="flex min-h-11 w-fit cursor-pointer items-center gap-2.5 text-label-sm text-ink-soft hover:text-ink desktop:min-h-8">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => setLowAffinityOnly(event.target.checked)}
        className="size-4 accent-accent"
      />
      {m.list.lowAffinityOnly}
      <span className="text-ink-muted tabular-nums">{lowAffinity}</span>
    </label>
  );
}
