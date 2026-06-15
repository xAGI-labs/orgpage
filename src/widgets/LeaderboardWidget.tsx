import { Trophy } from "lucide-react";
import { WidgetShell } from "../components/WidgetShell";
import { useOrg } from "../context/OrgContext";

export function LeaderboardWidget({ className }: { className?: string }) {
  const { bundle } = useOrg();
  if (!bundle) return null;

  return (
    <WidgetShell title="Leaderboard" eyebrow="Momentum" className={className}>
      <div className="grid gap-3">
        {bundle.leaderboard.length === 0 ? (
          <p className="rounded-md bg-[var(--brand-soft)] p-4 text-sm font-semibold text-[var(--muted)]">No leaderboard entries yet.</p>
        ) : (
          bundle.leaderboard.map((entry, index) => (
            <div key={entry.id} className="flex items-center gap-3 rounded-md bg-[var(--brand-soft)] p-3">
              <div className="grid h-9 w-9 place-items-center rounded-md bg-[var(--paper-strong)] font-black">{index + 1}</div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{entry.name}</p>
                <p className="text-xs font-semibold text-[var(--muted)]">{entry.label}</p>
              </div>
              <div className="flex items-center gap-1 font-black text-[var(--brand)]">
                <Trophy className="h-4 w-4" />
                {entry.score}
              </div>
            </div>
          ))
        )}
      </div>
    </WidgetShell>
  );
}
