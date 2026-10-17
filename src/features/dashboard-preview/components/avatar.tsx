import type { Member } from '../types/dashboard.types';

export function Avatar({ member }: { member: Member }) {
  return (
    <span
      title={member.name}
      className="grid size-6 shrink-0 place-items-center rounded-full bg-surface-muted text-caption text-fg-soft"
    >
      {member.initials}
    </span>
  );
}
