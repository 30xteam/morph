'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/ui';

import { ROLE_OPTIONS } from '../types/profile.schema';
import type { Profile } from '../types/segmentation.types';

const editSchema = z.object({
  role: z.enum(ROLE_OPTIONS),
  topics: z.string().trim(),
});

type EditValues = z.infer<typeof editSchema>;

interface EditProfileFormProps {
  profile: Profile;
  onSubmit: (profile: Profile) => void;
  onCancel: () => void;
}

const INPUT =
  'w-full rounded-input border border-border-input bg-surface px-3 py-2 text-body-sm text-fg focus-visible:outline-2 focus-visible:outline-primary';
const LABEL = 'flex flex-col gap-1 text-caption text-fg-muted';

function isRole(value: string): value is EditValues['role'] {
  return (ROLE_OPTIONS as readonly string[]).includes(value);
}

export function EditProfileForm({ profile, onSubmit, onCancel }: EditProfileFormProps) {
  const { register, handleSubmit } = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      role: isRole(profile.role) ? profile.role : 'Sin dato de rol',
      topics: profile.topics.join(', '),
    },
  });

  const submit = (values: EditValues) =>
    onSubmit({
      ...profile,
      role: values.role,
      topics: values.topics
        .split(',')
        .map((topic) => topic.trim())
        .filter(Boolean),
    });

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-3" noValidate>
      <label className={LABEL}>
        Role
        <select className={INPUT} {...register('role')}>
          {ROLE_OPTIONS.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </label>
      <label className={LABEL}>
        Topics of interest (comma separated)
        <input className={INPUT} placeholder="sales, ai, leadership" {...register('topics')} />
      </label>
      <div className="flex gap-2">
        <Button type="submit">Save and re-run Jev</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
