---
name: Orgpage
description: A calm, document-feel new-tab company homepage for small startup teams.
colors:
  brand-workshop-pine: "oklch(45% 0.08 145)"
  brand-wash: "color-mix(in oklch, oklch(45% 0.08 145) 13%, oklch(99% 0.012 86))"
  lobby-paper: "oklch(96% 0.018 86)"
  notice-sheet: "oklch(99% 0.012 86)"
  paper-soft: "oklch(92% 0.02 86)"
  pressed-ink: "oklch(24% 0.025 104)"
  quiet-ink: "oklch(45% 0.035 104)"
  hairline: "oklch(84% 0.025 86)"
  stamped-red: "oklch(48% 0.15 28)"
typography:
  display:
    fontFamily: "Fraunces, Recoleta, Charter, Georgia, serif"
    fontSize: "1.875rem"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Aptos, Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 900
    lineHeight: 1.15
    letterSpacing: "0"
  title:
    fontFamily: "Aptos, Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "0"
  body:
    fontFamily: "Aptos, Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "0"
  label:
    fontFamily: "Aptos, Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0"
  eyebrow:
    fontFamily: "Aptos, Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.12em"
rounded:
  sm: "6px"
  md: "8px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  shell: "clamp(18px, 3vw, 36px)"
components:
  button-primary:
    backgroundColor: "{colors.brand-workshop-pine}"
    textColor: "{colors.notice-sheet}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    height: "40px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.brand-workshop-pine}"
    textColor: "{colors.notice-sheet}"
  button-secondary:
    backgroundColor: "{colors.notice-sheet}"
    textColor: "{colors.pressed-ink}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    height: "40px"
    typography: "{typography.label}"
  button-secondary-hover:
    backgroundColor: "{colors.brand-wash}"
    textColor: "{colors.pressed-ink}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.quiet-ink}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    height: "40px"
    typography: "{typography.label}"
  button-ghost-hover:
    backgroundColor: "{colors.brand-wash}"
    textColor: "{colors.pressed-ink}"
  button-danger:
    backgroundColor: "{colors.stamped-red}"
    textColor: "{colors.notice-sheet}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    height: "40px"
    typography: "{typography.label}"
  input:
    backgroundColor: "{colors.notice-sheet}"
    textColor: "{colors.pressed-ink}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "44px"
    typography: "{typography.label}"
  widget-shell:
    backgroundColor: "color-mix(in oklch, {colors.notice-sheet} 88%, transparent)"
    textColor: "{colors.pressed-ink}"
    rounded: "{rounded.md}"
    padding: "20px"
  hero-block:
    backgroundColor: "{colors.brand-workshop-pine}"
    textColor: "{colors.notice-sheet}"
    rounded: "{rounded.md}"
    padding: "24px"
  avatar-square:
    backgroundColor: "{colors.brand-workshop-pine}"
    textColor: "{colors.notice-sheet}"
    rounded: "{rounded.sm}"
    size: "40px"
---

# Design System: Orgpage

## 1. Overview

**Creative North Star: "The Office Lobby"**

Orgpage is the well-kept lobby of a small startup. People pass through it on the way to actual work — many times a day, mid-thought, mid-flow. The room is warm, but it isn't trying to entertain you. The walls are paper. The notices are typeset. The plant in the corner is real. The page should reward a glance and disappear from mind by the time the tab is gone.

The system is built from a single warm neutral (Lobby Paper), a quiet pine green accent (Workshop Pine), a small sans family doing most of the work, and one serif (Fraunces) reserved for the moment of arrival. Density is medium: widgets sit on a 12-column grid with breathing room, never on a Sharepoint-grade information shelf. Motion is restrained — a single 560 ms ease-out enter, hover-brightness on actions, nothing choreographed.

