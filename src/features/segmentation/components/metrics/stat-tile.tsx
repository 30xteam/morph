interface StatTileProps {
  label: string;
  value: string;
  hint: string;
}

export function StatTile({ label, value, hint }: StatTileProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-line bg-card px-5 py-4.5">
      <dt className="text-body-sm font-medium text-ink-soft">{label}</dt>
      <dd className="text-title-lg text-ink tabular-nums">{value}</dd>
      <dd className="text-body-sm text-ink-muted">{hint}</dd>
    </div>
  );
}
