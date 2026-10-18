'use client';

import { cx } from '@/core/cx';

import { useMessages } from '../../hooks/use-messages';
import type { GraphColorBy } from '../../services/create-graph-renderer';
import type { GraphNode } from '../../types/graph.types';
import { SegmentedControl } from '../ui/segmented-control';

const CHIP =
  'inline-flex min-h-11 items-center rounded-full border px-3 text-label-sm font-medium transition-colors duration-150 ease-out-strong desktop:min-h-8';

const IDLE = 'border-line-strong text-ink-soft hover:bg-raised hover:text-ink';

const ACTIVE = 'border-accent bg-green-bg text-green-fg';

const LABEL = 'w-18 shrink-0 text-label-xs text-ink-soft';

interface GraphViewControlsProps {
  programs: GraphNode[];
  focusId?: string;
  colorBy: GraphColorBy;
  onFocus: (id: string | undefined) => void;
  onColorBy: (value: GraphColorBy) => void;
}

export function GraphViewControls({
  programs,
  focusId,
  colorBy,
  onFocus,
  onColorBy,
}: GraphViewControlsProps) {
  const m = useMessages();
  const options = [
    { value: 'priority', label: m.graph.colorPriority },
    { value: 'program', label: m.graph.colorProgram },
    { value: 'none', label: m.graph.colorNone },
  ] as const;
  const chips = [{ id: undefined, label: m.graph.focusNone }, ...programs];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className={LABEL}>{m.graph.colorBy}</span>
        <SegmentedControl<GraphColorBy>
          label={m.graph.colorBy}
          value={colorBy}
          options={options}
          onChange={onColorBy}
        />
      </div>
      <fieldset className="flex min-w-0 flex-wrap items-center gap-2">
        <legend className={cx(LABEL, 'float-left')}>{m.graph.focus}</legend>
        {chips.map((chip) => {
          const active = chip.id === focusId;
          return (
            <button
              key={chip.id ?? 'none'}
              type="button"
              aria-pressed={active}
              onClick={() => onFocus(chip.id)}
              className={cx(CHIP, active ? ACTIVE : IDLE)}
            >
              {chip.label}
            </button>
          );
        })}
      </fieldset>
    </div>
  );
}
