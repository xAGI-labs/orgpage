import { CheckCircle2, KeyRound } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "../components/Button";
import { useOrg } from "../context/OrgContext";

export function InvitePage() {
  const { inviteId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { acceptMemberInvite } = useOrg();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState(false);

  async function accept() {
    if (!inviteId) return;
    setBusy(true);
    setError("");
    try {
      await acceptMemberInvite(inviteId, searchParams.get("org") ?? undefined);
      setAccepted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not accept invite.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="app-shell grid place-items-center">
      <section className="org-card max-w-lg rounded-lg p-7">
        {accepted ? <CheckCircle2 className="h-8 w-8 text-[var(--brand)]" /> : <KeyRound className="h-8 w-8 text-[var(--brand)]" />}
        <h1 className="mt-5 text-3xl font-black">{accepted ? "Invite accepted" : "Join this Orgpage"}</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          {accepted
            ? "You now have access to the company new-tab page."
            : "Accepting the invite attaches your signed-in account to the organization if the invite is still pending and matches your email."}
        </p>
        {error ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-800">{error}</p> : null}
        <div className="mt-6 flex gap-3">
          {accepted ? (
            <Button onClick={() => navigate("/newtab")}>Open Orgpage</Button>
          ) : (
            <Button loading={busy} onClick={accept}>
              Accept invite
            </Button>
          )}
          <Link to="/newtab">
            <Button variant="secondary">Back</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
