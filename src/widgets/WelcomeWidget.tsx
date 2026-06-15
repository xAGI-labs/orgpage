import { WidgetShell } from "../components/WidgetShell";
import { useAuth } from "../context/AuthContext";
import { useOrg } from "../context/OrgContext";

export function WelcomeWidget({ className }: { className?: string }) {
  const { user } = useAuth();
  const { bundle } = useOrg();
  if (!bundle || !user) return null;

  return (
    <WidgetShell title={`Welcome, ${user.displayName.split(" ")[0]}`} eyebrow="Home base" className={className}>
      <p className="text-base leading-7 text-[var(--muted)]">{bundle.org.welcomeMessage}</p>
      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-md bg-[var(--brand-soft)] p-3">
          <p className="text-xl font-black">{bundle.members.length}</p>
          <p className="text-xs font-bold text-[var(--muted)]">Members</p>
        </div>
        <div className="rounded-md bg-[var(--brand-soft)] p-3">
          <p className="text-xl font-black">{bundle.announcements.length}</p>
          <p className="text-xs font-bold text-[var(--muted)]">Updates</p>
        </div>
        <div className="rounded-md bg-[var(--brand-soft)] p-3">
          <p className="text-xl font-black">{bundle.links.length}</p>
          <p className="text-xs font-bold text-[var(--muted)]">Links</p>
        </div>
      </div>
    </WidgetShell>
  );
}
