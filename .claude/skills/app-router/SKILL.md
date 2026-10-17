---
name: app-router
description: >
  Use FIRST when the project is Next.js App Router — before applying the
  plain-React Noxen skills (`architecture`, `react-patterns`, `http-layer`,
  `auth-flow`), since routing, data fetching, and the client/server split
  work differently here. Trigger on tasks like "where does this page go in
  a Next app", "should this be a Server or Client Component", "set up
  routing for a new feature", or any structural question in a Next.js
  project. Do NOT trigger for the layout-declaration pattern, i18n, or
  feature flags — see the sibling `screen-config`, `i18n`, and
  `feature-flags` skills, which build on top of this one.
metadata:
  version: 1.0
  collection: noxen
---

# Noxen — Next.js App Router

Part of the **Noxen** skill set. This skill is the bridge between the
plain-React base skills and the `nextjs/*` skills — read it first in a Next
project, then load the base skill for the specific thing you're doing (it
tells you which parts of that skill still apply).

## What Changes vs. the Plain-React Skills

| Concern | Plain React (`architecture`) | Next.js App Router |
|---|---|---|
| Routing | Central `src/router.tsx`, `RouteObject[]` | File-based: `app/<segment>/page.tsx` |
| Page location | `features/<feature>/pages/` | `app/<feature>/page.tsx` — outside the feature module |
| Default execution | Everything is client | Everything is a **Server Component** unless marked `'use client'` |
| Data fetching | manual `fetch`/`useEffect`, or a library via `data-fetching` | `await` directly in the page, or the `data-fetching` library inside a `'use client'` child |
| Reading cookies | `document.cookie` (see `http-layer`) | `await cookies()` from `next/headers` — server-only, cannot run client-side |
| Layout composition | Composed manually per page | `layout.tsx` per segment, inherited automatically |

The feature module's internals (`services/`, `hooks/`, `types/`, `utils/`)
are unchanged — only `pages/` moves out to `app/`, and a page becomes a thin
adapter between the route and the feature.

## Server Components Are the Default — Use That

```tsx
// app/events/page.tsx — Server Component, no 'use client'
export default async function EventsPage() {
  const events = await EventsService.getEventsSSR(); // direct await, no useQuery
  return <EventsList events={events} />;
}
```

Reach for `'use client'` only for the specific subtree that needs
interactivity (state, effects, event handlers, browser APIs) — not for the
whole page. Push `'use client'` as far down the tree as it will go.

```tsx
// app/events/_components/events-filter.tsx
'use client';
export function EventsFilter() {
  const [query, setQuery] = useState('');
  // ...
}
```

A `data-fetching` library (TanStack Query, SWR, …) still applies, but only
inside a `'use client'` boundary — for the initial render, prefer a direct
server-side fetch in the page itself.

## Cookies and the Server/Client Split

`http-layer` and `auth-flow` describe why a browser-only interceptor and a
server-only interceptor must be separate files. In App Router, "server
runtime" means `next/headers`:

```ts
// interceptors/insert-token-server.ts — Server Components / Server Actions only
import { cookies } from 'next/headers';
export const insertTokenServer = async (config) => {
  const token = (await cookies()).get(TOKEN_KEY)?.value;
  return withAuthHeader(config, token);
};
```

This file cannot be imported from a `'use client'` component — `next/headers`
throws at the client boundary. Keep the server HTTP client and its
interceptors in a `server/` subfolder so the import boundary is visible at a
glance, not just enforced at runtime.

## Pages Stay Thin

A `page.tsx` is route glue, not feature logic: minimal server-side fetch +
composition of feature components + `withScreenConfig(...)` (see
`screen-config`) as the default export. Anything more belongs in
`libs/<feature>/` or `app/<feature>/_components/`.

## Hard Rules

- Default to a Server Component; add `'use client'` only to the smallest subtree that needs it.
- Never import a `next/headers`-based module from a `'use client'` file.
- `page.tsx` files stay thin — fetch + compose, no business logic.
- The feature module's internal structure (`services/hooks/types/utils`) doesn't change — only where `pages/` physically lives.
