import { onRequest } from "firebase-functions/v2/https";
import type { Role } from "@orgpage/shared";

export const hello = onRequest((_req, res) => {
  const role: Role = "member";
  res.json({ ok: true, role });
});
