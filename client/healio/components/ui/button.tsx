import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default:
    "bg-sky-500 text-white shadow-lg shadow-sky-500/25 hover:bg-sky-400 active:scale-[0.98]",
  secondary:
    "bg-white/75 text-slate-950 shadow-sm ring-1 ring-slate-200/70 hover:bg-white dark:bg-white/10 dark:text-white dark:ring-white/15 dark:hover:bg-white/15",
  ghost:
    "text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10",
  outline:
    "border border-slate-200 bg-white/60 text-slate-900 hover:border-sky-300 hover:bg-sky-50 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-sky-300/50 dark:hover:bg-sky-400/10",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "h-11 px-5 text-sm",
  sm: "h-9 px-3 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10",
};

export function Button({
  className,
  variant = "default",
  size = "default",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-semibold transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-offset-slate-950",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
