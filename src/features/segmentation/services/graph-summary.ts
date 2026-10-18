import type { GraphNode, ProfileGraph } from '../types/graph.types';
import { PRIORITY_LEVELS } from './profile-priority';
import type { PriorityLevel } from './profile-priority';

export type LevelCounts = Record<PriorityLevel, number>;

export interface ProgramSummary {
  total: number;
  levels: LevelCounts;
  firstContacts: GraphNode[];
}

function emptyCounts(): LevelCounts {
  return Object.fromEntries(PRIORITY_LEVELS.map((level) => [level, 0])) as LevelCounts;
}

export function countLevels(nodes: readonly GraphNode[]) {
  const counts = emptyCounts();
  for (const node of nodes) {
    if (node.priority) counts[node.priority.level] += 1;
  }
  return counts;
}

export function summarizePrograms(graph: ProfileGraph) {
  const byId = new Map(graph.nodes.map((node) => [node.id, node]));
  const members = new Map<string, GraphNode[]>();
  for (const edge of graph.edges) {
    if (edge.kind !== 'recommendation') continue;
    const profile = byId.get(edge.source);
    if (!profile) continue;
    members.set(edge.target, [...(members.get(edge.target) ?? []), profile]);
  }
  const summaries = new Map<string, ProgramSummary>();
  for (const node of graph.nodes) {
    if (node.kind !== 'program') continue;
    const profiles = members.get(node.id) ?? [];
    summaries.set(node.id, {
      total: profiles.length,
      levels: countLevels(profiles),
      firstContacts: profiles.filter((profile) => profile.priority?.level === 'high'),
    });
  }
  return summaries;
}
