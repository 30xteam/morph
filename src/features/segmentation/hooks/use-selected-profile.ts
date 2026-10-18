import { useQueryStates } from 'nuqs';

import { PROFILE_URL_KEYS, profileParams, useSegmentationStore } from '@/libs/segmentation';

export function useSelectedProfile() {
  const firstId = useSegmentationStore((state) => state.profiles[0]?.id ?? null);
  const [{ profile }, setParams] = useQueryStates(profileParams, { urlKeys: PROFILE_URL_KEYS });

  return {
    requestedId: profile,
    selectedId: profile ?? firstId,
    select: (id: string | null) => void setParams({ profile: id }),
  };
}
