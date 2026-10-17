---
version: alpha
name: Quiet Workspace
description: A Notion-inspired, content-first workspace where the interface steps back and blue appears only where there is an action.
colors:
  # Brand / action
  primary: "#0075DE"
  primary-hover: "#097FE8"
  primary-active: "#005BAB"
  on-primary: "#FFFFFF"
  secondary: "#E6F3FE"
  secondary-hover: "#D6E8FD"
  secondary-active: "#C0DFFB"
  on-secondary: "#005BAB"
  on-secondary-active: "#003F7F"
  link: "#0075DE"
  link-hover: "#097FE8"
  link-visited: "#005BAB"
  # Accents (badges, status, feature callouts only)
  accent-teal: "#27918D"
  accent-purple: "#9849E8"
  accent-orange: "#FF6D00"
  accent-sky: "#62AEF0"
  accent-deep-blue: "#1313BA"
  accent-dark-blue: "#005BAB"
  # Surfaces
  surface: "#FFFFFF"
  surface-subtle: "#F9F9F8"
  surface-muted: "#F6F5F4"
  surface-accent: "#F2F9FF"
  # Content on surfaces
  on-surface: "#000000"
  on-surface-strong: "rgba(0, 0, 0, 0.95)"
  on-surface-default: "rgba(0, 0, 0, 0.898)"
  on-surface-soft: "#31302E"
  on-surface-variant: "#615D59"
  on-surface-muted: "#A39E98"
  on-surface-icon: "rgba(0, 0, 0, 0.6)"
  # Lines & overlays
  outline: "rgba(0, 0, 0, 0.05)"
  outline-input: "rgba(0, 0, 0, 0.08)"
  state-hover: "rgba(0, 0, 0, 0.05)"
  state-pressed: "rgba(0, 0, 0, 0.1)"
  disabled: "rgba(0, 0, 0, 0.1)"
  on-disabled: "rgba(0, 0, 0, 0.4)"
  scrim: "rgba(0, 0, 0, 0.2)"
  # Semantic
  error: "#F64932"
  warning: "#FFB110"
  success: "#27918D"
typography:
  display-xl:
    fontFamily: Inter
    fontSize: 96px
    fontWeight: 600
    lineHeight: 100px
    letterSpacing: 0px
  display-lg:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: 700
    lineHeight: 64px
    letterSpacing: 0px
  headline-lg:
    fontFamily: Inter
    fontSize: 54px
    fontWeight: 700
    lineHeight: 56px
    letterSpacing: 0px
  headline-md:
    fontFamily: Inter
    fontSize: 42px
    fontWeight: 700
    lineHeight: 48px
    letterSpacing: 0px
  headline-sm:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: 700
    lineHeight: 40px
    letterSpacing: 0px
  title-lg:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: 700
    lineHeight: 28px
    letterSpacing: 0px
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 700
    lineHeight: 28px
    letterSpacing: 0px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: 0px
  label-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 500
    lineHeight: 24px
    letterSpacing: 0px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0px
  label-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
    letterSpacing: 0px
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0px
rounded:
  none: 0px
  sm: 4px
  input: 5px
  input-lg: 6px
  md: 8px
  full: 9999px
spacing:
  "1": 4px
  "2": 8px
  "3": 12px
  "4": 16px
  "5": 20px
  "6": 24px
  "7": 28px
  "8": 32px
  "9": 36px
  "16": 64px
  "20": 80px
  "31": 124px
  container: 1440px
  gutter: 20px
  margin: 32px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: 6px 15px
    height: 38px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: 6px 15px
    height: 38px
  button-secondary-hover:
    backgroundColor: "{colors.secondary-hover}"
  button-secondary-active:
    backgroundColor: "{colors.secondary-active}"
    textColor: "{colors.on-secondary-active}"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.on-surface-default}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 6px 15px
    height: 36px
  button-ghost-hover:
    backgroundColor: "{colors.state-hover}"
  card-accent:
    backgroundColor: "{colors.surface-accent}"
    textColor: "{colors.on-surface-default}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 16px
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-strong}"
    typography: "{typography.body-md}"
    rounded: "{rounded.input-lg}"
    padding: 11px 12px
    height: 44px
  nav-bar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-default}"
    height: 64px
---

# Design System: Quiet Workspace

> Tokens in the front matter are normative and compile to CSS with `pnpm design:sync`. Shadows, motion,
> z-index and breakpoints, which the DESIGN.md schema can't hold, live in `.impeccable/design.json`
> under `extensions`. Inter stands in for the proprietary NotionInter.

