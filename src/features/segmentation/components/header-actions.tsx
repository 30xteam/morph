'use client';

import { Button } from '@/ui';

import { useSimulateSignUp } from '../hooks/use-simulate-sign-up';
import { RunAllButton } from './run-all-button';
import { RunSummary } from './run-summary';

export function HeaderActions() {
  const signUp = useSimulateSignUp();

  return (
    <div className="flex flex-col gap-2 tablet:items-end">
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => signUp.mutate()} disabled={signUp.isPending}>
          {signUp.isPending ? 'Adding…' : 'Add a test sign-up'}
        </Button>
        <RunAllButton />
      </div>
      <RunSummary />
      {signUp.isError ? (
        <p role="alert" className="text-caption text-danger">
          The test sign-up couldn’t be added. Try again in a moment.
        </p>
      ) : null}
    </div>
  );
}
