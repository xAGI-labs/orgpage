import { GoogleAuthProvider, signInWithCredential, signInWithPopup } from "firebase/auth";
import { auth, googleOAuthClientId } from "./firebase";

function isExtensionPage() {
  return window.location.protocol === "chrome-extension:" && typeof chrome !== "undefined" && !!chrome.identity;
}

export async function signInWithGoogle() {
  if (!auth) throw new Error("Firebase is not configured.");

  if (isExtensionPage()) {
    if (!googleOAuthClientId) {
      throw new Error("Set VITE_GOOGLE_OAUTH_CLIENT_ID and rebuild to enable Google login in Chrome.");
    }

    const token = await new Promise<string>((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive: true }, (authToken) => {
        const lastError = chrome.runtime.lastError;
        if (lastError || !authToken) {
          reject(new Error(lastError?.message ?? "Chrome identity did not return an OAuth token."));
          return;
        }
        resolve(authToken);
      });
    });

    const credential = GoogleAuthProvider.credential(null, token);
    return signInWithCredential(auth, credential);
  }

  return signInWithPopup(auth, new GoogleAuthProvider());
}
