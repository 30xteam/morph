# nice-modal-react

A modal *state manager*, not a modal component — it gives any modal an
imperative, globally-callable API (`show`/`hide`) via a registry, and wraps
whatever dialog implementation the project already renders (a design
system's `<Dialog>`, MUI's `<Modal>`, anything). Reach for it once a modal
needs to open from more than one place — see `modals/SKILL.md`.

## Register a Modal

```tsx
// features/checkout/confirm-dialog.tsx
export const ConfirmDialog = NiceModal.create<{ message: string }>(({ message }) => {
  const modal = useModal(); // hook into this specific modal instance's state
  return (
    <Dialog open={modal.visible} onClose={() => modal.hide()}>
      <p>{message}</p>
      <button onClick={() => modal.resolve(true) && modal.hide()}>Confirm</button>
    </Dialog>
  );
});
```

`NiceModal.create` wraps an *existing* dialog component (`<Dialog>` here) —
it doesn't render its own chrome. If the project has no dialog component
yet, get one from a UI library or `radix-dialog.md` first.

## Provider (One-Time Setup)

```tsx
// root of the app
<NiceModal.Provider>{children}</NiceModal.Provider>
```

## Opening From Anywhere

```ts
// no import of ConfirmDialog needed at the call site if registered by id,
// but the direct-reference form below is simpler and still decoupled from *where* it's rendered
const confirmed = await NiceModal.show(ConfirmDialog, { message: 'Delete this item?' });
```

`NiceModal.show` returns a promise — this is the pattern's real advantage
over prop-driven modals: a call site can `await` a confirmation instead of
wiring an `onConfirm`/`onCancel` callback pair.

## Hard Rules

- `NiceModal.create` always wraps a real dialog primitive — never build a modal's visual chrome from scratch inside it.
- Prefer `await NiceModal.show(...)` over callback props when the caller needs the modal's result.
- Mount `<NiceModal.Provider>` once, at the root — not per-feature.
