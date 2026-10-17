---
version: alpha
name: Notion
description: Clean, minimalist, content-first workspace aesthetic with a confident blue action color.
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
# Extension groups (not in the DESIGN.md spec yet; accepted by the linter and compiled by design:sync)
shadows:
  none: none
  nav: "rgba(0, 0, 0, 0) 0px 1px 0px 0px"
  dropdown: "rgba(0, 0, 0, 0.01) 0px 0.175px 1.041px 0px, rgba(0, 0, 0, 0.02) 0px 0.8px 2.925px 0px, rgba(0, 0, 0, 0.027) 0px 2.025px 7.847px 0px, rgba(0, 0, 0, 0.04) 0px 4px 18px 0px"
  modal: "rgba(0, 0, 0, 0.2) 0px 2px 7px 0px"
  elevated: "rgba(0, 0, 0, 0.04) 0px 4px 18px 0px, rgba(0, 0, 0, 0.027) 0px 2.025px 7.84688px 0px, rgba(0, 0, 0, 0.02) 0px 0.8px 2.925px 0px, rgba(0, 0, 0, 0.01) 0px 0.175px 1.04062px 0px, rgba(255, 255, 255, 0.6) 0px 0px 1px 0px"
  search: "rgba(0, 0, 0, 0.016) 0px 0.7px 1.462px 0px, rgba(0, 0, 0, 0.03) 0px 3px 9px 0px"
z-index:
  base: 1
  raised: 2
  floating: 3
  popover: 4
  dropdown: 10
  sticky: 100
  sticky-high: 500
  modal: 1000
breakpoints:
  tablet: 640px
  desktop: 1024px
  wide: 1440px
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

# Design System Inspired by Notion

