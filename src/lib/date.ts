export function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

export function formatShortDate(value: unknown) {
  if (!value) return "Now";

  const date =
    value instanceof Date
      ? value
      : typeof value === "string"
        ? new Date(value)
        : typeof value === "object" && value !== null && "toDate" in value && typeof value.toDate === "function"
          ? value.toDate()
          : null;

  if (!date || Number.isNaN(date.getTime())) return "Now";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric"
  }).format(date);
}

export function isPast(value: unknown) {
  const date =
    value instanceof Date
      ? value
      : typeof value === "string"
        ? new Date(value)
        : typeof value === "object" && value !== null && "toDate" in value && typeof value.toDate === "function"
          ? value.toDate()
          : null;

  return !!date && date.getTime() < Date.now();
}
