import type { ProfilePriority } from '../services/profile-priority';

export type GraphNodeKind = 'profile' | 'program' | 'interest';

export interface GraphNode {
  id: string;
  label: string;
  kind: GraphNodeKind;
  profileId?: string;
  priority?: ProfilePriority;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  kind: 'interest' | 'crm' | 'recommendation';
}

export interface ProfileGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface PositionedNode extends GraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}
