import { clsx } from "clsx";
import type { ReactNode } from "react";

export function WidgetShell({
  title,
  eyebrow,
  action,
  children,
  className
}: {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={clsx("org-card enter rounded-lg p-5", className)}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          {eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">{eyebrow}</p> : null}
          <h2 className="mt-1 text-lg font-bold leading-tight">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
