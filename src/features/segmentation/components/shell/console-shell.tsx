'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { useLumaFeed } from '../../hooks/use-luma-feed';
import { hydrateProfiles, useSegmentationStore } from '../../store/segmentation-store';
import type { Profile } from '../../types/segmentation.types';
import { OnboardingDialog } from '../onboarding/onboarding-dialog';
import { ConsoleSidebar } from './console-sidebar';
import { ConsoleTopbar } from './console-topbar';

interface ConsoleShellProps {
  profiles: Profile[];
  children: ReactNode;
}

export function ConsoleShell({ profiles, children }: ConsoleShellProps) {
  useState(() => hydrateProfiles(profiles));
  useEffect(() => {
    void useSegmentationStore.persist.rehydrate();
  }, []);
  useLumaFeed();

  return (
    <div className="flex min-h-dvh flex-col desktop:flex-row">
      <ConsoleSidebar />
      <ConsoleTopbar />
      <main className="flex min-w-0 flex-1 flex-col">{children}</main>
      <OnboardingDialog />
    </div>
  );
}