The system explicitly rejects: the SaaS hero-metric template; identical icon-and-heading card grids; tracked-uppercase eyebrows used as section scaffolding; gradient text, glassmorphism, and side-stripe borders; any push toward further warm-cream surfaces (the Lobby Paper is the system's warmth, not the floor of more warmth).

**Key Characteristics:**

- Warm paper backdrop, near-white widget surfaces, one quiet green accent.
- One sans family (Aptos / Satoshi stack) for everything except the hero serif moment.
- Squared geometry: `rounded-md` (6px) on small controls, `rounded-lg` (8px) on widgets and the hero. Avatars are squared, not circular.
- Diffuse, wide, low-opacity shadows. Surfaces lift, never pop.
- A single OKLCH token vocabulary; no hex anywhere in the codebase. `--brand` is themable per organization via inline CSS variables on the app shell.

## 2. Colors

The palette is one accent against a warm-neutral ramp, with one hot color reserved for danger. Names follow the office-lobby metaphor: the paper, the ink, the line, the stamped notice.

### Primary
- **Workshop Pine** (`oklch(45% 0.08 145)`): The single brand accent. Used for primary buttons, the org logo mark when no image is set, the focus ring, the loading spinner, the "Today's Focus" hero block, and as the source of `brand-wash`. The chroma is deliberately low (0.08) — this is the green of a well-bound book cover, not a SaaS pill. Themable per organization via `--brand` set inline on `.app-shell`.
- **Pine Wash** (`color-mix(in oklch, var(--brand) 13%, var(--paper-strong))`): A washed tint of Workshop Pine. Used as the surface under inline panels (the Welcome stat tiles, the Shoutouts compose form, secondary-button hover, ghost-button hover, empty-state pills). It carries warmth without weight.

### Neutral
- **Lobby Paper** (`oklch(96% 0.018 86)`): The body background — the wall color of the lobby. Receives a radial wash of brand tint at top-left and an angled linear gradient to a slightly deeper paper. The body is never a flat fill; the wall has gentle light on it.
- **Notice Sheet** (`oklch(99% 0.012 86)`): Near-white. The surface notices are printed on — widget cards, inputs, the org header bar (at 80% opacity over Lobby Paper).
- **Paper Soft** (`oklch(92% 0.02 86)`): Slightly deeper paper, reserved for receded layers (background extensions in the body gradient).
- **Pressed Ink** (`oklch(24% 0.025 104)`): Primary text. Dark, with a whisper of warm green chroma (104) so it sits in the same family as the brand, not against it.
- **Quiet Ink** (`oklch(45% 0.035 104)`): Secondary text. Used for muted labels, body copy in widgets, eyebrows, the footer.
- **Hairline** (`oklch(84% 0.025 86)`): Borders, dividers, the rules underneath the footer. Soft, paper-toned, never gray.

### Tertiary (state-only)
- **Stamped Red** (`oklch(48% 0.15 28)`): Danger only. The red of a "VOID" stamp. Buttons that destroy, error indicators, the AlertTriangle on error views. Never decorative.

### Named Rules

**The Quiet Pine Rule.** Workshop Pine appears on ≤10% of any given screen: primary actions, the hero "Today's Focus" block, the focus ring, the loading spinner, the org mark, and the source of `brand-wash`. If a third bright pine surface shows up on the same page, one of them is wrong. Its rarity is what makes it carry.

**The No-Default-Cream Rule.** Lobby Paper is the system's warmth, not the floor of more warmth. Do not introduce paper-textured backgrounds, tan tints on cards, warm gradients on widgets, or kraft-paper imagery. The brief is "warm office lobby," not "magazine spread." If a future surface needs more warmth, the warmth must come from typography, copy, or a portrait — not background fills.

**The Single-Hot-Color Rule.** Stamped Red is the only saturated non-pine color in the system. Never use red for highlight, never use orange for warning, never use yellow for caution. Warning and caution states use Pressed Ink + an icon, not color. Color is reserved for action (pine) and danger (red).

## 3. Typography

**Display Font:** Fraunces (with Recoleta, Charter, Georgia, serif as fallbacks).
**Body Font:** Aptos (with Satoshi, ui-sans-serif, system-ui, sans-serif as fallbacks).

**Character:** A modern humanist sans for the work, a contemporary serif for the moment of arrival. The pair sits on a contrast axis (sans + serif) and never two-sans-blurs. Weights are wide-ranging: regular for body, semibold (600) for labels, bold (700) for widget titles, black (900) for headlines and stat numbers. The system reaches for black where calmer systems would reach for size — a deliberately confident voice without growing the type scale.

### Hierarchy

- **Display** (Fraunces, weight 900, `text-3xl` / `text-4xl` md+, line-height 1, letter-spacing -0.01em): The org's hero message on the new tab header. The serif moment. Nowhere else.
- **Headline** (Aptos, weight 900, `text-2xl`, line-height 1.15): The "Today's Focus" hero copy; large stat numbers in the Welcome tiles. Carries by weight, not size.
- **Title** (Aptos, weight 700, `text-lg`, line-height 1.25): Widget titles. Sits below the eyebrow inside `WidgetShell`.
- **Body** (Aptos, weight 400, `text-base`, line-height 1.75): Welcome message, announcement bodies, shoutout messages. Capped at 65–75ch through the widget grid.
- **Label** (Aptos, weight 600, `text-sm`, line-height 1.4): Field labels, secondary actions, member names, footer copy. The most common text size in the UI.
- **Eyebrow** (Aptos, weight 600, 11px, uppercase, `tracking-[0.12em]`): The CATEGORY tag above widget titles ("Home base," "Kudos," "Momentum") and above the hero "Today &middot; [date]" line. Used sparingly — only on widgets where the title isn't self-evident. Always paired with the title it labels. Never standalone.

### Named Rules

**The Display Serif Earns Each Use Rule.** Fraunces appears in exactly two places: the hero org-message `<h1>` on the new tab, and the org-initial mark in the header when no logo is set. Never in widget titles. Never in body. Never in admin. The serif's job is to mark arrival. Spreading it dilutes the moment.

**The Category Eyebrow Rule.** The eyebrow is a CATEGORY label, not section scaffolding. "Home base," "Kudos," "Today's focus" — each names what a thing IS. Every widget has exactly one, baked into `WidgetShell`. Adding tracked-uppercase kickers ("ABOUT," "PROCESS," "PRICING," "FEATURES") on top of titles to give a page a marketing rhythm is banned. If you find yourself writing an eyebrow that could be deleted without the title losing meaning, delete it.

**The Weight-Before-Size Rule.** When a number or short string needs to feel important, reach for `font-black` (900) at the existing size before bumping the size. The Welcome tile counts are `font-black` at `text-xl`, not regular at `text-3xl`. The system's voice is heavy-weight at a tight scale, not loud-size at body weight.

## 4. Elevation

Surfaces lift gently from the paper. The vocabulary is two diffuse, wide, low-opacity shadows and a tonal `bg-opacity` trick on the org header. There are no tight, dark, near-the-element shadows; nothing is supposed to look like it's hovering 4 pixels above the page. The model is paper-on-paper-on-paper, not glass-floating-over-mesh.

### Shadow Vocabulary

- **Paper Lift** (`0 18px 48px color-mix(in oklch, var(--ink) 9%, transparent)`): The default `.org-card` shadow under every widget. Wide blur, low offset (the light source is high and diffuse), 9% ink-tinted opacity. The shadow reads as ambient room light, not a card protruding.
- **Hero Lift** (`0 24px 60px color-mix(in oklch, var(--ink) 12%, transparent)`): The "Today's Focus" hero block. One step heavier — slightly larger offset, slightly bolder opacity (12%) — to mark it as the most important block on the page. Used at most once per screen.
- **Focus Ring** (`outline: 2px solid color-mix(in oklch, var(--brand) 52%, transparent); outline-offset: 3px`): The interaction shadow. Not a box-shadow at all — a real outline at 52% pine, offset by 3px so it floats off the element. Visible across all keyboard-focusable surfaces.

### Named Rules

**The Diffuse-Lift Rule.** Shadows are wide (≥48px blur), low (≤24px offset), and quiet (≤12% opacity, tinted toward Pressed Ink). Tight punchy shadows (`0 2px 4px rgba(0,0,0,0.3)`) are banned. Glassmorphism — backdrop-blur on cards — is banned. The room is lit from above and diffused; no element gets a spotlight.

**The Two-Step Lift Rule.** Exactly two elevation levels exist: Paper Lift (widgets) and Hero Lift (the single hero block). Inventing a third (modal lift, dropdown lift, toast lift) is a smell — if a modal needs to feel above the page, use a scrim and the Paper Lift, not a third shadow.

## 5. Components

Refined and restrained. Calm geometry; weight does the work where size would shout; consistent vocabulary screen to screen. Every interactive component has default, hover, focus-visible, disabled (and loading where relevant) — no half-built component shipped without states.

### Buttons

- **Shape:** `rounded-md` (6px), `min-h-10` (40px), `px-4 py-2`, `text-sm font-semibold`.
- **Primary** (`Button` default): Workshop Pine background, Notice Sheet text. Hover: `brightness(0.95)` on the whole button. Used for the single primary action per surface — "Send kudos," "Save," "Invite."
- **Secondary**: Notice Sheet background, Hairline border, Pressed Ink text. Hover: Pine Wash background. Used for sibling actions that aren't the page's primary — "Admin," "Cancel," row actions.
- **Ghost**: Transparent, Quiet Ink text. Hover: Pine Wash background + Pressed Ink text. Used for tertiary actions inside dense areas — "Logout" in the header, filter chips, low-priority icon-only triggers.
- **Danger**: Stamped Red background, Notice Sheet text. Hover: `brightness(0.95)`. Used only for destructive confirms.
- **Loading** state: Loader2 spin replaces the leading icon; the button is disabled. Width is preserved (no layout shift).
- **Focus**: All variants apply `.focus-ring` on `focus-visible` — 2px Pine outline at 52% strength, 3px offset.

### Inputs / Fields (Field, TextArea, Select)

- **Shape:** `rounded-md` (6px), Notice Sheet background, Hairline border, `min-h-11` (44px) on single-line, `min-h-28` on text areas.
- **Label**: Sits ABOVE the input — never inline placeholder-as-label. `text-sm font-semibold` Pressed Ink.
- **Default**: `outline: none` (the border carries the resting state).
- **Focus**: `.focus-ring` on `focus-visible` (Pine outline, 3px offset). The border itself does not change color.
- **Required, error, disabled** treatments: required is enforced through native `required`; visible required indicators (`*` glyphs, red highlight on rest) are NOT used. Error treatment is reserved for the validation step (red helper text under the field). Disabled drops to `opacity-60`.

### Cards / Containers (WidgetShell, .org-card)

- **Corner Style:** `rounded-lg` (8px).
- **Background:** Notice Sheet at 88% opacity over Lobby Paper (lets the body gradient breathe through faintly), Hairline border.
- **Shadow:** Paper Lift (see Elevation).
- **Internal Padding:** 20px (`p-5`).
- **Header pattern:** Eyebrow + Title stacked left, optional action slot right (flex with `items-start`, `gap-4`, `justify-between`). The Eyebrow → Title rhythm is the system's signature widget cadence.
- **Enter animation:** `.enter` — 560 ms cubic-bezier(0.16, 1, 0.3, 1) on opacity + 12px translateY. Gated behind `prefers-reduced-motion: no-preference`. Reduced-motion users see the widget at rest immediately.

### Navigation (Header bar)

- **Style:** Notice Sheet at 80% opacity, Hairline border, `rounded-lg` (8px), `p-4`. Sits at the top of the new tab, hugging the page max-width.
- **Left**: Org logo or initial mark (40px square, `rounded-md`, Workshop Pine + Notice Sheet text when synthesized) + uppercase tracked org name + Display-serif hero message.
- **Right**: Admin button (Secondary, gated by role), Logout button (Ghost), avatar.
- **Responsive:** Stacks vertically below `md` breakpoint via `md:flex-row md:items-center md:justify-between`.

### Profile Avatar

- **Shape:** 40px square (`h-10 w-10`), `rounded-md` (6px). Never a circle.
- **Image:** `object-cover` fill.
- **Fallback:** Workshop Pine background, Notice Sheet text, initials in `font-black` (900) `text-sm`. Up to two initials, falls back to `"O"`.

### State Views (Loading, Error)

- **Loading**: Centered card inside `app-shell`, Loader2 spinner in Workshop Pine + label in Quiet Ink. No skeleton screens elsewhere yet; widgets gate on `if (!bundle) return null` until data arrives.
- **Error**: Centered card, AlertTriangle in Stamped Red, headline ("Something needs attention"), body in Quiet Ink, optional retry button. Never raw stack traces.

### Hero Block (Today's Focus)

- **Shape:** `rounded-lg` (8px), Workshop Pine background, Notice Sheet text, `p-6`, Hero Lift shadow.
- **Layout:** Sparkles icon (16px) + eyebrow ("Today's focus" uppercase tracked at 0.14em) + headline (text-2xl font-black). The most visually committed block on the page; only one per surface.

### Named Rules

**The Squared Avatar Rule.** Avatars and org marks are `rounded-md` squares, not circles. This is the most distinctive component choice in the system — every other AI-generated dashboard reaches for circles. The square avatar carries "this is a workshop, not a social network."

**The Single Hero Block Rule.** The "Today's Focus" hero is the only Workshop Pine surface block on the new tab. No second pine block. No tile grids with one pine tile. If the page needs another moment of emphasis, use weight and a heavier shadow, not more pine.

**The Earned Eyebrow Rule.** `WidgetShell` accepts the eyebrow as optional, and the default is **no eyebrow**. Add one only when the title alone fails to place the widget — when the category is a real meaning the title doesn't carry ("Home base" for Welcome, "Kudos" for Shoutouts, "Momentum" for Leaderboard, the date for Calendar). If the eyebrow could be deleted without the title losing meaning, delete it. Eyebrows competing across every widget read as marketing scaffolding; sparing them is what keeps the ones that remain meaningful.

## 6. Do's and Don'ts

### Do:

- **Do** anchor every widget on the WidgetShell eyebrow → title pair (`text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]` + `text-lg font-bold leading-tight`). Consistency widget-to-widget is the rhythm.
- **Do** keep Workshop Pine on ≤10% of any visible surface. Primary buttons, focus ring, the single hero block, the org mark.
- **Do** use `font-black` (900) before bumping size when a number or name needs weight. Tight scale, heavy weight; that's the voice.
- **Do** keep avatars and org marks `rounded-md` squares. The squared-avatar choice is signature.
- **Do** gate every animation behind `@media (prefers-reduced-motion: no-preference)` and provide a calm crossfade or instant alternative. The `.enter` reveal is the existing pattern; copy it.
- **Do** use OKLCH for every color. The codebase has no hex; do not introduce any.
- **Do** ship default + hover + focus-visible + disabled (+ loading where relevant) for every interactive component. No half-built components.

### Don't:

- **Don't** ship hero metric tiles (active members, announcement counts, weekly leaderboard rank) as decoration. From PRODUCT.md: *"Orgpage is not a KPI dashboard for the team's own existence."* (The WelcomeWidget currently shows Member / Update / Link counts as Pine Wash tiles; treat that as the *ceiling* of count-tiles on the page, not the floor. Other widgets must not introduce activity counters.)
- **Don't** use tracked-uppercase eyebrows above sections as marketing-style scaffolding. The category eyebrow in `WidgetShell` is voice; adding new ones above sub-sections is AI grammar.
- **Don't** use numbered section markers (`01 · 02 · 03`) anywhere unless the section IS a real ordered sequence and the number carries information.
- **Don't** ship identical icon-and-heading card grids ("Feature 1 / Feature 2 / Feature 3" same-size cards).
- **Don't** use gradient text, decorative glassmorphism (backdrop-blur on cards), or side-stripe borders. All three are absolute bans.
- **Don't** lean further into warm-cream. Lobby Paper is the system's warmth. Do not add paper textures, tan tints on cards, warm gradients on widgets, or kraft imagery.
- **Don't** introduce a third elevation step. Paper Lift and Hero Lift are the two; modals reuse Paper Lift + a scrim, not a new shadow.
- **Don't** use Fraunces anywhere except the new-tab hero message and the synthesized org-initial mark. Serif in widget titles dilutes the arrival moment.
- **Don't** make avatars or org marks circular. Squared geometry is the system.
- **Don't** invent new accent colors for highlight, warning, info, or selection. Use Workshop Pine for action and current selection; use Pressed Ink + an icon for warning. Stamped Red is for danger only.
- **Don't** ship SharePoint-style density, gamified leaderboard energy (confetti, big emoji, primary-color spam), or BI-dashboard-style chart grids. From PRODUCT.md anti-references — Orgpage is a homepage, not an analytics tool, an intranet, or a kids' app.
- **Don't** use `position: absolute` dropdowns inside `overflow-hidden` containers. Use the native `<dialog>` / popover API or a portal.
