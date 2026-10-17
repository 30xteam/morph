# SWR

Minimalist server-state library from Vercel — small bundle, convention over
configuration, no mutation-lifecycle API of its own. Reach for it only for
a genuinely small app where TanStack Query's surface area (mutations,
devtools, prefetch helpers) is more than the project needs (see
`data-fetching/SKILL.md` — Choosing a Library).

## Query

```ts
const { data, error, isLoading } = useSWR(['calls', id], () => CallService.getDetail(id));
```

The key can be a string or an array — an array key (`['calls', id]`) is how
a query that depends on more than one value stays uniquely cached, same
principle as TanStack Query's `queryKey`.

## Mutation (No Built-In Mutation Hook)

SWR has no `useMutation` — call the write yourself, then tell SWR its cache
is stale:

```ts
import { mutate } from 'swr';

async function createCall(payload: Payload) {
  await CallService.create(payload);
  mutate(['calls']); // revalidate — refetches and updates every consumer
}
```

For a result you already know, pass it directly to skip the refetch:

```ts
mutate(['calls', id], updatedCall, { revalidate: false });
```

## Conditional Fetching

```ts
const { data } = useSWR(id ? ['calls', id] : null, () => CallService.getDetail(id));
```

A `null` key means "don't fetch" — this is SWR's equivalent of TanStack
Query's `enabled: false`.

## Hard Rules

- Array keys include every value the fetch depends on, same as any other server-state library in this collection.
- A write operation is always followed by an explicit `mutate()` call — SWR does not infer that a mutation happened.
- Use a `null` key to skip a fetch conditionally — don't wrap the whole hook in an `if`.
