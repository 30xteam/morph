# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Undecided. The primary user, their situation and the job the product does for them are not defined yet. Do not invent personas.

## Product Purpose

A prototype for the 30X Jev challenge, served at `/`: Jev decides the right 30X program, affinity and traffic light for each profile in 30X's anonymized sample and for simulated Luma sign-ups, re-decides when the person changes, and hands low-confidence cases to a human review queue. See `docs/playbook.md`.

## Positioning

Undecided. No differentiating mechanism or claim has been stated, so future work must not make one up.

## Capabilities and Constraints

- Next.js 16 App Router (Cache Components), React 19, TypeScript 7, Tailwind 4. See `CLAUDE.md` for the full stack.
- `DESIGN.md` is the source of truth for visual tokens. It compiles to CSS through `pnpm design:sync`, and components only use semantic utilities from `src/design/theme.css`.
- Interface languages: **English** (default) and **Spanish**, switched in the UI. CRM values arrive in Spanish and are translated for display.
- Base infrastructure is in place but has no product features yet: data fetching, modals, the HTTP client and the auth skeleton. Auth has no provider or flows yet.

## Brand Commitments

- **Name:** **Morph**, set in `src/core/config/site.ts`. The logo is `MorphLogo` / `MorphMark` in `src/ui/logo/`: three shapes in a row, a circle, a rounded square and a square, getting more solid from left to right, in the accent color. Use the components; never redraw the mark.
- **Aesthetic:** the dark-first operator console from the Figma file "30x 2" (frame 10:29), recorded in `DESIGN.md`, is binding: zinc neutrals, hairline panes and one emerald for selection and action, with a light theme that mirrors it.
- **Typography:** a single sans family, Inter.

## Evidence on Hand

None. There are no testimonials, customers, metrics, press, logos or product imagery. Future work must not fabricate any of these.

## Product Principles

1. Content first: the interface steps back so content and data lead.
2. Clarity over decoration: every visual element must earn its place.
3. Accessible by default: no surface ships below the accessibility bar.
4. Never claim what doesn't exist yet: no invented features, proof or names until they are confirmed.

## Accessibility & Inclusion

WCAG 2.2 AA is mandatory on every surface. That means 4.5:1 contrast for normal text and 3:1 for large text, visible focus states, 44×44px minimum touch targets, and respect for `prefers-reduced-motion`.
