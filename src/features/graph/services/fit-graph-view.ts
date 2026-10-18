import type { GraphRenderer } from './create-graph-renderer';

const FIT_MARGIN = 1.15;
const MIN_RATIO = 0.1;

export function fitGraphView(sigma: GraphRenderer, duration: number) {
  const { width, height } = sigma.getDimensions();
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  sigma.getGraph().forEachNode((node) => {
    const data = sigma.getNodeDisplayData(node);
    if (!data) return;
    minX = Math.min(minX, data.x);
    minY = Math.min(minY, data.y);
    maxX = Math.max(maxX, data.x);
    maxY = Math.max(maxY, data.y);
  });
  if (!Number.isFinite(minX) || !width || !height) return;
  const center = { x: (minX + maxX) / 2, y: (minY + maxY) / 2, angle: 0 };
  const cameraState = { ...center, ratio: 1 };
  const from = sigma.framedGraphToViewport({ x: minX, y: minY }, { cameraState });
  const to = sigma.framedGraphToViewport({ x: maxX, y: maxY }, { cameraState });
  const ratio = Math.max(Math.abs(to.x - from.x) / width, Math.abs(to.y - from.y) / height);
  void sigma
    .getCamera()
    .animate({ ...center, ratio: Math.max(ratio * FIT_MARGIN, MIN_RATIO) }, { duration });
}
