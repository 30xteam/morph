import type forceAtlas2 from 'graphology-layout-forceatlas2';
import type FA2Layout from 'graphology-layout-forceatlas2/worker';
import type { Attributes } from 'graphology-types';
import type Sigma from 'sigma';

import type { PriorityLevel } from './profile-priority';
import type {
  GraphEdgeAttributes,
  GraphNodeAttributes,
  GraphTone,
  SigmaGraph,
} from './to-graphology';

export type GraphColorKey = GraphTone | 'ink' | 'line' | 'font';

interface SelectionState {
  isSelected: boolean;
}

export type GraphRenderer = Sigma<
  GraphNodeAttributes,
  GraphEdgeAttributes,
  Attributes,
  SelectionState
>;

export type GraphColorBy = 'priority' | 'program' | 'none';

export interface GraphView {
  color: (key: GraphColorKey) => string;
  colorBy: () => GraphColorBy;
}

export interface GraphLibraries {
  forceAtlas2: typeof forceAtlas2;
  Layout: typeof FA2Layout;
  createRenderer: (element: HTMLElement, view: GraphView) => GraphRenderer;
}

const DIMMED_NODE_OPACITY = 0.45;
const DIMMED_EDGE_OPACITY = 0.03;
const LEVEL_OPACITY: Record<PriorityLevel, number> = {
  high: 1,
  medium: 0.4,
  low: 0.32,
  pending: 0.5,
};

function restingOpacity(attributes: GraphNodeAttributes) {
  return attributes.level ? LEVEL_OPACITY[attributes.level] : 1;
}

function restingEdgeOpacity(attributes: GraphEdgeAttributes) {
  if (attributes.strong) return 0.5;
  return attributes.kind === 'recommendation' ? 0.12 : 0.15;
}

export async function loadGraphLibraries(): Promise<GraphLibraries> {
  const [{ default: SigmaRenderer }, { MultiGraph }, layout, worker, shapes] = await Promise.all([
    import('sigma'),
    import('graphology'),
    import('graphology-layout-forceatlas2'),
    import('graphology-layout-forceatlas2/worker'),
    import('sigma/rendering'),
  ]);

  function createRenderer(element: HTMLElement, { color, colorBy }: GraphView) {
    const empty: SigmaGraph = new MultiGraph();
    const renderer: GraphRenderer = new SigmaRenderer(empty, element, {
      customNodeState: { isSelected: false },
      primitives: { nodes: { shapes: [shapes.sdfCircle(), shapes.sdfDiamond()] } },
      styles: {
        nodes: {
          x: { attribute: 'x' },
          y: { attribute: 'y' },
          label: { attribute: 'label' },
          shape: (attributes) => (attributes.kind === 'interest' ? 'diamond' : 'circle'),
          size: (attributes, state) => attributes.size + (state.isSelected ? 4 : 0),
          color: (attributes, state, graphState) => {
            if (graphState.hasHighlighted && !state.isHighlighted) return color('line');
            const mode = colorBy();
            if (mode === 'program' && attributes.kind !== 'interest') {
              return color(attributes.programTone ?? 'ink-muted');
            }
            if (mode === 'none' && attributes.kind === 'profile') return color('ink-muted');
            return color(attributes.tone);
          },
          opacity: (attributes, state, graphState) => {
            if (state.isHighlighted) return 1;
            if (graphState.hasHighlighted) return DIMMED_NODE_OPACITY;
            if (colorBy() === 'priority') return restingOpacity(attributes);
            return attributes.kind === 'profile' ? 0.7 : 1;
          },
          labelColor: () => color('ink'),
          labelFont: () => color('font'),
          labelVisibility: (attributes, state, graphState) => {
            if (state.isHovered || state.isSelected || attributes.kind === 'program')
              return 'visible';
            if (graphState.hasHighlighted && !state.isHighlighted) return 'hidden';
            return 'auto';
          },
          backdropVisibility: 'hidden',
          depth: (_attributes, state) =>
            state.isHighlighted || state.isHovered ? 'topNodes' : 'nodes',
          cursor: 'pointer',
        },
        edges: {
          color: (attributes, state) => {
            if (attributes.kind === 'recommendation') return color('accent');
            return color(state.isHighlighted ? 'ink-soft' : 'ink-muted');
          },
          size: (attributes, state) =>
            attributes.kind === 'recommendation' && !state.isHighlighted ? 2.5 : 1.25,
          opacity: (attributes, state, graphState) => {
            if (state.isHighlighted) return attributes.kind === 'recommendation' ? 0.8 : 0.45;
            if (graphState.hasHighlighted) return DIMMED_EDGE_OPACITY;
            return restingEdgeOpacity(attributes);
          },
          depth: (_attributes, state) => (state.isHighlighted ? 'topEdges' : 'edges'),
        },
      },
      settings: {
        enableNodeDrag: true,
        labelRenderedSizeThreshold: 16,
        hideEdgesOnMove: true,
        minCameraRatio: 0.1,
        maxCameraRatio: 4,
      },
    });
    return renderer;
  }

  return { forceAtlas2: layout.default, Layout: worker.default, createRenderer };
}
