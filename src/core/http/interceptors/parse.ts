import { toCamelCase, toSnakeCase } from '../case';
import type { RequestInterceptor, ResponseInterceptor } from '../types';

/** The only place case conversion happens — services always see camelCase. */
export const camelToSnakeRequest: RequestInterceptor = (config) => ({
  ...config,
  data: config.data instanceof FormData ? config.data : toSnakeCase(config.data),
  params: config.params && toSnakeCase(config.params),
});

export const snakeToCamelResponse: ResponseInterceptor = (response) => ({
  ...response,
  data: toCamelCase(response.data),
});
