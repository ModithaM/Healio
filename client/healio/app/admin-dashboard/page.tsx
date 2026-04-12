"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  BarChart3,
  Bell,
  CalendarClock,
  Check,
  ChevronDown,
  ClipboardCheck,
  CreditCard,
  Database,
  FileBarChart,
  FileCheck2,
  HeartPulse,
  Home,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Moon,
  MoreHorizontal,
  Search,
  Server,
  Stethoscope,
  Sun,
  UserCheck,
  UserRound,
  UsersRound,
  Video,
  WalletCards,
  X,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import type { ComponentType, ReactNode } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Icon = ComponentType<{ className?: string }>;

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

const admin = {
  name: "Hasindu Admin",
  role: "Super Admin",
  email: "admin@healio.care",
  department: "Platform Operations",
  level: "Hospital Network Management",
  lastLogin: "Apr 12, 2026 · 08:12 AM",
  avatar: "/illustrations/testimonial-avatar-care.svg",
};

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Patients", icon: UsersRound },
  { label: "Doctors", icon: Stethoscope },
  { label: "Appointments", icon: CalendarClock },
  { label: "Telemedicine", icon: Video },
  { label: "Analytics", icon: FileBarChart },
  { label: "System Health", icon: Server },
];

const stats = [
  { label: "Total Patients", value: "12,486", helper: "+8.4% this month", icon: UsersRound, accent: "from-sky-500 to-cyan-400" },
  { label: "Total Doctors", value: "642", helper: "38 departments", icon: Stethoscope, accent: "from-emerald-500 to-teal-400" },
  { label: "Appointments", value: "31,208", helper: "1,284 today", icon: CalendarClock, accent: "from-blue-500 to-indigo-400" },
  { label: "Telemedicine Sessions", value: "8,920", helper: "212 live today", icon: Video, accent: "from-violet-500 to-sky-400" },
  { label: "Pending Verifications", value: "18", helper: "Needs admin review", icon: FileCheck2, accent: "from-amber-500 to-orange-400" },
  { label: "Transactions", value: "$128.4K", helper: "+12.7% revenue", icon: WalletCards, accent: "from-lime-500 to-emerald-400" },
];

const actions = [
  { label: "Manage Patients", icon: UsersRound, description: "View, edit, and support patient records" },
  { label: "Manage Doctors", icon: Stethoscope, description: "Update doctor profiles and departments" },
  { label: "Verify Doctors", icon: UserCheck, description: "Approve submitted credentials" },
  { label: "View Appointments", icon: CalendarClock, description: "Monitor bookings and cancellations" },
  { label: "Monitor Telemedicine", icon: Video, description: "Track live and upcoming sessions" },
  { label: "Reports & Analytics", icon: BarChart3, description: "Review operational performance" },
];

