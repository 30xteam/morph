import { useDeferredValue, useMemo, useState } from 'react';

import {
  buildProfileGraph,
  filterPriorityGraph,
  filterProfileGraph,
} from '../services/build-profile-graph';
import type { GraphColorBy } from '../services/create-graph-renderer';
import { countLevels, summarizePrograms } from '../services/graph-summary';
import { PRIORITY_LEVELS } from '../services/profile-priority';
import type { PriorityLevel } from '../services/profile-priority';
import { useSegmentationStore } from '../store/segmentation-store';

export interface GraphJump {
  id: string;
  at: number;
}

export function useGraphView() {
  const profiles = useSegmentationStore((state) => state.profiles);
  const history = useSegmentationStore((state) => state.history);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string>();
  const [jump, setJump] = useState<GraphJump>();
  const [local, setLocal] = useState(false);
  const [colorBy, setColorBy] = useState<GraphColorBy>('priority');
  const [levels, setLevels] = useState<readonly PriorityLevel[]>(PRIORITY_LEVELS);
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
    setSelectedId(id);
    if (!id) setLocal(false);
  }

  function search(value: string) {
    const match = graph.nodes.find((node) => node.label === value);
    if (!match) {
      setQuery(value);
      return;
    }
    setQuery('');
    select(match.id);
    setJump({ id: match.id, at: Date.now() });
  }

  function toggleLevel(level: PriorityLevel) {
    setLevels((current) =>
      current.includes(level)
        ? current.filter((item) => item !== level)
        : PRIORITY_LEVELS.filter((item) => item === level || current.includes(item)),
    );
  }

  function clear() {
    setQuery('');
    setLevels(PRIORITY_LEVELS);
    select(undefined);
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
    setLocal,
    setColorBy,
  };
}

export type GraphView = ReturnType<typeof useGraphView>;
