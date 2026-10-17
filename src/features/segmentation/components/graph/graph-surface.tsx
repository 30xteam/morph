'use client';

/* oxlint-disable jsx-a11y/prefer-tag-over-role -- SVG graph groups require explicit interactive roles. */

import { useState } from 'react';

import { cx } from '@/core/cx';
import { Button } from '@/ui';

import { useGraphCamera } from '../../hooks/use-graph-camera';
import { useGraphLayout } from '../../hooks/use-graph-layout';
import { graphNeighborhood } from '../../services/build-profile-graph';
import type { GraphNodeKind, ProfileGraph } from '../../types/graph.types';
import { PRIORITY_COLOR } from '../priority-badge';

const PRIORITY_RADIUS = { high: 12, medium: 9, low: 6, pending: 7 };

const NODE_COLOR: Record<GraphNodeKind, string> = {
  profile: 'text-fg-muted',
  program: 'text-primary',
  interest: 'text-accent-1',
};
const RADIUS: Record<GraphNodeKind, number> = { profile: 7, program: 13, interest: 10 };

interface GraphSurfaceProps {
  graph: ProfileGraph;
  selectedId?: string;
  onSelect: (id: string) => void;
}

export function GraphSurface({ graph, selectedId, onSelect }: GraphSurfaceProps) {
  const [paused, setPaused] = useState(false);
  const [hoveredId, setHoveredId] = useState<string>();
  const { positions, pin, release, reset } = useGraphLayout(graph, paused);
  const { svg, camera, viewBox, zoom, resetCamera, handlers } = useGraphCamera(
    pin,
    release,
    onSelect,
  );
  const byId = new Map(positions.map((node) => [node.id, node]));
  const active = hoveredId ?? selectedId;
  const visibleActive = active && byId.has(active) ? active : undefined;
  const neighbors = visibleActive ? graphNeighborhood(graph, visibleActive) : undefined;

  return (
    <div className="flex min-w-0 flex-col bg-surface">
      <div className="flex flex-wrap items-center gap-1 border-b border-border p-2">
        <Button variant="ghost" aria-label="Zoom out" onClick={() => zoom(1 / 1.25)}>
          −
        </Button>
        <span
          className="min-w-12 text-center text-caption text-fg-muted tabular-nums"
          aria-live="polite"
        >
          {Math.round(camera.scale * 100)}%
        </span>
        <Button variant="ghost" aria-label="Zoom in" onClick={() => zoom(1.25)}>
          +
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            resetCamera();
            reset();
          }}
        >
          Reset view
        </Button>
        <Button variant="ghost" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
          {paused ? 'Resume layout' : 'Pause layout'}
        </Button>
      </div>
      <svg
        ref={svg}
        viewBox={viewBox}
        role="group"
        aria-label="30X relationship graph"
        aria-describedby="graph-instructions"
        className="h-128 w-full touch-none select-none tablet:h-160"
        {...handlers}
        onPointerLeave={() => setHoveredId(undefined)}
      >
        <g
          data-camera="true"
          transform={`translate(${camera.x} ${camera.y}) scale(${camera.scale})`}
        >
          {graph.edges.map((edge) => {
            const a = byId.get(edge.source);
            const b = byId.get(edge.target);
            if (!a || !b) return null;
            const highlighted = edge.source === visibleActive || edge.target === visibleActive;
            return (
              <line
                key={edge.id}
                data-edge-kind={edge.kind}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                className={cx(
                  'pointer-events-none stroke-current',
                  highlighted ? 'text-primary' : 'text-border',
                )}
                opacity={visibleActive && !highlighted ? 0.2 : 1}
                strokeWidth={highlighted ? 2 : 1}
                strokeDasharray={edge.kind === 'recommendation' ? '5 5' : undefined}
              />
            );
          })}
          {positions.map((node) => (
            <g
              key={node.id}
              data-node-id={node.id}
              data-node-kind={node.kind}
              data-priority={node.priority?.level}
              transform={`translate(${node.x} ${node.y})`}
              role="button"
              tabIndex={0}
              aria-label={`${node.kind}: ${node.label}${node.priority ? `, ${node.priority.label}` : ''}`}
              aria-pressed={selectedId === node.id}
              className={cx(
                'group cursor-grab outline-none',
                node.priority ? PRIORITY_COLOR[node.priority.level] : NODE_COLOR[node.kind],
              )}
              opacity={neighbors && !neighbors.has(node.id) ? 0.25 : 1}
              onPointerEnter={() => setHoveredId(node.id)}
              onPointerLeave={() => setHoveredId(undefined)}
              onFocus={() => setHoveredId(node.id)}
              onBlur={() => setHoveredId(undefined)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelect(node.id);
                }
              }}
            >
              <title>
                {node.label} · {node.priority?.label ?? node.kind}
              </title>
              <circle r={22} fill="transparent" />
              <circle
                r={
                  (node.priority ? PRIORITY_RADIUS[node.priority.level] : RADIUS[node.kind]) +
                  (selectedId === node.id ? 4 : 0)
                }
                className="fill-current group-focus-visible:stroke-primary group-focus-visible:stroke-4"
                stroke="currentColor"
                strokeWidth={2}
              />
              <text
                x={(node.priority ? PRIORITY_RADIUS[node.priority.level] : RADIUS[node.kind]) + 7}
                y={5}
                className={cx('text-body-sm', node.priority ? 'fill-fg' : 'fill-current')}
              >
                {node.label}
                {node.priority ? ` · ${node.priority.short}` : ''}
              </text>
            </g>
          ))}
        </g>
      </svg>
      {!graph.nodes.length ? (
        <output className="px-4 pb-4 text-body-sm text-fg-muted">
          No matching nodes. Try another search.
        </output>
      ) : null}
      <p
        id="graph-instructions"
        className="border-t border-border px-3 py-3 text-caption text-fg-muted"
      >
        Drag nodes or the background. Scroll to zoom. Tab to a node and press Enter to select it.
      </p>
    </div>
  );
}
