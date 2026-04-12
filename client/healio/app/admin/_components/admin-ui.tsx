"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronDown,
  Home,
  LogOut,
  Moon,
  Search,
  ShieldCheck,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { adminNavItems, adminUser } from "./admin-data";

export const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

export function AdminShell({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={cn(isDark && "dark")}>
      <main className="min-h-screen overflow-hidden bg-[#f5f8fc] text-slate-950 transition-colors duration-500 dark:bg-[#020817] dark:text-white">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(34,197,94,0.12),transparent_30%),linear-gradient(135deg,rgba(248,252,255,0.98),rgba(241,245,249,0.72))] dark:bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.17),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.14),transparent_30%),linear-gradient(135deg,rgba(2,8,23,0.99),rgba(15,23,42,0.9))]" />
        <AdminSidebar />
        <div className="relative min-w-0 space-y-6 px-4 py-4 sm:px-6 lg:ml-[280px] lg:px-8">
          <AdminHeader isDark={isDark} onToggleDark={() => setIsDark((value) => !value)} />
          {children}
        </div>
      </main>
    </div>
  );
}

function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="relative z-40 lg:fixed lg:inset-y-0 lg:left-0 lg:w-[280px]">
      <Card className="flex h-full flex-col rounded-none border-x-0 border-y border-white/70 bg-white/82 p-4 shadow-2xl shadow-sky-950/8 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/82 lg:h-screen lg:border-y-0 lg:border-r">
        <Link href="/admin/overview" className="flex items-center gap-3 rounded-[22px] bg-slate-950 p-3 text-white transition hover:scale-[1.01] dark:bg-white dark:text-slate-950">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 text-white">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-bold leading-none">Healio</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] opacity-70">Admin OS</p>
          </div>
        </Link>

        <nav className="mt-5 grid gap-2">
          {adminNavItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold transition duration-300 hover:bg-sky-500/10 hover:text-sky-700 dark:hover:bg-sky-400/10 dark:hover:text-sky-200",
                  active ? "bg-sky-500 text-white shadow-lg shadow-sky-500/25 hover:bg-sky-500 hover:text-white dark:bg-sky-500 dark:text-white" : "text-slate-500 dark:text-slate-400"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-[22px] bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-4 text-white">
          <ShieldCheck className="h-6 w-6 text-emerald-300" />
          <p className="mt-3 text-sm font-bold">Secure admin access</p>
          <p className="mt-2 text-xs leading-5 text-slate-300">Role-based controls with audit-ready hospital operations.</p>
        </div>
      </Card>
    </aside>
  );
}

function AdminHeader({ isDark, onToggleDark }: { isDark: boolean; onToggleDark: () => void }) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-4 z-30 rounded-[28px] border border-white/70 bg-white/76 px-4 py-3.5 shadow-2xl shadow-sky-950/8 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/74 dark:shadow-black/30">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-sky-600 dark:text-sky-300">Hospital command center</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Welcome, Admin</h1>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <label className="group flex min-h-12 flex-1 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 text-sm text-slate-500 shadow-sm transition focus-within:border-sky-300 focus-within:ring-4 focus-within:ring-sky-200/40 dark:border-white/10 dark:bg-white/8 dark:text-slate-300 dark:focus-within:ring-sky-400/10 md:w-[420px]">
            <Search className="h-5 w-5 text-slate-400 transition group-focus-within:text-sky-500" />
            <input className="w-full bg-transparent font-medium outline-none placeholder:text-slate-400" placeholder="Search patients, doctors, sessions..." />
          </label>

          <div className="flex items-center gap-2">
            <IconButton ariaLabel="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-rose-400 ring-2 ring-white dark:ring-slate-950" />
            </IconButton>
            <IconButton ariaLabel="Toggle theme" onClick={onToggleDark}>
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </IconButton>
            <div className="relative">
              <button
                onClick={() => setProfileOpen((value) => !value)}
                className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-lg dark:border-white/10 dark:bg-white/8"
              >
                <Image src={adminUser.avatar} alt={`${adminUser.name} avatar`} width={34} height={34} className="rounded-xl" />
                <span className="hidden sm:block">
                  <span className="block text-sm font-bold">{adminUser.name}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">{adminUser.role}</span>
                </span>
                <ChevronDown className={cn("h-4 w-4 text-slate-400 transition", profileOpen && "rotate-180 text-sky-500")} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-14 z-50 w-52 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-2 shadow-2xl shadow-sky-950/12 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95">
                  <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-sky-50 hover:text-sky-700 dark:text-slate-200 dark:hover:bg-sky-400/10 dark:hover:text-sky-200">
                    <Home className="h-4 w-4" />
                    Home
                  </Link>
                  <Link href="/signin" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export function AdminPage({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return (
    <motion.section variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <p className="text-xs font-bold uppercase tracking-[0.26em] text-sky-600 dark:text-sky-300">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
      </motion.div>
      {children}
    </motion.section>
  );
}

export function GlassCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Card className={cn("h-full rounded-2xl border-white/70 bg-white/68 p-5 shadow-lg shadow-sky-950/8 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-sky-300/70 hover:shadow-xl hover:shadow-sky-500/10 dark:border-white/10 dark:bg-white/[0.07]", className)}>
      {children}
    </Card>
  );
}

