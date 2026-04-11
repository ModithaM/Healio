import * as React from "react";

import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-white/60 bg-white/55 shadow-xl shadow-sky-950/5 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.08] dark:shadow-black/30",
        className
      )}
      {...props}
    />
  );
}
