'use client';

import { useDeferredValue, useMemo, useState } from 'react';

import { Button } from '@/ui';

import { buildProfileGraph, filterProfileGraph } from '../../services/build-profile-graph';
import { useSegmentationStore } from '../../store/segmentation-store';
import { GraphDetails } from './graph-details';
import { GraphSurface } from './graph-surface';

export function ProfileGraph() {
  const profiles = useSegmentationStore((state) => state.profiles);
  const history = useSegmentationStore((state) => state.history);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string>();
  const [local, setLocal] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const graph = useMemo(() => buildProfileGraph(profiles, history), [profiles, history]);
  const selected = graph.nodes.find((node) => node.id === selectedId);
  const visible = useMemo(
    () => filterProfileGraph(graph, deferredQuery, local ? selected?.id : undefined),
    [graph, deferredQuery, local, selected?.id],
  );
  const decided = profiles.filter((profile) => history[profile.id]?.length).length;

  return (
    <section
      id="signups"
      aria-labelledby="graph-heading"
      className="flex scroll-mt-32 flex-col gap-3"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="graph-heading" className="text-title-md text-fg-strong">
            30X Graph
          </h2>
          <p className="text-caption text-fg-muted" aria-live="polite">
            {visible.nodes.length} nodes · {visible.edges.length} connections · {profiles.length}{' '}
            live profiles · {decided} with Jev decisions
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <label className="flex flex-col gap-1 text-caption text-fg-muted">
            Search nodes
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Person, program or interest"
              className="h-11 w-full rounded-input border border-border-input bg-surface px-3 text-body-sm text-fg focus-visible:outline-2 focus-visible:outline-primary"
            />
          </label>
          <Button
            variant="secondary"
            aria-pressed={local}
            disabled={!selected}
            onClick={() => setLocal((value) => !value)}
          >
            {local ? 'Show global graph' : 'Show local graph'}
          </Button>
          {selected ? (
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedId(undefined);
                setLocal(false);
              }}
            >
              Clear selection
            </Button>
          ) : null}
        </div>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-caption">
        <span className="text-fg-muted">● Profiles</span>
        <span className="text-primary">● Programs</span>
        <span className="text-accent-1">● Interests</span>
      </div>
      <div className="grid min-w-0 overflow-hidden rounded-md border border-border desktop:grid-cols-[minmax(0,1fr)_15rem]">
        <GraphSurface graph={visible} selectedId={selected?.id} onSelect={setSelectedId} />
        <GraphDetails graph={graph} selected={selected} onSelect={setSelectedId} />
      </div>
      <p className="text-caption text-fg-muted">
        Uses the same CRM profiles and live Luma feed as the table. Run Jev on all to add
        recommendations.
      </p>
    </section>
  );
}
