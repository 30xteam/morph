'use client';

import { Button } from '@/ui';

import { useRunAll } from '../hooks/use-run-all';

export function RunAllButton({ className }: { className?: string }) {
  const { runAll, run } = useRunAll();

  return (
    <Button onClick={runAll} disabled={run.running} className={className}>
      {run.running ? `Sorting ${run.done} of ${run.total}…` : 'Sort all sign-ups'}
    </Button>
  );
}
