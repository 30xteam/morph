# Webapp

Next.js 16 (App Router, Cache Components) + React 19 + TypeScript 7 + Tailwind CSS 4.
The visual design is driven entirely by [`DESIGN.md`](./DESIGN.md).

## 30X challenge: Live segments

**Metrics** (`/#metrics`) is a live snapshot of loaded profiles, filtered by CRM/Luma/all: evaluation coverage, unresolved human reviews, activity signals, priority distribution and latest recommended programs. Priority percentages use all scoped profiles (including not evaluated); program percentages use only evaluated profiles. Recorded decision runs/cost and median/p95 latency use every stored successful run in the source, including re-evaluations; percentiles use nearest rank. Review completion is operational workload, not model accuracy. Providers and calibrated-run coverage are explicit. No conversions, revenue, daily trends or billing reconciliation are inferred. Browser decision history resets on reload; the server-memory Luma demo feed may replay available entries.

Every loaded person has a commercial priority derived from their latest decision: **P1 High** (green: contact today), **P2 Medium** (yellow: follow up/nurture), **P3 Low** (red: qualify fit/information before outreach), or **Not evaluated** until Jev runs. Human review stays separate from commercial priority. The table defaults to priority order; Graph shows priority codes, colors and node sizes, with a priority filter. The graph side panel and profile dialog explain the level. No extra model call or numeric score is introduced.

Switch **Table / Graph** above Sign-ups to explore the live CRM and Luma profiles as a force-directed network of people, programs and declared interests. Drag nodes or the background, scroll or use the zoom buttons, and select nodes with the pointer or keyboard. The side panel lists neighbors and opens the existing profile dialog; **Show local graph** isolates a node and its immediate connections. Search matches person aliases, programs and interests. Solid links represent declared interests or CRM programs; dashed links use the latest Jev recommendation. New Luma profiles and profile edits update both views. The layout settles automatically, can be paused, and respects reduced-motion preferences. This view uses the profiles currently loaded in the dashboard (24 CRM profiles initially), not all 697 evaluation profiles.

