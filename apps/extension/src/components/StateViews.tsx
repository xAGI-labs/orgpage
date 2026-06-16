import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "./Button";

export function LoadingView({ label = "Loading Orgpage" }: { label?: string }) {
  return (
    <main className="app-shell grid place-items-center">
      <div className="org-card flex items-center gap-3 rounded-lg px-5 py-4 text-sm font-semibold text-[var(--muted)]">
        <Loader2 className="h-5 w-5 animate-spin text-[var(--brand)]" />
        {label}
      </div>
    </main>
  );
}

export function ErrorView({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <main className="app-shell grid place-items-center">
      <div className="org-card max-w-md rounded-lg p-6">
        <AlertTriangle className="mb-4 h-6 w-6 text-[var(--danger)]" />
        <h1 className="text-xl font-bold">Something needs attention</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{message}</p>
        {onRetry ? (
          <Button className="mt-5" onClick={onRetry}>
            Try again
          </Button>
        ) : null}
      </div>
    </main>
  );
}
