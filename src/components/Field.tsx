import { clsx } from "clsx";
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Field({
  label,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={clsx("grid gap-2 text-sm font-semibold text-[var(--ink)]", className)}>
      <span>{label}</span>
      <input
        className="min-h-11 rounded-md border border-[var(--line)] bg-[var(--paper-strong)] px-3 text-sm outline-none focus-visible:focus-ring"
        {...props}
      />
    </label>
  );
}

export function TextArea({
  label,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className={clsx("grid gap-2 text-sm font-semibold text-[var(--ink)]", className)}>
      <span>{label}</span>
      <textarea
        className="min-h-28 resize-y rounded-md border border-[var(--line)] bg-[var(--paper-strong)] px-3 py-3 text-sm outline-none focus-visible:focus-ring"
        {...props}
      />
    </label>
  );
}

export function Select({
  label,
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className={clsx("grid gap-2 text-sm font-semibold text-[var(--ink)]", className)}>
      <span>{label}</span>
      <select
        className="min-h-11 rounded-md border border-[var(--line)] bg-[var(--paper-strong)] px-3 text-sm outline-none focus-visible:focus-ring"
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
