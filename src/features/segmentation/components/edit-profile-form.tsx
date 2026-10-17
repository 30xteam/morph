'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/ui';

import { COMPANY_SIZES, profileSchema } from '../types/profile.schema';
import type { Profile } from '../types/segmentation.types';

interface EditProfileFormProps {
  profile: Profile;
  onSubmit: (profile: Profile) => void;
  onCancel: () => void;
}

const INPUT =
  'w-full rounded-input border border-border-input bg-surface px-3 py-2 text-body-sm text-fg focus-visible:outline-2 focus-visible:outline-primary';
const LABEL = 'flex flex-col gap-1 text-caption text-fg-muted';
const ERROR = 'text-caption text-danger';

export function EditProfileForm({ profile, onSubmit, onCancel }: EditProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Profile>({ resolver: zodResolver(profileSchema), defaultValues: profile });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
      <label className={LABEL}>
        Role
        <input className={INPUT} {...register('role')} />
        {errors.role ? <span className={ERROR}>{errors.role.message}</span> : null}
      </label>
      <label className={LABEL}>
        Company
        <input className={INPUT} {...register('company')} />
        {errors.company ? <span className={ERROR}>{errors.company.message}</span> : null}
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className={LABEL}>
          Industry
          <input className={INPUT} {...register('industry')} />
        </label>
        <label className={LABEL}>
          Company size
          <select className={INPUT} {...register('companySize')}>
            {COMPANY_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className={LABEL}>
        What do you want from this event?
        <textarea rows={4} className={INPUT} {...register('signupAnswer')} />
        {errors.signupAnswer ? <span className={ERROR}>{errors.signupAnswer.message}</span> : null}
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
