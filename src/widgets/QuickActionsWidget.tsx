import { Plus, Send, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { useOrg } from "../context/OrgContext";
import { canManage } from "../data/orgStore";

export function QuickActionsWidget() {
  const { bundle } = useOrg();
  if (!bundle) return null;

  return (
    <section className="org-card rounded-lg p-4">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-[var(--muted)]">Quick actions</p>
      <div className="grid grid-cols-2 gap-2">
        {canManage(bundle.member.role) ? (
          <>
            <Link to="/admin/announcements">
              <Button variant="secondary" className="w-full" icon={<Plus className="h-4 w-4" />}>
                Update
              </Button>
            </Link>
            <Link to="/admin/invites">
              <Button variant="secondary" className="w-full" icon={<Send className="h-4 w-4" />}>
                Invite
              </Button>
            </Link>
          </>
        ) : null}
        <Link to="/admin/theme" className={canManage(bundle.member.role) ? "" : "col-span-2"}>
          <Button variant="ghost" className="w-full" icon={<Settings className="h-4 w-4" />}>
            Settings
          </Button>
        </Link>
      </div>
    </section>
  );
}
