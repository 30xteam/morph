'use client';

import { cx } from '@/core/cx';
import { usePreferences } from '@/core/preferences';

import { useMessages } from '../../hooks/use-messages';
import { missingSignals } from '../../services/profile-state';
import type { Profile } from '../../types/segmentation.types';
import { DETAIL_SIGNALS, SIGNAL_LABELS, signalValue } from '../../utils/signal-values';
import { Panel } from '../ui/panel';
import { SignalIcon } from '../ui/signal-icon';

interface SignalsCardProps {
  profile: Profile;
  flagMissing?: boolean;
}

export function SignalsCard({ profile, flagMissing = false }: SignalsCardProps) {
  const m = useMessages();
  const { locale } = usePreferences();
  const missing = missingSignals(profile);

  return (
    <Panel title={m.detail.signals}>
      <dl className="flex flex-col">
        {DETAIL_SIGNALS.map((key) => {
          const asked = missing.includes(key);
          const value = signalValue(profile, key, asked, locale, m);
          return (
            <div
              key={key}
              className="flex items-center gap-2.5 border-b border-line py-2 last:border-b-0"
            >
              <SignalIcon signal={key} />
              <dt className="text-body-md text-ink-soft">{SIGNAL_LABELS[locale][key]}</dt>
              <dd
                className={cx(
                  'ml-auto text-right text-label-sm',
                  value.missing ? 'text-ink-muted' : 'text-ink',
                  flagMissing && asked && 'text-yellow-fg',
                )}
              >
                {value.text}
              </dd>
            </div>
          );
        })}
      </dl>
      <p className="text-caption text-ink-muted">{m.detail.signalsNote}</p>
    </Panel>
  );
}
