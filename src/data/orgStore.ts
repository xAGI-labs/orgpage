import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  writeBatch
} from "firebase/firestore";
import { addDays } from "../lib/date";
import { db, isFirebaseConfigured, trackEvent } from "../lib/firebase";
import { defaultTheme, sampleBundle } from "./demo";
import type {
  Announcement,
  AppUser,
  CompanyLink,
  Invite,
  LeaderboardEntry,
  Member,
  OnboardingTask,
  OrgBundle,
  OrgTheme,
  Organization,
  Role,
  Shoutout,
  UserProfile
} from "../types/orgpage";

const DEMO_KEY = "orgpage-demo-bundle";

function nowOrServer() {
  return isFirebaseConfigured ? serverTimestamp() : new Date().toISOString();
}

function newId(prefix: string) {
  if (crypto.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getDemoBundle(): OrgBundle {
  const stored = localStorage.getItem(DEMO_KEY);
  if (!stored) return sampleBundle;
  try {
    return JSON.parse(stored) as OrgBundle;
  } catch {
    return sampleBundle;
  }
}

function saveDemoBundle(bundle: OrgBundle) {
  localStorage.setItem(DEMO_KEY, JSON.stringify(bundle));
}

function mapDoc<T extends object>(snapshot: { id: string; data: () => object }) {
  return { id: snapshot.id, ...snapshot.data() } as T & { id: string };
}

export function canManage(role?: Role) {
  return role === "owner" || role === "admin";
}

export async function ensureUserProfile(user: AppUser) {
  if (!isFirebaseConfigured || !db) return;
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email || "Orgpage user",
      photoURL: user.photoURL ?? null,
      createdAt: serverTimestamp()
    });
  } else {
    await updateDoc(userRef, {
      email: user.email,
      displayName: user.displayName || user.email || "Orgpage user",
      photoURL: user.photoURL ?? null
    });
  }
}

export async function loadOrgBundle(user: AppUser): Promise<OrgBundle | null> {
  if (!isFirebaseConfigured || !db) {
    return getDemoBundle();
  }

  const userSnapshot = await getDoc(doc(db, "users", user.uid));
  if (!userSnapshot.exists()) return null;

  const userProfile = userSnapshot.data() as UserProfile;
  if (!userProfile.orgId) return null;

  const orgRef = doc(db, "organizations", userProfile.orgId);
  const [orgSnapshot, memberSnapshot] = await Promise.all([
    getDoc(orgRef),
    getDoc(doc(db, "organizations", userProfile.orgId, "members", user.uid))
  ]);

  if (!orgSnapshot.exists() || !memberSnapshot.exists()) return null;

  const member = memberSnapshot.data() as Member;
  const org = { id: orgSnapshot.id, ...orgSnapshot.data() } as Organization;

  const [
    membersSnapshot,
    announcementsSnapshot,
    tasksSnapshot,
    linksSnapshot,
    leaderboardSnapshot,
    shoutoutsSnapshot,
    invitesSnapshot
  ] = await Promise.all([
    getDocs(collection(orgRef, "members")),
    getDocs(query(collection(orgRef, "announcements"), orderBy("createdAt", "desc"), limit(12))),
    getDocs(collection(orgRef, "onboardingTasks")),
    getDocs(collection(orgRef, "links")),
    getDocs(query(collection(orgRef, "leaderboard"), orderBy("score", "desc"), limit(10))),
    getDocs(query(collection(orgRef, "shoutouts"), where("status", "==", "visible"), limit(20))),
    canManage(member.role) ? getDocs(query(collection(orgRef, "invites"), orderBy("createdAt", "desc"), limit(50))) : null
  ]);

  return {
    org,
    member,
    members: membersSnapshot.docs.map((item) => item.data() as Member),
    announcements: announcementsSnapshot.docs.map((item) => mapDoc<Announcement>(item)),
    onboardingTasks: tasksSnapshot.docs.map((item) => mapDoc<OnboardingTask>(item)),
    links: linksSnapshot.docs.map((item) => mapDoc<CompanyLink>(item)),
    leaderboard: leaderboardSnapshot.docs.map((item) => mapDoc<LeaderboardEntry>(item)),
    shoutouts: shoutoutsSnapshot.docs.map((item) => mapDoc<Shoutout>(item)),
    invites: invitesSnapshot?.docs.map((item) => item.data() as Invite) ?? []
  };
}

