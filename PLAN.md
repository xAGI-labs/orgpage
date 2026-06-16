# Monorepo Refactor Plan

## Goal

Convert Orgpage from a single Vite app into a pnpm workspaces monorepo with:

- `apps/extension/` — the current Chrome MV3 + admin SPA (no functional change).
- `apps/functions/` — Cloud Functions on Firebase, bundled with esbuild at predeploy so workspace imports survive deploy.
- `packages/shared/` — shared TypeScript types (`Organization`, `Member`, `Role`, etc.) imported by both apps. Types-only, no runtime.

No admin app split yet — admin remains routes inside the extension SPA + Firebase Hosting.

## Final structure

```
orgpage/
├── apps/
│   ├── extension/
│   │   ├── public/
│   │   │   ├── favicon.svg
│   │   │   └── icons/
│   │   ├── src/                          ← from root src/
│   │   │   ├── components/
│   │   │   ├── context/
│   │   │   ├── data/
│   │   │   ├── lib/
│   │   │   ├── pages/
│   │   │   ├── widgets/
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   ├── styles.css
│   │   │   └── vite-env.d.ts
│   │   ├── index.html                    ← from root
│   │   ├── package.json                  (extension deps only)
│   │   ├── tsconfig.json                 (references packages/shared)
│   │   ├── vite.config.ts                ← from root
│   │   ├── tailwind.config.ts            ← from root
│   │   ├── postcss.config.js             ← from root
│   │   └── dist/                         (Firebase Hosting target)
│   └── functions/
│       ├── src/
│       │   └── index.ts                  (hello-world handler to start)
│       ├── lib/                          (esbuild output; .gitignored)
│       ├── package.json                  (firebase-functions, firebase-admin)
│       ├── tsconfig.json                 (references packages/shared)
│       └── esbuild.config.mjs            (bundles src/index.ts → lib/index.js)
├── packages/
│   └── shared/
│       ├── src/
│       │   └── orgpage.ts                ← from extension src/types/orgpage.ts
│       ├── index.ts                      (re-exports)
│       ├── package.json                  (type: module, no deps)
│       └── tsconfig.json
├── pnpm-workspace.yaml                   (NEW)
├── package.json                          (workspace root: dev/build/lint scripts only)
├── tsconfig.base.json                    (NEW — shared compiler options)
├── eslint.config.js                      (root; workspace-aware overrides)
├── firebase.json                         (updated: hosting + functions paths)
├── firestore.rules                       (unchanged)
├── README.md
├── PRODUCT.md
├── DESIGN.md
├── PLAN.md                               (this file — delete after refactor)
├── .impeccable/
├── docs/
└── .gitignore
```

`src/types/orgpage.ts` is the **only file** moving out of the extension into a shared package.

## Migration in numbered steps

### 1. Install pnpm and clear npm artifacts

```bash
# Install pnpm globally if not present
npm install -g pnpm

# Remove npm artifacts that pnpm replaces
rm package-lock.json
rm -rf node_modules
```

### 2. Create the workspace skeleton

```bash
mkdir -p apps/extension apps/functions/src packages/shared/src
```

### 3. Move the extension into apps/extension

```bash
# Move all extension source
git mv src apps/extension/src
git mv public apps/extension/public
git mv index.html apps/extension/index.html
git mv vite.config.ts apps/extension/vite.config.ts
git mv tailwind.config.ts apps/extension/tailwind.config.ts
git mv postcss.config.js apps/extension/postcss.config.js
```

### 4. Lift shared types into packages/shared

```bash
# Move the canonical types file
git mv apps/extension/src/types/orgpage.ts packages/shared/src/orgpage.ts

# Remove now-empty types dir
rmdir apps/extension/src/types
```

Then rewrite imports in the 8 consuming files (`AuthContext.tsx`, `OrgContext.tsx`, `data/demo.ts`, `data/orgStore.ts`, `pages/OnboardingPage.tsx`, `pages/admin/AdminAnnouncementsPage.tsx`, `pages/admin/AdminInvitesPage.tsx`, `pages/admin/AdminThemePage.tsx`):

```diff
- import type { Foo } from "../types/orgpage";
+ import type { Foo } from "@orgpage/shared";
```

(A single `sed` or VS Code project-wide replace handles this.)

### 5. Write the workspace root files

**`pnpm-workspace.yaml`** (new):

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

**`package.json`** (rewrite from current root — keep `name`, drop runtime deps, keep devDeps that span apps like eslint/typescript):

