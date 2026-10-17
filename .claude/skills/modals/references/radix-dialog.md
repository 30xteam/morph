# Radix Dialog

A headless, accessible dialog primitive — focus trapping, scroll locking,
`Escape`-to-close, and correct ARIA roles come built in, with zero visual
styling imposed. This is the actual dialog implementation most design
systems (including shadcn/ui) are built on — pair it with
`nice-modal-react` for the imperative "open from anywhere" registry (see
`modals/SKILL.md`), it doesn't replace that concern, it solves a different
one (accessibility/behavior vs. imperative control).

## Composition

```tsx
<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
  <Dialog.Trigger asChild><button>Delete</button></Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6">
      <Dialog.Title>Delete this item?</Dialog.Title>
      <Dialog.Description>This can't be undone.</Dialog.Description>
      <Dialog.Close asChild><button>Cancel</button></Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

Every piece of chrome (overlay, content, title) is a separate primitive you
compose and style — Radix ships zero default CSS, so the visual design is
entirely the project's `ui/` layer's job.

## Always Include `Title` and `Description`

```tsx
// ❌ — screen readers announce "dialog" with no context
<Dialog.Content><p>Delete this item?</p></Dialog.Content>

// ✅ — Dialog.Title is what a screen reader announces on open
<Dialog.Content>
  <Dialog.Title>Delete this item?</Dialog.Title>
  <Dialog.Description>This can't be undone.</Dialog.Description>
</Dialog.Content>
```

If the design has no room for a visible title, use `VisuallyHidden` around
`Dialog.Title` rather than omitting it — omitting it is an accessibility
regression, not a styling choice.

## Controlled vs. Uncontrolled

Pass `open`/`onOpenChange` (controlled) when something outside the trigger
needs to open it too (e.g. `nice-modal-react`'s `modal.visible`); let
`Dialog.Root` manage its own open state uncontrolled when a single
`Dialog.Trigger` is the only way to open it.

## Hard Rules

- Every `Dialog.Content` includes a `Dialog.Title` — wrap it in `VisuallyHidden` rather than omit it if it shouldn't render visibly.
- Use the controlled `open`/`onOpenChange` form whenever the dialog can be opened from somewhere other than its own `Dialog.Trigger`.
- Style through the composed primitives (`Overlay`, `Content`, …) — Radix provides zero default styling by design, that's not a bug to work around.
