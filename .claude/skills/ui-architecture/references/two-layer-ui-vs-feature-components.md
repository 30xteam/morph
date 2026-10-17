# Scenario 10 — Two-layer `ui/` (generic) vs. feature-owned components

A lighter-weight variant seen in small-to-medium React + TypeScript + Tailwind codebases:
there's a clean generic `ui/` layer, but the app hasn't (yet) adopted a domain-folder
structure (screaming architecture) or a full slicing methodology (FSD). This scenario also
covers migrating *away* from a flat catch-all "app-specific components" bucket.

## Detection signals
- `src/ui/` (or `ui/`) exists as a self-contained layer of generic, reusable components
  (button, input, badge, layout wrappers) with an explicit or implicit rule of "no business
  logic in here" — could plausibly be extracted to an npm package unchanged.
- Everything that ISN'T generic lives either flat under a single bucket
  (`core/components/`, `app/components/`) or is scattered ad hoc per route/page.
- No top-level domain folders (`auth/`, `billing/`...) — if those exist, you're actually in
  scenario 3/4 (screaming) or 5 (FSD); this scenario is what a repo looks like *before* that
  split happens.

## Core rule for the generic half

| Directory | Purpose | Rule |
|-----------|---------|------|
| `ui/` | Generic, reusable components | Zero business logic. Could be an npm package. |

**Belongs in `ui/`?**
- Works in any app regardless of branding
- Only handles visual/layout concerns
- Configurable via props/slots, no business rules baked in

**Does NOT belong in `ui/`?**
- Has app-specific text, logo, or branding
- Knows about app routes, roles, or business entities
- Uses auth state, or any business-specific hook/provider

## Where business/app-specific components go — deliberately NOT a single bucket

The original version of this pattern puts everything non-generic into one flat folder
(`core/components/`). **Avoid that.** A single "everything app-specific" bucket recreates the
same junk-drawer problem as Scenario 2 (flat `components/`): it hides which feature owns a
component, and it grows without bound since nothing routes things into it by domain.

Instead, place business/app-specific components using the same vertical-slice principle as
the rest of this skill:
- If the repo already has feature/domain folders (`libs/<feature>/`, `features/<feature>/`,
  or similar) → the component goes there, next to that feature's services/hooks/types (see
  scenario 3/4/5).
- If the repo doesn't have that structure yet and is small → colocate the component with the
  route/page that owns it (`app/<route>/_components/`, `pages/<route>/components/`), not in a
  shared bucket. This keeps ownership visible and makes the eventual move to a feature-folder
  structure a matter of relocating an already-scoped group of files, not untangling a flat pile.

## Three-layer form of the same idea

Once a repo does adopt feature/domain folders, this two-layer split naturally becomes the
three-layer split already documented in scenarios 3/4:

| Layer | Directory | Knows about |
|---|---|---|
| Primitives | `design-system/` (or `ui/`) | Nothing — buttons, icons, theming tokens. |
| Layout compositions | `ui/` (or `ui/layout/`) | The app's shell (header, sidebar, modal, toolbar) — but no domain/feature. |
| Feature UI | `libs/<feature>/components/` (or `app/<feature>/_components/`) | The domain. |

Test for the middle layer: a component belongs there if it composes primitives into an
app-shaped layout (a `<Toolbar>`, a `<ShellLayout>`) but would be identical regardless of
which feature is currently active. If it branches on *which* feature or route it's rendering
for, it belongs one layer down, inside that feature.

## Layout composition pattern (middle layer example)

```tsx
// ui/layouts/main-layout.tsx
export default function MainLayout() {
  const headerConfig = useHeaderConfig();
  const Logo = headerConfig.logo;
  const Actions = headerConfig.actions;

  return (
    <div className="h-screen bg-gray-100 w-full flex flex-col px-10 pt-4 overflow-hidden">
      <Header logo={<Logo />} actions={Actions ? <Actions /> : null} />
      <main className="flex-1 flex flex-col overflow-hidden px-10 py-8">
        <Outlet />
      </main>
    </div>
  );
}
```

This is layout composition, not a feature: it doesn't know or care which route rendered
inside `<Outlet />`. That's what keeps it in the middle layer instead of a feature folder.

## Anti-pattern: business logic leaking into `ui/`

```tsx
// ❌ Business logic in ui/
export function Search() {
  const { patients } = usePatients(); // business logic in ui/ — WRONG
  return <input />;
}

// ✅ Generic component + feature-owned wrapper
// ui/input/input.tsx
export function Input(props: InputProps) { return <input {...props} />; }

// libs/patients/components/patient-search.tsx (or app/patients/_components/)
export function PatientSearch() {
  const { patients } = usePatients();
  return <Input placeholder="Search patients..." />;
}
```

Rule of thumb: features import from `ui/`. `ui/` never imports from a feature.

## Practical check before creating a new `ui/` component

Before adding a new generic primitive, check the existing inventory in `ui/` — small codebases
tend to accumulate near-duplicate buttons/inputs because nobody checked what already exists.
List the folder (`ls src/ui/`) or grep for the primitive name before writing a new one.

## Hard rules

- `ui/` components must have zero business logic — no data fetching, no auth checks, no
  reads from a business-specific store/context.
- Any component that reads auth state, app routes, or a business entity goes in its feature's
  folder, not in a shared bucket — flat or otherwise.
- Check the existing `ui/` inventory before creating a new primitive.
