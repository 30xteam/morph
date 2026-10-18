'use client';

import Link from 'next/link';

import type { ProgramFilter } from '@/libs/segmentation';

import { NavIcon } from './nav-icon';
import { navItemClasses } from './nav-link-classes';
import type { SegmentLink, WorkflowLink } from './use-sidebar-nav';

export function SectionLabel({ id, children }: { id: string; children: string }) {
  return (
    <p
      id={id}
      className="-mx-3 mb-1.5 border-y border-line bg-raised px-5.5 py-1.5 text-badge font-semibold tracking-wider text-ink-soft uppercase"
    >
      {children}
    </p>
  );
}

function Count({ value }: { value: number }) {
  return <span className="text-body-sm font-normal text-ink-muted tabular-nums">{value}</span>;
}

export function SegmentList({
  segments,
  onOpen,
}: {
  segments: SegmentLink[];
  onOpen: (value: ProgramFilter) => void;
}) {
  return (
    <ul aria-labelledby="nav-segments" className="flex flex-col gap-0.5">
      {segments.map((segment) => (
        <li key={segment.value}>
          <button
            type="button"
            aria-current={segment.active ? 'true' : undefined}
            onClick={() => onOpen(segment.value)}
            className={navItemClasses(segment.active)}
          >
            <span className="flex-1 truncate">{segment.label}</span>
            <Count value={segment.count} />
          </button>
        </li>
      ))}
    </ul>
  );
}

export function WorkflowList({ workflow }: { workflow: WorkflowLink[] }) {
  return (
    <ul aria-labelledby="nav-workflow" className="flex flex-col gap-0.5">
      {workflow.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            aria-current={link.active ? 'page' : undefined}
            className={navItemClasses(link.active)}
          >
            <NavIcon name={link.icon} />
            <span className="flex-1">{link.label}</span>
            {link.count ? <Count value={link.count} /> : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
