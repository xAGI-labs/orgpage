import { LogOut, Settings } from "lucide-react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { ProfileAvatar } from "../components/ProfileAvatar";
import { useAuth } from "../context/AuthContext";
import { useOrg } from "../context/OrgContext";
import { canManage } from "../data/orgStore";
import { AnnouncementWidget } from "../widgets/AnnouncementWidget";
import { CalendarPlaceholderWidget } from "../widgets/CalendarPlaceholderWidget";
import { LeaderboardWidget } from "../widgets/LeaderboardWidget";
import { LinksWidget } from "../widgets/LinksWidget";
import { OnboardingWidget } from "../widgets/OnboardingWidget";
import { ShoutoutsWidget } from "../widgets/ShoutoutsWidget";
import { WelcomeWidget } from "../widgets/WelcomeWidget";

const todayLabel = () =>
  new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric"
  }).format(new Date());

export function NewTabPage() {
  const { user, logout } = useAuth();
  const { bundle } = useOrg();

  if (!bundle || !user) return null;

  const { org, member } = bundle;
  const theme = org.theme;
  const densityClass = `density-${theme.density}`;

  const quietWidgets = [
    theme.widgets.links ? <LinksWidget key="links" tone="quiet" /> : null,
    theme.widgets.leaderboard ? <LeaderboardWidget key="leaderboard" tone="quiet" /> : null,
    theme.widgets.calendar ? <CalendarPlaceholderWidget key="calendar" tone="quiet" /> : null
  ].filter(Boolean);

  return (
    <main
      className={`app-shell ${densityClass} ${theme.backgroundStyle === "graph" ? "graph-bg" : ""}`}
      style={{ "--brand": theme.brandColor } as CSSProperties}
    >
      <div className="mx-auto max-w-6xl">
        <header className="org-bar mb-6 flex flex-col gap-3 rounded-lg px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {org.logoUrl ? (
              <img src={org.logoUrl} alt="" className="h-10 w-10 rounded-md object-cover" />
            ) : (
              <div
                aria-hidden="true"
                className="grid h-10 w-10 place-items-center rounded-md bg-[var(--brand)] font-display text-lg font-black text-white"
              >
                {org.name[0]}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[var(--ink)]">{org.name}</p>
              {theme.heroMessage ? (
                <p className="truncate text-xs text-[var(--muted)]">{theme.heroMessage}</p>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {canManage(member.role) ? (
              <Link to="/admin">
                <Button variant="ghost" icon={<Settings className="h-4 w-4" />}>
                  Admin
                </Button>
              </Link>
            ) : null}
            <Button variant="ghost" onClick={logout} icon={<LogOut className="h-4 w-4" />} aria-label="Sign out">
              <span className="sr-only sm:not-sr-only">Logout</span>
            </Button>
            <ProfileAvatar name={user.displayName} src={user.photoURL} />
          </div>
        </header>

        <section className="hero-today enter mb-8 rounded-lg p-6 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
            Today &middot; {todayLabel()}
          </p>
          <p
            className="mt-3 font-display text-2xl font-bold leading-tight text-[var(--ink)] md:text-3xl"
            style={{ textWrap: "balance" } as CSSProperties}
          >
            {org.pinnedUpdate}
          </p>
        </section>

        <section className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-12">
          {theme.widgets.announcements ? <AnnouncementWidget className="lg:col-span-7" /> : null}
          {theme.widgets.onboarding ? <OnboardingWidget className="lg:col-span-5" /> : null}
        </section>

        <section className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-12">
          {theme.widgets.shoutouts ? <ShoutoutsWidget className="lg:col-span-7" /> : null}
          {theme.widgets.welcome ? <WelcomeWidget className="lg:col-span-5" /> : null}
        </section>

        {quietWidgets.length > 0 ? (
          <section
            className="grid gap-x-6 gap-y-5 sm:grid-cols-2"
            style={{
              gridTemplateColumns:
                quietWidgets.length >= 3 ? "repeat(auto-fit, minmax(220px, 1fr))" : undefined
            }}
          >
            {quietWidgets}
          </section>
        ) : null}
      </div>
    </main>
  );
}
