import { useQueryStates } from 'nuqs';

import { reviewParams } from '../config/url-params';

export function useReviewTab() {
  const [{ tab }, setParams] = useQueryStates(reviewParams);
  return [tab, (value: typeof tab) => void setParams({ tab: value })] as const;
}
