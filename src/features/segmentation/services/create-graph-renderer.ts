import type forceAtlas2 from 'graphology-layout-forceatlas2';
import type FA2Layout from 'graphology-layout-forceatlas2/worker';
import type { Attributes } from 'graphology-types';
import type Sigma from 'sigma';

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

export interface GraphLibraries {
  forceAtlas2: typeof forceAtlas2;
  Layout: typeof FA2Layout;
  createRenderer: (element: HTMLElement, color: (key: GraphColorKey) => string) => GraphRenderer;
}

const DIMMED_OPACITY = 0.2;

export async function loadGraphLibraries(): Promise<GraphLibraries> {
  const [{ default: SigmaRenderer }, { MultiGraph }, layout, worker] = await Promise.all([
    import('sigma'),
    import('graphology'),
    import('graphology-layout-forceatlas2'),
    import('graphology-layout-forceatlas2/worker'),
  ]);

  function createRenderer(element: HTMLElement, color: (key: GraphColorKey) => string) {
    const empty: SigmaGraph = new MultiGraph();
    const renderer: GraphRenderer = new SigmaRenderer(empty, element, {
      customNodeState: { isSelected: false },
      styles: {
        nodes: {
          x: { attribute: 'x' },
          y: { attribute: 'y' },
          label: { attribute: 'label' },
          size: (attributes, state) => attributes.size + (state.isSelected ? 4 : 0),
          color: (attributes) => color(attributes.tone),
          opacity: (_attributes, state, graphState) =>
            graphState.hasHighlighted && !state.isHighlighted ? DIMMED_OPACITY : 1,
          labelColor: () => color('ink'),
          labelFont: () => color('font'),
          labelVisibility: (attributes, state) =>
            state.isHighlighted || state.isHovered || attributes.kind === 'program'
              ? 'visible'
              : 'auto',
          backdropVisibility: 'hidden',
          depth: (_attributes, state) =>
            state.isHighlighted || state.isHovered ? 'topNodes' : 'nodes',
          cursor: 'pointer',
        },
        edges: {
          color: (attributes, state) => {
            if (state.isHighlighted) return color('ink');
            return color(attributes.kind === 'recommendation' ? 'accent' : 'line');
          },
          size: (_attributes, state) => (state.isHighlighted ? 2 : 1),
          opacity: (_attributes, state, graphState) =>
            graphState.hasHighlighted && !state.isHighlighted ? DIMMED_OPACITY : 1,
          depth: (_attributes, state) => (state.isHighlighted ? 'topEdges' : 'edges'),
        },
      },
      settings: {
        enableNodeDrag: true,
        labelRenderedSizeThreshold: 10,
        hideEdgesOnMove: true,
        minCameraRatio: 0.1,
        maxCameraRatio: 4,
      },
    });
    return renderer;
  }

  return { forceAtlas2: layout.default, Layout: worker.default, createRenderer };
}
