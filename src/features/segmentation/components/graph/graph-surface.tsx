'use client';

import { useEffect, useEffectEvent, useState } from 'react';

import { cx } from '@/core/cx';
import { MarkLoader } from '@/ui';

import { useGraphColors } from '../../hooks/use-graph-colors';
import type { GraphJump } from '../../hooks/use-graph-view';
import { useMessages } from '../../hooks/use-messages';
import { useSigmaGraph } from '../../hooks/use-sigma-graph';
import type { GraphColorBy } from '../../services/create-graph-renderer';
import type { ProfileGraph } from '../../types/graph.types';
import { FitIcon, PauseIcon, PlayIcon } from './graph-icons';

const CONTROL =
  'inline-flex size-11 items-center justify-center rounded-sm text-ink-soft transition-colors duration-150 hover:bg-raised hover:text-ink desktop:size-9';

interface GraphSurfaceProps {
  graph: ProfileGraph;
  selectedId?: string;
  jump?: GraphJump;
  colorBy: GraphColorBy;
  onSelect: (id: string) => void;
}

export function GraphSurface({ graph, selectedId, jump, colorBy, onSelect }: GraphSurfaceProps) {
  const [paused, setPaused] = useState(false);
  const m = useMessages();
  const colors = useGraphColors();
  const { container, loading, zoomPercent, zoomIn, zoomOut, focus, reset } = useSigmaGraph({
    graph,
    selectedId,
    paused,
    colorBy,
    colors,
    onSelect,
  });
  const focusNode = useEffectEvent((id: string) => focus(id));

  useEffect(() => {
    if (jump) focusNode(jump.id);
  }, [jump]);

  return (
    <div className="relative h-[65dvh] min-w-0 flex-none bg-canvas desktop:h-auto desktop:flex-1">
      <figure
        aria-label={m.graph.label}
        aria-describedby="graph-instructions"
        aria-busy={loading}
        className="absolute inset-0"
      >
        <div ref={container} className="absolute inset-0 touch-none select-none" />
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
      <p id="graph-instructions" className="sr-only">
        {m.graph.instructions}
      </p>
      {!graph.nodes.length ? (
        <output className="absolute inset-x-4 top-6 text-center text-body-sm text-ink-muted">
          {m.graph.empty}
        </output>
      ) : null}
      <div className="absolute bottom-4 left-4 flex items-center gap-0.5 rounded-md border border-line bg-card p-0.5 shadow-raised">
        <button type="button" aria-label={m.graph.zoomOut} onClick={zoomOut} className={CONTROL}>
          −
        </button>
        <span
          aria-live="polite"
          className="min-w-12 text-center text-caption text-ink-muted tabular-nums"
        >
          {zoomPercent}%
        </span>
        <button type="button" aria-label={m.graph.zoomIn} onClick={zoomIn} className={CONTROL}>
          +
        </button>
        <span aria-hidden="true" className="mx-0.5 h-5 w-px bg-line" />
        <button
          type="button"
          aria-label={m.graph.fit}
          title={m.graph.fit}
          onClick={reset}
          className={CONTROL}
        >
          <FitIcon />
        </button>
        <button
          type="button"
          aria-label={paused ? m.graph.resume : m.graph.pause}
          title={paused ? m.graph.resume : m.graph.pause}
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
          className={CONTROL}
        >
          {paused ? <PlayIcon /> : <PauseIcon />}
        </button>
      </div>
    </div>
  );
}
