export function ConfidenceBar({ value, label }: { value: number; label: string }) {
  const percent = Math.round(value * 100);
  return (
    <div className="flex items-center gap-2">
      <progress
        value={percent}
        max={100}
        aria-label={label}
        className="h-1.5 w-24 appearance-none overflow-hidden rounded-full bg-surface-muted [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-fg-soft [&::-webkit-progress-bar]:bg-surface-muted [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-fg-soft"
      />
      <span className="w-9 text-caption text-fg-muted tabular-nums">{percent}%</span>
    </div>
  );
}
