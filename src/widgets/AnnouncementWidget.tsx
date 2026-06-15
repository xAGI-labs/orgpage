import { Megaphone } from "lucide-react";
import { WidgetShell } from "../components/WidgetShell";
import { formatShortDate } from "../lib/date";
import { useOrg } from "../context/OrgContext";

export function AnnouncementWidget({ className }: { className?: string }) {
  const { bundle } = useOrg();
  if (!bundle) return null;

  return (
    <WidgetShell title="Announcements" eyebrow="Read first" className={className}>
      {bundle.announcements.length === 0 ? (
        <div className="rounded-md bg-[var(--brand-soft)] p-4 text-sm font-semibold text-[var(--muted)]">
          Admins can publish the first announcement from the dashboard.
        </div>
      ) : (
        <div className="grid gap-3">
          {bundle.announcements.slice(0, 4).map((item) => (
            <article key={item.id} className="rounded-md border border-[var(--line)] bg-[var(--paper-strong)] p-4">
              <div className="flex items-start gap-3">
                <Megaphone className="mt-1 h-4 w-4 text-[var(--brand)]" />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold">{item.title}</h3>
                    {item.priority !== "normal" ? (
                      <span className="rounded-sm bg-[var(--brand)] px-2 py-0.5 text-[11px] font-black uppercase text-white">
                        {item.priority}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{item.body}</p>
                  <p className="mt-2 text-xs font-bold text-[var(--muted)]">{formatShortDate(item.createdAt)}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </WidgetShell>
  );
}
