'use client';

import { useGraphView } from '../hooks/use-graph-view';
import { GraphDetails } from './graph-details';
import { GraphFiltersPanel } from './graph-filters-panel';
import { GraphMobileBar } from './graph-mobile-bar';
import { GraphSurface } from './graph-surface';

export function ProfileGraph() {
  const view = useGraphView();

  return (
    <div className="flex min-w-0 flex-1 flex-col desktop:h-dvh desktop:flex-row">
      <GraphFiltersPanel view={view} />
      <GraphMobileBar view={view} />
      <GraphSurface
        graph={view.visible}
        selectedId={view.selected?.id}
        jump={view.jump}
        colorBy={view.colorBy}
        onSelect={view.select}
      />
      {view.selected ? <GraphDetails view={view} selected={view.selected} /> : null}
    </div>
  );
}
