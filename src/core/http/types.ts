export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type QueryParams = Record<string, string | number | boolean | null | undefined>;

export interface HttpRequestConfig {
  url: string;
  method: HttpMethod;
  headers: Headers;
  params?: QueryParams;
  data?: unknown;
  /** Forwarded to `fetch` — use for Next.js cache directives (`next: { revalidate }`, `cache`). */
  init?: Omit<RequestInit, 'body' | 'headers' | 'method'>;
}

export interface HttpResponse<T = unknown> {
  data: T;
  status: number;
  headers: Headers;
  config: HttpRequestConfig;
}

export type RequestInterceptor = (
  config: HttpRequestConfig,
) => HttpRequestConfig | Promise<HttpRequestConfig>;

export type ResponseInterceptor = (response: HttpResponse) => HttpResponse | Promise<HttpResponse>;

export type ErrorInterceptor = (error: unknown) => never | Promise<never>;

export interface HttpClientOptions {
  baseUrl?: string;
  /** Run in registration order: auth first, URL normalization last (see http-layer skill). */
  request?: RequestInterceptor[];
  response?: ResponseInterceptor[];
  error?: ErrorInterceptor[];
}

export type RequestOptions = Partial<Omit<HttpRequestConfig, 'url' | 'method' | 'headers'>> & {
  headers?: HeadersInit;
};
