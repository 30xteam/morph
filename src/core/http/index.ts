import { env } from '@/core/config/env';

import { createHttpClient } from './create-http-client';
import { insertToken } from './interceptors/insert-token';
import { camelToSnakeRequest, snakeToCamelResponse } from './interceptors/parse';

/** Client-side HTTP client. For Server Components / Actions import `httpServer` from `@/core/http/server`. */
export const http = createHttpClient({
  baseUrl: env.NEXT_PUBLIC_API_URL,
  request: [insertToken, camelToSnakeRequest],
  response: [snakeToCamelResponse],
});

export { createHttpClient, type HttpClient } from './create-http-client';
export { HttpError, isHttpError } from './http-error';
export type { HttpResponse, RequestOptions } from './types';