const users = [
  { name: "Hasindu Chanuka", role: "Patient", status: "Active", statusClass: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300", activity: "Booked cardiology session · 12 min ago", action: "View" },
  { name: "Dr. Kavish Silva", role: "Doctor", status: "Verified", statusClass: "bg-sky-500/12 text-sky-700 dark:text-sky-300", activity: "Completed consultation · 24 min ago", action: "Edit" },
  { name: "Dr. Amelia Fernando", role: "Doctor", status: "Review", statusClass: "bg-amber-500/12 text-amber-700 dark:text-amber-300", activity: "Uploaded license docs · 1 hr ago", action: "Verify" },
  { name: "Nadia Perera", role: "Patient", status: "Active", statusClass: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300", activity: "Payment processed · 2 hrs ago", action: "View" },
];

const verifications = [
  { name: "Dr. Maya Chen", specialty: "Neurology", documents: "SLMC license, NIC, board certificate", submitted: "Apr 12, 2026" },
  { name: "Dr. Aaron Silva", specialty: "Orthopedics", documents: "License, hospital letter, degree certificate", submitted: "Apr 11, 2026" },
  { name: "Dr. Nadia Perera", specialty: "Pediatrics", documents: "License, ID, specialist registration", submitted: "Apr 10, 2026" },
];

const appointments = [
  { title: "Cardiology follow-up", person: "Hasindu Chanuka with Dr. Silva", time: "09:30 AM", status: "Live video", icon: Video },
  { title: "Dermatology clinic visit", person: "Maya Chen with Dr. Fernando", time: "10:15 AM", status: "Confirmed", icon: CalendarClock },
  { title: "General medicine consult", person: "Nadia Perera with Dr. Aaron", time: "11:45 AM", status: "Waiting", icon: ClipboardCheck },
];

const chartData = [
  { label: "Mon", appointments: 58, users: 72 },
  { label: "Tue", appointments: 76, users: 84 },
  { label: "Wed", appointments: 64, users: 69 },
  { label: "Thu", appointments: 92, users: 88 },
  { label: "Fri", appointments: 81, users: 93 },
  { label: "Sat", appointments: 54, users: 62 },
  { label: "Sun", appointments: 68, users: 74 },
];

const activity = [
  { title: "New patient registered", detail: "Hasindu Chanuka completed profile verification", time: "9 min ago", icon: UserRound },
  { title: "Doctor verified", detail: "Dr. Kavish Silva approved for Cardiology department", time: "32 min ago", icon: UserCheck },
  { title: "Appointment cancelled", detail: "Clinic slot released and patient notified", time: "1 hr ago", icon: CalendarClock },
  { title: "Telemedicine session completed", detail: "Video consultation archived with prescription", time: "2 hrs ago", icon: Video },
  { title: "Payment processed", detail: "$84.00 transaction settled successfully", time: "3 hrs ago", icon: CreditCard },
];

const systemStatus = [
  { label: "API Gateway", value: "Operational", icon: Server, tone: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300" },
  { label: "Active Sessions", value: "1,482", icon: Activity, tone: "bg-sky-500/12 text-sky-700 dark:text-sky-300" },
  { label: "Notifications", value: "Healthy", icon: Bell, tone: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300" },
  { label: "Payments", value: "Healthy", icon: CreditCard, tone: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300" },
  { label: "Data Vault", value: "Encrypted", icon: Database, tone: "bg-indigo-500/12 text-indigo-700 dark:text-indigo-300" },
];

export default function AdminDashboardPage() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={cn(isDark && "dark")}>
      <main className="min-h-screen overflow-hidden bg-[#f5f8fc] text-slate-950 transition-colors duration-500 dark:bg-[#020817] dark:text-white">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.13),transparent_30%),linear-gradient(135deg,rgba(248,252,255,0.98),rgba(241,245,249,0.72))] dark:bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.17),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_30%),linear-gradient(135deg,rgba(2,8,23,0.99),rgba(15,23,42,0.9))]" />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative min-h-screen w-full"
        >
          <Sidebar />

          <div className="min-w-0 space-y-5 px-4 py-4 sm:px-6 lg:ml-[280px] lg:px-8">
            <DashboardHeader isDark={isDark} onToggleDark={() => setIsDark((value) => !value)} />

            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12 [grid-auto-flow:dense]">
              <motion.div variants={fadeUp} className="h-full md:col-span-2 xl:col-span-12">
                <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
                  {stats.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="h-full md:col-span-2 xl:col-span-12">
                <QuickActions />
              </motion.div>

              <motion.div variants={fadeUp} className="h-full md:col-span-2 xl:col-span-7">
                <UserManagement />
              </motion.div>
              <motion.div variants={fadeUp} className="h-full md:col-span-1 xl:col-span-5">
                <DoctorVerification />
              </motion.div>

              <motion.div variants={fadeUp} className="h-full md:col-span-1 xl:col-span-5">
                <OperationsMonitoring />
              </motion.div>
              <motion.div variants={fadeUp} className="h-full md:col-span-2 xl:col-span-7">
                <AnalyticsOverview />
              </motion.div>

              <motion.div variants={fadeUp} className="h-full md:col-span-2 xl:col-span-7">
                <RecentActivity />
              </motion.div>
              <motion.div variants={fadeUp} className="h-full md:col-span-1 xl:col-span-5">
                <SystemHealth />
              </motion.div>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function Sidebar() {
  return (
    <motion.aside variants={fadeUp} className="relative z-40 h-full lg:fixed lg:inset-y-0 lg:left-0 lg:w-[280px]">
      <Card className="flex h-full flex-col rounded-none border-x-0 border-y border-white/70 bg-white/82 p-4 shadow-2xl shadow-sky-950/8 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/82 lg:h-screen lg:border-y-0 lg:border-r">
        <div className="flex items-center gap-3 rounded-[22px] bg-slate-950 p-3 text-white dark:bg-white dark:text-slate-950">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 text-white">
            <HeartPulse className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-bold leading-none">Healio</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] opacity-70">Admin OS</p>
          </div>
        </div>

        <nav className="mt-5 grid gap-2">
          {navItems.map((item, index) => (
            <button
              key={item.label}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-bold transition hover:bg-sky-500/10 hover:text-sky-700 dark:hover:bg-sky-400/10 dark:hover:text-sky-200",
                index === 0 ? "bg-sky-500/12 text-sky-700 dark:text-sky-300" : "text-slate-500 dark:text-slate-400"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto rounded-[22px] bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-4 text-white">
          <LockKeyhole className="h-6 w-6 text-emerald-300" />
          <p className="mt-3 text-sm font-bold">Security posture</p>
          <p className="mt-2 text-xs leading-5 text-slate-300">All admin actions are audit logged and protected by role permissions.</p>
        </div>
      </Card>
    </motion.aside>
  );
}

function DashboardHeader({ isDark, onToggleDark }: { isDark: boolean; onToggleDark: () => void }) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <motion.header variants={fadeUp} className="sticky top-4 z-30">
      <div className="rounded-[28px] border border-white/70 bg-white/76 px-4 py-3.5 shadow-2xl shadow-sky-950/8 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/74 dark:shadow-black/30">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-sky-600 dark:text-sky-300">Platform management</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Welcome, Admin</h1>
            <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">Monitor hospital operations, users, verifications, sessions, and system health.</p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <label className="group flex min-h-12 flex-1 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 text-sm text-slate-500 shadow-sm transition focus-within:border-sky-300 focus-within:ring-4 focus-within:ring-sky-200/40 dark:border-white/10 dark:bg-white/8 dark:text-slate-300 dark:focus-within:ring-sky-400/10 md:w-[420px]">
              <Search className="h-5 w-5 text-slate-400 transition group-focus-within:text-sky-500" />
              <input className="w-full bg-transparent font-medium outline-none placeholder:text-slate-400" placeholder="Search users, doctors, sessions, reports..." />
            </label>

            <div className="flex items-center gap-2">
              <HeaderIconButton ariaLabel="Notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-rose-400 ring-2 ring-white dark:ring-slate-950" />
              </HeaderIconButton>
              <HeaderIconButton ariaLabel="Toggle theme" onClick={onToggleDark}>
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </HeaderIconButton>
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((value) => !value)}
                  className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-lg dark:border-white/10 dark:bg-white/8"
                >
                  <Image src={admin.avatar} alt={`${admin.name} avatar`} width={34} height={34} className="rounded-xl" />
                  <span className="hidden sm:block">
                    <span className="block text-sm font-bold">{admin.name}</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">{admin.role}</span>
                  </span>
                  <ChevronDown className={cn("h-4 w-4 text-slate-400 transition", profileOpen && "rotate-180 text-sky-500")} />
                </button>
                {profileOpen && <ProfileMenu />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

function ProfileMenu() {
  return (
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
  );
}

function StatCard({ label, value, helper, icon: Icon, accent }: { label: string; value: string; helper: string; icon: Icon; accent: string }) {
  return (
    <Card className="group h-full flex flex-col rounded-[24px] p-4 transition duration-300 hover:-translate-y-1 hover:border-sky-300/70 hover:shadow-2xl hover:shadow-sky-500/10">
      <div className="flex items-start justify-between">
        <div className={cn("grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg", accent)}>
          <Icon className="h-6 w-6" />
        </div>
        <MoreHorizontal className="h-5 w-5 text-slate-400 transition group-hover:text-sky-500" />
      </div>
      <p className="mt-4 text-3xl font-bold">{value}</p>
      <p className="mt-2 text-sm font-bold text-slate-600 dark:text-slate-300">{label}</p>
      <p className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-300">{helper}</p>
    </Card>
  );
}

function QuickActions() {
  return (
    <Card className="h-full flex flex-col rounded-[28px] p-5">
      <SectionTitle eyebrow="Quick actions" title="Operational controls" />
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {actions.map((action) => (
          <button key={action.label} className="group rounded-[22px] border border-slate-200/70 bg-white/68 p-4 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:bg-sky-50/80 hover:shadow-xl hover:shadow-sky-500/10 dark:border-white/10 dark:bg-white/[0.05] dark:hover:bg-sky-400/10">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-sky-600 to-emerald-500 text-white shadow-lg shadow-sky-500/25 transition group-hover:scale-105">
              <action.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-bold">{action.label}</p>
            <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{action.description}</p>
          </button>
        ))}
      </div>
    </Card>
  );
}

function UserManagement() {
  return (
    <Card className="h-full flex flex-col rounded-[28px] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionTitle eyebrow="User management" title="Patients and doctors" />
        <Button variant="outline" className="rounded-2xl">
          <UsersRound className="h-4 w-4" />
          Export Users
        </Button>
      </div>

      <div className="mt-5 overflow-hidden rounded-[24px] border border-slate-200/70 bg-white/60 dark:border-white/10 dark:bg-white/[0.05]">
        <div className="hidden grid-cols-[1fr_0.55fr_0.55fr_1fr_0.8fr] gap-4 border-b border-slate-200/70 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:border-white/10 lg:grid">
          <span>Name</span>
          <span>Role</span>
          <span>Status</span>
          <span>Last activity</span>
          <span className="text-right">Actions</span>
        </div>
        {users.map((user) => (
          <div key={user.name} className="grid gap-3 border-b border-slate-200/70 px-5 py-4 last:border-b-0 dark:border-white/10 lg:grid-cols-[1fr_0.55fr_0.55fr_1fr_0.8fr] lg:items-center">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
                {user.role === "Doctor" ? <Stethoscope className="h-5 w-5" /> : <UserRound className="h-5 w-5" />}
              </div>
              <p className="font-bold">{user.name}</p>
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{user.role}</p>
            <span className={cn("w-fit rounded-full px-3 py-1.5 text-xs font-bold", user.statusClass)}>{user.status}</span>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user.activity}</p>
            <div className="flex flex-wrap justify-start gap-2 lg:justify-end">
              <Button variant="outline" className="rounded-2xl">{user.action}</Button>
              <Button variant="ghost" className="rounded-2xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10">Suspend</Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function DoctorVerification() {
  return (
    <Card className="h-full flex flex-col rounded-[28px] p-5">
      <SectionTitle eyebrow="Doctor verification" title="Pending applications" />
      <div className="mt-5 grid gap-3.5">
        {verifications.map((doctor) => (
          <div key={doctor.name} className="rounded-[24px] border border-slate-200/70 bg-white/62 p-4 dark:border-white/10 dark:bg-white/[0.05]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold">{doctor.name}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{doctor.specialty} · {doctor.submitted}</p>
              </div>
              <span className="rounded-full bg-amber-500/12 px-3 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-300">Pending</span>
            </div>
            <p className="mt-3 rounded-2xl bg-slate-950/5 p-3 text-sm leading-6 text-slate-600 dark:bg-white/10 dark:text-slate-300">{doctor.documents}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button className="rounded-2xl bg-emerald-500 hover:bg-emerald-400">
                <Check className="h-4 w-4" />
                Approve
              </Button>
              <Button variant="outline" className="rounded-2xl text-rose-500">
                <X className="h-4 w-4" />
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function OperationsMonitoring() {
  return (
    <Card className="h-full flex flex-col rounded-[28px] p-5">
      <SectionTitle eyebrow="Monitoring" title="Appointments and telemedicine" />
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Live video rooms", value: "42", icon: Video },
          { label: "Clinic queue", value: "118", icon: CalendarClock },
          { label: "Cancelled today", value: "09", icon: ClipboardCheck },
        ].map((item) => (
          <div key={item.label} className="rounded-[22px] border border-slate-200/70 bg-white/62 p-4 dark:border-white/10 dark:bg-white/[0.05]">
            <item.icon className="h-5 w-5 text-sky-600 dark:text-sky-300" />
            <p className="mt-4 text-2xl font-bold">{item.value}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3">
        {appointments.map((item) => (
          <div key={`${item.title}-${item.time}`} className="flex items-center justify-between gap-4 rounded-[22px] border border-slate-200/70 bg-white/62 p-4 dark:border-white/10 dark:bg-white/[0.05]">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-sky-600 to-emerald-500 text-white">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold">{item.title}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.person}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">{item.time}</p>
              <p className="mt-1 text-xs font-bold text-sky-600 dark:text-sky-300">{item.status}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function AnalyticsOverview() {
  return (
    <Card className="h-full flex flex-col rounded-[28px] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionTitle eyebrow="Analytics" title="Operational overview" />
        <span className="rounded-full bg-sky-500/12 px-3 py-1.5 text-xs font-bold text-sky-700 dark:text-sky-300">Last 7 days</span>
      </div>

      <div className="mt-5 rounded-[24px] border border-slate-200/70 bg-white/62 p-4 dark:border-white/10 dark:bg-white/[0.05]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Appointments per day</p>
            <h3 className="mt-2 text-3xl font-bold">493 total</h3>
          </div>
          <BarChart3 className="h-7 w-7 text-sky-600 dark:text-sky-300" />
        </div>
        <div className="mt-6 flex h-36 items-end gap-2">
          {chartData.map((item) => (
            <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-28 w-full items-end rounded-full bg-slate-950/5 p-1 dark:bg-white/10">
                <div className="w-full rounded-full bg-gradient-to-t from-sky-600 to-emerald-400" style={{ height: `${item.appointments}%` }} />
              </div>
              <span className="text-xs font-bold text-slate-400">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Active users", value: "9.8K", helper: "+11%" },
          { label: "Telemedicine usage", value: "68%", helper: "+7%" },
          { label: "Doctor availability", value: "82%", helper: "stable" },
        ].map((item) => (
          <div key={item.label} className="rounded-[22px] border border-slate-200/70 bg-white/62 p-4 dark:border-white/10 dark:bg-white/[0.05]">
            <p className="text-2xl font-bold">{item.value}</p>
            <p className="mt-1 text-sm font-bold text-slate-600 dark:text-slate-300">{item.label}</p>
            <p className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-300">{item.helper}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function RecentActivity() {
  return (
    <Card className="h-full flex flex-col rounded-[28px] p-5">
      <SectionTitle eyebrow="Activity feed" title="Recent platform events" />
      <div className="mt-5 space-y-1">
        {activity.map((item, index) => (
          <div key={item.title} className="relative flex gap-4 pb-5 last:pb-0">
            {index !== activity.length - 1 && <div className="absolute left-6 top-12 h-[calc(100%-3rem)] w-px bg-gradient-to-b from-sky-300 to-emerald-300 dark:from-sky-400/40 dark:to-emerald-400/40" />}
            <div className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-sky-600 to-emerald-500 text-white shadow-lg shadow-sky-500/25">
              <item.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1 rounded-[22px] border border-slate-200/70 bg-white/58 p-4 dark:border-white/10 dark:bg-white/[0.05]">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-bold">{item.title}</h3>
                <span className="text-xs font-bold text-sky-600 dark:text-sky-300">{item.time}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SystemHealth() {
  return (
    <Card className="h-full flex flex-col rounded-[28px] p-5">
      <SectionTitle eyebrow="System health" title="Platform status" />
      <div className="mt-5 rounded-[24px] bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-5 text-white shadow-2xl shadow-sky-950/20">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-sky-100">Overall status</p>
            <h3 className="mt-2 text-3xl font-bold">Operational</h3>
            <p className="mt-2 text-sm text-slate-300">99.98% uptime · 12 monitored services</p>
          </div>
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-white/10 ring-1 ring-white/15">
            <Server className="h-8 w-8 text-emerald-300" />
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {systemStatus.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-4 rounded-[22px] border border-slate-200/70 bg-white/62 p-4 dark:border-white/10 dark:bg-white/[0.05]">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
                <item.icon className="h-5 w-5" />
              </div>
              <p className="font-bold">{item.label}</p>
            </div>
            <span className={cn("rounded-full px-3 py-1.5 text-xs font-bold", item.tone)}>{item.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-600 dark:text-sky-300">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-bold">{title}</h2>
    </div>
  );
}

function HeaderIconButton({
  children,
  ariaLabel,
  onClick,
}: {
  children: ReactNode;
  ariaLabel: string;
  onClick?: () => void;
}) {
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
