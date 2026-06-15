# Orgpage

Orgpage is a Manifest V3 Chrome extension that replaces the new tab page with a customizable company homepage for announcements, onboarding, links, leaderboards, shoutouts, and team updates.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- Chrome Extension Manifest V3
- Firebase Auth, Firestore, Analytics
- Firebase Hosting optional for the admin web app

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` from `.env.example` and fill the Firebase web app values:

   ```bash
   cp .env.example .env.local
   ```

3. For Google login inside the extension, create a Google Cloud OAuth client of type **Chrome Extension** and set:

   ```bash
   VITE_GOOGLE_OAUTH_CLIENT_ID=...
   ```

   Email/password auth works through Firebase Auth without the Chrome OAuth client.

4. Build the extension:

   ```bash
   npm run build
   ```

5. Load it in Chrome:

   - Open `chrome://extensions`
   - Enable Developer mode
   - Choose **Load unpacked**
   - Select the generated `dist` folder

Opening a new tab should now render Orgpage.

## Development

```bash
npm run dev
```

The Vite dev server is useful for hosted-web testing. Chrome's `chrome_url_overrides` behavior is verified from the production `dist` folder.

If Firebase is not configured, Orgpage runs in local demo mode with sample data so the UI remains testable. Configure Firebase before using it with a real organization.

## Firebase

Deploy Firestore rules:

```bash
firebase deploy --only firestore:rules
```

Optional Firebase Hosting deploy:

```bash
npm run build
firebase deploy --only hosting
```

The hosting config rewrites all routes to `index.html`, so `/admin`, `/invite/:inviteId?org=:orgId`, and `/newtab` work as normal web routes. Inside the Chrome extension, routing automatically uses hash URLs.

## Roles

- `owner`: full organization control, member management, invite creation, and theme updates.
- `admin`: company page editing, invites, announcements, links, onboarding tasks, leaderboard, and shoutout moderation.
- `member`: new-tab access, onboarding task completion, link opening, and shoutout creation.

## Project Structure

```text
src/
  components/      reusable UI primitives
  context/         auth and organization providers
  data/            Firestore/demo data service
  lib/             Firebase, Chrome auth, date helpers
  pages/           route-level screens
  pages/admin/     admin dashboard sections
  types/           product data contracts
  widgets/         modular new-tab widgets
firestore.rules    production Firestore security rules
firebase.json      Firestore and optional Hosting config
```
