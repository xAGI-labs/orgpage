import { EyeOff, Users } from "lucide-react";
import { Button } from "../../components/Button";
import { ProfileAvatar } from "../../components/ProfileAvatar";
import { WidgetShell } from "../../components/WidgetShell";
import { useOrg } from "../../context/OrgContext";

export function AdminMembersPage() {
  const { bundle, moderateShoutout } = useOrg();
  if (!bundle) return null;

  return (
    <section className="grid gap-4">
      <WidgetShell title="Members" eyebrow={`${bundle.members.length} active`}>
        <div className="grid gap-3">
          {bundle.members.map((member) => (
            <div key={member.uid} className="flex items-center gap-3 rounded-md border border-[var(--line)] bg-[var(--paper-strong)] p-4">
              <ProfileAvatar name={member.displayName} src={member.photoURL} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-black">{member.displayName}</p>
                <p className="truncate text-sm font-semibold text-[var(--muted)]">{member.email}</p>
              </div>
              <span className="rounded-md bg-[var(--brand-soft)] px-3 py-1 text-xs font-black uppercase text-[var(--brand)]">{member.role}</span>
            </div>
          ))}
        </div>
      </WidgetShell>

      <WidgetShell title="Shoutout moderation" eyebrow="Visible kudos">
        <div className="grid gap-3">
          {bundle.shoutouts.length === 0 ? (
            <p className="rounded-md bg-[var(--brand-soft)] p-4 text-sm font-semibold text-[var(--muted)]">
              <Users className="mb-2 h-5 w-5" />
              No shoutouts yet.
            </p>
          ) : (
            bundle.shoutouts.map((shoutout) => (
              <article key={shoutout.id} className="flex flex-col gap-3 rounded-md border border-[var(--line)] bg-[var(--paper-strong)] p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm leading-6 text-[var(--muted)]">{shoutout.message}</p>
                  <p className="mt-2 text-sm font-black">
                    {shoutout.from} → {shoutout.to}
                  </p>
                </div>
                {shoutout.status === "visible" ? (
                  <Button variant="secondary" icon={<EyeOff className="h-4 w-4" />} onClick={() => moderateShoutout(shoutout.id, "hidden")}>
                    Hide
                  </Button>
                ) : null}
              </article>
            ))
          )}
        </div>
      </WidgetShell>
    </section>
  );
}
