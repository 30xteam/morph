import type { SignalKey } from '../../types/segmentation.types';

const ICONS: Record<SignalKey, string> = {
  relation: 'user',
  crmStage: 'funnel',
  role: 'brief',
  pain: 'alert',
  goal: 'target',
  topics: 'tag',
  country: 'user',
  currentProgram: 'award',
};

export function SignalIcon({ signal }: { signal: SignalKey }) {
  return (
    // oxlint-disable-next-line nextjs/no-img-element -- 14px static SVG from the Figma file, no optimization needed
    <img
      src={`/icons/signals/${ICONS[signal]}.svg`}
      alt=""
      width={14}
      height={14}
      className="shrink-0"
    />
  );
}
