'use client';

import { show } from '@ebay/nice-modal-react';

import { Button } from '@/ui';

import { graphNeighborhood } from '../../services/build-profile-graph';
import type { GraphNode, ProfileGraph } from '../../types/graph.types';
import { ProfileDialog } from '../profile/profile-dialog';

interface GraphDetailsProps {
  graph: ProfileGraph;
  selected?: GraphNode;
  onSelect: (id: string) => void;
}

export function GraphDetails({ graph, selected, onSelect }: GraphDetailsProps) {
  const profileId = selected?.profileId;
  const neighbors = selected ? graphNeighborhood(graph, selected.id) : new Set<string>();
  const connections = graph.nodes.filter(
    (node) => node.id !== selected?.id && neighbors.has(node.id),
  );

  return (
    <aside
      aria-label="Graph details"
      className="flex min-w-0 flex-col gap-4 border-t border-border bg-surface-subtle p-4 desktop:border-t-0 desktop:border-l"
    >
      <div className="flex flex-col gap-1" aria-live="polite">
        <p className="text-caption text-fg-muted">{selected?.kind ?? 'Explore the network'}</p>
        <h3 className="text-title-md break-words text-fg-strong">
          {selected?.label ?? 'Connected profiles'}
        </h3>
        <p className="text-body-sm text-fg-muted">
          {selected
            ? `${connections.length} connected nodes`
            : 'Select a person, program or interest to explore its connections.'}
        </p>
      </div>
      {profileId ? (
        <Button variant="secondary" onClick={() => show(ProfileDialog, { profileId })}>
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
                className="flex min-h-11 w-full flex-col items-start rounded-sm px-2 py-2 text-left hover:bg-state-hover focus-visible:outline-2 focus-visible:outline-primary"
              >
                <span className="text-body-sm break-words text-fg">{node.label}</span>
                <span className="text-caption text-fg-muted">{node.kind}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <dl className="mt-auto flex flex-col gap-2 border-t border-border pt-4 text-caption text-fg-muted">
        <dt className="text-label-sm text-fg-strong">Connections</dt>
        <dd>Solid: declared interest or program recorded in the CRM.</dd>
        <dd>Dashed: latest Jev program recommendation.</dd>
        <dd>Shared interests do not imply people know each other.</dd>
      </dl>
    </aside>
  );
}