```json
{
  "name": "orgpage",
  "version": "0.1.0",
  "private": true,
  "description": "Orgpage monorepo: Chrome new-tab extension + Firebase backend.",
  "type": "module",
  "scripts": {
    "dev": "pnpm --filter @orgpage/extension dev",
    "build": "pnpm -r build",
    "build:extension": "pnpm --filter @orgpage/extension build",
    "build:functions": "pnpm --filter @orgpage/functions build",
    "lint": "pnpm -r lint",
    "typecheck": "pnpm -r typecheck",
    "deploy:hosting": "pnpm build:extension && firebase deploy --only hosting",
    "deploy:functions": "firebase deploy --only functions",
    "deploy:rules": "firebase deploy --only firestore:rules"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^8.16.0",
    "@typescript-eslint/parser": "^8.16.0",
    "eslint": "^9.16.0",
    "typescript": "^5.7.2"
  }
}
```

**`tsconfig.base.json`** (new — compiler options inherited by every workspace):

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "resolveJsonModule": true
  }
}
```

**Keep `eslint.config.js`, `firebase.json`, `firestore.rules`, `PRODUCT.md`, `DESIGN.md`, `.impeccable/`, `docs/`, `README.md`, `.gitignore` at the root.**

### 6. Write apps/extension/package.json

Extract the runtime deps + extension-specific devDeps. Name it `@orgpage/extension`:

```json
{
  "name": "@orgpage/extension",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview --host 127.0.0.1",
    "lint": "eslint . --max-warnings=0",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@orgpage/shared": "workspace:*",
    "clsx": "^2.1.1",
    "firebase": "^11.0.0",
    "lucide-react": "^0.468.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0"
  },
  "devDependencies": {
    "@types/chrome": "^0.0.287",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^6.0.2",
    "autoprefixer": "^10.4.20",
    "eslint-plugin-react-hooks": "^5.1.0",
    "eslint-plugin-react-refresh": "^0.4.16",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.16",
    "vite": "^8.0.16"
  }
}
```

### 7. Write apps/extension/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "jsx": "react-jsx",
    "noEmit": true,
    "allowImportingTsExtensions": false,
    "paths": {
      "@orgpage/shared": ["../../packages/shared"]
    }
  },
  "include": ["src", "vite.config.ts", "tailwind.config.ts"],
  "references": [{ "path": "../../packages/shared" }]
}
```

The `paths` mapping lets the TS server resolve `@orgpage/shared` even before pnpm has linked node_modules; pnpm will link it for runtime.

### 8. Write packages/shared

**`packages/shared/package.json`**:

```json
{
  "name": "@orgpage/shared",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./index.ts",
  "types": "./index.ts",
  "scripts": {
    "lint": "eslint . --max-warnings=0",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.7.2"
  }
}
```

(Pointing `main` and `types` at `index.ts` directly is fine for an internal types-only package — no build step needed.)

**`packages/shared/index.ts`**:

```ts
export * from "./src/orgpage";
```

**`packages/shared/tsconfig.json`**:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "noEmit": true,
    "lib": ["ES2022"]
  },
  "include": ["src", "index.ts"]
}
```

### 9. Write apps/functions

**`apps/functions/package.json`**:

```json
{
  "name": "@orgpage/functions",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "lib/index.js",
  "engines": {
    "node": "20"
  },
  "scripts": {
    "build": "node esbuild.config.mjs",
    "lint": "eslint . --max-warnings=0",
    "typecheck": "tsc --noEmit",
    "serve": "pnpm build && firebase emulators:start --only functions",
    "deploy": "pnpm build && firebase deploy --only functions"
  },
  "dependencies": {
    "firebase-admin": "^12.0.0",
    "firebase-functions": "^6.0.0"
  },
  "devDependencies": {
    "@orgpage/shared": "workspace:*",
    "@types/node": "^20.0.0",
    "esbuild": "^0.24.0",
    "typescript": "^5.7.2"
  }
}
```

Note: `@orgpage/shared` is a **devDependency**, not a dependency. Esbuild bundles it into `lib/index.js`, so it doesn't need to be in production deps.

**`apps/functions/tsconfig.json`**:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "lib": ["ES2022"],
    "noEmit": true,
    "types": ["node"],
    "paths": {
      "@orgpage/shared": ["../../packages/shared"]
    }
  },
  "include": ["src", "esbuild.config.mjs"],
  "references": [{ "path": "../../packages/shared" }]
}
```

**`apps/functions/esbuild.config.mjs`**:

```js
import { build } from "esbuild";

await build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  outfile: "lib/index.js",
  external: ["firebase-functions", "firebase-admin"],
  sourcemap: false,
  banner: {
    js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);"
  }
});
```

- `bundle: true` + omitting `@orgpage/shared` from `external` means esbuild inlines shared.
- `external: ["firebase-functions", "firebase-admin"]` keeps those as runtime deps (they ship with the Functions runtime); bundling them would break the deploy.
- The banner shim lets bundled ESM code use `require()` for any CommonJS that sneaks in.

