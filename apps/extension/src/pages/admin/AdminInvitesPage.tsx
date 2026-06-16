import { Copy, ShieldOff } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Button } from "../../components/Button";
import { Field, Select } from "../../components/Field";
import { WidgetShell } from "../../components/WidgetShell";
import { useOrg } from "../../context/OrgContext";
import { formatShortDate } from "../../lib/date";
import type { Role } from "@orgpage/shared";

export function AdminInvitesPage() {
  const { bundle, inviteMember, revokeMemberInvite } = useOrg();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Exclude<Role, "owner">>("member");
  const [lastLink, setLastLink] = useState("");

  const baseUrl = useMemo(() => {
    const root = window.location.origin + window.location.pathname;
    return window.location.protocol === "chrome-extension:" ? `${root}#/invite/` : `${window.location.origin}/invite/`;
  }, []);

  if (!bundle) return null;

  async function submit(event: FormEvent) {
    event.preventDefault();
    const invite = await inviteMember({ email, role });
      if (invite) setLastLink(`${baseUrl}${invite.inviteId}?org=${encodeURIComponent(invite.orgId)}`);
    setEmail("");
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
      <WidgetShell title="Create invite" eyebrow="Team access">
        <form onSubmit={submit} className="grid gap-4">
          <Field label="Email" type="email" placeholder="optional@company.com" value={email} onChange={(event) => setEmail(event.target.value)} />
          <Select label="Role" value={role} onChange={(event) => setRole(event.target.value as Exclude<Role, "owner">)}>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </Select>
          <Button>Create invite link</Button>
        </form>
        {lastLink ? (
          <div className="mt-5 rounded-md bg-[var(--brand-soft)] p-3">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--muted)]">Invite link</p>
            <div className="mt-2 flex gap-2">
              <input readOnly value={lastLink} className="min-w-0 flex-1 rounded-md border border-[var(--line)] bg-[var(--paper-strong)] px-3 text-xs" />
              <Button type="button" variant="secondary" icon={<Copy className="h-4 w-4" />} onClick={() => navigator.clipboard.writeText(lastLink)}>
                Copy
              </Button>
            </div>
          </div>
        ) : null}
      </WidgetShell>

      <WidgetShell title="Pending invites" eyebrow={`${bundle.invites.length} total`}>
        <div className="grid gap-3">
          {bundle.invites.length === 0 ? (
            <p className="rounded-md bg-[var(--brand-soft)] p-4 text-sm font-semibold text-[var(--muted)]">No pending invites.</p>
          ) : (
            bundle.invites.map((invite) => (
              <div key={invite.inviteId} className="flex flex-col gap-3 rounded-md border border-[var(--line)] bg-[var(--paper-strong)] p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-black">{invite.email || "Open invite"}</p>
                  <p className="text-sm font-semibold text-[var(--muted)]">
                    {invite.role} · {invite.status} · expires {formatShortDate(invite.expiresAt)}
                  </p>
                </div>
                {invite.status === "pending" ? (
                  <Button variant="danger" icon={<ShieldOff className="h-4 w-4" />} onClick={() => revokeMemberInvite(invite.inviteId)}>
                    Revoke
                  </Button>
                ) : null}
              </div>
            ))
          )}
        </div>
      </WidgetShell>
    </section>
  );
}
