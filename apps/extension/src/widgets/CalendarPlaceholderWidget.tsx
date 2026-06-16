import { WidgetShell } from "../components/WidgetShell";

export function CalendarPlaceholderWidget({ className, tone }: { className?: string; tone?: "primary" | "quiet" }) {
  const today = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" }).format(new Date());

  return (
    <WidgetShell title="Calendar" eyebrow={today} className={className} tone={tone}>
      <p className="text-sm leading-6 text-[var(--muted)]">
        Calendar coming soon.
      </p>
    </WidgetShell>
  );
}
