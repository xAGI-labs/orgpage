import { Trophy } from "lucide-react";
import { WidgetShell } from "../components/WidgetShell";
import { useOrg } from "../context/OrgContext";

export function LeaderboardWidget({ className, tone }: { className?: string; tone?: "primary" | "quiet" }) {
  const { bundle } = useOrg();
  if (!bundle) return null;

  return (
    <WidgetShell title="Leaderboard" eyebrow="Momentum" className={className} tone={tone}>
      <ol className="grid gap-2">
        {bundle.leaderboard.length === 0 ? (
          <li className="rounded-md border border-[var(--line)] p-4 text-sm font-semibold text-[var(--muted)]">No leaderboard entries yet.</li>
        ) : (
          bundle.leaderboard.map((entry, index) => (
            <li key={entry.id} className="flex items-center gap-3 py-1">
              <span
                aria-hidden="true"
                className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-xs font-bold text-[var(--muted)]"
              >
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[var(--ink)]">{entry.name}</p>
                <p className="truncate text-xs text-[var(--muted)]">{entry.label}</p>
              </div>
              <span className="flex shrink-0 items-center gap-1 text-sm font-bold text-[var(--ink)]">
                <Trophy className="h-3.5 w-3.5 text-[var(--brand)]" aria-hidden="true" />
                {entry.score}
              </span>
            </li>
          ))
        )}
      </ol>
    </WidgetShell>
  );
}
