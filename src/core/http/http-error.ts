import type { HttpRequestConfig } from './types';

export class HttpError<TBody = unknown> extends Error {
  readonly status: number;
  readonly body: TBody;
  readonly config: HttpRequestConfig;

  constructor(status: number, body: TBody, config: HttpRequestConfig) {
    super(`HTTP ${status} on ${config.method} ${config.url}`);
    this.name = 'HttpError';
    this.status = status;
    this.body = body;
    this.config = config;
  }
}

export function isHttpError(error: unknown): error is HttpError {
  return error instanceof HttpError;
}
