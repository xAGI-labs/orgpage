import { ExternalLink, LogOut, Settings, Sparkles } from "lucide-react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { ProfileAvatar } from "../components/ProfileAvatar";
import { useAuth } from "../context/AuthContext";
import { useOrg } from "../context/OrgContext";
import { canManage } from "../data/orgStore";
import { CalendarPlaceholderWidget } from "../widgets/CalendarPlaceholderWidget";
import { AnnouncementWidget } from "../widgets/AnnouncementWidget";
import { LeaderboardWidget } from "../widgets/LeaderboardWidget";
import { LinksWidget } from "../widgets/LinksWidget";
import { OnboardingWidget } from "../widgets/OnboardingWidget";
import { QuickActionsWidget } from "../widgets/QuickActionsWidget";
import { ShoutoutsWidget } from "../widgets/ShoutoutsWidget";
import { WelcomeWidget } from "../widgets/WelcomeWidget";

export function NewTabPage() {
  const { user, logout } = useAuth();
  const { bundle } = useOrg();

  if (!bundle || !user) return null;

  const { org, member } = bundle;
  const theme = org.theme;
  const densityClass = `density-${theme.density}`;

  return (
    <main
      className={`app-shell ${densityClass} ${theme.backgroundStyle === "graph" ? "graph-bg" : ""}`}
      style={{ "--brand": theme.brandColor } as CSSProperties}
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 rounded-lg border border-[var(--line)] bg-[var(--paper-strong)]/80 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            {org.logoUrl ? (
              <img src={org.logoUrl} alt="" className="h-12 w-12 rounded-md object-cover" />
            ) : (
              <div className="grid h-12 w-12 place-items-center rounded-md bg-[var(--brand)] font-display text-2xl font-black text-white">
                {org.name[0]}
              </div>
            )}
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{org.name}</p>
              <h1 className="font-display text-3xl font-black leading-none md:text-4xl">{theme.heroMessage}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {canManage(member.role) ? (
              <Link to="/admin">
                <Button variant="secondary" icon={<Settings className="h-4 w-4" />}>
                  Admin
                </Button>
              </Link>
            ) : null}
            <Button variant="ghost" onClick={logout} icon={<LogOut className="h-4 w-4" />}>
              Logout
            </Button>
            <ProfileAvatar name={user.displayName} src={user.photoURL} />
          </div>
        </header>

        <section className="mb-6 grid gap-4 lg:grid-cols-[1fr_0.7fr]">
          <div className="rounded-lg bg-[var(--brand)] p-6 text-white shadow-paper-lift">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-1 h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm font-black uppercase tracking-[0.14em] opacity-75">Today&apos;s focus</p>
                <p className="mt-2 text-2xl font-black leading-tight">{org.pinnedUpdate}</p>
              </div>
            </div>
          </div>
          <QuickActionsWidget />
        </section>

        <section className="grid gap-4 lg:grid-cols-12">
          {theme.widgets.welcome ? <WelcomeWidget className="lg:col-span-5" /> : null}
          {theme.widgets.announcements ? <AnnouncementWidget className="lg:col-span-7" /> : null}
          {theme.widgets.onboarding ? <OnboardingWidget className="lg:col-span-4" /> : null}
          {theme.widgets.links ? <LinksWidget className="lg:col-span-4" /> : null}
          {theme.widgets.leaderboard ? <LeaderboardWidget className="lg:col-span-4" /> : null}
          {theme.widgets.shoutouts ? <ShoutoutsWidget className="lg:col-span-8" /> : null}
          {theme.widgets.calendar ? <CalendarPlaceholderWidget className="lg:col-span-4" /> : null}
        </section>

        <footer className="mt-8 flex items-center justify-between border-t border-[var(--line)] pt-5 text-xs font-semibold text-[var(--muted)]">
          <span>Orgpage replaces your Chrome new tab.</span>
          <a href="https://firebase.google.com/docs" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-[var(--ink)]">
            Firebase docs <ExternalLink className="h-3 w-3" />
          </a>
        </footer>
      </div>
    </main>
  );
}
