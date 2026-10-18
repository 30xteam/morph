'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { usePreferences } from '@/core/preferences';
import { translateValue, ROLE_OPTIONS, type Profile } from '@/libs/segmentation';
import { Button } from '@/ui';

import { useMessages } from '../../hooks/use-messages';

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
  'min-h-11 w-full rounded-md border border-line bg-canvas px-3 text-body-md text-ink focus-visible:outline-2 focus-visible:outline-accent';
const LABEL = 'flex flex-col gap-1.5 text-label-xs text-ink-soft';

function isRole(value: string): value is EditValues['role'] {
  return (ROLE_OPTIONS as readonly string[]).includes(value);
}

export function EditProfileForm({ profile, onSubmit, onCancel }: EditProfileFormProps) {
  const m = useMessages();
  const { locale } = usePreferences();
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
        {m.change.role}
        <select className={INPUT} {...register('role')}>
          {ROLE_OPTIONS.map((role) => (
            <option key={role} value={role}>
              {translateValue(role, locale)}
            </option>
          ))}
        </select>
      </label>
      <label className={LABEL}>
        {m.change.topics}
        <input className={INPUT} placeholder="sales, ai, leadership" {...register('topics')} />
      </label>
      <div className="flex flex-wrap gap-2">
        <Button type="submit">{m.change.save}</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          {m.change.cancel}
        </Button>
      </div>
    </form>
  );
}
