import 'server-only';
import { httpServer, isHttpError } from '@/core/http/server';

import type { User } from '../types/auth.types';

// TODO: point at the real endpoint once the backend contract exists.
const ME_ENDPOINT = '/users/me';

/**
 * Re-hydrates the session from the cookie on every full page load. A missing or invalid token
 * is an implicit logout (null), never an error to display.
 */
export async function getSessionUser(): Promise<User | null> {
  try {
    const { data } = await httpServer.get<User>(ME_ENDPOINT);
    return data;
  } catch (error) {
    if (isHttpError(error) && (error.status === 401 || error.status === 403)) return null;
    throw error;
  }
}
