export type NavIconName = 'review' | 'metrics' | 'graph';

const PATHS: Record<NavIconName, string> = {
  review: 'M4 6h16M4 12h10M4 18h7',
  metrics: 'M5 20V10M12 20V4M19 20v-7',
  graph:
    'M8.5 6a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM20.5 9a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM11.5 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM8 7.5l8 1M7 8.3l1.6 7.4M16.4 10.8l-5.6 5.6',
};

export function NavIcon({ name }: { name: NavIconName }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 shrink-0"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
