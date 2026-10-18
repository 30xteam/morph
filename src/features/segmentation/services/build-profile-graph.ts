import {
  PROGRAM_LABELS,
  type Profile,
  type SegmentationOutcome,
  PRIORITY_LEVELS,
  profilePriority,
  type PriorityLevel,
} from '@/libs/segmentation';

import type { GraphEdge, GraphNode, ProfileGraph } from '../types/graph.types';

export function normalizeGraphText(text: string) {
  return text.normalize('NFD').replace(/\p{M}/gu, '').trim().toLowerCase();
}

export function buildProfileGraph(
  profiles: Profile[],
  history: Record<string, SegmentationOutcome[]>,
): ProfileGraph {
  const nodes = new Map<string, GraphNode>();
  const edges = new Map<string, GraphEdge>();
  const programs = Object.entries(PROGRAM_LABELS).filter(([key]) => key !== 'none');
  for (const [key, label] of programs) {
    nodes.set(`program:${key}`, { id: `program:${key}`, label, kind: 'program' });
  }
  function connect(source: string, target: string, kind: GraphEdge['kind']) {
    const id = `${source}:${kind}:${target}`;
    edges.set(id, { id, source, target, kind });
  }
  for (const profile of profiles) {
    const id = `profile:${profile.id}`;
    const outcome = history[profile.id]?.at(-1);
    nodes.set(id, {
      id,
      label: profile.alias,
      kind: 'profile',
      profileId: profile.id,
      priority: profilePriority(outcome),
    });
    for (const topic of profile.topics) {
      const label = topic.trim();
      if (!label) continue;
      const interestId = `interest:${normalizeGraphText(label)}`;
      if (!nodes.has(interestId)) {
        nodes.set(interestId, { id: interestId, label, kind: 'interest' });
      }
      connect(id, interestId, 'interest');
    }
    const crmProgram = programs.find(
      ([, label]) => normalizeGraphText(label) === normalizeGraphText(profile.crm.program),
    );
    if (crmProgram) connect(id, `program:${crmProgram[0]}`, 'crm');
    if (outcome && outcome.program.value !== 'none') {
      connect(id, `program:${outcome.program.value}`, 'recommendation');
    }
  }
  return { nodes: [...nodes.values()], edges: [...edges.values()] };
}

export function graphNeighborhood(graph: ProfileGraph, id: string) {
  const ids = new Set([id]);
  for (const edge of graph.edges) {
    if (edge.source === id) ids.add(edge.target);
    if (edge.target === id) ids.add(edge.source);
  }
  return ids;
}

export function filterPriorityGraph(graph: ProfileGraph, levels: readonly PriorityLevel[]) {
  if (levels.length === PRIORITY_LEVELS.length) return graph;
  const ids = new Set(
    graph.nodes
      .filter((node) => node.priority && levels.includes(node.priority.level))
      .map((node) => node.id),
  );
  const edges = graph.edges.filter((edge) => ids.has(edge.source));
  for (const edge of edges) ids.add(edge.target);
  return { nodes: graph.nodes.filter((node) => ids.has(node.id)), edges };
}

export function filterProfileGraph(graph: ProfileGraph, query: string, localId?: string) {
  let ids = new Set(graph.nodes.map((node) => node.id));
  const term = normalizeGraphText(query);
  if (term) {
    ids = new Set<string>();
    for (const node of graph.nodes) {
      if (!normalizeGraphText(node.label).includes(term)) continue;
      for (const id of graphNeighborhood(graph, node.id)) ids.add(id);
    }
  }
  if (localId) {
    const neighborhood = graphNeighborhood(graph, localId);
    ids = new Set([...ids].filter((id) => neighborhood.has(id)));
  }
  return {
    nodes: graph.nodes.filter((node) => ids.has(node.id)),
    edges: graph.edges.filter((edge) => ids.has(edge.source) && ids.has(edge.target)),
  };
}
