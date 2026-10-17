'use client';

import { useState } from 'react';

import { Button } from '@/ui';

import { ProfileGraph } from './graph/profile-graph';
import { SignupsTable } from './signups-table';

export function ProfileViews() {
  const [view, setView] = useState<'table' | 'graph'>('table');

  return (
    <div className="flex flex-col gap-4">
      <fieldset aria-label="Profile view" className="flex gap-2">
        <Button
          variant={view === 'table' ? 'primary' : 'secondary'}
          aria-pressed={view === 'table'}
          onClick={() => setView('table')}
        >
          Table
        </Button>
        <Button
          variant={view === 'graph' ? 'primary' : 'secondary'}
          aria-pressed={view === 'graph'}
          onClick={() => setView('graph')}
        >
          Graph
        </Button>
      </fieldset>
      {view === 'table' ? <SignupsTable /> : <ProfileGraph />}
    </div>
  );
}