export function StatCard({ label, value, helper, icon: Icon, accent }: { label: string; value: string; helper: string; icon: LucideIcon; accent: string }) {
  return (
    <GlassCard className="flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className={cn("grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg", accent)}>
          <Icon className="h-6 w-6" />
        </div>
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">{helper}</span>
      </div>
      <div className="mt-5">
        <p className="text-3xl font-bold">{value}</p>
        <p className="mt-2 text-sm font-bold text-slate-600 dark:text-slate-300">{label}</p>
      </div>
    </GlassCard>
  );
}

export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h3 className="text-xl font-bold">{title}</h3>
      {action}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "Completed" || status === "Active" || status === "Verified" || status === "Healthy" || status === "Live"
      ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
      : status === "Scheduled" || status === "Upcoming"
        ? "bg-sky-500/12 text-sky-700 dark:text-sky-300"
        : status === "Warning" || status === "Review"
          ? "bg-amber-500/12 text-amber-700 dark:text-amber-300"
          : "bg-rose-500/12 text-rose-700 dark:text-rose-300";

  return <span className={cn("rounded-full px-3 py-1.5 text-xs font-bold", tone)}>{status}</span>;
}

export function MiniBarChart({ data, dual = false }: { data: Array<{ label: string; value: number; secondary?: number }>; dual?: boolean }) {
  return (
    <div className="mt-6 flex h-44 items-end gap-2">
      {data.map((item) => (
        <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-36 w-full items-end gap-1 rounded-full bg-slate-950/5 p-1 dark:bg-white/10">
            <div className="w-full rounded-full bg-gradient-to-t from-sky-600 to-emerald-400" style={{ height: `${item.value}%` }} />
            {dual && <div className="w-full rounded-full bg-gradient-to-t from-indigo-500 to-sky-300" style={{ height: `${item.secondary ?? item.value}%` }} />}
          </div>
          <span className="text-xs font-bold text-slate-400">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export function ActivityTimeline({ items }: { items: Array<{ title: string; detail: string; time: string; icon: LucideIcon }> }) {
  return (
    <div className="space-y-1">
      {items.map((item, index) => (
        <div key={item.title} className="relative flex gap-4 pb-5 last:pb-0">
          {index !== items.length - 1 && <div className="absolute left-6 top-12 h-[calc(100%-3rem)] w-px bg-gradient-to-b from-sky-300 to-emerald-300 dark:from-sky-400/40 dark:to-emerald-400/40" />}
          <div className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-sky-600 to-emerald-500 text-white shadow-lg shadow-sky-500/25">
            <item.icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1 rounded-2xl border border-slate-200/70 bg-white/58 p-4 dark:border-white/10 dark:bg-white/[0.05]">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-bold">{item.title}</h3>
              <span className="text-xs font-bold text-sky-600 dark:text-sky-300">{item.time}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{item.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function IconButton({ children, ariaLabel, onClick }: { children: ReactNode; ariaLabel: string; onClick?: () => void }) {
  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      className="relative grid h-12 w-12 place-items-center rounded-2xl border border-slate-200/80 bg-white/80 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-600 hover:shadow-lg dark:border-white/10 dark:bg-white/8 dark:text-slate-200 dark:hover:text-sky-200"
    >
      {children}
    </button>
  );
}

export { Button };
