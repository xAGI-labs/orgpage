---
target: src/pages/NewTabPage.tsx
total_score: 21
p0_count: 0
p1_count: 4
timestamp: 2026-06-16T06-12-40Z
slug: src-pages-newtabpage-tsx
---
# Critique: `src/pages/NewTabPage.tsx`

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Shoutout submit / task completion / link click all silent. |
| 2 | Match System / Real World | 3 | Eyebrows mostly human; "Fast paths" / "Read first" forced; Firebase docs footer is alien. |
| 3 | User Control and Freedom | 2 | Send shoutout / mark task done / dismiss announcement all irreversible. |
| 4 | Consistency and Standards | 2 | QuickActionsWidget bypasses WidgetShell; eyebrow weight/tracking inconsistent; Done button overrides standard sizing. |
| 5 | Error Prevention | 3 | Native required, no destructive actions in member view. |
| 6 | Recognition Rather Than Recall | 3 | Icons paired with text labels throughout. |
| 7 | Flexibility and Efficiency | 1 | No keyboard shortcuts; no member customization; no hide/reorder. |
| 8 | Aesthetic and Minimalist Design | 2 | 8+ widgets at identical weight; two heroes; brand-soft carpets every empty state. |
| 9 | Error Recovery | 2 | Page-level ErrorView only; no field-level / action-level errors. |
| 10 | Help and Documentation | 1 | No contextual help. Firebase docs footer is developer-only. |
| **Total** | | **21/40** | **Acceptable — significant improvements needed** |

## Anti-Patterns Verdict

**LLM assessment.** Strong token foundation, dashboard-shaped composition. Four AI-grammar tells: (1) hero-metric template in `WelcomeWidget` (Members/Updates/Links count tiles), (2) eyebrow saturation (8 tracked-uppercase eyebrows on first paint), (3) Sparkles icon on the hero block (the most overused AI/SaaS icon), (4) uniform `.enter` reveal across every widget (the uniform-reflex tell). Warm-paper body bg stays — it reads as deliberate, not the AI-default cream-paper move.

