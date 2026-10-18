'use client';

import { useId, useState } from 'react';

import { cx } from '@/core/cx';
import { Button, MarkLoader } from '@/ui';

import { useGraphColors } from '../../hooks/use-graph-colors';
import { useMessages } from '../../hooks/use-messages';
import { useSigmaGraph } from '../../hooks/use-sigma-graph';
import type { ProfileGraph } from '../../types/graph.types';

interface GraphSurfaceProps {
  graph: ProfileGraph;
  selectedId?: string;
  onSelect: (id: string) => void;
}

export function GraphSurface({ graph, selectedId, onSelect }: GraphSurfaceProps) {
  const [paused, setPaused] = useState(false);
  const [jump, setJump] = useState('');
  const optionsId = useId();
  const m = useMessages();
  const colors = useGraphColors();
  const { container, loading, zoomPercent, zoomIn, zoomOut, focus, reset } = useSigmaGraph({
    graph,
    selectedId,
    paused,
    colors,
    onSelect,
  });

  function jumpTo(value: string) {
    setJump(value);
    const match = graph.nodes.find((node) => node.label === value);
    if (!match) return;
    onSelect(match.id);
    focus(match.id);
    setJump('');
  }

  return (
    <div className="flex min-w-0 flex-col bg-canvas">
      <div className="flex flex-wrap items-center gap-1 border-b border-line p-2">
        <Button variant="ghost" aria-label="Zoom out" onClick={zoomOut}>
          −
        </Button>
        <span
          className="min-w-12 text-center text-body-sm text-ink-muted tabular-nums"
          aria-live="polite"
        >
          {zoomPercent}%
        </span>
        <Button variant="ghost" aria-label="Zoom in" onClick={zoomIn}>
          +
        </Button>
        <Button variant="ghost" onClick={reset}>
          Reset view
        </Button>
        <Button variant="ghost" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
          {paused ? 'Resume layout' : 'Pause layout'}
        </Button>
        <label className="ml-auto flex items-center gap-2 text-body-sm text-ink-muted">
          Go to node
          <input
            list={optionsId}
            value={jump}
            onChange={(event) => jumpTo(event.target.value)}
            placeholder="Type a name"
            className="h-11 w-48 rounded-md border border-line bg-canvas px-3 text-body-sm text-ink focus-visible:outline-2 focus-visible:outline-accent"
          />
        </label>
        <datalist id={optionsId}>
          {graph.nodes.map((node) => (
            <option key={node.id} value={node.label}>
              {node.kind}
            </option>
          ))}
        </datalist>
      </div>
      <figure
        aria-label="30X relationship graph"
        aria-describedby="graph-instructions"
        aria-busy={loading}
        className="relative"
      >
        <div ref={container} className="h-128 w-full touch-none select-none tablet:h-160" />
        <div
          aria-hidden={!loading}
          className={cx(
            'absolute inset-0 grid place-items-center bg-canvas transition-[opacity,visibility] duration-500 motion-reduce:transition-none',
            !loading && 'invisible opacity-0',
          )}
        >
          <MarkLoader label={m.graph.loading} />
        </div>
      </figure>
      {!graph.nodes.length ? (
        <output className="px-4 pb-4 text-body-sm text-ink-muted">
          No matching nodes. Try another search.
        </output>
      ) : null}
      <p
        id="graph-instructions"
        className="border-t border-line px-3 py-3 text-body-sm text-ink-muted"
      >
        Drag nodes or the background. Scroll to zoom. Use Go to node to select one with the
        keyboard.
      </p>
    </div>
  );
}
