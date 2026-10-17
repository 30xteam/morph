import { MultiGraph } from 'graphology';

import type { GraphEdge, GraphNode, GraphNodeKind, ProfileGraph } from '../types/graph.types';
import type { PriorityLevel } from './profile-priority';

export type GraphTone = 'ink-muted' | 'accent' | 'yellow-fg' | 'green-fg' | 'red-fg';

export interface GraphNodeAttributes {
  x: number;
  y: number;
  size: number;
  label: string;
  tone: GraphTone;
  kind: GraphNodeKind;
  fixed?: boolean;
}

export interface GraphEdgeAttributes {
  kind: GraphEdge['kind'];
}

export type SigmaGraph = MultiGraph<GraphNodeAttributes, GraphEdgeAttributes>;

const KIND_SIZE: Record<GraphNodeKind, number> = { profile: 7, program: 13, interest: 10 };
const PRIORITY_SIZE: Record<PriorityLevel, number> = { high: 12, medium: 9, low: 6, pending: 7 };
const KIND_TONE: Record<GraphNodeKind, GraphTone> = {
  profile: 'ink-muted',
  program: 'accent',
  interest: 'yellow-fg',
};
const PRIORITY_TONE: Record<PriorityLevel, GraphTone> = {
  high: 'green-fg',
  medium: 'yellow-fg',
  low: 'red-fg',
  pending: 'ink-muted',
};

export function seedGraphPosition(node: GraphNode, index: number) {
  const angle = index * 2.399963229728653;
  const radius = node.kind === 'program' ? 100 : 150 + Math.sqrt(index) * 22;
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
}

export function toGraphology(graph: ProfileGraph, previous?: SigmaGraph): SigmaGraph {
  const result: SigmaGraph = new MultiGraph();
  graph.nodes.forEach((node, index) => {
    const prior = previous?.hasNode(node.id) ? previous.getNodeAttributes(node.id) : undefined;
    result.addNode(node.id, {
      ...(prior ? { x: prior.x, y: prior.y } : seedGraphPosition(node, index)),
      size: node.priority ? PRIORITY_SIZE[node.priority.level] : KIND_SIZE[node.kind],
      label: node.priority ? `${node.label} · ${node.priority.short}` : node.label,
      tone: node.priority ? PRIORITY_TONE[node.priority.level] : KIND_TONE[node.kind],
      kind: node.kind,
    });
  });
  for (const edge of graph.edges) {
    if (!result.hasNode(edge.source) || !result.hasNode(edge.target)) continue;
    result.addEdgeWithKey(edge.id, edge.source, edge.target, { kind: edge.kind });
  }
  return result;
}
