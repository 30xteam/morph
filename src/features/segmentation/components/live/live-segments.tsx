'use client';

import { useState } from 'react';

import { cx } from '@/core/cx';

import { ProfileDetail } from '../detail/profile-detail';
import { ProfileList } from './profile-list';

export function LiveSegments() {
  const [detailOpen, setDetailOpen] = useState(false);

  return (
    <div className="flex min-w-0 flex-1 desktop:h-dvh">
      <ProfileList
        className={cx('flex-1 desktop:flex desktop:flex-none', detailOpen ? 'hidden' : 'flex')}
        onOpen={() => setDetailOpen(true)}
      />
      <ProfileDetail
        className={cx('flex-1 desktop:flex', detailOpen ? 'flex' : 'hidden')}
        onBack={() => setDetailOpen(false)}
      />
    </div>
  );
}
