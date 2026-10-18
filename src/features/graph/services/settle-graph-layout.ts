import type { GraphLibraries } from './create-graph-renderer';
import type { SigmaGraph } from './to-graphology';

interface SettleOptions {
  computeMs: number;
  tweenMs: number;
  onLaidOut?: () => void;
}

function easeOutCubic(progress: number) {
  return 1 - (1 - progress) ** 3;
}

function tweenPositions(graph: SigmaGraph, target: SigmaGraph, duration: number) {
  const moves = new Map<string, { x: number; y: number; dx: number; dy: number }>();
  graph.forEachNode((node, attributes) => {
    if (!target.hasNode(node)) return;
    const end = target.getNodeAttributes(node);
    moves.set(node, {
      x: attributes.x,
      y: attributes.y,
      dx: end.x - attributes.x,
      dy: end.y - attributes.y,
    });
  });
  function apply(progress: number) {
    const eased = easeOutCubic(progress);
    graph.updateEachNodeAttributes(
      (node, attributes) => {
        const move = moves.get(node);
        if (!move) return attributes;
        attributes.x = move.x + move.dx * eased;
        attributes.y = move.y + move.dy * eased;
        return attributes;
      },
      { attributes: ['x', 'y'] },
    );
  }
  if (duration <= 0) {
    apply(1);
    return () => undefined;
  }
  const start = performance.now();
  let frame = requestAnimationFrame(function step(now) {
    const progress = Math.min(1, (now - start) / duration);
    apply(progress);
    if (progress < 1) frame = requestAnimationFrame(step);
  });
  return () => cancelAnimationFrame(frame);
}

export function settleGraphLayout(
  graph: SigmaGraph,
  libraries: GraphLibraries,
  { computeMs, tweenMs, onLaidOut }: SettleOptions,
) {
  const shadow = graph.copy();
  const layout = new libraries.Layout(shadow, {
    settings: {
      ...libraries.forceAtlas2.inferSettings(shadow),
      barnesHutOptimize: shadow.order > 300,
      strongGravityMode: true,
      gravity: 1,
    },
  });
  let cancelTween: (() => void) | undefined;
  layout.start();
  const timer = setTimeout(() => {
    layout.kill();
    cancelTween = tweenPositions(graph, shadow, tweenMs);
    onLaidOut?.();
  }, computeMs);
  return () => {
    clearTimeout(timer);
    layout.kill();
    cancelTween?.();
  };
}
