import { useEffect, useRef, useState } from 'react';

import { seedGraphNode, stepGraph } from '../services/graph-physics';
import type { PositionedNode, ProfileGraph } from '../types/graph.types';

export function useGraphLayout(graph: ProfileGraph, paused: boolean) {
  const cache = useRef(new Map<string, PositionedNode>());
  const pinned = useRef<string | undefined>(undefined);
  const [epoch, setEpoch] = useState(0);
  const [positions, setPositions] = useState<PositionedNode[]>([]);

  useEffect(() => {
    const nodes = graph.nodes.map((node, index) => {
      const previous = cache.current.get(node.id);
      return previous ? { ...previous, ...node } : seedGraphNode(node, index + epoch);
    });
    cache.current = new Map(nodes.map((node) => [node.id, node]));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let count = 0;
    function tick() {
      if (!paused) {
        const steps = reduced ? 160 : 2;
        for (let i = 0; i < steps; i += 1) stepGraph(nodes, graph.edges, pinned.current);
      }
      setPositions(nodes.map((node) => Object.assign({}, node)));
      count += 1;
      if (!paused && !reduced && count < 160) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [graph, paused, epoch]);

  function pin(id: string, x: number, y: number) {
    const node = cache.current.get(id);
    if (!node) return;
    pinned.current = id;
    Object.assign(node, { x, y, vx: 0, vy: 0 });
    setPositions([...cache.current.values()].map((item) => Object.assign({}, item)));
  }

  function release() {
    pinned.current = undefined;
    setEpoch((value) => value + 1);
  }

  function reset() {
    cache.current.clear();
    setEpoch((value) => value + 1);
  }

  return { positions, pin, release, reset };
}