## Overview

**Creative North Star: "The Quiet Workspace"**

A room where the furniture disappears so the work can be seen. The interface is paper and ink: warm whites, near-black text, and hairline structure that you notice only when you look for it. Color is not decoration here. One confident blue marks every place you can act, and almost nothing else is allowed to compete with it.

Depth comes from tone, not from light. Sections separate by stepping between Paper White, Warm Paper and Morning Sky rather than by casting shadows; only things that genuinely float above the page (menus, dialogs) earn a shadow, and even then it is a soft, layered whisper. Components are refined and restrained: generous breathing room, gentle 8px corners, hover expressed as a faint tint instead of a border or a lift.

The personality is calm, competent and human: generous whitespace and a firm typographic ladder do the organizing, so the page never needs ornament to feel finished.

**Key Characteristics:**
- Paper-and-ink neutrals with a warm undertone; pure white is the canvas.
- A single action color (Signal Blue) that stays rare.
- Depth through tonal layering; shadows reserved for floating layers.
- One sans family, hierarchy carried by size and weight steps.
- Generous whitespace; dense only where data demands it.
- Quiet, tint-based interaction states.

## Colors

A warm paper-and-ink neutral world with one decisive blue and a small, disciplined set of accents.

### Primary
- **Signal Blue** (`primary`): every primary call to action, links, focus rings and the selected state. The one color that means "you can do something here".
- **Bright Signal Blue** (`primary-hover`): the hover state of Signal Blue elements and links.
- **Deep Harbor Blue** (`primary-active`): the pressed state, visited links and the text on Mist Blue buttons.

### Secondary
- **Mist Blue** (`secondary`): the soft secondary button and quiet selected backgrounds. It carries Deep Harbor Blue text (`on-secondary`).

### Tertiary (accents)
- **Lagoon Teal** (`accent-teal`), **Iris** (`accent-purple`), **Ember** (`accent-orange`), **Sky** (`accent-sky`), **Cobalt** (`accent-deep-blue`), **Harbor** (`accent-dark-blue`): badges, status chips, avatars and feature callouts only. Never body text, never large fills.

### Neutral
- **Paper White** (`surface`): the canvas for content, cards and the nav bar.
- **Warm Paper** (`surface-subtle`): the first tonal step for quiet sections.
- **Linen** (`surface-muted`): the second tonal step for grouped or inset areas.
- **Morning Sky** (`surface-accent`): an accent-tinted layer for highlighted cards and callouts.
- **Ink** (`on-surface`, `on-surface-strong`, `on-surface-default`): headings and body copy. Default body text sits at 90% ink.
- **Warm Charcoal** (`on-surface-soft`): softer long-form passages.
- **Graphite Taupe** (`on-surface-variant`): secondary text and metadata (passes AA on Paper White).
- **Pebble** (`on-surface-muted`): placeholders and disabled hints only (2.7:1, never readable copy).
- **Hairline** (`outline`, `outline-input`): 5% and 8% ink strokes for containers and fields.

### Status
- **Alert Coral** (`error`), **Marigold** (`warning`), **Lagoon Teal** (`success`): semantic states only, always paired with an icon or a text label.

### Named Rules
**The One Blue Rule.** Signal Blue appears only where there is an action, a link or focus. If something is blue and you can't click it, it shouldn't be blue.

**The Ink Ladder Rule.** Text hierarchy steps down Ink → Warm Charcoal → Graphite Taupe. Pebble is for placeholders, never for words someone must read.

**The Accent Quarantine Rule.** Accents live inside badges, chips and small callouts. They never become backgrounds of whole sections or text colors.

## Typography

**Display Font:** Inter (with -apple-system, Segoe UI, Helvetica Neue, sans-serif)
**Body Font:** Inter (same stack)

**Character:** a single neutral, highly legible sans. Hierarchy comes from decisive size and weight steps (400 body, 500 labels, 600–700 headings), never from a second family.

### Hierarchy
- **Display** (`display-xl` 600, `display-lg` 700): hero statements, one per page.
- **Headline** (`headline-lg`, `headline-md`, `headline-sm`, 700): section and card headings.
- **Title** (`title-lg`, `title-md`, 700): feature titles and small headings.
- **Body** (`body-md`, `body-sm`, 400): paragraphs, capped at 65–75ch.
- **Label** (`label-md`, `label-sm`, 500; `caption` 500): buttons, form labels, metadata and helper text.

### Named Rules
**The Single Voice Rule.** One family, everywhere. A new mood comes from size and weight, not from a new font.

