import { FormEvent, useState } from "react";
import { Button } from "../../components/Button";
import { Field, Select, TextArea } from "../../components/Field";
import { WidgetShell } from "../../components/WidgetShell";
import { useOrg } from "../../context/OrgContext";
import type { OrgTheme, WidgetKey } from "../../types/orgpage";

const widgetLabels: Array<[WidgetKey, string]> = [
  ["welcome", "Welcome"],
  ["announcements", "Announcements"],
  ["onboarding", "Onboarding"],
  ["links", "Links"],
  ["leaderboard", "Leaderboard"],
  ["shoutouts", "Shoutouts"],
  ["calendar", "Calendar"]
];

export function AdminThemePage() {
  const { bundle, saveTheme } = useOrg();
  const [theme, setTheme] = useState<OrgTheme | null>(bundle?.org.theme ?? null);
  const [quickLinks, setQuickLinks] = useState(bundle?.org.theme.quickLinks.join(", ") ?? "");

  if (!bundle || !theme) return null;

  async function submit(event: FormEvent) {
    event.preventDefault();
    const nextTheme = {
      ...theme,
      quickLinks: quickLinks
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    } as OrgTheme;
    await saveTheme(nextTheme);
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <WidgetShell title="Taste profile" eyebrow="Theme builder">
        <form onSubmit={submit} className="grid gap-4">
          <Field label="Logo URL" value={theme.logoUrl ?? ""} onChange={(event) => setTheme({ ...theme, logoUrl: event.target.value })} />
          <Field label="Brand color" type="color" value={theme.brandColor} onChange={(event) => setTheme({ ...theme, brandColor: event.target.value })} />
          <Select label="Background" value={theme.backgroundStyle} onChange={(event) => setTheme({ ...theme, backgroundStyle: event.target.value as OrgTheme["backgroundStyle"] })}>
            <option value="linen">Linen</option>
            <option value="graph">Graph</option>
            <option value="solid">Solid</option>
            <option value="midnight">Midnight</option>
          </Select>
          <Select label="Layout density" value={theme.density} onChange={(event) => setTheme({ ...theme, density: event.target.value as OrgTheme["density"] })}>
            <option value="minimal">Minimal</option>
            <option value="standard">Standard</option>
            <option value="rich">Rich</option>
          </Select>
          <Select label="Tone" value={theme.tone} onChange={(event) => setTheme({ ...theme, tone: event.target.value as OrgTheme["tone"] })}>
            <option value="professional">Professional</option>
            <option value="fun">Fun</option>
            <option value="startup">Startup</option>
            <option value="formal">Formal</option>
          </Select>
          <TextArea label="Hero message" value={theme.heroMessage} onChange={(event) => setTheme({ ...theme, heroMessage: event.target.value })} />
          <Field label="Default quick links" value={quickLinks} onChange={(event) => setQuickLinks(event.target.value)} />
          <Button className="w-fit">Save theme</Button>
        </form>
      </WidgetShell>

      <WidgetShell title="Widgets" eyebrow="Enable or disable">
        <div className="grid gap-3 sm:grid-cols-2">
          {widgetLabels.map(([key, label]) => (
            <label key={key} className="flex items-center justify-between gap-3 rounded-md border border-[var(--line)] bg-[var(--paper-strong)] p-4 text-sm font-black">
              {label}
              <input
                type="checkbox"
                checked={theme.widgets[key]}
                onChange={(event) => setTheme({ ...theme, widgets: { ...theme.widgets, [key]: event.target.checked } })}
                className="h-5 w-5 accent-[var(--brand)]"
              />
            </label>
          ))}
        </div>
      </WidgetShell>
    </section>
  );
}
