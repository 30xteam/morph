'use client';

import { useConsoleCounts } from '../../hooks/use-console-counts';
import { useMessages } from '../../hooks/use-messages';
import { type ProgramFilter, useSegmentationStore } from '../../store/segmentation-store';
import { PROGRAM_ORDER } from '../shell/program-order';

export function ProgramSelect() {
  const m = useMessages();
  const counts = useConsoleCounts();
  const program = useSegmentationStore((state) => state.program);
  const setProgram = useSegmentationStore((state) => state.setProgram);

  return (
    <label className="flex flex-col gap-1.5 text-label-xs text-ink-soft desktop:hidden">
      {m.nav.segments}
      <select
        value={program}
        onChange={(event) => setProgram(event.target.value as ProgramFilter)}
        className="min-h-11 rounded-md border border-line bg-canvas px-3 text-body-md text-ink"
      >
        <option value="all">
          {m.nav.allProfiles} · {counts.total}
        </option>
        {PROGRAM_ORDER.map((key) => (
          <option key={key} value={key}>
            {m.programs[key]} · {counts.programs[key]}
          </option>
        ))}
      </select>
    </label>
  );
}
