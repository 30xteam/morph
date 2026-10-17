import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

const INITIAL_CAMERA = { x: 0, y: 0, scale: 1 };

export function useGraphCamera(
  pin: (id: string, x: number, y: number) => void,
  release: () => void,
  select: (id: string) => void,
) {
  const svg = useRef<SVGSVGElement>(null);
  const [camera, setCamera] = useState(INITIAL_CAMERA);
  const [viewport, setViewport] = useState({ width: 800, height: 600 });
  const drag = useRef<
    | {
        pointer: number;
        nodeId?: string;
        startX: number;
        startY: number;
        x: number;
        y: number;
        moved: boolean;
      }
    | undefined
  >(undefined);

  const point = useCallback((clientX: number, clientY: number) => {
    const matrix = svg.current?.getScreenCTM();
    return matrix
      ? new DOMPoint(clientX, clientY).matrixTransform(matrix.inverse())
      : new DOMPoint();
  }, []);

  const zoom = useCallback((factor: number, anchor = { x: 0, y: 0 }) => {
    setCamera((current) => {
      const scale = Math.max(0.35, Math.min(3.5, current.scale * factor));
      const ratio = scale / current.scale;
      return {
        x: anchor.x - (anchor.x - current.x) * ratio,
        y: anchor.y - (anchor.y - current.y) * ratio,
        scale,
      };
    });
  }, []);

  useEffect(() => {
    const element = svg.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (width && height) setViewport({ width, height });
    });
    observer.observe(element);
    function wheel(event: WheelEvent) {
      event.preventDefault();
      zoom(Math.exp(-event.deltaY * 0.001), point(event.clientX, event.clientY));
    }
    element.addEventListener('wheel', wheel, { passive: false });
    return () => {
      element.removeEventListener('wheel', wheel);
      observer.disconnect();
    };
  }, [point, zoom]);

  function onPointerDown(event: ReactPointerEvent<SVGSVGElement>) {
    if (event.button !== 0 || drag.current) return;
    const target = (event.target as Element).closest('[data-node-id]');
    const nodeId = target?.getAttribute('data-node-id') ?? undefined;
    const position = point(event.clientX, event.clientY);
    drag.current = {
      pointer: event.pointerId,
      nodeId,
      startX: position.x,
      startY: position.y,
      x: camera.x,
      y: camera.y,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: ReactPointerEvent<SVGSVGElement>) {
    const current = drag.current;
    if (!current || current.pointer !== event.pointerId) return;
    const position = point(event.clientX, event.clientY);
    const dx = position.x - current.startX;
    const dy = position.y - current.startY;
    if (Math.hypot(dx, dy) > 4) current.moved = true;
    if (!current.moved) return;
    if (current.nodeId)
      pin(
        current.nodeId,
        (position.x - camera.x) / camera.scale,
        (position.y - camera.y) / camera.scale,
      );
    else setCamera({ ...camera, x: current.x + dx, y: current.y + dy });
  }

  function endPointer(event: ReactPointerEvent<SVGSVGElement>, cancelled: boolean) {
    const current = drag.current;
    if (!current || current.pointer !== event.pointerId) return;
    drag.current = undefined;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (current.nodeId) {
      if (current.moved) release();
      if (!cancelled && !current.moved) select(current.nodeId);
    }
  }

  return {
    svg,
    camera,
    viewBox: `${-viewport.width / 2} ${-viewport.height / 2} ${viewport.width} ${viewport.height}`,
    zoom,
    resetCamera: () => setCamera(INITIAL_CAMERA),
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: (event: ReactPointerEvent<SVGSVGElement>) => endPointer(event, false),
      onPointerCancel: (event: ReactPointerEvent<SVGSVGElement>) => endPointer(event, true),
    },
  };
}
