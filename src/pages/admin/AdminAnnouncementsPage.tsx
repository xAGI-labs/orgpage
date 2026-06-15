import { FormEvent, useState } from "react";
import { Button } from "../../components/Button";
import { Field, Select, TextArea } from "../../components/Field";
import { WidgetShell } from "../../components/WidgetShell";
import { useOrg } from "../../context/OrgContext";
import { formatShortDate } from "../../lib/date";
import type { Announcement } from "../../types/orgpage";

export function AdminAnnouncementsPage() {
  const { bundle, addAnnouncement } = useOrg();
  const [form, setForm] = useState<Pick<Announcement, "title" | "body" | "priority">>({
    title: "",
    body: "",
    priority: "normal"
  });

  if (!bundle) return null;

  async function submit(event: FormEvent) {
    event.preventDefault();
    await addAnnouncement(form);
    setForm({ title: "", body: "", priority: "normal" });
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
      <WidgetShell title="Publish announcement" eyebrow="Create">
        <form onSubmit={submit} className="grid gap-4">
          <Field label="Title" required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          <TextArea label="Body" required value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} />
          <Select label="Priority" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as Announcement["priority"] })}>
            <option value="normal">Normal</option>
            <option value="important">Important</option>
            <option value="urgent">Urgent</option>
          </Select>
          <Button>Publish</Button>
        </form>
      </WidgetShell>

      <WidgetShell title="Recent announcements" eyebrow={`${bundle.announcements.length} live`}>
        <div className="grid gap-3">
          {bundle.announcements.map((item) => (
            <article key={item.id} className="rounded-md border border-[var(--line)] bg-[var(--paper-strong)] p-4">
              <div className="flex justify-between gap-3">
                <h3 className="font-black">{item.title}</h3>
                <span className="text-xs font-bold text-[var(--muted)]">{formatShortDate(item.createdAt)}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.body}</p>
            </article>
          ))}
        </div>
      </WidgetShell>
    </section>
  );
}
