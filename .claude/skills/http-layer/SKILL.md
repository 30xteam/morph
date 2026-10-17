---
name: http-layer
description: >
  Use when setting up an HTTP client, adding a request/response interceptor,
  or deciding where request/response shape conversion belongs. Trigger on
  tasks like "add an axios interceptor", "why is this field snake_case in
  the app", "call this API from a server-rendered context", or "add an auth
  header to every request". If the project runs on Next.js App Router, also
  load `nextjs/app-router` for the split between a browser client and a
  server-only client. For where the token itself comes from, see the
  sibling `auth-flow` skill. Do NOT trigger for server-state caching — see
  `data-fetching`. Do NOT trigger for service-layer function shape — see
  `architecture`.
metadata:
  version: 1.0
  collection: noxen
---

# Noxen — HTTP Layer

Part of the **Noxen** skill set (a personal engineering standard for React +
TypeScript + Tailwind). This skill covers the HTTP client and its
interceptor pipeline only — for the service functions that call it see
`architecture`, for where the auth token comes from see `auth-flow`.

## One Client Is Not Always Enough

Any interceptor that reads a browser API (`document.cookie`,
`window.navigator`) cannot run in a context that has no browser — a Node
script, a test, or (in frameworks with a server runtime, e.g. Next.js) a
Server Component or Server Action. When such a context exists, keep two
thin client instances instead of branching one client's interceptors at
runtime:

```
core/http/
  index.ts            http — for client-side code, browser-only interceptors
  interceptors/        insertToken, injectPlatformHeader, parse.ts (case conversion)
  server/
    http.ts            httpServer — for server-rendered code, server-only interceptors
    interceptors/       server-safe equivalents of the client ones
```

Each pair (`insertToken` / `insertTokenServer`) does the *same thing* —
attach `Authorization: Bearer <token>` — but reads the token from a
different source. Keep them separate files; do not add an
`isServer` branch inside one interceptor.

## Interceptor Order Is Part of the Contract

Request interceptors run in registration order. A typical pipeline:

```ts
http.interceptors.request.use(insertToken);              // 1. auth header
http.interceptors.request.use(camelToSnakeRequest);       // 2. body case conversion
http.interceptors.request.use(injectPublicApiKey);        // 3. only if no token
http.interceptors.request.use(injectPlatformHeader);      // 4. static metadata
http.interceptors.request.use(injectTrailingSlash);       // 5. always last — URL shape
```

Auth first (later interceptors may need to know a token was set), URL
normalization last (nothing after it should still touch the URL).

## Case Conversion Belongs at the Boundary, Not in Services

Put snake_case ⇄ camelCase conversion in a single response/request
interceptor pair, never inline in a service:

```ts
// core/http/interceptors/parse.ts
export const camelToSnakeRequest = (config) => ({ ...config, data: toSnakeCase(config.data) });
export const snakeToCamelResponse = (response) => ({ ...response, data: toCamelCase(response.data) });

http.interceptors.response.use(snakeToCamelResponse);
```

```ts
// ✅ features/events/services/events.service.ts
export const getEvents = async () => {
  const { data } = await http.get(EVENTS.Endpoints.List);
  return data; // already camelCase — the interceptor did it
};

// ❌ never do this per-service
export const getEvents = async () => {
  const { data } = await http.get(EVENTS.Endpoints.List);
  return snakeToCamel(data); // duplicated, easy to forget elsewhere
};
```

This means every `types/*.types.ts` in the app can assume camelCase
regardless of the backend's actual contract — pick one convention app-side
and let the interceptor absorb the mismatch.

## `fetch` As an Escape Hatch

When you need fine-grained cache control the HTTP client's interceptor
pipeline doesn't expose (e.g. framework-level cache directives), a thin
`fetch` wrapper is a reasonable second tool — but it duplicates header
logic manually, so keep it for the few call sites that actually need that
control, not as a default:

```ts
// core/http/fetch.ts — only for cache-control call sites
export const fetchWithCache = (url: string, opts?: { revalidate?: number }) =>
  fetch(url, {
    headers: { Authorization: `Bearer ${getToken()}`, ...staticHeaders },
    next: opts?.revalidate ? { revalidate: opts.revalidate } : undefined,
  });
```

## Errors: Log Structure on the Server, Not the Client

A server-rendered request has no DevTools network tab to inspect after the
fact — its error interceptor should log structured context (`error.response`
vs `error.request` vs `error.message`) since that's the only trace you get:

```ts
httpServer.interceptors.response.use(undefined, (error) => {
  if (error.response) console.error('http.response', error.response.status, error.config.url);
  else if (error.request) console.error('http.no-response', error.config.url);
  else console.error('http.setup', error.message);
  return Promise.reject(error);
});
```

## Hard Rules

- Case conversion (snake_case ⇄ camelCase) lives in exactly one interceptor pair — services never convert manually.
- Never branch a single interceptor on `isServer` — split into a client and a server file instead.
- Interceptor registration order is deliberate: auth first, URL normalization last.
- A `fetch` escape hatch is for the few call sites that need cache control it enables — not a parallel default client.
