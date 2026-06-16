import { Chrome, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Button } from "../components/Button";
import { Field } from "../components/Field";
import { useAuth } from "../context/AuthContext";
import { isFirebaseConfigured } from "../lib/firebase";

export function LoginPage() {
  const { user, signInEmail, signUpEmail, signInGoogle } = useAuth();
  const location = useLocation();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (user) return <Navigate to={location.state?.from ?? "/newtab"} replace />;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "signup") await signUpEmail(name, email, password);
      else await signInEmail(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="app-shell grid min-h-screen place-items-center">
      <section className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-between rounded-lg border border-[var(--line)] bg-[var(--brand)] p-8 text-white shadow-paper-lift">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] opacity-75">Orgpage</p>
            <h1 className="mt-6 font-display text-5xl font-black leading-[0.95] md:text-6xl">
              Your company, every new tab.
            </h1>
          </div>
          <p className="mt-10 max-w-md text-base leading-7 opacity-85">
            Announcements, onboarding, useful links, and team momentum in the one surface everyone opens all day.
          </p>
        </div>

        <form onSubmit={submit} className="org-card rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-black">{mode === "signin" ? "Sign in" : "Create account"}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {isFirebaseConfigured
                ? "Use your team account to open the right Orgpage."
                : "Firebase is not configured, so this runs in local demo mode."}
            </p>
          </div>

          <Button type="button" variant="secondary" className="w-full" icon={<Chrome className="h-4 w-4" />} onClick={signInGoogle}>
            Continue with Google
          </Button>

          <div className="my-5 h-px bg-[var(--line)]" />

          <div className="grid gap-4">
            {mode === "signup" ? <Field label="Name" value={name} onChange={(event) => setName(event.target.value)} /> : null}
            <Field label="Email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
            <Field label="Password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>

          {error ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-800">{error}</p> : null}

          <Button type="submit" loading={busy} className="mt-5 w-full" icon={<Mail className="h-4 w-4" />}>
            {mode === "signin" ? "Sign in with email" : "Create account"}
          </Button>

          <button
            type="button"
            className="mt-4 text-sm font-semibold text-[var(--muted)] underline-offset-4 hover:underline"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? "Need an account? Create one" : "Already have an account? Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
