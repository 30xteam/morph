import type { ReactNode } from 'react';

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 shrink-0"
    >
      {children}
    </svg>
  );
}

export function FilterIcon() {
  return (
    <Icon>
      <path d="M4 6h16M7 12h10M10 18h4" />
    </Icon>
  );
}

export function SearchIcon() {
  return (
    <Icon>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </Icon>
  );
}

export function CloseIcon() {
  return (
    <Icon>
      <path d="M6 6l12 12M18 6 6 18" />
    </Icon>
  );
}

export function PanelIcon() {
  return (
    <Icon>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
    </Icon>
  );
}

export function FitIcon() {
  return (
    <Icon>
      <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
    </Icon>
  );
}

export function PauseIcon() {
  return (
    <Icon>
      <path d="M9 5v14M15 5v14" />
    </Icon>
  );
}

export function PlayIcon() {
  return (
    <Icon>
      <path d="m8 5 11 7-11 7z" />
    </Icon>
  );
}
