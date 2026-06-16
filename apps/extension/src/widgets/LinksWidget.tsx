import { ExternalLink } from "lucide-react";
import { WidgetShell } from "../components/WidgetShell";
import { useOrg } from "../context/OrgContext";
import { trackEvent } from "../lib/firebase";

export function LinksWidget({ className, tone }: { className?: string; tone?: "primary" | "quiet" }) {
  const { bundle } = useOrg();
  if (!bundle) return null;

  return (
    <WidgetShell title="Company links" className={className} tone={tone}>
      {bundle.links.length === 0 ? (
        <p className="rounded-md border border-[var(--line)] p-4 text-sm font-semibold text-[var(--muted)]">No links yet.</p>
      ) : (
        <ul className="grid gap-1">
          {bundle.links.map((link) => (
            <li key={link.id}>
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent("link_clicked", { linkId: link.id, orgId: bundle.org.id })}
                className="group flex items-center justify-between gap-2 rounded-md px-2 py-2 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--brand-soft)]"
              >
                <span className="min-w-0 truncate">
                  {link.label}
                  <span className="ml-2 text-xs font-normal text-[var(--muted)]">{link.category}</span>
                </span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-[var(--muted)] group-hover:text-[var(--ink)]" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </WidgetShell>
  );
}
