---
version: alpha
name: Live Console
description: A dark-first, three-pane operator console where neutral zinc carries the structure and a single emerald marks selection and action.
colors:
  # Dark (default theme)
  canvas-dark: "#09090B"
  card-dark: "#111113"
  raised-dark: "#18181B"
  selected-dark: "#1F1F23"
  line-dark: "#27272A"
  line-strong-dark: "#3F3F46"
  ink-dark: "#FAFAFA"
  ink-soft-dark: "#A1A1AA"
  ink-muted-dark: "#8B8B94"
  icon-dark: "#71717A"
  accent-dark: "#34D399"
  primary-dark: "#047857"
  primary-hover-dark: "#065F46"
  bar-strong-dark: "#E4E4E7"
  bar-weak-dark: "#3F3F46"
  green-bg-dark: "#122319"
  green-fg-dark: "#7DD3A8"
  yellow-bg-dark: "#241E10"
  yellow-fg-dark: "#D9B866"
  red-bg-dark: "#2A1717"
  red-fg-dark: "#E39A9A"
  blue-fg-dark: "#7DB4E3"
  violet-fg-dark: "#B39DDB"
  review-bg-dark: "#1F1F23"
  review-fg-dark: "#A1A1AA"
  danger-dark: "#F87171"
  # Light
  canvas: "#FFFFFF"
  card: "#FAFAFA"
  raised: "#F4F4F5"
  selected: "#F4F4F5"
  line: "#E4E4E7"
  line-strong: "#D4D4D8"
  ink: "#09090B"
  ink-soft: "#52525B"
  ink-muted: "#63636B"
  icon: "#71717A"
  accent: "#059669"
  primary: "#047857"
  primary-hover: "#065F46"
  on-primary: "#FFFFFF"
  bar-strong: "#27272A"
  bar-weak: "#D4D4D8"
  green-bg: "#ECFDF5"
  green-fg: "#047857"
  yellow-bg: "#FEFCE8"
  yellow-fg: "#854D0E"
  red-bg: "#FEF2F2"
  red-fg: "#B91C1C"
  blue-fg: "#1D4ED8"
  violet-fg: "#6D28D9"
  review-bg: "#F4F4F5"
  review-fg: "#52525B"
  danger: "#B91C1C"
typography:
  logo:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: 800
    lineHeight: 27px
    letterSpacing: 0px
  title-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: 700
    lineHeight: 29px
    letterSpacing: 0px
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 700
    lineHeight: 22px
    letterSpacing: 0px
  title-sm:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: 600
    lineHeight: 21px
    letterSpacing: 0px
  label-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 600
    lineHeight: 19px
    letterSpacing: 0px
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: 400
    lineHeight: 18px
    letterSpacing: 0px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 600
    lineHeight: 17px
    letterSpacing: 0px
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 400
    lineHeight: 18px
    letterSpacing: 0px
  label-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
    letterSpacing: 0px
  label-xs:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 600
    lineHeight: 15px
    letterSpacing: 0px
  caption:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: 400
    lineHeight: 14px
    letterSpacing: 0px
  badge:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: 600
    lineHeight: 13px
    letterSpacing: 0.4px
rounded:
  none: 0px
  xs: 2px
  sm: 4px
  nav: 6px
  md: 8px
  lg: 10px
  full: 9999px
spacing:
  "1": 4px
  container: 1440px
  sidebar: 232px
  list: 440px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.md}"
    padding: 12px 18px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.md}"
    padding: 12px 18px
  status-badge:
    typography: "{typography.badge}"
    rounded: "{rounded.sm}"
    padding: 3px 8px
  card:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.lg}"
    padding: 18px 20px
  nav-item:
    typography: "{typography.label-sm}"
    rounded: "{rounded.nav}"
    padding: 8px 10px
---

# Design System: Live Console

> Tokens in the front matter are normative and compile to CSS with `pnpm design:sync`. Shadows, motion,
> z-index and breakpoints, which the DESIGN.md schema can't hold, live in `.impeccable/design.json`
> under `extensions`. Source: Figma "30x 2", frame `S1 · Live segments · Dark · EN` (node 10:29).

