# RTK Query

Server-state layer built into Redux Toolkit — API endpoints are defined as
part of a Redux slice, and results live in the Redux store. Never a
standalone choice: it requires the Redux store and `<Provider>` already set
up. Reach for it only when a project already uses Redux Toolkit for client
state (see `data-fetching/SKILL.md` — Choosing a Library) — introducing
Redux solely to get RTK Query is adding a client-state library to solve a
server-state problem.

## API Slice

```ts
// features/calls/calls.api.ts
export const callsApi = createApi({
  reducerPath: 'callsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Call'],
  endpoints: (builder) => ({
    getCalls: builder.query<Call[], void>({
      query: () => 'calls',
      providesTags: ['Call'],
    }),
    createCall: builder.mutation<Call, Payload>({
      query: (body) => ({ url: 'calls', method: 'POST', body }),
      invalidatesTags: ['Call'], // any query providing 'Call' refetches
    }),
  }),
});

export const { useGetCallsQuery, useCreateCallMutation } = callsApi;
```

Tags (`providesTags`/`invalidatesTags`) are RTK Query's version of a query
key — a query that provides a tag automatically refetches when a mutation
invalidates it, without manually listing which queries to update.

## Consuming

```ts
const { data: calls, isLoading, error } = useGetCallsQuery();
const [createCall, { isLoading: isCreating }] = useCreateCallMutation();
```

## Store Wiring (One-Time Setup)

```ts
export const store = configureStore({
  reducer: { [callsApi.reducerPath]: callsApi.reducer },
  middleware: (gDM) => gDM().concat(callsApi.middleware),
});
```

## Hard Rules

- Every query that should refetch after a related mutation declares `providesTags`; every mutation that changes that data declares the matching `invalidatesTags` — don't invalidate by manually refetching from the component.
- Don't add Redux Toolkit to a project purely to get RTK Query — if the project has no other Redux state, use TanStack Query or SWR instead.
- Consume endpoints only through the generated hooks (`useGetCallsQuery`) — never dispatch the underlying thunks manually.