**The Step Down Rule.** On mobile, headings drop 20–30% (Display → Headline). Body stays at 16px on every screen.

## Layout

A centered, max-width canvas (`spacing.container`) on a strict 4px rhythm (`spacing.1`). Components breathe at 16px inside; sections separate at 32–64px; heroes take 80–124px of vertical air on desktop. The gutter between cards in a grid is `spacing.gutter`, and the desktop side margin is `spacing.margin`.

Responsive behavior (breakpoints live in the sidecar): one column under 640px, two columns from 640px (tablet), three from 1024px (desktop), up to four above 1440px (wide). Large vertical gaps contract by about half on mobile, and touch targets never fall below 44×44px.

**The Breathing Room Rule.** When in doubt, add space rather than a divider. Whitespace is the primary grouping device.

## Elevation & Depth

This is a tonal system. At rest every surface is flat, and layers are told apart by stepping between Paper White, Warm Paper, Linen and Morning Sky, plus a 5% ink hairline where an edge must be explicit. Shadows exist only for layers that physically float over the page, and they are multi-layer, low-opacity and soft (see `extensions.shadows` in the sidecar: `dropdown`, `modal`, `elevated`, `search`).

**The Tint Before Shadow Rule.** To separate two things, change the surface tone first. Reach for a shadow only if the element actually floats (menu, popover, dialog).

**The No Lift Rule.** Cards and buttons never lift or gain a shadow on hover. Hover is a tint.

## Shapes

Gentle, consistent rounding. Most components use 8px (`rounded.md`); compact controls and icon buttons use 4px (`rounded.sm`); fields use 5–6px (`rounded.input`, `rounded.input-lg`); badges, pills and avatars are fully round. Media-topped cards round only their top corners. Strokes are 1px by default and 2px only to mark an active or emphasized state. Nothing goes below 4px except deliberate structural zero (nav bars, full-bleed bands).

## Components

### Buttons
- **Shape:** gently curved (8px), 38px tall, `6px 15px` padding, `label-md`.
- **Primary:** Signal Blue with white text. Hover → Bright Signal Blue; pressed → Deep Harbor Blue. No border, no shadow.
- **Secondary:** Mist Blue with Deep Harbor Blue text, deepening one tint per state.
- **Ghost:** transparent with 90% ink text; hover adds a 5% ink tint and pressed a 10% tint. Never bordered.
- **Focus:** a visible Signal Blue focus ring on every variant.
- **Disabled:** 10% ink fill with 40% ink text and `cursor: not-allowed`.

### Cards / Containers
- **Corner Style:** 8px.
- **Background:** Paper White, or Morning Sky for highlighted cards.
- **Shadow Strategy:** none. Separation comes from tone (see Elevation & Depth).
- **Border:** a 5% ink hairline only when the card sits on the same tone.
- **Internal Padding:** 16px (12px on tablet, 8px on tight mobile layouts).

### Inputs / Fields
- **Style:** Paper White fill, 8% ink hairline, 6px corners, 44px tall, `body-md` text.
- **Focus:** the border turns Signal Blue and a soft blue ring appears.
- **Error / Disabled:** Alert Coral border plus a helper message; disabled uses a 5% ink fill with 40% ink text.

### Navigation
- **Style:** a 64px Paper White bar with no shadow (a hairline only when content scrolls under it). Items are 90% ink and turn Signal Blue on hover. On tablet and mobile they collapse behind a menu button, and the primary CTA stays visible.

### Links
- Signal Blue at rest; Bright Signal Blue with an underline on hover; Deep Harbor Blue once visited.

## Do's and Don'ts

### Do:
- **Do** reserve Signal Blue for actions, links and focus (The One Blue Rule).
- **Do** separate regions by surface tone before reaching for borders or shadows.
- **Do** keep 16px padding inside cards and 32–64px between major sections.
- **Do** step text down the Ink Ladder and keep readable copy at or above 4.5:1 contrast.
- **Do** theme browser surfaces too: text selection, focus rings and caret from the palette.
- **Do** honor `prefers-reduced-motion` with an instant, already-visible default.

### Don't:
- **Don't** use Pebble (`on-surface-muted`) for any text someone must read.
- **Don't** put shadows on cards or buttons at rest or on hover.
- **Don't** use accents as section backgrounds or body text colors.
- **Don't** add a second typeface.
- **Don't** put an eyebrow or kicker label above a heading; the heading carries its own weight.
- **Don't** use radii under 4px (except structural 0) or invent button heights beyond 38px and 36px.
- **Don't** exceed z-index 1000; restructure the layering instead.
