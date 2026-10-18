import { useQueryStates } from 'nuqs';
import { useDeferredValue, useMemo, useState } from 'react';

import {
  graphParams,
  PRIORITY_LEVELS,
  type PriorityLevel,
  useSegmentationStore,
} from '@/libs/segmentation';

import {
  buildProfileGraph,
  filterPriorityGraph,
  filterProfileGraph,
} from '../services/build-profile-graph';
import type { GraphColorBy } from '../services/create-graph-renderer';
import { countLevels, summarizePrograms } from '../services/graph-summary';

export interface GraphJump {
  id: string;
  at: number;
}

export function useGraphView() {
  const profiles = useSegmentationStore((state) => state.profiles);
  const history = useSegmentationStore((state) => state.history);
  const [params, setParams] = useQueryStates(graphParams);
  const [jump, setJump] = useState<GraphJump>();
  const { q: query, local, color: colorBy, priority: levels } = params;
  const selectedId = params.node ?? undefined;
  const deferredQuery = useDeferredValue(query);

  const graph = useMemo(() => buildProfileGraph(profiles, history), [profiles, history]);
  const nodesById = useMemo(() => new Map(graph.nodes.map((node) => [node.id, node])), [graph]);
  const programs = useMemo(() => graph.nodes.filter((node) => node.kind === 'program'), [graph]);
  const summaries = useMemo(() => summarizePrograms(graph), [graph]);
  const levelCounts = useMemo(() => countLevels(graph.nodes), [graph]);
  const selected = selectedId ? nodesById.get(selectedId) : undefined;
  const localId = local ? selectedId : undefined;
  const visible = useMemo(
    () => filterProfileGraph(filterPriorityGraph(graph, levels), deferredQuery, localId),
    [graph, levels, deferredQuery, localId],
  );
  const visibleProfiles = visible.nodes.filter((node) => node.kind === 'profile').length;
  const focusId = selected?.kind === 'program' ? selected.id : undefined;
  const matches = focusId ? (summaries.get(focusId)?.total ?? 0) : visibleProfiles;
  const activeFilters =
    Number(levels.length < PRIORITY_LEVELS.length) +
    Number(Boolean(focusId)) +
    Number(Boolean(query));

  function select(id: string | undefined) {
    void setParams(id ? { node: id } : { node: null, local: null });
  }

  function search(value: string) {
    const match = graph.nodes.find((node) => node.label === value);
    if (!match) {
      void setParams({ q: value });
      return;
    }
    void setParams({ q: null, node: match.id });
    setJump({ id: match.id, at: Date.now() });
  }

  function toggleLevel(level: PriorityLevel) {
    void setParams({
      priority: levels.includes(level)
        ? levels.filter((item) => item !== level)
        : PRIORITY_LEVELS.filter((item) => item === level || levels.includes(item)),
    });
  }

  function clear() {
    void setParams({ q: null, priority: null, node: null, local: null });
  }

  return {
    graph,
    visible,
    visibleProfiles,
    matches,
    programs,
    summaries,
    levelCounts,
    selected,
    focusId,
    query,
    jump,
    local,
    colorBy,
    levels,
    activeFilters,
    totalProfiles: profiles.length,
    select,
    search,
    toggleLevel,
    clear,
    setLocal: (value: boolean) => void setParams({ local: value }),
    setColorBy: (value: GraphColorBy) => void setParams({ color: value }),
  };
}

export type GraphView = ReturnType<typeof useGraphView>;
