import { SESSION_TOKEN_KEY } from '@/core/config/auth';

import type { RequestInterceptor } from '../types';
import { withAuthHeader } from './with-auth-header';

function readCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

/** Browser-only: reads the session cookie. Server code uses `insertTokenServer` instead. */
export const insertToken: RequestInterceptor = (config) =>
  withAuthHeader(config, readCookie(SESSION_TOKEN_KEY));