**Deterministic scan.** Unavailable. `detect.mjs` crashed: `Cannot find module '.../scripts/lib/impeccable-config.mjs'` (the file doesn't exist; lib/ has impeccable-paths.mjs, design-parser.mjs, is-generated.mjs). Skill-installation bug worth raising.

**Visual overlays.** Skipped. The new tab is served from `chrome-extension://...` and no equivalent dev-server URL exists for this surface.

## Overall Impression

Token system, voice, and component primitives are calm and well-built; the page composes them into something noisier than the parts. Biggest opportunity: collapse the dual-hero problem (serif heroMessage in header vs Today's Focus pine block), then quiet everything else by ≥30%. The AI-grammar tells fall away with it.

## What's Working

- OKLCH token vocabulary, semantically named, per-org themable via inline CSS variables — the bedrock.
- Empty-state voice consistent and human across all widgets. Calm, declarative, no marketing.
- Serif arrival in header earns its place per DESIGN.md's "Display Serif Earns Each Use" rule.

## Priority Issues

### [P1] Two hero blocks compete for first attention
Header serif `heroMessage` (`text-3xl md:text-4xl font-black` Fraunces) AND Workshop Pine "Today's Focus" block both shout primary. DESIGN.md "Single Hero Block Rule" says one. **Fix:** pick a carrier — drop the header heroMessage to body-weight serif so Today's Focus carries arrival, OR remove the Today's Focus block and let the serif greeting be the hero. **Suggested command:** `/impeccable quieter src/pages/NewTabPage.tsx`

### [P1] WelcomeWidget is the count-tile pattern PRODUCT.md banned
Three pine-wash tiles with Members/Updates/Links counts in `font-black text-xl`. That is the hero-metric template at small scale. **Fix:** replace tiles with content that earns the welcome — first name, calm sentence, one concrete pointer ("Three onboarding steps waiting"). Counts of the team itself are noise. **Suggested command:** `/impeccable polish src/widgets/WelcomeWidget.tsx`

### [P1] Eyebrow saturation
8 tracked-uppercase eyebrows on first paint. "Fast paths," "Read first," "Quick actions" especially read as filler categories. DESIGN.md's Category Eyebrow Rule allows them as named categories, but applied uniformly they cross back into reflex. **Fix:** drop eyebrows where the title is self-evident (Links, QuickActions); keep where the category is genuinely categorizing (Welcome → Home base, Shoutouts → Kudos, Leaderboard → Momentum). Also unify eyebrow weight (`font-bold` vs `font-black`) and tracking (0.12em vs 0.14em). **Suggested command:** `/impeccable typeset src/widgets`

### [P1] High cognitive load on first paint
8+ widgets at near-identical visual weight, 5 different content rhythms. Single focus fails, hierarchy weak, minimal choices fails. PRODUCT.md "Respect the new-tab moment" says reward a glance; the page demands a session. **Fix:** stratify weight aggressively. One hero, one secondary, rest muted. Or move half the widgets behind a "more from your team" reveal. **Suggested command:** `/impeccable distill src/pages/NewTabPage.tsx`

### [P2] Quiet Pine Rule violated
Pine or pine-wash on org mark, Today's Focus block, priority badge, every leaderboard row bg, leaderboard score, calendar placeholder body, welcome tiles, shoutout compose form, 5 empty-state pills, 5 icon usages, link-hover bg. ~30-40% of the surface, not the ≤10% DESIGN.md requires. **Fix:** demote brand-soft from default empty/filler bg; use hairline-bordered notice-sheet (the pattern announcements already use). Reserve pine fills for the single hero and primary buttons. **Suggested command:** `/impeccable quieter src/widgets`

### [P2] Sparkles icon on the hero
The most-AI-tell icon in lucide-react. Signals "AI / magic / generated insight"; the Today's Focus line is human-pinned content. **Fix:** remove entirely or swap for Pin / Megaphone / nothing. **Suggested command:** `/impeccable polish src/pages/NewTabPage.tsx`

### [P3] Footer "Firebase docs" link
Developer scaffolding in a member-facing footer. **Fix:** replace with org-meaningful link or remove. **Suggested command:** `/impeccable clarify src/pages/NewTabPage.tsx`

### [P3] Uniform .enter animation across every widget
Same 560 ms translateY+opacity on all 7+. The uniform-reflex tell. **Fix:** stagger by index, or reveal only what changed (today's focus line, new announcements). **Suggested command:** `/impeccable animate src/pages/NewTabPage.tsx`

### [P3] Tablet (768–1024px) collapses to single-column scroll
Grid jumps from 1 column at <lg straight to 12 columns at lg+. **Fix:** add `md:grid-cols-2` intermediate. **Suggested command:** `/impeccable adapt src/pages/NewTabPage.tsx`

## Persona Red Flags

**Alex (impatient power user, opens 30-50×/day).** No keyboard shortcuts; 560 ms reveal animation on every open; no widget hide/reorder; no Cmd+Enter on shoutout form. Mouse-only, slow, no agency.

**Jordan (day-one new hire).** OnboardingWidget is one of seven equal blocks; should be the single most prominent thing for the first 7-14 days. No tooltips, no contextual help. "Kudos" / "Today's focus" / "Momentum" are phrases Jordan has to interpret.

**Sam (keyboard / assistive tech).** Focus rings present and working — credit where due. But: ProfileAvatar `<img alt="">` is null where user's name would help; lucide icons missing `aria-hidden="true"`; onboarding "Done" button has no aria-label naming the task.

**Riley (small-startup founder).** Will open this on day-one-of-the-month and notice Today's Focus still says what they pinned three weeks ago — no freshness signal. The page rewards admin effort linearly; if Riley hasn't filled it in, it's mostly empty states. Needs a first-run path that doesn't penalize the team.

## Minor Observations

- QuickActionsWidget should use WidgetShell instead of rolling its own org-card with divergent eyebrow style.
- CalendarPlaceholderWidget body copy is a developer note ("Calendar integrations can plug in...") — members will never read that.
- Footer copy "Orgpage replaces your Chrome new tab" tells the user something they already know.
- Onboarding "Done" button overrides standard sizing at call site; build a `size="sm"` variant on Button instead.
- `text-wrap: balance` not set on serif heroMessage; long org messages wrap unevenly.

## Questions to Consider

- What if the page had one moment per day, and everything else lived behind a calm reveal?
- Could OnboardingWidget be the hero for new hires' first 14 days, then demote itself?
- Does Today's Focus need to be a pine-filled block, or could it be a serif sentence in the header — collapsing two heroes into one?
- What's the version of WelcomeWidget that has no metric tiles?
- Should members have any control over their own new tab — hide a widget, reorder, mute — or is the page admin-shaped only?
