import { addDays } from "../lib/date";
import type { AppUser, OrgBundle, OrgTheme } from "../types/orgpage";
import { defaultWidgets } from "../types/orgpage";

export const demoUser: AppUser = {
  uid: "demo-user",
  email: "demo@orgpage.local",
  displayName: "Saurav Demo",
  photoURL: ""
};

export const defaultTheme: OrgTheme = {
  brandColor: "#3f5f46",
  backgroundStyle: "linen",
  density: "rich",
  tone: "startup",
  heroMessage: "Make the new tab the place your team actually checks.",
  widgets: defaultWidgets,
  quickLinks: ["Handbook", "Roadmap", "Support queue"]
};

export const sampleBundle: OrgBundle = {
  org: {
    id: "demo-org",
    name: "Northstar Labs",
    logoUrl: "",
    welcomeMessage: "Good morning. Ship the important thing before the urgent thing takes over.",
    pinnedUpdate: "Design review is pinned for 4:00 PM. Add blockers before lunch.",
    ownerId: demoUser.uid,
    theme: defaultTheme
  },
  member: {
    uid: demoUser.uid,
    email: demoUser.email,
    displayName: demoUser.displayName,
    role: "owner",
    status: "active"
  },
  members: [
    { uid: "demo-user", email: "demo@orgpage.local", displayName: "Saurav Demo", role: "owner", status: "active" },
    { uid: "m-2", email: "maya@northstar.test", displayName: "Maya Chen", role: "admin", status: "active" },
    { uid: "m-3", email: "rio@northstar.test", displayName: "Rio Martin", role: "member", status: "active" }
  ],
  announcements: [
    {
      id: "a-1",
      title: "Customer migration window",
      body: "Infra is moving legacy accounts between 7:00 and 9:00 PM. Support has the escalation path.",
      priority: "important",
      createdBy: "Maya Chen"
    },
    {
      id: "a-2",
      title: "Q3 planning packet is live",
      body: "Read the one-page memo before Friday's team planning session.",
      priority: "normal",
      createdBy: "Saurav Demo"
    }
  ],
  onboardingTasks: [
    { id: "t-1", title: "Read the handbook", description: "Start with culture, security, and comms norms.", completedBy: ["demo-user"] },
    { id: "t-2", title: "Add your profile links", description: "Share timezone, team, and escalation preferences.", completedBy: [] },
    { id: "t-3", title: "Book manager 1:1", description: "Pick a recurring weekly slot.", completedBy: [] }
  ],
  links: [
    { id: "l-1", label: "Handbook", url: "https://example.com/handbook", category: "People" },
    { id: "l-2", label: "Linear", url: "https://linear.app", category: "Execution" },
    { id: "l-3", label: "Dashboard", url: "https://example.com/dashboard", category: "Metrics" },
    { id: "l-4", label: "Runbooks", url: "https://example.com/runbooks", category: "Ops" }
  ],
  leaderboard: [
    { id: "lb-1", name: "Maya Chen", score: 18, label: "closed customer asks" },
    { id: "lb-2", name: "Rio Martin", score: 11, label: "bugs cleared" },
    { id: "lb-3", name: "Saurav Demo", score: 7, label: "docs merged" }
  ],
  shoutouts: [
    { id: "s-1", from: "Rio", to: "Maya", message: "Unblocked the migration plan with one clean diagram.", status: "visible" },
    { id: "s-2", from: "Maya", to: "Support", message: "Covered the customer queue while infra tested rollback.", status: "visible" }
  ],
  invites: [
    {
      inviteId: "demo-invite",
      orgId: "demo-org",
      email: "newhire@northstar.test",
      role: "member",
      status: "pending",
      createdBy: demoUser.uid,
      expiresAt: addDays(new Date(), 7).toISOString()
    }
  ]
};