export async function createOrganization(user: AppUser, name: string, theme: Partial<OrgTheme> = {}) {
  const orgId = newId("org");
  const org: Organization = {
    id: orgId,
    name,
    logoUrl: theme.logoUrl ?? "",
    welcomeMessage: "Welcome to your team homepage.",
    pinnedUpdate: "Pin the one thing everyone should know today.",
    ownerId: user.uid,
    theme: { ...defaultTheme, ...theme }
  };

  const member: Member = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || user.email || "Owner",
    photoURL: user.photoURL,
    role: "owner",
    status: "active"
  };

  if (!isFirebaseConfigured || !db) {
    const bundle: OrgBundle = {
      ...sampleBundle,
      org,
      member,
      members: [member],
      announcements: [],
      onboardingTasks: [],
      links: [],
      leaderboard: [],
      shoutouts: [],
      invites: []
    };
    saveDemoBundle(bundle);
    trackEvent("org_created");
    return bundle;
  }

  const batch = writeBatch(db);
  const orgRef = doc(db, "organizations", orgId);
  batch.set(orgRef, { ...org, createdAt: serverTimestamp() });
  batch.set(doc(db, "organizations", orgId, "members", user.uid), { ...member, joinedAt: serverTimestamp() });
  batch.set(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || user.email || "Owner",
    photoURL: user.photoURL ?? null,
    orgId,
    role: "owner",
    createdAt: serverTimestamp()
  });
  await batch.commit();
  trackEvent("org_created");
  return loadOrgBundle(user);
}

export async function updateOrganization(bundle: OrgBundle, patch: Partial<Organization>) {
  if (!isFirebaseConfigured || !db) {
    const next = { ...bundle, org: { ...bundle.org, ...patch } };
    saveDemoBundle(next);
    return next;
  }
  await updateDoc(doc(db, "organizations", bundle.org.id), patch);
  return null;
}

export async function updateTheme(bundle: OrgBundle, theme: OrgTheme) {
  return updateOrganization(bundle, { theme, logoUrl: theme.logoUrl ?? bundle.org.logoUrl });
}

export async function createAnnouncement(bundle: OrgBundle, user: AppUser, input: Pick<Announcement, "title" | "body" | "priority">) {
  const announcement: Announcement = {
    id: newId("announcement"),
    ...input,
    createdBy: user.displayName || user.email || "Teammate",
    createdAt: nowOrServer()
  };

  if (!isFirebaseConfigured || !db) {
    const next = { ...bundle, announcements: [announcement, ...bundle.announcements] };
    saveDemoBundle(next);
    trackEvent("announcement_created");
    return next;
  }

  await setDoc(doc(db, "organizations", bundle.org.id, "announcements", announcement.id), announcement);
  trackEvent("announcement_created", { orgId: bundle.org.id });
  return null;
}

export async function createLink(bundle: OrgBundle, input: Omit<CompanyLink, "id" | "createdAt">) {
  const link: CompanyLink = { id: newId("link"), ...input, createdAt: nowOrServer() };
  if (!isFirebaseConfigured || !db) {
    const next = { ...bundle, links: [...bundle.links, link] };
    saveDemoBundle(next);
    return next;
  }
  await setDoc(doc(db, "organizations", bundle.org.id, "links", link.id), link);
  return null;
}

export async function createTask(bundle: OrgBundle, input: Omit<OnboardingTask, "id" | "completedBy" | "createdAt">) {
  const task: OnboardingTask = { id: newId("task"), ...input, completedBy: [], createdAt: nowOrServer() };
  if (!isFirebaseConfigured || !db) {
    const next = { ...bundle, onboardingTasks: [...bundle.onboardingTasks, task] };
    saveDemoBundle(next);
    return next;
  }
  await setDoc(doc(db, "organizations", bundle.org.id, "onboardingTasks", task.id), task);
  return null;
}

export async function createLeaderboardEntry(bundle: OrgBundle, input: Omit<LeaderboardEntry, "id" | "createdAt">) {
  const entry: LeaderboardEntry = { id: newId("leaderboard"), ...input, createdAt: nowOrServer() };
  if (!isFirebaseConfigured || !db) {
    const next = { ...bundle, leaderboard: [...bundle.leaderboard, entry].sort((a, b) => b.score - a.score) };
    saveDemoBundle(next);
    return next;
  }
  await setDoc(doc(db, "organizations", bundle.org.id, "leaderboard", entry.id), entry);
  return null;
}

export async function completeTask(bundle: OrgBundle, taskId: string, user: AppUser) {
  if (!isFirebaseConfigured || !db) {
    const next = {
      ...bundle,
      onboardingTasks: bundle.onboardingTasks.map((task) =>
        task.id === taskId && !task.completedBy.includes(user.uid)
          ? { ...task, completedBy: [...task.completedBy, user.uid] }
          : task
      )
    };
    saveDemoBundle(next);
    trackEvent("onboarding_task_completed");
    return next;
  }

  await updateDoc(doc(db, "organizations", bundle.org.id, "onboardingTasks", taskId), {
    completedBy: arrayUnion(user.uid)
  });
  trackEvent("onboarding_task_completed", { orgId: bundle.org.id });
  return null;
}

export async function setShoutoutStatus(bundle: OrgBundle, shoutoutId: string, status: Shoutout["status"]) {
  if (!isFirebaseConfigured || !db) {
    const next = {
      ...bundle,
      shoutouts: bundle.shoutouts.map((shoutout) => (shoutout.id === shoutoutId ? { ...shoutout, status } : shoutout))
    };
    saveDemoBundle(next);
    return next;
  }
  await updateDoc(doc(db, "organizations", bundle.org.id, "shoutouts", shoutoutId), { status });
  return null;
}

