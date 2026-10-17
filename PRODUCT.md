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
- Interface language: **English**.
- Base infrastructure is in place but has no product features yet: data fetching, modals, the HTTP client and the auth skeleton. Auth has no provider or flows yet.

## Brand Commitments

- **Name:** none yet. "Webapp" in `src/core/config/site.ts` is a placeholder and must not be treated as a brand.
- **Aesthetic:** the Notion-inspired visual language in `DESIGN.md` is a binding brand commitment, not just a starting point. That means a clean, minimalist, content-first look with generous whitespace and a single confident blue action color.
- **Typography:** a single sans family. The proprietary NotionInter is replaced by Inter.

## Evidence on Hand

None. There are no testimonials, customers, metrics, press, logos or product imagery. Future work must not fabricate any of these.

## Product Principles

1. Content first: the interface steps back so content and data lead.
2. Clarity over decoration: every visual element must earn its place.
3. Accessible by default: no surface ships below the accessibility bar.
4. Never claim what doesn't exist yet: no invented features, proof or names until they are confirmed.

## Accessibility & Inclusion

WCAG 2.2 AA is mandatory on every surface. That means 4.5:1 contrast for normal text and 3:1 for large text, visible focus states, 44×44px minimum touch targets, and respect for `prefers-reduced-motion`.
