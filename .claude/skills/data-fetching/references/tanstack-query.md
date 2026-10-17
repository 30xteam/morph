# TanStack Query

The most feature-complete server-state library — caching, mutations,
optimistic updates, prefetching, devtools, SSR hooks. Default choice for
new projects (see `data-fetching/SKILL.md` — Choosing a Library).

## Query

```ts
const { data, isLoading, isError, error } = useQuery({
  queryKey: ['calls', id],
  queryFn: () => CallService.getDetail(id),
  enabled: !!id, // don't run the query until id exists
});
```

`queryKey` must include every value the query depends on — `['calls', id]`,
not just `['calls']`, if the query result differs per `id`.

## Mutation + Invalidation

```ts
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: (payload: Payload) => CallService.create(payload),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['calls'] });
    Toast.success({ title: 'Created' });
  },
  onError: () => Toast.error({ title: 'Failed' }),
});
```

For a mutation whose result you already know without a refetch (e.g. a
toggle), write it directly with `queryClient.setQueryData` instead of
invalidating — it updates the UI instantly without a round trip.

## Custom Hook Wrapping a Query

```ts
// features/calls/hooks/use-calls.ts
export function useCalls() {
  return useQuery({ queryKey: ['calls'], queryFn: CallService.getCalls });
}
```

Wrap every query used by more than one component in a named hook — it
gives the query key a single place to change and a descriptive call site
(`useCalls()`, not a raw `useQuery` block repeated in three files).

## Hard Rules

- `queryKey` includes every value the query result depends on — no exceptions.
- A mutation's `onSuccess` invalidates or writes the affected query keys — never left as a no-op.
- Any query read from more than one component is wrapped in a named hook, not inlined at each call site.