export async function createShoutout(bundle: OrgBundle, user: AppUser, input: Pick<Shoutout, "to" | "message">) {
  const shoutout: Shoutout = {
    id: newId("shoutout"),
    from: user.displayName || user.email || "Teammate",
    to: input.to,
    message: input.message,
    status: "visible",
    createdAt: nowOrServer()
  };

  if (!isFirebaseConfigured || !db) {
    const next = { ...bundle, shoutouts: [shoutout, ...bundle.shoutouts] };
    saveDemoBundle(next);
    trackEvent("shoutout_created");
    return next;
  }

  await setDoc(doc(db, "organizations", bundle.org.id, "shoutouts", shoutout.id), shoutout);
  trackEvent("shoutout_created", { orgId: bundle.org.id });
  return null;
}

export async function createInvite(
  bundle: OrgBundle,
  user: AppUser,
  input: { email?: string; role: Exclude<Role, "owner"> }
) {
  const invite: Invite = {
    inviteId: newId("invite"),
    orgId: bundle.org.id,
    email: input.email?.trim().toLowerCase() || undefined,
    role: input.role,
    status: "pending",
    createdBy: user.uid,
    createdAt: nowOrServer(),
    expiresAt: isFirebaseConfigured ? Timestamp.fromDate(addDays(new Date(), 14)) : addDays(new Date(), 14).toISOString()
  };

  if (!isFirebaseConfigured || !db) {
    const next = { ...bundle, invites: [invite, ...bundle.invites] };
    saveDemoBundle(next);
    trackEvent("invite_created");
    return { bundle: next, invite };
  }

  await setDoc(doc(db, "organizations", bundle.org.id, "invites", invite.inviteId), invite);
  trackEvent("invite_created", { orgId: bundle.org.id, role: invite.role });
  return { bundle: null, invite };
}

export async function revokeInvite(bundle: OrgBundle, inviteId: string) {
  if (!isFirebaseConfigured || !db) {
    const next = {
      ...bundle,
      invites: bundle.invites.map((invite) => (invite.inviteId === inviteId ? { ...invite, status: "revoked" as const } : invite))
    };
    saveDemoBundle(next);
    return next;
  }
  await updateDoc(doc(db, "organizations", bundle.org.id, "invites", inviteId), { status: "revoked" });
  return null;
}

export async function acceptInvite(inviteId: string, user: AppUser, orgId?: string) {
  if (!isFirebaseConfigured || !db) {
    const bundle = getDemoBundle();
    const invite = bundle.invites.find((item) => item.inviteId === inviteId);
    if (!invite || invite.status !== "pending") throw new Error("This invite is not available.");
    if (invite.email && invite.email !== user.email?.toLowerCase()) throw new Error("This invite is for a different email address.");

    const member: Member = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email || "Teammate",
      photoURL: user.photoURL,
      role: invite.role,
      status: "active",
      joinedAt: new Date().toISOString()
    };
    const next = {
      ...bundle,
      member,
      members: [...bundle.members.filter((item) => item.uid !== user.uid), member],
      invites: bundle.invites.map((item) =>
        item.inviteId === inviteId
          ? { ...item, status: "accepted" as const, acceptedBy: user.uid, acceptedAt: new Date().toISOString() }
          : item
      )
    };
    saveDemoBundle(next);
    trackEvent("invite_accepted");
    return next;
  }

  if (!orgId) {
    throw new Error("Invite links must include an org query parameter.");
  }

  const activeDb = db;
  const inviteRef = doc(activeDb, "organizations", orgId, "invites", inviteId);
  await runTransaction(activeDb, async (transaction) => {
    const inviteSnap = await transaction.get(inviteRef);
    const invite = inviteSnap.data() as Invite | undefined;
    if (!invite) throw new Error("Invite not found.");
    if (invite.status !== "pending") throw new Error("This invite is no longer pending.");
    if (invite.email && invite.email !== user.email?.toLowerCase()) throw new Error("This invite is for a different email address.");

    const expiresAt =
      invite.expiresAt instanceof Timestamp
        ? invite.expiresAt.toDate()
        : typeof invite.expiresAt === "string"
          ? new Date(invite.expiresAt)
          : null;
    if (expiresAt && expiresAt.getTime() < Date.now()) throw new Error("This invite has expired.");

    const member: Member & { inviteId: string } = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email || "Teammate",
      photoURL: user.photoURL,
      role: invite.role,
      status: "active",
      joinedAt: serverTimestamp(),
      inviteId: invite.inviteId
    };

    transaction.set(doc(activeDb, "organizations", invite.orgId, "members", user.uid), member);
    transaction.set(doc(activeDb, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email || "Teammate",
      photoURL: user.photoURL ?? null,
      orgId: invite.orgId,
      role: invite.role,
      createdAt: serverTimestamp()
    });
    transaction.update(inviteRef, {
      status: "accepted",
      acceptedBy: user.uid,
      acceptedAt: serverTimestamp()
    });
  });

  trackEvent("invite_accepted");
  return loadOrgBundle(user);
}
