import { useEffect, useEffectEvent, useRef, useState } from 'react';
import type { RefObject } from 'react';

import { loadGraphLibraries } from '../services/create-graph-renderer';
import type {
  GraphColorBy,
  GraphLibraries,
  GraphRenderer,
} from '../services/create-graph-renderer';
import { fitGraphView } from '../services/fit-graph-view';
import { settleGraphLayout } from '../services/settle-graph-layout';
import { toGraphology } from '../services/to-graphology';
import type { ProfileGraph } from '../types/graph.types';
import type { GraphColors } from './use-graph-colors';

interface SigmaGraphOptions {
  graph: ProfileGraph;
  selectedId?: string;
  paused: boolean;
  colorBy: GraphColorBy;
  colors?: GraphColors;
  onSelect: (id: string) => void;
}

const FIRST_LAYOUT_MS = 2000;
const UPDATE_LAYOUT_MS = 1000;

function cancel(ref: RefObject<(() => void) | undefined>) {
  ref.current?.();
  ref.current = undefined;
}

function animationDuration() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 300;
}

export function useSigmaGraph({
  graph,
  selectedId,
  paused,
  colorBy,
  colors,
  onSelect,
}: SigmaGraphOptions) {
  const container = useRef<HTMLDivElement>(null);
  const renderer = useRef<GraphRenderer>(undefined);
  const libraries = useRef<GraphLibraries>(undefined);
  const cancelSettle = useRef<() => void>(undefined);
  const hovered = useRef<string>(undefined);
  const palette = useRef(colors);
  const mode = useRef(colorBy);
  const highlighted = useRef({ nodes: [] as string[], edges: [] as string[], selected: '' });
  const seededEpoch = useRef(0);
  const [ready, setReady] = useState(false);
  const [laidOut, setLaidOut] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [zoomPercent, setZoomPercent] = useState(100);

  const select = useEffectEvent((id: string) => onSelect(id));

  const highlight = useEffectEvent((selected = selectedId) => {
    const sigma = renderer.current;
    if (!sigma) return;
    const current = sigma.getGraph();
    const previous = highlighted.current;
    const candidate = hovered.current ?? selected;
    const active = candidate && current.hasNode(candidate) ? candidate : undefined;
    sigma.setNodesState(previous.nodes, { isHighlighted: false });
    sigma.setEdgesState(previous.edges, { isHighlighted: false });
    if (previous.selected && current.hasNode(previous.selected)) {
      sigma.setNodeState(previous.selected, { isSelected: false });
    }
    const next = {
      nodes: active ? [active, ...current.neighbors(active)] : [],
      edges: active ? current.edges(active) : [],
      selected: selected && current.hasNode(selected) ? selected : '',
    };
    sigma.setNodesState(next.nodes, { isHighlighted: true });
    sigma.setEdgesState(next.edges, { isHighlighted: true });
    if (next.selected) sigma.setNodeState(next.selected, { isSelected: true });
    highlighted.current = next;
  });

  const runLayout = useEffectEvent((computeMs = UPDATE_LAYOUT_MS) => {
    const sigma = renderer.current;
    const libs = libraries.current;
    cancel(cancelSettle);
    if (!sigma || !libs || paused) return;
    cancelSettle.current = settleGraphLayout(sigma.getGraph(), libs, {
      computeMs,
      tweenMs: animationDuration() * 2,
      onLaidOut: () => setLaidOut(true),
    });
  });

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    let disposed = false;
    let instance: GraphRenderer | undefined;
    async function mount(target: HTMLElement) {
      const libs = await loadGraphLibraries();
      if (disposed) return;
      libraries.current = libs;
      instance = libs.createRenderer(target, {
        color: (key) => palette.current?.[key] ?? '',
        colorBy: () => mode.current,
      });
      instance.on('enterNode', ({ node }) => {
        hovered.current = node;
        highlight();
      });
      instance.on('leaveNode', () => {
        hovered.current = undefined;
        highlight();
      });
      instance.on('clickNode', ({ node }) => select(node));
      instance.on('nodeDragStart', ({ node }) => {
        cancel(cancelSettle);
        instance?.getGraph().setNodeAttribute(node, 'fixed', true);
      });
      instance.on('nodeDragEnd', () => runLayout());
      instance.getCamera().on('updated', (state) => setZoomPercent(Math.round(100 / state.ratio)));
      renderer.current = instance;
      setReady(true);
    }
    const observer = new ResizeObserver(() => {
      if (!element.offsetWidth || !element.offsetHeight) return;
      if (!instance) return;
      instance.resize();
      fitGraphView(instance, 0);
    });
    observer.observe(element);
    void mount(element);
    return () => {
      disposed = true;
      observer.disconnect();
      cancel(cancelSettle);
      instance?.kill();
      renderer.current = undefined;
    };
  }, []);

  useEffect(() => {
    const sigma = renderer.current;
    if (!ready || !sigma) return;
    const reseed = seededEpoch.current !== epoch;
    const firstRun = reseed || sigma.getGraph().order === 0;
    seededEpoch.current = epoch;
    const next = toGraphology(graph, reseed ? undefined : sigma.getGraph());
    sigma.setGraph(next);
    highlight();
    runLayout(firstRun ? FIRST_LAYOUT_MS : UPDATE_LAYOUT_MS);
    return () => cancel(cancelSettle);
  }, [ready, graph, epoch]);

  useEffect(() => {
    if (paused) cancel(cancelSettle);
    else runLayout();
  }, [paused]);

  useEffect(() => {
    highlight(selectedId);
  }, [selectedId]);

  useEffect(() => {
    palette.current = colors;
    mode.current = colorBy;
    renderer.current?.refresh({ skipIndexation: true });
  }, [colors, colorBy]);

  function focus(id: string) {
    const sigma = renderer.current;
    const position = sigma?.getNodeDisplayData(id);
    if (!sigma || !position) return;
    void sigma
      .getCamera()
      .animate({ x: position.x, y: position.y, ratio: 0.5 }, { duration: animationDuration() });
  }

  return {
    container,
    loading: !laidOut && !paused,
    zoomPercent,
    zoomIn: () => void renderer.current?.getCamera().zoomIn({ duration: animationDuration() }),
    zoomOut: () => void renderer.current?.getCamera().zoomOut({ duration: animationDuration() }),
    focus,
    reset: () => {
      setEpoch((value) => value + 1);
      if (renderer.current) fitGraphView(renderer.current, animationDuration());
    },
  };
}
