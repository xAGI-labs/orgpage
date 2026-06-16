export function ProfileAvatar({ name, src }: { name: string; src?: string | null }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0])
    .join("")
    .toUpperCase();

  if (src) {
    return <img src={src} alt={name} className="h-10 w-10 rounded-md object-cover" />;
  }

  return (
    <div
      aria-label={name}
      role="img"
      className="grid h-10 w-10 place-items-center rounded-md bg-[var(--brand)] text-sm font-black text-white"
    >
      <span aria-hidden="true">{initials || "O"}</span>
    </div>
  );
}
