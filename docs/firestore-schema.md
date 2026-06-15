# Orgpage Firestore Schema

```text
users/{userId}
organizations/{orgId}
organizations/{orgId}/members/{userId}
organizations/{orgId}/announcements/{announcementId}
organizations/{orgId}/onboardingTasks/{taskId}
organizations/{orgId}/links/{linkId}
organizations/{orgId}/leaderboard/{entryId}
organizations/{orgId}/shoutouts/{shoutoutId}
organizations/{orgId}/invites/{inviteId}
```

## Required Documents

`users/{userId}` stores the signed-in user's public profile plus `orgId` and `role` after they create or join an organization.

`organizations/{orgId}` stores the company profile, pinned update, owner, and `theme` object. `theme.widgets` controls which widgets render on the new tab.

`members/{userId}` is the source of truth for access control. Roles are `owner`, `admin`, and `member`.

`invites/{inviteId}` stores pending, accepted, revoked, or expired invites. Email-restricted invites must use lowercase email addresses. Generated invite URLs include the org ID as a query parameter, for example `/invite/{inviteId}?org={orgId}`, so the client can read exactly one invite document without listing cross-org invite collections.

## Analytics Events

The app emits these Firebase Analytics events when analytics is supported in the runtime:

- `login`
- `org_created`
- `invite_created`
- `invite_accepted`
- `announcement_created`
- `onboarding_task_completed`
- `new_tab_opened`
- `link_clicked`
- `shoutout_created`

No sensitive message bodies, passwords, or invite tokens are sent as analytics parameters.
