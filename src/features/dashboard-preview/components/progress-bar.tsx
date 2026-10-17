export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <progress
        value={value}
        max={100}
        aria-label={label}
        className="h-1.5 w-24 appearance-none overflow-hidden rounded-full bg-surface-muted [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-fg-soft [&::-webkit-progress-bar]:bg-surface-muted [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-fg-soft"
      />
      <span className="w-9 text-caption text-fg-muted tabular-nums">{value}%</span>
    </div>
  );
}
