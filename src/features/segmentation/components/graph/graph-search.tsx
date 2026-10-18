'use client';

import { useId } from 'react';

import { useMessages } from '../../hooks/use-messages';
import type { GraphNode } from '../../types/graph.types';
import { SearchIcon } from './graph-icons';

interface GraphSearchProps {
  nodes: GraphNode[];
  value: string;
  onSearch: (value: string) => void;
}

export function GraphSearch({ nodes, value, onSearch }: GraphSearchProps) {
  const m = useMessages();
  const optionsId = useId();

  return (
    <label className="flex h-11 items-center gap-2 rounded-md border border-line-strong bg-canvas px-3 text-ink-muted focus-within:outline-2 focus-within:outline-accent desktop:h-10">
      <SearchIcon />
      <span className="sr-only">{m.graph.search}</span>
      <input
        type="search"
        list={optionsId}
        value={value}
        onChange={(event) => onSearch(event.target.value)}
        placeholder={m.graph.searchPlaceholder}
        className="min-w-0 flex-1 bg-transparent text-body-sm text-ink outline-none placeholder:text-ink-muted"
      />
      <datalist id={optionsId}>
        {nodes.map((node) => (
          <option key={node.id} value={node.label}>
            {m.graph.kinds[node.kind]}
          </option>
        ))}
      </datalist>
    </label>
  );
}
