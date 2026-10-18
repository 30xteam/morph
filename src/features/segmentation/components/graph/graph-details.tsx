'use client';

import { useMemo } from 'react';

import { Button, useProgressRouter } from '@/ui';

import { graphNeighborhood } from '../../services/build-profile-graph';
import { useSegmentationStore } from '../../store/segmentation-store';
import type { GraphNode, ProfileGraph } from '../../types/graph.types';
import { PriorityBadge } from '../priority-badge';
import { GraphLegend } from './graph-legend';

interface GraphDetailsProps {
  graph: ProfileGraph;
  selected?: GraphNode;
  onSelect: (id: string) => void;
}

export function GraphDetails({ graph, selected, onSelect }: GraphDetailsProps) {
  const router = useProgressRouter();
  const select = useSegmentationStore((state) => state.select);
  const profileId = selected?.profileId;
  const connections = useMemo(() => {
    if (!selected) return [];
    const neighbors = graphNeighborhood(graph, selected.id);
    return graph.nodes.filter((node) => node.id !== selected.id && neighbors.has(node.id));
  }, [graph, selected]);

  return (
    <aside
      aria-label="Graph details"
      className="flex min-w-0 flex-col gap-4 border-t border-line bg-card p-4 desktop:border-t-0 desktop:border-l"
    >
      <div className="flex flex-col gap-1" aria-live="polite">
        <p className="text-body-sm text-ink-muted">{selected?.kind ?? 'Explore the network'}</p>
        <h2 className="text-title-md break-words text-ink">
          {selected?.label ?? 'Connected profiles'}
        </h2>
        <p className="text-body-sm text-ink-muted">
          {selected
            ? `${connections.length} connected nodes`
            : 'Select a person, program or interest to explore its connections.'}
        </p>
      </div>
      {selected?.priority ? (
        <div className="flex flex-col gap-2">
          <PriorityBadge priority={selected.priority} />
          <p className="text-body-sm text-ink-soft">{selected.priority.reason}</p>
          {selected.priority.needsReview ? (
            <p className="text-body-sm text-ink-muted">Review required before outreach.</p>
          ) : null}
        </div>
      ) : null}
      {profileId ? (
        <Button
          variant="secondary"
          onClick={() => {
            select(profileId);
            router.push('/');
          }}
        >
          Open profile
        </Button>
      ) : null}
      {connections.length ? (
        <ul className="flex max-h-80 flex-col gap-1 overflow-y-auto" aria-label="Connected nodes">
          {connections.map((node) => (
            <li key={node.id}>
              <button
                type="button"
                onClick={() => onSelect(node.id)}
                className="flex min-h-11 w-full flex-col items-start rounded-sm px-2 py-2 text-left hover:bg-raised focus-visible:outline-2 focus-visible:outline-accent"
              >
                <span className="text-body-sm break-words text-ink">{node.label}</span>
                <span className="text-body-sm text-ink-muted">{node.kind}</span>
                {node.priority ? <PriorityBadge priority={node.priority} /> : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <GraphLegend />
    </aside>
  );
}
