# Native `<dialog>` Element

Zero-dependency modal — the browser provides focus trapping, top-layer
stacking (no z-index wars with the rest of the page), `Escape`-to-close,
and a backdrop, all without a library. Reach for it when starting a project
with no design system yet and modest modal needs (see `modals/SKILL.md` —
Choosing an Approach).

## Open as a True Modal

```tsx
const ref = useRef<HTMLDialogElement>(null);

<dialog ref={ref} onClose={() => setIsOpen(false)}>
  <p>Delete this item?</p>
  <button onClick={() => ref.current?.close()}>Cancel</button>
</dialog>

<button onClick={() => ref.current?.showModal()}>Delete</button>
```

`showModal()` is what makes it an actual modal (backdrop, focus trap,
inert background) — calling `.show()` or toggling the `open` attribute
directly renders it as a non-modal popover with none of that behavior.

## Closing via `<form method="dialog">`

```tsx
<dialog ref={ref}>
  <form method="dialog">
    <button value="confirm">Confirm</button>
    <button value="cancel">Cancel</button>
  </form>
</dialog>
```

A `<form method="dialog">` submit closes the dialog automatically and sets
`dialog.returnValue` to the clicked button's `value` — read it in the
`close` handler instead of wiring individual `onClick` handlers per button.

## Styling the Backdrop

```css
dialog::backdrop { background: rgb(0 0 0 / 0.5); }
```

The backdrop is a real pseudo-element the browser manages — don't render a
separate absolutely-positioned overlay `<div>` behind it, that duplicates
what `::backdrop` already provides and can desync from the dialog's actual
open state.

## Hard Rules

- Open with `showModal()`, never `.show()` or the `open` attribute directly — those skip the backdrop, focus trap, and inert background.
- Read the result of a form-based close from `dialog.returnValue`, not from separate per-button click handlers.
- Style the backdrop with `::backdrop` — don't render a duplicate overlay element.
