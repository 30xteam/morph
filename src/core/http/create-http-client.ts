import { HttpError } from './http-error';
import type {
  HttpClientOptions,
  HttpMethod,
  HttpRequestConfig,
  HttpResponse,
  QueryParams,
  RequestOptions,
} from './types';

/** String concat (not `new URL(path, base)`) so a base path like `/api` is never dropped. */
function buildUrl(baseUrl: string, path: string, params?: QueryParams) {
  const isAbsolute = /^https?:\/\//.test(path);
  const target =
    isAbsolute || !baseUrl ? path : `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;

  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== null) search.set(key, String(value));
  }
  const query = search.toString();
  if (!query) return target;
  return `${target}${target.includes('?') ? '&' : '?'}${query}`;
}

async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return null;
  const type = response.headers.get('content-type') ?? '';
  return type.includes('application/json') ? response.json() : response.text();
}

/** A minimal fetch client with an interceptor pipeline, usable from both RSC and the browser. */
export function createHttpClient(options: HttpClientOptions = {}) {
  const { baseUrl = '', request = [], response = [], error = [] } = options;

  async function send<T>(method: HttpMethod, url: string, opts: RequestOptions = {}) {
    let config: HttpRequestConfig = {
      ...opts,
      url,
      method,
      headers: new Headers({
        Accept: 'application/json',
        ...Object.fromEntries(new Headers(opts.headers)),
      }),
    };

    try {
      // oxlint-disable-next-line no-await-in-loop -- interceptor order is part of the contract
      for (const intercept of request) config = await intercept(config);

      const hasJsonBody = config.data !== undefined && !(config.data instanceof FormData);
      if (hasJsonBody) config.headers.set('Content-Type', 'application/json');

      const res = await fetch(buildUrl(baseUrl, config.url, config.params), {
        ...config.init,
        method: config.method,
        headers: config.headers,
        body: hasJsonBody ? JSON.stringify(config.data) : (config.data as FormData | undefined),
      });

      const body = await parseBody(res);
      if (!res.ok) throw new HttpError(res.status, body, config);

      let result: HttpResponse = { data: body, status: res.status, headers: res.headers, config };
      // oxlint-disable-next-line no-await-in-loop -- interceptor order is part of the contract
      for (const intercept of response) result = await intercept(result);
      return result as HttpResponse<T>;
    } catch (caught) {
      // oxlint-disable-next-line no-await-in-loop -- interceptor order is part of the contract
      for (const intercept of error) await intercept(caught);
      throw caught;
    }
  }

  return {
    get: <T>(url: string, opts?: RequestOptions) => send<T>('GET', url, opts),
    delete: <T>(url: string, opts?: RequestOptions) => send<T>('DELETE', url, opts),
    post: <T>(url: string, data?: unknown, opts?: RequestOptions) =>
      send<T>('POST', url, { ...opts, data }),
    put: <T>(url: string, data?: unknown, opts?: RequestOptions) =>
      send<T>('PUT', url, { ...opts, data }),
    patch: <T>(url: string, data?: unknown, opts?: RequestOptions) =>
      send<T>('PATCH', url, { ...opts, data }),
  };
}

export type HttpClient = ReturnType<typeof createHttpClient>;
