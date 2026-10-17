'use client';

import { Button } from '@/ui';

import { useRunAll } from '../hooks/use-run-all';
import { useSimulateSignUp } from '../hooks/use-simulate-sign-up';

export function HeaderActions() {
  const { runAll, running, failed } = useRunAll();
  const signUp = useSimulateSignUp();

  return (
    <div className="flex flex-col gap-2 tablet:items-end">
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => signUp.mutate()} disabled={signUp.isPending}>
          {signUp.isPending ? 'Receiving…' : 'Simulate Luma sign-up'}
        </Button>
        <Button onClick={runAll} disabled={running}>
          {running ? 'Running Jev…' : 'Run Jev on all'}
        </Button>
      </div>
      {failed || signUp.isError ? (
        <p role="alert" className="text-caption text-danger">
          Some calls failed. Check the Jev provider settings in .env.local.
        </p>
      ) : null}
    </div>
  );
}
