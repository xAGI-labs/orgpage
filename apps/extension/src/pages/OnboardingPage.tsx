import { Building2, LinkIcon, Palette } from "lucide-react";
import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/Button";
import { Field, Select } from "../components/Field";
import { useOrg } from "../context/OrgContext";
import type { OrgTheme } from "@orgpage/shared";

export function OnboardingPage() {
  const navigate = useNavigate();
  const { createOrg } = useOrg();
  const [companyName, setCompanyName] = useState("");
  const [brandColor, setBrandColor] = useState("#3f5f46");
  const [tone, setTone] = useState<OrgTheme["tone"]>("startup");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await createOrg(companyName, { brandColor, tone });
      navigate("/admin/theme");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create company.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="app-shell">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--brand)]">First run</p>
          <h1 className="mt-4 max-w-xl font-display text-5xl font-black leading-none">Create the page your team opens first.</h1>
          <div className="mt-8 grid gap-3">
            {[
              [Building2, "Create your organization and become owner."],
              [Palette, "Pick a taste profile so the homepage has a point of view."],
              [LinkIcon, "Add the first links, tasks, and announcement from admin."]
            ].map(([Icon, text]) => (
              <div key={String(text)} className="flex items-center gap-3 text-sm font-semibold text-[var(--muted)]">
                <Icon className="h-5 w-5 text-[var(--brand)]" />
                {text as string}
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-[var(--muted)]">
            Joining with an invite? Open the invite link, or paste the invite ID at <Link className="font-bold underline" to="/invite/demo-invite">the invite route</Link>.
          </p>
        </section>

        <form onSubmit={submit} className="org-card rounded-lg p-6">
          <h2 className="text-2xl font-black">Company setup</h2>
          <div className="mt-6 grid gap-4">
            <Field label="Company name" required value={companyName} onChange={(event) => setCompanyName(event.target.value)} />
            <Field label="Brand color" type="color" value={brandColor} onChange={(event) => setBrandColor(event.target.value)} />
            <Select label="Tone" value={tone} onChange={(event) => setTone(event.target.value as OrgTheme["tone"])}>
              <option value="startup">Startup</option>
              <option value="professional">Professional</option>
              <option value="formal">Formal</option>
              <option value="fun">Fun</option>
            </Select>
          </div>
          {error ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-800">{error}</p> : null}
          <Button type="submit" loading={busy} className="mt-6 w-full">
            Create Orgpage
          </Button>
        </form>
      </div>
    </main>
  );
}
