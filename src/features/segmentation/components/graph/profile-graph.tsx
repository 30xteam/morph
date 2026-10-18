'use client';

import { useDeferredValue, useMemo, useState } from 'react';

import { Button } from '@/ui';

import {
  buildProfileGraph,
  filterProfileGraph,
  filterPriorityGraph,
} from '../../services/build-profile-graph';
import type { PriorityLevel } from '../../services/profile-priority';
import { useSegmentationStore } from '../../store/segmentation-store';
import { GraphDetails } from './graph-details';
import { GraphSurface } from './graph-surface';

export function ProfileGraph() {
  const profiles = useSegmentationStore((state) => state.profiles);
  const history = useSegmentationStore((state) => state.history);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string>();
  const [local, setLocal] = useState(false);
  const [priority, setPriority] = useState<PriorityLevel | 'all'>('all');
  const deferredQuery = useDeferredValue(query);
  const graph = useMemo(() => buildProfileGraph(profiles, history), [profiles, history]);
  const nodesById = useMemo(() => new Map(graph.nodes.map((node) => [node.id, node])), [graph]);
  const selected = selectedId ? nodesById.get(selectedId) : undefined;
  const visible = useMemo(
    () =>
      filterProfileGraph(
        filterPriorityGraph(graph, priority),
        deferredQuery,
        local ? selected?.id : undefined,
      ),
    [graph, priority, deferredQuery, local, selected?.id],
  );
  const decided = useMemo(
    () => profiles.filter((profile) => history[profile.id]?.length).length,
    [profiles, history],
  );

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3 px-4 py-6 tablet:px-8 desktop:py-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 id="graph-heading" className="text-title-lg text-ink">
            30X Graph
          </h1>
          <p className="text-body-sm text-ink-muted" aria-live="polite">
            {visible.nodes.length} nodes · {visible.edges.length} connections · {profiles.length}{' '}
            live profiles · {decided} with Jev decisions
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <label className="flex flex-col gap-1 text-body-sm text-ink-muted">
            Priority
            <select
              aria-label="Priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value as PriorityLevel | 'all')}
              className="h-11 rounded-md border border-line bg-canvas px-3 text-body-sm text-ink focus-visible:outline-2 focus-visible:outline-accent"
            >
              <option value="all">All priorities</option>
              <option value="high">P1 · High</option>
              <option value="medium">P2 · Medium</option>
              <option value="low">P3 · Low</option>
              <option value="pending">Not evaluated</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-body-sm text-ink-muted">
            Search nodes
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Person, program or interest"
              className="h-11 w-full rounded-md border border-line bg-canvas px-3 text-body-sm text-ink focus-visible:outline-2 focus-visible:outline-accent"
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
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-body-sm">
        <span className="text-ink-muted">
          People: P1 high · P2 medium · P3 low · — not evaluated
        </span>
        <span className="flex items-center gap-1.5 text-ink-soft">
          <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
          Programs
        </span>
        <span className="flex items-center gap-1.5 text-ink-soft">
          <span aria-hidden="true" className="size-2 rounded-full bg-yellow-fg" />
          Interests
        </span>
      </div>
      <div className="grid min-w-0 overflow-hidden rounded-md border border-line desktop:grid-cols-[minmax(0,1fr)_15rem]">
        <GraphSurface graph={visible} selectedId={selected?.id} onSelect={setSelectedId} />
        <GraphDetails graph={graph} selected={selected} onSelect={setSelectedId} />
      </div>
      <p className="text-body-sm text-ink-muted">
        Uses the same CRM profiles and live Luma feed as the table. Decide all on Live segments to
        add recommendations.
      </p>
    </div>
  );
}
