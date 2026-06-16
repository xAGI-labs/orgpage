import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User
} from "firebase/auth";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { demoUser } from "../data/demo";
import { ensureUserProfile } from "../data/orgStore";
import { auth, isFirebaseConfigured, trackEvent } from "../lib/firebase";
import { signInWithGoogle as chromeGoogleLogin } from "../lib/chromeAuth";
import type { AppUser } from "@orgpage/shared";

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  authReady: boolean;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (name: string, email: string, password: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toAppUser(user: User): AppUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || user.email || "Orgpage user",
    photoURL: user.photoURL
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setUser(demoUser);
      setLoading(false);
      return;
    }

    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const nextUser = toAppUser(firebaseUser);
      await ensureUserProfile(nextUser);
      setUser(nextUser);
      setLoading(false);
    });
  }, []);

  const signInEmail = useCallback(async (email: string, password: string) => {
    if (!isFirebaseConfigured || !auth) {
      setUser({ ...demoUser, email, displayName: email.split("@")[0] || "Demo user" });
      trackEvent("login", { provider: "demo-email" });
      return;
    }

    await signInWithEmailAndPassword(auth, email, password);
    trackEvent("login", { provider: "password" });
  }, []);

  const signUpEmail = useCallback(async (name: string, email: string, password: string) => {
    if (!isFirebaseConfigured || !auth) {
      setUser({ ...demoUser, email, displayName: name || email.split("@")[0] || "Demo user" });
      trackEvent("login", { provider: "demo-signup" });
      return;
    }

    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    await ensureUserProfile(toAppUser(result.user));
    trackEvent("login", { provider: "password_signup" });
  }, []);

  const signInGoogle = useCallback(async () => {
    if (!isFirebaseConfigured) {
      setUser(demoUser);
      trackEvent("login", { provider: "demo-google" });
      return;
    }
    await chromeGoogleLogin();
    trackEvent("login", { provider: "google" });
  }, []);

  const logout = useCallback(async () => {
    if (!isFirebaseConfigured || !auth) {
      setUser(null);
      return;
    }
    await signOut(auth);
  }, []);

  const value = useMemo(
    () => ({ user, loading, authReady: !loading, signInEmail, signUpEmail, signInGoogle, logout }),
    [loading, logout, signInEmail, signInGoogle, signUpEmail, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
