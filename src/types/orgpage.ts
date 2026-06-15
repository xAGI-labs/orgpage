export type Role = "owner" | "admin" | "member";
export type InviteStatus = "pending" | "accepted" | "revoked" | "expired";
export type LayoutDensity = "minimal" | "standard" | "rich";
export type Tone = "professional" | "fun" | "startup" | "formal";

export type WidgetKey =
  | "welcome"
  | "announcements"
  | "onboarding"
  | "links"
  | "leaderboard"
  | "shoutouts"
  | "calendar"
  | "quickActions";

export interface OrgTheme {
  brandColor: string;
  logoUrl?: string;
  backgroundStyle: "linen" | "graph" | "solid" | "midnight";
  density: LayoutDensity;
  tone: Tone;
  heroMessage: string;
  widgets: Record<WidgetKey, boolean>;
  quickLinks: string[];
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string;
  photoURL?: string | null;
  orgId?: string;
  role?: Role;
  createdAt?: unknown;
}

export interface Organization {
  id: string;
  name: string;
  logoUrl?: string;
  welcomeMessage: string;
  pinnedUpdate: string;
  ownerId: string;
  theme: OrgTheme;
  createdAt?: unknown;
}

export interface Member {
  uid: string;
  email: string | null;
  displayName: string;
  photoURL?: string | null;
  role: Role;
  status: "active" | "invited";
  joinedAt?: unknown;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  priority: "normal" | "important" | "urgent";
  createdBy: string;
  createdAt?: unknown;
}

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  completedBy: string[];
  createdAt?: unknown;
}

export interface CompanyLink {
  id: string;
  label: string;
  url: string;
  category: string;
  createdAt?: unknown;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  label: string;
  avatarUrl?: string;
  createdAt?: unknown;
}

export interface Shoutout {
  id: string;
  from: string;
  to: string;
  message: string;
  status: "visible" | "hidden";
  createdAt?: unknown;
}

export interface Invite {
  inviteId: string;
  orgId: string;
  email?: string;
  role: Exclude<Role, "owner">;
  status: InviteStatus;
  createdBy: string;
  createdAt?: unknown;
  expiresAt: unknown;
  acceptedBy?: string;
  acceptedAt?: unknown;
}

export interface OrgBundle {
  org: Organization;
  member: Member;
  members: Member[];
  announcements: Announcement[];
  onboardingTasks: OnboardingTask[];
  links: CompanyLink[];
  leaderboard: LeaderboardEntry[];
  shoutouts: Shoutout[];
  invites: Invite[];
}

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string;
  photoURL?: string | null;
}

export const defaultWidgets: OrgTheme["widgets"] = {
  welcome: true,
  announcements: true,
  onboarding: true,
  links: true,
  leaderboard: true,
  shoutouts: true,
  calendar: true,
  quickActions: true
};
