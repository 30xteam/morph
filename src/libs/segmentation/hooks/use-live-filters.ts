import { useQueryStates } from 'nuqs';

import { liveParams } from '../config/url-params';
import type { ProfileStatus } from '../utils/profile-status';

export function useLiveFilters() {
  const [{ program, light: lights, low: lowAffinityOnly }, setParams] = useQueryStates(liveParams);

  return {
    program,
    lights,
    lowAffinityOnly,
    setProgram: (value: typeof program) => void setParams({ program: value }),
    setLowAffinityOnly: (value: boolean) => void setParams({ low: value }),
    toggleLight: (value: ProfileStatus) =>
      void setParams({
        light: lights.includes(value)
          ? lights.filter((item) => item !== value)
          : [...lights, value],
      }),
    clearLights: () => void setParams({ light: null }),
    clearFilters: () => void setParams({ light: null, low: null }),
  };
}
