import { CalendarDays } from "lucide-react";
import { WidgetShell } from "../components/WidgetShell";

export function CalendarPlaceholderWidget({ className }: { className?: string }) {
  const today = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" }).format(new Date());

  return (
    <WidgetShell title="Calendar" eyebrow={today} className={className}>
      <div className="rounded-md bg-[var(--brand-soft)] p-4">
        <CalendarDays className="h-6 w-6 text-[var(--brand)]" />
        <p className="mt-3 text-sm font-semibold leading-6 text-[var(--muted)]">
          Calendar integrations can plug into this widget without changing the new-tab layout.
        </p>
      </div>
    </WidgetShell>
  );
}
