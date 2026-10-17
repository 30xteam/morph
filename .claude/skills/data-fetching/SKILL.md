---
name: data-fetching
description: >
  Use when fetching, caching, or mutating server data in a React component —
  loading/error states, cache invalidation, or choosing a data-fetching
  library. Trigger on tasks like "fetch this from the API in a hook", "this
  list doesn't update after a mutation", "add pagination to this query", or
  "which data-fetching library should I use". Library-agnostic — loads a
  `references/<library>.md` for the concrete library the project uses
  (TanStack Query, SWR, RTK Query). Do NOT trigger for the HTTP client
  itself (interceptors, base URL) — see `http-layer`. Do NOT trigger for
  local/UI-only state — see the sibling `react-patterns` and
  `state-management` skills.
metadata:
  version: 1.0
  collection: noxen
---

# Noxen — Data Fetching

Part of the **Noxen** skill set. This skill covers server-state patterns
independent of which library a project uses — load the matching
`references/*.md` for the concrete library actually installed. For the HTTP
client underneath (interceptors, case conversion), see `http-layer`.

## Server State Is Not Component State

Server data is owned by the server — a component holding it in `useState`
is caching a snapshot that immediately goes stale. Every library in this
skill exists to solve the same problem a raw `useState`/`useEffect` fetch
doesn't: caching, deduplication, revalidation, and loading/error state,
without you hand-rolling any of it.

```tsx
// ❌ hand-rolled — no cache, no dedup, no revalidation, re-fetches on every mount
useEffect(() => { fetchCalls().then(setCalls); }, []);

// ✅ delegate all of that to the library
const { data: calls, isLoading, error } = useServerQuery(['calls'], CallService.getCalls);
```

## Load the Right Reference

| Concern | Reference |
|---|---|
| Project uses TanStack Query | `references/tanstack-query.md` |
| Project uses SWR | `references/swr.md` |
| Project uses RTK Query (Redux Toolkit) | `references/rtk-query.md` |
| Starting a new project, no library chosen yet | Read `## Choosing a Library` below |

## Choosing a Library (New Projects)

Default to **TanStack Query**: the most complete feature set (mutations,
optimistic updates, prefetching, devtools, SSR hooks) and the widest
adoption, so it's the safest default when requirements aren't fully known
yet. Reach for **SWR** only for a genuinely small app where TanStack
Query's surface area is more than the project needs. Reach for **RTK
Query** only if the project already uses Redux Toolkit for client state —
it requires the Redux store and provider, so it's never a standalone
choice.

## Patterns That Hold Regardless of Library

**A query is keyed by everything it depends on.** If a query reads an `id`,
that `id` is part of the cache key — two different ids must produce two
different cache entries, not one entry silently reused for the wrong id.

**A mutation invalidates or updates the queries it affects.** After a
create/update/delete, either invalidate the affected query keys or write
the known result directly into the cache — don't leave stale data on
screen and rely on the user refreshing.

**Loading and error are the query's problem, not the component's.** A
component consuming a query reads `isLoading`/`error` from it; it doesn't
maintain a parallel `useState` flag for the same request.

**Never duplicate server data into local state.** If a value is fetched,
it lives in the fetching library's cache — copying it into `useState` "to
edit it locally" creates two sources of truth that can silently diverge.

## Hard Rules

- Every value a query depends on (id, filters, page) is part of its cache key.
- A mutation always invalidates or writes to the query cache it affects — never leave the UI showing pre-mutation data.
- Read `isLoading`/`error` from the fetching library — never mirror them into local state.
- Never copy fetched data into `useState`; treat the fetching library's cache as the single source of truth.
