import 'server-only';
import { cookies } from 'next/headers';

import { SESSION_TOKEN_KEY } from '@/core/config/auth';

import { withAuthHeader } from '../../interceptors/with-auth-header';
import type { RequestInterceptor } from '../../types';

/** Server-only twin of `insertToken`: same header, token read via `next/headers`. */
export const insertTokenServer: RequestInterceptor = async (config) => {
  const token = (await cookies()).get(SESSION_TOKEN_KEY)?.value;
  return withAuthHeader(config, token);
};
