import { MultiGraph } from 'graphology';

import type { ProgramKey, PriorityLevel } from '@/libs/segmentation';

import type { GraphEdge, GraphNode, GraphNodeKind, ProfileGraph } from '../types/graph.types';

export type GraphTone =
  | 'ink-muted'
  | 'ink-soft'
  | 'accent'
  | 'yellow-fg'
  | 'green-fg'
  | 'red-fg'
  | 'blue-fg'
  | 'violet-fg';

export interface GraphNodeAttributes {
  x: number;
  y: number;
  size: number;
  label: string;
  tone: GraphTone;
  kind: GraphNodeKind;
  level?: PriorityLevel;
  programTone?: GraphTone;
  fixed?: boolean;
}

export interface GraphEdgeAttributes {
  kind: GraphEdge['kind'];
  strong: boolean;
}

export type SigmaGraph = MultiGraph<GraphNodeAttributes, GraphEdgeAttributes>;

const KIND_SIZE: Record<GraphNodeKind, number> = { profile: 4, program: 12, interest: 6 };
const PRIORITY_SIZE: Record<PriorityLevel, number> = { high: 8, medium: 5, low: 4.5, pending: 4 };

export const PROGRAM_TONE: Record<Exclude<ProgramKey, 'none'>, GraphTone> = {
  ai_sales: 'accent',
  sales_machine: 'blue-fg',
  inmersion_ejecutiva: 'violet-fg',
  achievers: 'yellow-fg',
  hardcore_ai: 'red-fg',
};

function programTone(id: string) {
  return PROGRAM_TONE[id.replace('program:', '') as keyof typeof PROGRAM_TONE];
}
const KIND_TONE: Record<GraphNodeKind, GraphTone> = {
  profile: 'ink-muted',
  program: 'accent',
  interest: 'ink-soft',
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
      level: node.priority?.level,
    });
  });
  for (const node of graph.nodes) {
    if (node.kind === 'program')
      result.setNodeAttribute(node.id, 'programTone', programTone(node.id));
  }
  for (const edge of graph.edges) {
    if (!result.hasNode(edge.source) || !result.hasNode(edge.target)) continue;
    if (edge.kind === 'recommendation') {
      result.setNodeAttribute(edge.source, 'programTone', programTone(edge.target));
    }
    const strong =
      edge.kind === 'recommendation' &&
      [edge.source, edge.target].some((id) => result.getNodeAttribute(id, 'level') === 'high');
    result.addEdgeWithKey(edge.id, edge.source, edge.target, { kind: edge.kind, strong });
  }
  return result;
}
