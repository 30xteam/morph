'use client';

import * as Dialog from '@radix-ui/react-dialog';

import { Button } from '@/ui';

import type { GraphView } from '../hooks/use-graph-view';
import { useMessages } from '../hooks/use-messages';
import { GraphFilters } from './graph-filters';
import { CloseIcon, FilterIcon } from './graph-icons';

const PILL =
  'inline-flex min-h-11 items-center gap-2 rounded-full border px-3.5 text-label-sm font-medium transition-colors duration-150';

export function GraphMobileBar({ view }: { view: GraphView }) {
  const m = useMessages();
  const focused = view.focusId ? view.selected : undefined;

  return (
    <div className="flex flex-col gap-3 border-b border-line px-4 pt-5 pb-3 desktop:hidden">
      <h1 className="text-title-md text-ink">{m.graph.title}</h1>
      <div className="flex flex-wrap items-center gap-2">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button type="button" className={`${PILL} border-line-strong bg-card text-ink`}>
              <FilterIcon />
              {m.graph.filters}
              {view.activeFilters ? (
                <span className="inline-flex size-5 items-center justify-center rounded-full bg-accent text-badge text-canvas">
                  {view.activeFilters}
                </span>
              ) : null}
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-modal bg-canvas/70 motion-safe:animate-enter" />
            <Dialog.Content
              aria-describedby={undefined}
              className="fixed inset-x-0 bottom-0 z-modal flex max-h-[85dvh] flex-col rounded-t-lg border-t border-line bg-card shadow-modal outline-none motion-safe:animate-sheet"
            >
              <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-3">
                <Dialog.Title className="text-title-sm text-ink">{m.graph.filters}</Dialog.Title>
                <Dialog.Close asChild>
                  <Button variant="ghost" aria-label={m.graph.close}>
                    <CloseIcon />
                  </Button>
                </Dialog.Close>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">
                <GraphFilters view={view} />
              </div>
              <div className="flex gap-2 border-t border-line px-5 pt-3 pb-[max(--spacing(6),env(safe-area-inset-bottom))]">
                <Button variant="secondary" className="flex-1" onClick={view.clear}>
                  {m.graph.clear}
                </Button>
                <Dialog.Close asChild>
                  <Button className="flex-2">{m.graph.showResults(view.matches)}</Button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        {focused ? (
          <button
            type="button"
            aria-label={m.graph.clearFocus(focused.label)}
            onClick={() => view.select(undefined)}
            className={`${PILL} border-accent bg-green-bg text-green-fg`}
          >
            {focused.label}
            <CloseIcon />
          </button>
        ) : null}
        <span className="ml-auto text-body-sm text-ink-muted tabular-nums" aria-live="polite">
          {m.graph.results(view.matches, view.totalProfiles)}
        </span>
      </div>
    </div>
  );
}
