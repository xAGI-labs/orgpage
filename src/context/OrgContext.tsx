import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  acceptInvite,
  completeTask,
  createAnnouncement,
  createInvite,
  createLeaderboardEntry,
  createLink,
  createOrganization,
  createShoutout,
  createTask,
  loadOrgBundle,
  revokeInvite,
  setShoutoutStatus,
  updateOrganization,
  updateTheme
} from "../data/orgStore";
import { trackEvent } from "../lib/firebase";
import type {
  Announcement,
  CompanyLink,
  Invite,
  LeaderboardEntry,
  OnboardingTask,
  OrgBundle,
  OrgTheme,
  Organization,
  Role,
  Shoutout
} from "../types/orgpage";
import { useAuth } from "./AuthContext";

interface OrgContextValue {
  bundle: OrgBundle | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createOrg: (name: string, theme?: Partial<OrgTheme>) => Promise<void>;
  updateOrg: (patch: Partial<Organization>) => Promise<void>;
  saveTheme: (theme: OrgTheme) => Promise<void>;
  addAnnouncement: (input: Pick<Announcement, "title" | "body" | "priority">) => Promise<void>;
  addLink: (input: Omit<CompanyLink, "id" | "createdAt">) => Promise<void>;
  addTask: (input: Omit<OnboardingTask, "id" | "completedBy" | "createdAt">) => Promise<void>;
  addLeaderboardEntry: (input: Omit<LeaderboardEntry, "id" | "createdAt">) => Promise<void>;
  markTaskDone: (taskId: string) => Promise<void>;
  addShoutout: (input: Pick<Shoutout, "to" | "message">) => Promise<void>;
  moderateShoutout: (shoutoutId: string, status: Shoutout["status"]) => Promise<void>;
  inviteMember: (input: { email?: string; role: Exclude<Role, "owner"> }) => Promise<Invite | null>;
  revokeMemberInvite: (inviteId: string) => Promise<void>;
  acceptMemberInvite: (inviteId: string, orgId?: string) => Promise<void>;
}

const OrgContext = createContext<OrgContextValue | null>(null);

export function OrgProvider({ children }: { children: ReactNode }) {
  const { user, authReady } = useAuth();
  const [bundle, setBundle] = useState<OrgBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!authReady) return;
    if (!user) {
      setBundle(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const next = await loadOrgBundle(user);
      setBundle(next);
      if (next) trackEvent("new_tab_opened", { orgId: next.org.id });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load Orgpage.");
    } finally {
      setLoading(false);
    }
  }, [authReady, user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const withBundle = useCallback(
    async (operation: (current: OrgBundle) => Promise<OrgBundle | null | void>) => {
      if (!bundle) throw new Error("No organization loaded.");
      const next = await operation(bundle);
      if (next) setBundle(next);
      else await refresh();
    },
    [bundle, refresh]
  );

  const value = useMemo<OrgContextValue>(
    () => ({
      bundle,
      loading,
      error,
      refresh,
      createOrg: async (name, theme) => {
        if (!user) throw new Error("Sign in first.");
        const next = await createOrganization(user, name, theme);
        setBundle(next);
      },
      updateOrg: (patch) => withBundle((current) => updateOrganization(current, patch)),
      saveTheme: (theme) => withBundle((current) => updateTheme(current, theme)),
      addAnnouncement: (input) =>
        withBundle((current) => {
          if (!user) throw new Error("Sign in first.");
          return createAnnouncement(current, user, input);
        }),
      addLink: (input) => withBundle((current) => createLink(current, input)),
      addTask: (input) => withBundle((current) => createTask(current, input)),
      addLeaderboardEntry: (input) => withBundle((current) => createLeaderboardEntry(current, input)),
      markTaskDone: (taskId) =>
        withBundle((current) => {
          if (!user) throw new Error("Sign in first.");
          return completeTask(current, taskId, user);
        }),
      addShoutout: (input) =>
        withBundle((current) => {
          if (!user) throw new Error("Sign in first.");
          return createShoutout(current, user, input);
        }),
      moderateShoutout: (shoutoutId, status) => withBundle((current) => setShoutoutStatus(current, shoutoutId, status)),
      inviteMember: async (input) => {
        if (!bundle || !user) throw new Error("No organization loaded.");
        const result = await createInvite(bundle, user, input);
        if (result.bundle) setBundle(result.bundle);
        else await refresh();
        return result.invite;
      },
      revokeMemberInvite: (inviteId) => withBundle((current) => revokeInvite(current, inviteId)),
      acceptMemberInvite: async (inviteId, orgId) => {
        if (!user) throw new Error("Sign in first.");
        const next = await acceptInvite(inviteId, user, orgId);
        setBundle(next);
      }
    }),
    [bundle, error, loading, refresh, user, withBundle]
  );

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
}

export function useOrg() {
  const value = useContext(OrgContext);
  if (!value) throw new Error("useOrg must be used inside OrgProvider");
  return value;
}
