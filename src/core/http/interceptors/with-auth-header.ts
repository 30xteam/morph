import type { HttpRequestConfig } from '../types';

/** Shared by the client and server token interceptors so both emit the identical header. */
export function withAuthHeader(config: HttpRequestConfig, token: string | undefined) {
  if (token) config.headers.set('Authorization', `Bearer ${token}`);
  return config;
}
