import type { GraphEdge, GraphNode, PositionedNode } from '../types/graph.types';

export function seedGraphNode(node: GraphNode, index: number): PositionedNode {
  const angle = index * 2.399963229728653;
  const radius = node.kind === 'program' ? 100 : 150 + Math.sqrt(index) * 22;
  return { ...node, x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, vx: 0, vy: 0 };
}

export function stepGraph(nodes: PositionedNode[], edges: GraphEdge[], pinned?: string) {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  for (let i = 0; i < nodes.length; i += 1) {
    const a = nodes[i]!;
    for (let j = i + 1; j < nodes.length; j += 1) {
      const b = nodes[j]!;
      const dx = a.x - b.x || 0.1;
      const dy = a.y - b.y || 0.1;
      const distance = Math.max(100, dx * dx + dy * dy);
      const force = 1000 / distance;
      const length = Math.sqrt(distance);
      a.vx += (dx / length) * force;
      a.vy += (dy / length) * force;
      b.vx -= (dx / length) * force;
      b.vy -= (dy / length) * force;
    }
  }
  for (const edge of edges) {
    const a = byId.get(edge.source);
    const b = byId.get(edge.target);
    if (!a || !b) continue;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const length = Math.max(1, Math.hypot(dx, dy));
    const force = (length - 115) * 0.008;
    a.vx += (dx / length) * force;
    a.vy += (dy / length) * force;
    b.vx -= (dx / length) * force;
    b.vy -= (dy / length) * force;
  }
  for (const node of nodes) {
    if (node.id === pinned) {
      node.vx = 0;
      node.vy = 0;
      continue;
    }
    node.vx = (node.vx - node.x * 0.0008) * 0.78;
    node.vy = (node.vy - node.y * 0.0008) * 0.78;
    node.x += Math.max(-8, Math.min(8, node.vx));
    node.y += Math.max(-8, Math.min(8, node.vy));
  }
}
