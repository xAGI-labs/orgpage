# Orgpage

Orgpage replaces Chrome's new-tab page with a customizable company homepage for announcements, onboarding, links, leaderboards, shoutouts, and team updates. Manifest V3 extension + Firebase backend.

## Workspaces

This is a pnpm monorepo with two apps and one shared package:

```
orgpage/
├── apps/
│   ├── extension/       Chrome MV3 + admin SPA (React + Vite + Tailwind)
│   └── functions/       Cloud Functions on Firebase (esbuild-bundled, Node 22)
├── packages/
│   └── shared/          TypeScript types shared by extension and functions
├── firebase.json        Hosting + Functions config
├── firestore.rules      Firestore security rules
├── PRODUCT.md           Strategic register, users, brand, anti-references
└── DESIGN.md            Visual system (Workshop Pine, Lobby Paper, etc.)
```

## Stack

- React 18 + TypeScript + Vite (extension)
- Tailwind CSS with OKLCH token system
- Firebase Auth, Firestore, Analytics
- Firebase Cloud Functions (Node 22) for server-side logic
- pnpm workspaces

## Setup

1. Install pnpm globally if you don't have it:

   ```bash
   npm install -g pnpm
   ```

2. Install all workspace dependencies from the root:

   ```bash
   pnpm install
   ```

3. Create `apps/extension/.env.local` from `apps/extension/.env.example` (if present) with your Firebase web app values.

4. For Google sign-in inside the extension, set:

   ```
   VITE_GOOGLE_OAUTH_CLIENT_ID=...
   ```

   Email/password auth works without the Chrome OAuth client.

## Development

```bash
pnpm dev                   # runs apps/extension on Vite (127.0.0.1:5173)
```

The Vite dev server is useful for hosted-web testing. Chrome's `chrome_url_overrides` only kicks in from the built extension under `dist/`.

## Build

```bash
pnpm build                 # builds every workspace (extension + functions)
pnpm build:extension       # only the extension (outputs apps/extension/dist)
pnpm build:functions       # only the functions (outputs apps/functions/lib/index.js, single bundled file)
```

## Load the extension in Chrome

```bash
pnpm build:extension
```

Then in Chrome:

- Open `chrome://extensions`
- Enable Developer mode
- Click **Load unpacked**
- Select `apps/extension/dist`

Opening a new tab renders Orgpage.

## Cloud Functions

Functions live in `apps/functions/src/`. Each handler is a normal Firebase Functions v2 export. At deploy time, esbuild bundles `src/index.ts` (and all `@orgpage/shared` imports) into a single `lib/index.js` so the workspace symlink doesn't need to survive the upload — Firebase only sees `lib/index.js`, `package.json`, and the lockfile.

Local emulator:

```bash
pnpm --filter @orgpage/functions serve
```

## Deploy

```bash
pnpm deploy:rules          # Firestore security rules
pnpm deploy:functions      # Cloud Functions (bundles via esbuild predeploy)
pnpm deploy:hosting        # Firebase Hosting (rebuilds the extension first)
```

The hosting config rewrites all routes to `index.html`, so `/admin`, `/invite/:inviteId?org=:orgId`, and `/newtab` work as normal web routes. Inside the Chrome extension, routing automatically uses hash URLs.

## Roles

- `owner`: full organization control, member management, invite creation, theme updates.
- `admin`: company page editing, invites, announcements, links, onboarding tasks, leaderboard, shoutout moderation.
- `member`: new-tab access, onboarding task completion, link opening, shoutout creation.

## Quality bar

```bash
pnpm typecheck             # tsc --noEmit across all workspaces
pnpm lint                  # eslint --max-warnings=0 across all workspaces
```

CI should run both before any deploy.

## Design system

The visual system is documented in `DESIGN.md` (root) and mirrored as machine-readable tokens in `.impeccable/design.json`. Strategic register (target users, brand, anti-references, design principles) lives in `PRODUCT.md`. Both files inform how new screens get built — read them before adding a new surface.
