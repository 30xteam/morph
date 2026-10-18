'use client';

import { useMemo } from 'react';

import { liveHref } from '@/libs/segmentation';
import { Button, useProgressRouter } from '@/ui';

import type { GraphView } from '../hooks/use-graph-view';
import { useMessages } from '../hooks/use-messages';
import { graphNeighborhood } from '../services/build-profile-graph';
import type { GraphNode } from '../types/graph.types';
import { CloseIcon } from './graph-icons';
import { GraphProgramSummary } from './graph-program-summary';
import { PriorityBadge } from './priority-badge';

export function GraphDetails({ view, selected }: { view: GraphView; selected: GraphNode }) {
  const m = useMessages();
  const router = useProgressRouter();
  const summary = view.summaries.get(selected.id);
  const connections = useMemo(() => {
    const neighbors = graphNeighborhood(view.graph, selected.id);
    return view.graph.nodes.filter((node) => node.id !== selected.id && neighbors.has(node.id));
  }, [view.graph, selected.id]);
  const profileId = selected.profileId;

  return (
    <aside
      aria-label={m.graph.details}
      className="flex min-w-0 shrink-0 flex-col gap-5 overflow-y-auto border-t border-line bg-card px-5 py-6 desktop:w-80 desktop:border-t-0 desktop:border-l"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1" aria-live="polite">
          <p className="text-badge font-semibold tracking-wider text-ink-soft uppercase">
            {m.graph.kinds[selected.kind]}
          </p>
          <h2 className="text-title-md break-words text-ink">{selected.label}</h2>
          <p className="text-body-sm text-ink-muted">
            {summary ? m.graph.recommended(summary.total) : m.graph.connected(connections.length)}
          </p>
        </div>
        <Button variant="ghost" aria-label={m.graph.close} onClick={() => view.select(undefined)}>
          <CloseIcon />
        </Button>
      </div>
      {selected.priority ? (
        <div className="flex flex-col gap-2">
          <PriorityBadge priority={selected.priority} />
          <p className="text-body-sm text-ink-soft">{selected.priority.reason}</p>
          {selected.priority.needsReview ? (
            <p className="text-body-sm text-ink-muted">{m.graph.reviewRequired}</p>
          ) : null}
        </div>
      ) : null}
      {profileId ? (
        <Button
          onClick={() => {
            router.push(liveHref('/', { profile: profileId }));
          }}
        >
          {m.graph.openProfile}
        </Button>
      ) : null}
      {summary ? <GraphProgramSummary summary={summary} onSelect={view.select} /> : null}
      <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-label-sm text-ink-soft desktop:min-h-8">
        <input
          type="checkbox"
          checked={view.local}
          onChange={(event) => view.setLocal(event.target.checked)}
          className="size-4 accent-accent"
        />
        {m.graph.onlyConnections}
      </label>
      {!summary && connections.length ? (
        <ul className="flex flex-col gap-1" aria-label={m.graph.connections}>
          {connections.map((node) => (
            <li key={node.id}>
              <button
                type="button"
                onClick={() => view.select(node.id)}
                className="flex min-h-11 w-full flex-col items-start rounded-sm px-2 py-2 text-left hover:bg-raised"
              >
                <span className="text-body-sm break-words text-ink">{node.label}</span>
                <span className="text-body-sm text-ink-muted">{m.graph.kinds[node.kind]}</span>
                {node.priority ? <PriorityBadge priority={node.priority} /> : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </aside>
  );
}
