# Zustand

A store is a hook — no provider, no boilerplate. Smallest bundle of the
three, pragmatic default for most new projects (see
`state-management/SKILL.md` — Choosing a Library).

## Store Factory

Wrap `create` in a small factory so devtools wiring and opt-in persistence
stay consistent across every store, instead of configuring each by hand:

```ts
// core/store/create-store.ts
export function createStore<T>(name: string, cb: StateCreator<T>, opts?: { hydrate?: boolean }) {
  const { hydrate = false, ...rest } = opts ?? {};
  return hydrate ? create<T>()(devtools(persist(cb, { ...rest, name }))) : create<T>()(devtools(cb));
}
```

```ts
// features/cart/store/cart.store.ts
export const useCartStore = createStore<CartState>('cart', (set) => ({
  items: [],
  add: (item) => set((s) => ({ items: [...s.items, item] })),
}));
```

Default to `hydrate: false` (in-memory only) — opt into `persist`
explicitly per store, don't make persistence the default.

## Selecting a Slice

```ts
// ✅ re-renders only when items changes
const items = useCartStore((s) => s.items);

// ❌ re-renders on every store change, even unrelated ones
const { items } = useCartStore();
```

## Actions Live in the Store

```ts
// ✅ component calls a named action
useCartStore.getState().add(item);

// ❌ component reaches into the store's internals
useCartStore.setState((s) => ({ items: [...s.items, item] }));
```

## Hard Rules

- Always select the specific slice a component reads — never destructure the whole store in a component.
- Mutate state only through actions defined on the store, never with `setState` from a component.
- Default every store to `hydrate: false`; opt into `persist` per store when it's actually needed.
