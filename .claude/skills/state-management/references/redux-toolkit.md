# Redux Toolkit

The enforced-patterns choice — slices, reducers, and a single store with
time-travel debugging via DevTools. Reach for it only when the team
specifically needs that structure/tooling, or the project already has a
Redux store (see `state-management/SKILL.md` — Choosing a Library). For
server data specifically, pair it with RTK Query rather than hand-rolled
thunks — see `data-fetching/references/rtk-query.md`.

## Slice

```ts
// features/cart/cart.slice.ts
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] as CartItem[] },
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      state.items.push(action.payload); // Immer under the hood — direct "mutation" is safe here only
    },
  },
});

export const { addItem } = cartSlice.actions;
export default cartSlice.reducer;
```

The direct-mutation syntax inside a `createSlice` reducer is safe because
Redux Toolkit wraps reducers in Immer — this is the one place in the app
where "mutating" state is the correct pattern, not an exception to avoid
elsewhere.

## Store

```ts
export const store = configureStore({
  reducer: { cart: cartReducer },
});
```

## Selecting a Slice

```ts
// ✅ re-renders only when items changes
const items = useAppSelector((s) => s.cart.items);

// ❌ re-renders on every store change
const cart = useAppSelector((s) => s.cart);
```

Use typed hooks (`useAppSelector`/`useAppDispatch`, generated once from the
store) rather than the bare `useSelector`/`useDispatch` — it's what gives
every selector and dispatched action full type inference.

## Dispatching

```ts
const dispatch = useAppDispatch();
dispatch(addItem(newItem)); // never mutate cart.items from a component directly
```

## Hard Rules

- Select the specific slice a component reads with a memoized selector — never the whole state tree.
- State only changes through `dispatch`ed actions defined in a slice — never mutated from outside a reducer.
- Use the project's typed `useAppSelector`/`useAppDispatch`, not the untyped Redux hooks.
