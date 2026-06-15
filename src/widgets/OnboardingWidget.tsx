import { CheckCircle2, Circle } from "lucide-react";
import { Button } from "../components/Button";
import { WidgetShell } from "../components/WidgetShell";
import { useAuth } from "../context/AuthContext";
import { useOrg } from "../context/OrgContext";

export function OnboardingWidget({ className }: { className?: string }) {
  const { user } = useAuth();
  const { bundle, markTaskDone } = useOrg();
  if (!bundle || !user) return null;

  const completed = bundle.onboardingTasks.filter((task) => task.completedBy.includes(user.uid)).length;

  return (
    <WidgetShell title="Onboarding" eyebrow={`${completed}/${bundle.onboardingTasks.length} done`} className={className}>
      {bundle.onboardingTasks.length === 0 ? (
        <p className="rounded-md bg-[var(--brand-soft)] p-4 text-sm font-semibold text-[var(--muted)]">
          Add tasks so new hires know where to start.
        </p>
      ) : (
        <div className="grid gap-3">
          {bundle.onboardingTasks.map((task) => {
            const done = task.completedBy.includes(user.uid);
            return (
              <div key={task.id} className="rounded-md border border-[var(--line)] bg-[var(--paper-strong)] p-3">
                <div className="flex items-start gap-3">
                  {done ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-[var(--brand)]" /> : <Circle className="mt-0.5 h-5 w-5 text-[var(--muted)]" />}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold">{task.title}</h3>
                    <p className="text-sm leading-6 text-[var(--muted)]">{task.description}</p>
                  </div>
                  {!done ? (
                    <Button variant="secondary" className="px-3 py-1 text-xs" onClick={() => markTaskDone(task.id)}>
                      Done
                    </Button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </WidgetShell>
  );
}
