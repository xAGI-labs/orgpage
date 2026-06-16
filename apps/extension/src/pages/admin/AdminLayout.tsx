import { Bell, Home, Link as LinkIcon, Palette, Send, Users } from "lucide-react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { Button } from "../../components/Button";
import { useOrg } from "../../context/OrgContext";

const navItems = [
  { to: "/admin", label: "Overview", icon: Home },
  { to: "/admin/announcements", label: "Announcements", icon: Bell },
  { to: "/admin/theme", label: "Theme", icon: Palette },
  { to: "/admin/members", label: "Members", icon: Users },
  { to: "/admin/invites", label: "Invites", icon: Send }
];

export function AdminLayout() {
  const { bundle } = useOrg();

  return (
    <main className="app-shell">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[250px_1fr]">
        <aside className="org-card h-fit rounded-lg p-4">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-[var(--brand)] font-black text-white">{bundle?.org.name[0]}</div>
            <div>
              <p className="font-black">{bundle?.org.name}</p>
              <p className="text-xs font-bold text-[var(--muted)]">Admin dashboard</p>
            </div>
          </div>
          <nav className="grid gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold ${isActive ? "bg-[var(--brand)] text-white" : "text-[var(--muted)] hover:bg-[var(--brand-soft)] hover:text-[var(--ink)]"}`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <Link to="/newtab">
            <Button variant="secondary" className="mt-5 w-full" icon={<LinkIcon className="h-4 w-4" />}>
              New tab
            </Button>
          </Link>
        </aside>
        <Outlet />
      </div>
    </main>
  );
}
