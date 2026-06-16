import { FormEvent, useState } from "react";
import { Button } from "../../components/Button";
import { Field, TextArea } from "../../components/Field";
import { WidgetShell } from "../../components/WidgetShell";
import { useOrg } from "../../context/OrgContext";

export function AdminHomePage() {
  const { bundle, updateOrg, addLink, addTask, addLeaderboardEntry } = useOrg();
  const [orgName, setOrgName] = useState(bundle?.org.name ?? "");
  const [welcomeMessage, setWelcomeMessage] = useState(bundle?.org.welcomeMessage ?? "");
  const [pinnedUpdate, setPinnedUpdate] = useState(bundle?.org.pinnedUpdate ?? "");
  const [link, setLink] = useState({ label: "", url: "", category: "" });
  const [task, setTask] = useState({ title: "", description: "" });
  const [leader, setLeader] = useState({ name: "", score: "1", label: "" });

  if (!bundle) return null;

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    await updateOrg({ name: orgName, welcomeMessage, pinnedUpdate });
  }

  async function submitLink(event: FormEvent) {
    event.preventDefault();
    await addLink(link);
    setLink({ label: "", url: "", category: "" });
  }

  async function submitTask(event: FormEvent) {
    event.preventDefault();
    await addTask(task);
    setTask({ title: "", description: "" });
  }

  async function submitLeader(event: FormEvent) {
    event.preventDefault();
    await addLeaderboardEntry({ name: leader.name, score: Number(leader.score), label: leader.label });
    setLeader({ name: "", score: "1", label: "" });
  }

  return (
    <section className="grid gap-4">
      <WidgetShell title="Company profile" eyebrow="Page content">
        <form onSubmit={saveProfile} className="grid gap-4">
          <Field label="Company name" value={orgName} onChange={(event) => setOrgName(event.target.value)} />
          <TextArea label="Welcome message" value={welcomeMessage} onChange={(event) => setWelcomeMessage(event.target.value)} />
          <TextArea label="Pinned update" value={pinnedUpdate} onChange={(event) => setPinnedUpdate(event.target.value)} />
          <Button className="w-fit">Save profile</Button>
        </form>
      </WidgetShell>

      <div className="grid gap-4 xl:grid-cols-3">
        <WidgetShell title="Add link" eyebrow={`${bundle.links.length} links`}>
          <form onSubmit={submitLink} className="grid gap-3">
            <Field label="Label" required value={link.label} onChange={(event) => setLink({ ...link, label: event.target.value })} />
            <Field label="URL" required type="url" value={link.url} onChange={(event) => setLink({ ...link, url: event.target.value })} />
            <Field label="Category" required value={link.category} onChange={(event) => setLink({ ...link, category: event.target.value })} />
            <Button>Add link</Button>
          </form>
        </WidgetShell>

        <WidgetShell title="Add onboarding task" eyebrow={`${bundle.onboardingTasks.length} tasks`}>
          <form onSubmit={submitTask} className="grid gap-3">
            <Field label="Title" required value={task.title} onChange={(event) => setTask({ ...task, title: event.target.value })} />
            <TextArea label="Description" required value={task.description} onChange={(event) => setTask({ ...task, description: event.target.value })} />
            <Button>Add task</Button>
          </form>
        </WidgetShell>

        <WidgetShell title="Add leaderboard entry" eyebrow={`${bundle.leaderboard.length} entries`}>
          <form onSubmit={submitLeader} className="grid gap-3">
            <Field label="Name" required value={leader.name} onChange={(event) => setLeader({ ...leader, name: event.target.value })} />
            <Field label="Score" required type="number" min="0" value={leader.score} onChange={(event) => setLeader({ ...leader, score: event.target.value })} />
            <Field label="Label" required value={leader.label} onChange={(event) => setLeader({ ...leader, label: event.target.value })} />
            <Button>Add entry</Button>
          </form>
        </WidgetShell>
      </div>
    </section>
  );
}
