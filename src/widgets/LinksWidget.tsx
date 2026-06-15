import { ExternalLink } from "lucide-react";
import { WidgetShell } from "../components/WidgetShell";
import { useOrg } from "../context/OrgContext";
import { trackEvent } from "../lib/firebase";

export function LinksWidget({ className }: { className?: string }) {
  const { bundle } = useOrg();
  if (!bundle) return null;

  return (
    <WidgetShell title="Company links" eyebrow="Fast paths" className={className}>
      {bundle.links.length === 0 ? (
        <p className="rounded-md bg-[var(--brand-soft)] p-4 text-sm font-semibold text-[var(--muted)]">No links yet.</p>
      ) : (
        <div className="grid gap-2">
          {bundle.links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("link_clicked", { linkId: link.id, orgId: bundle.org.id })}
              className="flex items-center justify-between rounded-md border border-[var(--line)] bg-[var(--paper-strong)] px-3 py-3 text-sm font-bold hover:bg-[var(--brand-soft)]"
            >
              <span>
                {link.label}
                <span className="ml-2 text-xs font-semibold text-[var(--muted)]">{link.category}</span>
              </span>
              <ExternalLink className="h-4 w-4 text-[var(--muted)]" />
            </a>
          ))}
        </div>
      )}
    </WidgetShell>
  );
}
