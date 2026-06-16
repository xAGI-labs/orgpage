import type { CSSProperties } from "react";
import { WidgetShell } from "../components/WidgetShell";
import { useAuth } from "../context/AuthContext";
import { useOrg } from "../context/OrgContext";

export function WelcomeWidget({ className }: { className?: string }) {
  const { user } = useAuth();
  const { bundle } = useOrg();
  if (!bundle || !user) return null;

  const firstName = user.displayName.split(" ")[0] || user.displayName;
  const tasksRemaining = bundle.onboardingTasks.filter(
    (task) => !task.completedBy.includes(user.uid)
  ).length;

  return (
    <WidgetShell title={`Welcome, ${firstName}`} eyebrow="Home base" className={className}>
      <p
        className="text-base leading-7 text-[var(--ink)]"
        style={{ textWrap: "pretty" } as CSSProperties}
      >
        {bundle.org.welcomeMessage}
      </p>
      {tasksRemaining > 0 ? (
        <p className="mt-4 text-sm font-semibold text-[var(--muted)]">
          {tasksRemaining === 1
            ? "One onboarding step waiting."
            : `${tasksRemaining} onboarding steps waiting.`}
        </p>
      ) : null}
    </WidgetShell>
  );
}
