import 'server-only';
import { isHttpError } from '../../http-error';
import type { ErrorInterceptor } from '../../types';

/** Server requests have no DevTools network tab, so structured logs are the only trace. */
export const logErrorServer: ErrorInterceptor = (error) => {
  if (isHttpError(error))
    console.error('http.response', error.status, error.config.method, error.config.url);
  else if (error instanceof TypeError) console.error('http.no-response', error.message);
  else console.error('http.unknown', error);
  throw error;
};
