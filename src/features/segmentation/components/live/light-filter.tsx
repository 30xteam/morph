'use client';

import { cx } from '@/core/cx';

import { LIGHT_ORDER, useLightCounts } from '../../hooks/use-light-counts';
import { useMessages } from '../../hooks/use-messages';
import { useSegmentationStore } from '../../store/segmentation-store';
import type { ProfileStatus } from '../../utils/profile-status';
import { LightHelp } from './light-help';

const CHIP =
  'inline-flex min-h-11 items-center gap-2 rounded-full border px-3.5 text-label-sm font-medium transition-colors duration-150 ease-out-strong desktop:min-h-9';

const IDLE = 'border-line-strong text-ink-soft hover:bg-raised hover:text-ink';

const ACTIVE: Record<ProfileStatus, string> = {
  green: 'border-green-fg bg-green-bg text-green-fg',
  yellow: 'border-yellow-fg bg-yellow-bg text-yellow-fg',
  red: 'border-red-fg bg-red-bg text-red-fg',
  review: 'border-review-fg bg-review-bg text-ink',
  pending: 'border-ink-muted bg-raised text-ink',
};

const DOT: Record<ProfileStatus, string> = {
  green: 'bg-green-fg',
  yellow: 'bg-yellow-fg',
  red: 'bg-red-fg',
  review: 'bg-review-fg',
  pending: 'border border-ink-muted',
};

export function LightFilter() {
  const m = useMessages();
  const { counts, total } = useLightCounts();
  const lights = useSegmentationStore((state) => state.lights);
  const toggleLight = useSegmentationStore((state) => state.toggleLight);
  const clearLights = useSegmentationStore((state) => state.clearLights);
  const all = lights.length === 0;

  return (
    <fieldset className="flex min-w-0 flex-col gap-2">
      <legend className="flex w-full items-center gap-1 pb-2 text-label-xs text-ink-soft">
        <span>
          {m.list.lights}
          <span className="font-normal text-ink-muted"> · {m.list.lightsHint}</span>
        </span>
        <LightHelp />
      </legend>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={all}
          onClick={clearLights}
          className={cx(CHIP, all ? 'border-ink-soft bg-selected text-ink' : IDLE)}
        >
          {m.list.all}
          <span className="text-ink-muted tabular-nums">{total}</span>
        </button>
        {LIGHT_ORDER.map((light) => {
          const active = lights.includes(light);
          return (
            <button
              key={light}
              type="button"
              aria-pressed={active}
              onClick={() => toggleLight(light)}
              className={cx(CHIP, active ? ACTIVE[light] : IDLE)}
            >
              <span aria-hidden="true" className={cx('size-2 rounded-full', DOT[light])} />
              {m.status[light]}
              <span className="tabular-nums">{counts[light]}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
