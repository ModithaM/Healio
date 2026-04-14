"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type TelemedicineStatsCardProps = {
  label: string;
  value: number | string;
  helper: string;
  icon: LucideIcon;
  accent: string;
  tone: string;
};

export function TelemedicineStatsCard({ label, value, helper, icon: Icon, accent, tone }: TelemedicineStatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.32 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={cn(
        "h-full rounded-2xl border border-white/70 bg-white/68 p-5 shadow-lg shadow-sky-950/8 backdrop-blur-md transition dark:border-white/10 dark:bg-white/[0.07]",
        tone
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className={cn("grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg", accent)}>
          <Icon className="h-6 w-6" />
        </div>
        <span className="rounded-full bg-white/70 px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm dark:bg-white/10 dark:text-slate-300">
          {helper}
        </span>
      </div>
      <p className="mt-5 text-3xl font-bold">{value}</p>
      <p className="mt-2 text-sm font-bold text-slate-600 dark:text-slate-300">{label}</p>
    </motion.div>
  );
}
