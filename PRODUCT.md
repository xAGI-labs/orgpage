# Product

## Register

product

## Users

Members of small and medium startups (≈10–200 people). The audience is the **whole team**, not power users: engineers, designers, ops, sales, support — anyone who opens a browser. They reach Orgpage every time they open a new tab, so the surface is glanced at dozens of times a day in the middle of other work. They are not coming to Orgpage to *do* a task; they're passing through it.

Three roles share the same product:

- **Members** open the new tab. They scan announcements, click links, complete onboarding steps, see who got shouted out, and move on.
- **Admins** maintain the page. They publish announcements, curate links, run onboarding, moderate shoutouts.
- **Owners** set the organization up: members, invites, theme, defaults.

## Product Purpose

Orgpage replaces the browser's new-tab page with a single team-wide company homepage so a small startup can feel like a small startup — not a SharePoint, not a Slack channel, not a generic SaaS dashboard.

Success looks like: a new hire knows where to start on day one; an existing teammate notices a real announcement on the day it's posted; a shoutout reaches the people it was meant for; nobody resents the page for getting in their way each time they open a tab.

It is a **homepage**, not analytics, not a control panel, not a productivity tool. It rewards a glance.

## Brand Personality

Calm · precise · trustworthy. Three-word personality, in that order — calm first.

Voice is warm but understated: the product talks like a thoughtful office manager, not a hype announcer. Welcome messages are short. Announcements are direct. Shoutouts use real names, not emoji-spam. Empty states explain quietly; they don't sell.

Aesthetic family: **quiet product UI** (Linear, Height, Pitch) blended with **workspace document feel** (Notion, Coda). Serif accents earn their place. Type does the hierarchy work; color and motion stay restrained.

## Anti-references

The single most important constraint: Orgpage must not look like a **generic SaaS template**. Specifically reject:

- Hero metric tiles ("327 active members · 12 announcements this week"). Orgpage is not a KPI dashboard for the team's own existence.
- Tiny tracked uppercase eyebrows above every section ("ABOUT · ONBOARDING · LINKS").
- Numbered section markers (`01 · 02 · 03`) as scaffolding.
- Icon + heading + paragraph card grids repeated across the page.
- Gradient text, decorative glassmorphism, side-stripe borders.
- The cross-project cream-paper warmth used as the default body bg. If Orgpage stays warm, it is warm on purpose (document-feel, Notion-adjacent), not warm by reflex. This is worth re-litigating in DESIGN.md.

Also avoid: SharePoint-era corporate intranet density; loud / playful / gamified leaderboard energy; BI-tool dashboard density.

## Design Principles

1. **Quiet by default, warm on purpose.** Calm precision is the baseline. Warmth appears where it belongs — people, shoutouts, the welcome moment — not as ambient decoration. Every warm choice should be defensible as a specific intent, not a tone.
2. **The homepage, not the dashboard.** Orgpage is the first surface of the workday. It should feel like a place, not a panel. No KPI tiles, no "active users" counters, no metrics about the team's own activity. Reward a glance.
3. **Document feel over app feel.** Type-driven hierarchy. Generous whitespace. Serif accents where they earn their place. Closer to a Notion page than a SaaS admin. Cards are the lazy answer here; use them only when they're truly the best affordance.
4. **Configurability is invisible.** Admins and owners shape the page; members never see the seams. No "configure me" placeholders, no empty widget slots, no admin affordances leaking into the member view.
5. **Respect the new-tab moment.** Opened many times a day, mid-flow, while the user is thinking about something else. Must load fast, never block on the network, never demand attention with motion. The page should reward a glance and disappear from the user's mind by the time the tab is gone.

## Accessibility & Inclusion

WCAG 2.1 AA across the product. Concretely:

- Body text contrast ≥ 4.5:1; large text (≥18px or bold ≥14px) ≥ 3:1. Placeholder text held to the same 4.5:1 bar.
- Full keyboard navigation across widgets, admin tables, and modals. Visible focus ring (already present as `.focus-ring`); never removed.
- `prefers-reduced-motion: reduce` honored for every animation — including the `.enter` reveal and any future widget transitions. Crossfade or instant transition as the alternative; never a blank gated reveal.
- Color is never the sole channel for meaning (status, role badges, leaderboard rank, error states). Pair with text or icon.
- Real user names and pronouns (when supplied) are respected verbatim across shoutouts, leaderboard, and member lists.
