import { Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "../components/Button";
import { Field, TextArea } from "../components/Field";
import { WidgetShell } from "../components/WidgetShell";
import { useOrg } from "../context/OrgContext";

export function ShoutoutsWidget({ className }: { className?: string }) {
  const { bundle, addShoutout } = useOrg();
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  if (!bundle) return null;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    await addShoutout({ to, message });
    setTo("");
    setMessage("");
    setBusy(false);
  }

  return (
    <WidgetShell title="Shoutouts" eyebrow="Kudos" className={className}>
      <div className="grid gap-4 md:grid-cols-[1fr_0.9fr]">
        <div className="grid gap-3">
          {bundle.shoutouts.length === 0 ? (
            <p className="rounded-md border border-[var(--line)] p-4 text-sm font-semibold text-[var(--muted)]">Be the first to give kudos.</p>
          ) : (
            bundle.shoutouts.slice(0, 5).map((shoutout) => (
              <article key={shoutout.id} className="rounded-md border border-[var(--line)] bg-[var(--paper-strong)] p-4">
                <p className="text-sm leading-6 text-[var(--ink)]">{shoutout.message}</p>
                <p className="mt-3 text-sm font-bold text-[var(--muted)]">
                  {shoutout.from} <span aria-hidden="true">→</span> {shoutout.to}
                </p>
              </article>
            ))
          )}
        </div>
        <form onSubmit={submit} className="rounded-md border border-[var(--line)] bg-[var(--paper-strong)] p-4">
          <Field label="To" required value={to} onChange={(event) => setTo(event.target.value)} />
          <TextArea label="Message" required className="mt-3" value={message} onChange={(event) => setMessage(event.target.value)} />
          <Button className="mt-3 w-full" loading={busy} icon={<Send className="h-4 w-4" aria-hidden="true" />}>
            Send kudos
          </Button>
        </form>
      </div>
    </WidgetShell>
  );
}