A working prototype for the 30X Jev challenge (Commercial area), served at `/`. It runs on 30X's
anonymized sample of 697 real profiles (categories only). For each one, [Jev](https://typesafe.ai),
TypeSafe's typed decision model, answers six typed questions in one call: which 30X program fits
(AI Sales, Inmersión Ejecutiva, Sales Machine, Hardcore AI, Achievers or none), affinity, role when
the CRM does not have it, ready to buy, decision power and learning intent. Code turns the answers
into a traffic light: **green** goes to a seller with the program to offer, **yellow** gets a
nurture sequence, **red** is reviewed by a person. Decisions are re-made when the person checks in
at an event, changes role or their company raises a round.

- App: `/` (`/preview` and `/segmentation` redirect there) · Playbook: [`docs/playbook.md`](./docs/playbook.md)
- APIs: `POST /api/segment` (`{ profile, trigger }`), `POST /api/segment/evaluate` (`{ mode:
  'single' | 'consensus', limit? }`, 697 profiles vs 30X's own labels), `POST /api/segment/simulate` (`{ days }`).
- **Luma, simulated end to end (no Luma account needed):** `POST /api/luma/webhook` behaves like a
  production Luma webhook. It verifies the HMAC `webhook-signature` (`t=…,v1=…` over
  `timestamp.body`, secret `LUMA_WEBHOOK_SECRET`), rejects forged or stale requests (401), ignores
  replays by `webhook-id`, handles `guest.registered` (new segment) and `guest.updated` with
  `checked_in_at` (re-decides as "attended event"), and drops name and email before Jev. Fictional
  guests (`@example.com`) come from **Start Luma sign-ups** on the dashboard or from the terminal:
  `pnpm luma:simulate --count 20 --every 2 [--kind registration|check_in|auto] [--replay] [--tamper]`.
  The dashboard polls `GET /api/luma/feed`. The feed lives in server memory, enough for a
  single-process demo; production would store it in a database.
- Recalculate: `POST /api/segment/recalculate` (`{ profile, previous }`) returns the previous and current outcomes plus changes to role, program, affinity, light and action. Actions use program confidence: auto >= 0.8, review >= 0.55, otherwise escalate.
- Evaluation from the terminal (dev server running): `pnpm jev:smoke`, `pnpm jev:eval [--consensus]`,
  `pnpm jev:simulate [--days 30]`, `pnpm jev:states` (auto / review / escalate in mock mode) and
  `pnpm jev:raw` (one direct TypeSafe call saved without keys). Reports and the 12:00 cut-off rule live in
  [`docs/evaluation/`](./docs/evaluation/README.md).
- No personal data: the sample has no names or emails; Luma guest names are fictional and never reach Jev.

| `JEV_PROVIDER`   | What it does                                                                   |
| ---------------- | ------------------------------------------------------------------------------ |
| `mock` (default) | Keyword heuristic, runs offline with no key, so anyone can run the demo        |
| `typesafe`       | Real Jev via `https://api.typesafe.ai/v1/systemone` (needs `TYPESAFE_API_KEY`) |
| `openrouter`     | A chat model emulates the answers (needs `OPENROUTER_API_KEY`); not calibrated |

## Getting started

```bash
pnpm install
cp .env.example .env.local   # set JEV_PROVIDER and a key to use real Jev
pnpm dev                     # http://localhost:3000/segmentation
```

## Scripts

| Script                         | What it does                                                                        |
| ------------------------------ | ----------------------------------------------------------------------------------- |
| `pnpm dev` / `build` / `start` | Next.js                                                                             |
| `pnpm lint` / `lint:fix`       | oxlint                                                                              |
| `pnpm format` / `format:check` | oxfmt (Prettier-compatible, sorts imports + Tailwind classes)                       |
| `pnpm typecheck`               | `tsc --noEmit` (TypeScript 7)                                                       |
| `pnpm check`                   | lint + format check + typecheck (runs on pre-commit)                                |
| `pnpm design:sync`             | Compiles `DESIGN.md` → `src/design/tokens.generated.css` and validates the contract |
| `pnpm design:lint`             | Lints `DESIGN.md` against the spec (structure, WCAG contrast)                       |

Commits follow [Conventional Commits](https://www.conventionalcommits.org) (enforced by commitlint).

## Changing the design

The design system has three layers, so components never change when the design does:

```
DESIGN.md (front matter tokens)
   │  pnpm design:sync
   ▼
src/design/tokens.generated.css   --ds-* raw values (generated, never edit)
   │
   ▼
src/design/theme.css              semantic roles → Tailwind utilities (bg-primary, text-fg-muted, …)
   │
   ▼
components                        only use semantic utilities
```

- **Tweak a color / size / radius / shadow:** edit the value in `DESIGN.md`, run `pnpm design:sync`.
- **Change the font:** set `fontFamily` in `DESIGN.md`, load it in `src/design/fonts.ts` with
  `variable: '--font-<slug>'` (e.g. `Space Grotesk` → `--font-space-grotesk`), run `pnpm design:sync`.
- **Swap in a whole new DESIGN.md:** replace the file, run `pnpm design:sync`. If the new file uses
  different token names, the command lists every role it can't resolve. Remap those lines in
  `src/design/theme.css` and you're done.

`DESIGN.md` follows the [DESIGN.md spec](https://github.com/google-labs-code/design.md). Token groups the
spec can't hold (`shadows`, `motion`, `zIndex`, `breakpoints`) live in the Impeccable sidecar
`.impeccable/design.json` under `extensions`. A group defined directly in `DESIGN.md` takes precedence.

## Project structure

```
src/
├── app/                 # Routes only (thin pages, layouts)
├── core/                # App-level infra: config, cx, http (+ server/), query, providers
├── design/              # Tokens, theme contract, fonts, motion
└── features/<feature>/  # Self-contained modules exposed through index.ts
```

## Agent skills

Project skills live in `.claude/skills/` (Noxen, Emil Kowalski, Impeccable). See `CLAUDE.md`.
After cloning, run `/impeccable init` once in Claude Code to set up Impeccable's design context.