> **Source of truth.** The YAML front matter above follows the
> [DESIGN.md spec](https://github.com/google-labs-code/design.md) and is compiled into CSS by
> `pnpm design:sync`. The prose below explains how to apply the tokens. `shadows`, `z-index` and
> `breakpoints` are extension groups (the spec has no token group for them yet).
>
> **Font note:** the original system uses the proprietary `NotionInter`. This project substitutes
> **Inter** (its open-source base), loaded in `src/design/fonts.ts`.

## Overview

Notion's design system embodies a modern, collaborative, and intelligent workspace aesthetic. The visual personality is clean and minimalist, with purposeful use of bright accent colors that convey action and possibility. The design prioritizes clarity and usability through generous whitespace, subtle micro-interactions, and a carefully balanced neutral foundation that allows content and data to take center stage. The system communicates professionalism and innovation through its precise typography, accessible color contrasts, and intuitive component hierarchy. Playful touches—such as the diverse character avatars and colorful status badges—inject personality while maintaining enterprise-grade polish.

**Key Characteristics**
- Clean, minimalist aesthetic with purposeful whitespace
- Bright, confident primary blue as the dominant action color
- Accessible, high-contrast neutral palette grounded in black and white
- Modern, friendly typography using a single Inter family for consistency
- Subtle, layered shadows for depth without visual noise
- Data-forward design that prioritizes content legibility
- Collaborative energy through diverse, inclusive iconography
- Enterprise-ready with playful, human-centered details

## Colors

### Primary
- **Primary Blue** (`primary` · `#0075DE`): Dominant call-to-action color for primary buttons, links, and key interactive elements.
- **Primary Blue Light** (`primary-hover` · `#097FE8`): Hover state for primary actions and links.
- **Dark Blue** (`primary-active` · `#005BAB`): Pressed state, visited links, secondary button text.

### Accent Colors
- **Teal** (`accent-teal` · `#27918D`): Status indicators, badges, complementary UI.
- **Purple** (`accent-purple` · `#9849E8`): Secondary actions and special feature callouts.
- **Orange** (`accent-orange` · `#FF6D00`): Highlighted status and attention-drawing elements.
- **Sky Blue** (`accent-sky` · `#62AEF0`): Supporting hierarchy and background fills.
- **Deep Blue** (`accent-deep-blue` · `#1313BA`): Premium or high-priority states.
- **Dark Blue** (`accent-dark-blue` · `#005BAB`): Navigation and structural emphasis.

### Interactive
- **Primary Button** (`primary` / `on-primary`): Filled primary buttons and high-priority CTAs.
- **Secondary Button** (`secondary` · `#E6F3FE` / `on-secondary` · `#005BAB`): Soft secondary variant with a subtle blue tint.

### Neutral Scale
- **Black** (`on-surface` · `#000000`): Primary text, icons, and foreground elements.
- **Near Black** (`on-surface-soft` · `#31302E`): Warmed alternative to pure black for softer passages.
- **Dark Gray** (`on-surface-variant` · `#615D59`): Tertiary text and disabled states.
- **Medium Gray** (`on-surface-muted` · `#A39E98`): Placeholder text, hints, subtle UI.
- **Off White** (`surface-subtle` · `#F9F9F8`): Minimal background fill with warm undertone.
- **Light Gray** (`surface-muted` · `#F6F5F4`): Secondary background for subtle sections.
- **White** (`surface` · `#FFFFFF`): Primary background for main content areas and cards.

### Surface & Borders
- **Light Blue Surface** (`surface-accent` · `#F2F9FF`): Card and container background for airy sections.
- **Border Stroke** (`outline` · `rgba(0, 0, 0, 0.05)`): Card and container edges.
- **Input Border** (`outline-input` · `rgba(0, 0, 0, 0.08)`): Form inputs and interactive fields.

### Semantic / Status
- **Error / Danger** (`error` · `#F64932`): Errors, validation failures, destructive actions.
- **Warning** (`warning` · `#FFB110`): Warnings and cautionary notifications.
- **Success / Complete** (`success` · `#27918D`): Success confirmations and completed status.

## Typography

**Font stack:** `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif`

| Token | Size | Weight | Line Height | Use |
|------|------|--------|-------------|-----|
| `display-xl` | 96px | 600 | 100px | Hero headings, page titles |
| `display-lg` | 64px | 700 | 64px | Large hero headings |
| `headline-lg` | 54px | 700 | 56px | Section headings, major CTAs |
| `headline-md` | 42px | 700 | 48px | Subsection headings |
| `headline-sm` | 32px | 700 | 40px | Card headings, secondary headings |
| `title-lg` | 22px | 700 | 28px | Feature titles, h3 |
| `title-md` | 18px | 700 | 28px | h5, small headings |
| `body-md` | 16px | 400 | 24px | Body text, paragraphs |
| `label-md` | 16px | 500 | 24px | Emphasis within body, button labels |
| `body-sm` | 14px | 400 | 20px | Secondary text, labels |
| `label-sm` | 14px | 500 | 20px | Small labels |
| `caption` | 12px | 500 | 16px | List items, tiny labels, helper text |

### Principles
- **Hierarchy through weight and size:** 600–700 for headings, 400 for body, 500 for emphasis and UI labels.
- **Line height consistency:** 1.5× for body text (16px → 24px), proportional for display sizes.
- **Single family:** one typeface across the system reduces cognitive load.
- **Contrast and accessibility:** all text meets WCAG AA.
- **Responsive scaling:** reduce heading sizes 10–20% on mobile, preserve weight distinctions.

## Layout

### Spacing System
**Base unit:** `4px`. Scale: `4, 8, 12, 16, 20, 24, 28, 32, 36, 64, 80, 124px`.

- **Tight UI (forms, inputs):** `4px–12px`
- **Standard components (buttons, cards):** `16px` padding
- **Content sections:** `24px–32px`
- **Hero and marketing:** `64px–124px`

### Grid & Container
- **Max width:** `1440px`.
- **Columns:** 12-column grid on large layouts, fluid on small. Card grids 3–4 per row on desktop, 1 on mobile, `20px` gap.
- **Hero sections:** full width, `124px` top/bottom padding, centered content.
- **Content rows:** max-width container with `32px` side margin on desktop.

### Whitespace Philosophy
Generous whitespace is intentional and functional. Negative space reduces cognitive load and prioritizes content. Interior component padding is consistently `16px`; gaps between sections scale with hierarchy.

### Breakpoints

| Name | Width | Key Changes |
|------|-------|---|
| Mobile | < 640px | Single column, `12px` padding, headings −20%, stacked nav |
| Tablet | 640–1024px | Two-column cards, `16px` padding, `20–24px` spacing, hamburger menu |
| Desktop | 1024–1440px | Three-column grids, full spacing scale, full navigation |
| Wide | > 1440px | Four-column grids possible, container capped at `1440px` |

### Touch Targets
- Minimum `44 × 44px`; primary buttons ≥ `44px` tall on mobile.
- Inputs `44px` on mobile, `38px` on desktop; ≥ `8px` between clickable elements.

### Collapsing Strategy
- **Hero:** heading −15–20% on tablet, −25–30% on mobile (Display XL → Headline LG).
- **Grids:** 4 → 2 → 1 columns, `20px` gap at every size.
- **Spacing:** `64–80px` → `36–48px` tablet → `24–32px` mobile.
- **Body text** stays `16px` everywhere.

## Elevation & Depth

| Level | Treatment | Use |
|-------|-----------|-----|
| 1 | none | Flat backgrounds, neutral surfaces |
| 2 | `rgba(0,0,0,0) 0 1px 0 0` | Navigation bars, subtle borders |
| 3 | `rgba(0,0,0,0.01) 0 0.175px 1.041px, rgba(0,0,0,0.02) 0 0.8px 2.925px, rgba(0,0,0,0.027) 0 2.025px 7.847px, rgba(0,0,0,0.04) 0 4px 18px` | Dropdowns, floating panels |
| 4 | `rgba(0,0,0,0.2) 0 2px 7px 0` | Modals, overlays |
| 5 | Level 3 + `rgba(255,255,255,0.6) 0 0 1px 0` | Custom elevated surfaces, soft glow |

**Shadow philosophy:** subtle multi-layer shadows with low-opacity black mimic natural light. Navigation is nearly flat, dropdowns lift gently, modals cast pronounced shadows. Most cards are shadow-free.

### Opacity Levels
`5%` hover tints · `10%` disabled backgrounds · `20%` modal scrim · `40%` disabled text · `50%` secondary icons · `80%` high-contrast secondary · `100%` primary text.

### Z-index
| Token | Value | Use |
|---|---|---|
| base | 1 | Content, cards |
| raised | 2 | Overlays above base content |
| floating | 3 | Tooltips |
| popover | 4 | Popovers, expanded menus |
| dropdown | 10 | Dropdowns, select popups |
| sticky | 100 | Sticky headers |
| sticky-high | 500 | Persistent overlays |
| modal | 1000 | Modals, dialogs (never exceed) |

## Shapes

| Token | Value | Use |
|---|---|---|
| `none` | 0px | Structural elements, navigation bars |
| `sm` | 4px | Compact buttons, icon buttons |
| `input` | 5px | Form inputs, search fields |
| `input-lg` | 6px | Alternative input variant |
| `md` | 8px | Cards, primary buttons, most components |
| `full` | 9999px | Pills, badges, avatars |

Rounded-top cards use `8px 8px 0 0`. Border widths: `1px` default, `2px` for emphasis/active.

## Components

### Buttons
- **Primary:** `primary` bg, `on-primary` text, `label-md`, `6px 15px`, radius `md`, height `38px`. Hover → `primary-hover`; active → `primary-active`; disabled → `disabled` bg + `on-disabled` text, `cursor: not-allowed`.
- **Secondary:** `secondary` bg, `on-secondary` text, same metrics. Hover → `secondary-hover`; active → `secondary-active` + `on-secondary-active`.
- **Ghost:** transparent, `on-surface-default` text, `body-md`, height `36px` (or `30px` compact, `5px 10px`, radius `sm`). Hover → `state-hover`; active → `state-pressed`. Never bordered.
- **Icon:** transparent, `on-surface-icon`, padding `11px`, radius `sm`. Hover → `state-hover` + `on-surface-default`.

### Cards & Containers
- **Accent card:** `surface-accent` bg, `1px solid outline`, radius `md`, padding `16px`, no shadow.
- **Neutral card:** no background, no border, no padding.
- **Rounded-top card:** radius `8px 8px 0 0`, used for media headers.

### Inputs & Forms
- **Text input:** `surface` (or transparent) bg, `on-surface-strong` text, `body-md`, `1px solid outline-input`, radius `input-lg`, height `44px`, padding `11px 12px` (`7px 10px 7px 30px` with leading icon).
- **Focus:** border `primary` + soft blue ring. **Disabled:** `state-hover` bg, `on-disabled` text.
- **Search variant:** adds shadow `rgba(0,0,0,0.016) 0 0.7px 1.462px, rgba(0,0,0,0.03) 0 3px 9px`.

### Navigation
- **Top bar:** `surface` bg, `on-surface-default` text, height `64px`, elevation level 2. Nav item hover → `primary` text.

### Links
- **Primary link:** `link` text, `body-md`; hover → `link-hover` + underline; visited → `link-visited`.
- **Small link:** `caption` size, weight 500; hover → `link-hover` + underline.

## Do's and Don'ts

### Do
- Use `primary` for all primary CTAs.
- Keep `16px` padding inside cards and containers.
- Layer shadows intentionally: base elements flat, only floating UI elevated.
- Pair display tokens with heroes, headline tokens with feature titles, `body-md` for paragraphs.
- Use `32px–64px` between major sections.
- Apply `8px` radius to most interactive components.
- Check contrast: WCAG AA (4.5:1 normal, 3:1 large text).
- Map status colors to their semantic meaning (error, warning, success).

### Don't
- Don't put pure black text on colored backgrounds without checking contrast; prefer `on-surface-default` or white.
- Don't overuse accent colors; reserve them for badges, status, secondary features.
- Don't add shadows to flat UI that doesn't float.
- Don't mix font families.
- Don't compress hero whitespace (`64px–124px` is intentional).
- Don't invent button sizes; use `38px` (primary/secondary) and `36px` (ghost).
- Don't use radii below `4px` except structural `0`.
- Don't exceed z-index `1000`.

## Agent Prompt Guide

1. Never hardcode a color, size, radius or shadow in a component — use the semantic Tailwind utilities defined in `src/design/theme.css` (e.g. `bg-primary`, `text-fg-muted`, `rounded-md`, `shadow-dropdown`, `text-body-md`).
2. If a value you need does not exist, add it here (front matter) first, run `pnpm design:sync`, then map it in `theme.css`.
3. Primary buttons: `primary` bg, white text, `label-md`, `6px 15px`, radius `md`, `38px` high.
4. Section spacing: `32px` comfortable → `64px` emphatic → `80–124px` hero; ×0.5–0.75 on mobile.
5. Z-index ladder: 1 → 10 → 100 → 500 → 1000. Restructure the DOM instead of going higher.
