import { cx } from '@/core/cx';

import { LIGHT_LABELS } from '../config/labels';
import type { TrafficLight } from '../types/segmentation.types';

const DOT: Record<TrafficLight, string> = {
  green: 'bg-success',
  yellow: 'bg-warning',
  red: 'bg-danger',
};

export function LightBadge({ light }: { light: TrafficLight }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-2 py-0.5 text-caption whitespace-nowrap text-fg-soft">
      <span aria-hidden="true" className={cx('size-1.5 rounded-full', DOT[light])} />
      {LIGHT_LABELS[light]}
    </span>
  );
}