**`apps/functions/src/index.ts`** (starter — replace with real handlers later):

```ts
import { onRequest } from "firebase-functions/v2/https";
import type { Role } from "@orgpage/shared";

export const hello = onRequest((_req, res) => {
  const role: Role = "member";
  res.json({ ok: true, role });
});
```

### 10. Update firebase.json

```diff
 {
   "firestore": {
     "rules": "firestore.rules"
   },
   "hosting": {
-    "public": "dist",
+    "public": "apps/extension/dist",
     "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
     "rewrites": [
       {
         "source": "**",
         "destination": "/index.html"
       }
     ],
     "headers": [
       {
         "source": "**/*.@(js|css)",
         "headers": [
           {
             "key": "Cache-Control",
             "value": "public,max-age=31536000,immutable"
           }
         ]
       }
     ]
+  },
+  "functions": [
+    {
+      "source": "apps/functions",
+      "codebase": "default",
+      "runtime": "nodejs20",
+      "predeploy": "pnpm --filter @orgpage/functions build",
+      "ignore": ["src", "tsconfig.json", "esbuild.config.mjs", "node_modules"]
+    }
+  ]
 }
```

The `ignore` field is critical: it tells Firebase **not** to upload `src/` or `node_modules/` — only `lib/index.js`, `package.json`, and the lockfile go up. Firebase runs `npm install --omit=dev` server-side from that minimal payload.

### 11. Update .gitignore

Append:

```
apps/extension/dist
apps/functions/lib
apps/functions/.firebase
pnpm-lock.yaml  # (decision: see "Risks" below — likely you want to COMMIT this)
.pnpm-store
```

Decision: commit `pnpm-lock.yaml` for reproducibility (standard practice). The line above is just a placeholder; remove before committing.

### 12. Install and verify

```bash
pnpm install                     # links workspaces, generates pnpm-lock.yaml
pnpm typecheck                   # both apps + shared compile
pnpm lint                        # clean across the workspace
pnpm build:extension             # apps/extension/dist/ exists
pnpm build:functions             # apps/functions/lib/index.js exists
firebase emulators:start         # smoke test functions locally
```

## Verification checklist

- [ ] `pnpm install` succeeds, `pnpm-lock.yaml` generated.
- [ ] `pnpm typecheck` clean in extension, functions, and shared.
- [ ] `pnpm lint` clean.
- [ ] `pnpm build:extension` produces `apps/extension/dist/manifest.json` (Chrome can load it).
- [ ] `pnpm build:functions` produces `apps/functions/lib/index.js` (single bundled file, no `node_modules/@orgpage/shared` import inside).
- [ ] `firebase emulators:start --only functions` serves the `hello` function locally.
- [ ] Chrome can still load `apps/extension/dist/` as unpacked extension; new tab works.
- [ ] `firebase deploy --only hosting` deploys the extension SPA (only run if you actually want to push).
- [ ] `firebase deploy --only functions` deploys the bundled functions.

## Risks and rollback

- **pnpm-lock.yaml replacing package-lock.json** changes the deterministic install graph. If CI is pinned to npm, CI will break until updated. Pin Node 20+ in CI to match Functions runtime.
- **esbuild bundling can hide missing externals.** If a future function imports a third-party CJS module that doesn't bundle cleanly (rare with modern packages, common with some Firebase ecosystem extras), the deploy succeeds but the function crashes at cold start. Mitigation: smoke-test every new handler in the emulator before deploying.
- **Firebase Functions still requires its own `package.json` at the source root** at deploy time. The `firebase deploy` CLI reads that file's `engines.node` to choose the runtime. Don't strip it.
- **The 8 import rewrites** are mechanical but worth typecheck-verifying — TypeScript will catch any missed file immediately.
- **Rollback** is just `git revert` of the refactor commit + `rm -rf apps packages pnpm-workspace.yaml pnpm-lock.yaml`. No data migration, no Firestore changes.

## What this does NOT do

- Doesn't move admin pages out of the extension SPA. They stay as routes; Firebase Hosting still serves them.
- Doesn't write real Cloud Functions handlers — the `hello` function is a smoke-test only. Real handlers (invite emails, scheduled cleanup, etc.) come in follow-up commits.
- Doesn't change Firestore schema, rules, or any runtime behavior of the extension.
- Doesn't introduce Turborepo or build caching. If build times become annoying once there are 3+ apps, add Turbo on top of pnpm then — not yet.
- Doesn't delete this `PLAN.md`. Delete it after the refactor lands and you no longer need to reference it.
