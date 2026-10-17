import 'server-only';
import { env } from '@/core/config/env';

import { createHttpClient } from '../create-http-client';
import { camelToSnakeRequest, snakeToCamelResponse } from '../interceptors/parse';
import { insertTokenServer } from './interceptors/insert-token-server';
import { logErrorServer } from './interceptors/log-error-server';

/**
 * Server Components / Server Actions only. Reading cookies makes the caller dynamic, so with
 * Cache Components render it inside <Suspense> (or use `'use cache: private'`).
 */
export const httpServer = createHttpClient({
  baseUrl: env.NEXT_PUBLIC_API_URL,
  request: [insertTokenServer, camelToSnakeRequest],
  response: [snakeToCamelResponse],
  error: [logErrorServer],
});

export { HttpError, isHttpError } from '../http-error';
