import { clsx } from "clsx";
import type { ReactNode } from "react";

type WidgetTone = "primary" | "quiet";

export function WidgetShell({
  title,
  eyebrow,
  action,
  children,
  className,
  tone = "primary"
}: {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  tone?: WidgetTone;
}) {
  const isQuiet = tone === "quiet";

  return (
    <section
      className={clsx(
        "enter",
        isQuiet
          ? "border-t border-[var(--line)] pt-4"
          : "org-card rounded-lg p-5",
        className
      )}
    >
      <div className={clsx("flex items-start justify-between gap-4", isQuiet ? "mb-3" : "mb-4")}>
        <div>
          {eyebrow ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">{eyebrow}</p>
          ) : null}
          <h2
            className={clsx(
              "leading-tight",
              isQuiet ? "mt-0.5 text-sm font-bold" : "mt-1 text-lg font-bold",
              eyebrow ? "" : "mt-0"
            )}
          >
            {title}
          </h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