## Overview

**Creative North Star: "The Live Console"**

An operations console for people who sort hundreds of profiles a day. Three panes read left to right: where you are (sidebar), who is in it (list), what Jev decided and why (detail). The interface is near-black zinc with hairline structure; nothing glows except the one thing you are looking at. Dark is the default theme, light is its faithful inversion, and both share every role.

**Key Characteristics:**
- Zinc neutrals, 1px hairlines between panes and inside cards.
- One emerald: the selected row's edge, the active tab's underline and the primary action.
- Status reads as uppercase micro-badges with a tinted fill, always text plus color.
- Dense type (11–14px) with a firm weight ladder; one sans family.
- Cards are flat tinted panels with a hairline; only the selected row lifts.

## Colors

Every role exists twice: the plain token is light, the `-dark` token is dark. `src/design/theme.css` maps both
onto one semantic utility set (`bg-canvas`, `text-ink-muted`, `border-line`…) and switches on `data-theme`.

- **Canvas** (`canvas`): pane backgrounds. **Card** (`card`): grouped panels. **Raised** (`raised`): active nav item and active segment. **Selected** (`selected`): the open row.
- **Ink ladder** (`ink` → `ink-soft` → `ink-muted`): headings and values, labels and secondary copy, metadata. All three pass AA on every surface of their theme. `icon` is for 14px glyphs only.
- **Emerald** (`accent`): selection marks only (row edge, tab underline). **Primary** (`primary`): the one filled button. White text on it passes AA.
- **Status pairs** (`green-*`, `yellow-*`, `red-*`, `review-*`): badge fill and text. Never used outside a badge or a callout.
- **Bars** (`bar-strong`, `bar-weak` on a `line` track): the top choice in strong, alternatives weak.

**The One Emerald Rule.** Emerald means "this is selected" or "this is the action". It never decorates.

**The Readable Muted Rule.** Muted text is lifted from the Figma's #71717A to #8B8B94 in dark so metadata passes 4.5:1 on the selected row too.

## Typography

Inter only. Sizes step 24 / 18 / 17 / 16 / 15 / 14 / 13 / 12 / 11, weights 400 body, 500 labels, 600–700 titles, 800 for the wordmark. Badges are 11px (the Figma's 10px is lifted to the 11px legibility floor), 600, uppercase, 0.4px tracking.

## Layout

Desktop is three fixed columns: 232px sidebar, 440px list, fluid detail with 32px side padding. Each pane scrolls on its own. Below 1024px the sidebar becomes a top bar and list and detail stack as master → detail with a back control. Touch targets stay at 44px below 1024px.

## Elevation & Depth

Flat by tone and hairline. The only shadow is `raised` on the selected row (see the sidecar). Hover is a tint.

## Shapes

2px bar tracks, 4px badges, 6px nav items and segmented controls, 8px rows and buttons, 10px cards.

## Components

- **Logo:** `MorphMark` (24px, `accent`) beside the wordmark "Morph" in `logo` type. The favicon is the mark on `canvas-dark`.

- **Status badge:** uppercase micro label on its tinted fill, 3px × 8px padding, 4px radius.
- **Row:** 12px × 18px padding, title / id · country / program · affinity; status and relative time on the right. Selected: `selected` fill, `raised` shadow, 3px emerald edge.
- **Tabs:** 12px labels with counts; the active tab is ink and semibold with a 2px emerald underline.
- **Segmented control:** 1px `line` frame, 2px inset, active segment on `raised`.
- **Card:** `card` fill, `line` hairline, 10px radius, 18px × 20px padding, a 12px semibold `ink-soft` heading.
- **Buttons:** primary emerald fill with white text; secondary 1px `line-strong` outline with ink text; both 8px radius, 12px × 18px padding.

## Do's and Don'ts

- **Do** pair every status color with its word.
- **Do** keep emerald for selection and the primary action.
- **Don't** add eyebrows, glyph arrows or decorative icons; the signal icons are the only pictograms.
- **Don't** use `icon` grey for text.
