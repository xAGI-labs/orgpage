import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";

function orgpageManifest(env: Record<string, string>): Plugin {
  return {
    name: "orgpage-manifest",
    generateBundle() {
      const googleClientId = env.VITE_GOOGLE_OAUTH_CLIENT_ID;
      const manifest = {
        manifest_version: 3,
        name: "Orgpage",
        short_name: "Orgpage",
        version: "0.1.0",
        description: "Replace the new tab with your company's noticeboard, onboarding hub, and team homepage.",
        icons: {
          "16": "icons/icon-16.png",
          "32": "icons/icon-32.png",
          "48": "icons/icon-48.png",
          "128": "icons/icon-128.png"
        },
        chrome_url_overrides: {
          newtab: "index.html"
        },
        permissions: ["identity"],
        host_permissions: [
          "https://*.googleapis.com/*",
          "https://*.firebaseio.com/*",
          "https://*.firebaseapp.com/*"
        ],
        action: {
          default_title: "Open Orgpage"
        },
        content_security_policy: {
          extension_pages:
            "script-src 'self'; object-src 'self'; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.firebaseapp.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://www.googleapis.com;"
        },
        ...(googleClientId
          ? {
              oauth2: {
                client_id: googleClientId,
                scopes: ["email", "profile"]
              }
            }
          : {})
      };

      this.emitFile({
        type: "asset",
        fileName: "manifest.json",
        source: `${JSON.stringify(manifest, null, 2)}\n`
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), orgpageManifest(env)],
    build: {
      outDir: "dist",
      sourcemap: false,
      emptyOutDir: true,
      rollupOptions: {
        output: {
          entryFileNames: "assets/[name]-[hash].js",
          chunkFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash][extname]"
        }
      }
    }
  };
});
