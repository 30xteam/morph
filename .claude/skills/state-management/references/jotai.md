# Jotai

Atomic state — each piece of state is its own small "atom" instead of one
combined store, and derived atoms recompute automatically from the atoms
they read. Reach for it over Zustand when the state model is naturally many
small, independent, composable values rather than a few larger stores (see
`state-management/SKILL.md` — Choosing a Library).

## Atoms

```ts
// features/cart/store/cart.atoms.ts
export const cartItemsAtom = atom<CartItem[]>([]);

// derived atom — recomputes automatically when cartItemsAtom changes
export const cartTotalAtom = atom((get) => get(cartItemsAtom).reduce((sum, i) => sum + i.price, 0));
```

A derived atom is the direct replacement for a `useMemo`-computed value
sourced from global state — express the derivation once, at the atom
level, rather than recomputing it in every component that needs the total.

## Reading and Writing

```ts
// ✅ read-only where only the total is needed — no re-render on unrelated item fields
const total = useAtomValue(cartTotalAtom);

// read + write where the component adds items
const [items, setItems] = useAtom(cartItemsAtom);
setItems((prev) => [...prev, newItem]);

// write-only action atom — component never sees the raw items array
const addItem = useSetAtom(addItemAtom);
```

Use `useAtomValue`/`useSetAtom` instead of the combined `useAtom` whenever
a component only reads or only writes — it makes the one-directional
dependency explicit and avoids subscribing to writes the component never
performs.

## Action Atoms Instead of Inline Setters

```ts
export const addItemAtom = atom(null, (get, set, item: CartItem) => {
  set(cartItemsAtom, [...get(cartItemsAtom), item]);
});
```

Same principle as `state-management/SKILL.md`'s "actions live next to the
state" rule — a write atom, not a component calling `setItems` with
inline logic.

## Hard Rules

- Prefer `useAtomValue`/`useSetAtom` over `useAtom` whenever a component only reads or only writes.
- Express any value computable from other atoms as a derived atom, not a component-level `useMemo` over multiple atom reads.
- Non-trivial writes go through a dedicated write atom, not inline `set` logic scattered across components.
