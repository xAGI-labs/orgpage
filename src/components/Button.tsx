import { Loader2 } from "lucide-react";
import { clsx } from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
  icon?: ReactNode;
}

const styles = {
  primary: "bg-[var(--brand)] text-white hover:brightness-95",
  secondary: "border border-[var(--line)] bg-[var(--paper-strong)] text-[var(--ink)] hover:bg-[var(--brand-soft)]",
  ghost: "text-[var(--muted)] hover:bg-[var(--brand-soft)] hover:text-[var(--ink)]",
  danger: "bg-[var(--danger)] text-white hover:brightness-95"
};

export function Button({ children, variant = "primary", loading, icon, className, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition focus-visible:focus-ring disabled:cursor-not-allowed disabled:opacity-60",
        styles[variant],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}
