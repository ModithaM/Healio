"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  BarChart3,
  Bell,
  CalendarCheck,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardPlus,
  Clock3,
  Edit3,
  FileHeart,
  FileText,
  HeartPulse,
  Home,
  Hospital,
  LogOut,
  MailPlus,
  Moon,
  MoreHorizontal,
  NotebookPen,
  Pill,
  Search,
  ShieldCheck,
  Stethoscope,
  Sun,
  Timer,
  UserRound,
  UsersRound,
  Video,
  X,
} from "lucide-react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import type { ComponentType, ReactNode } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Icon = ComponentType<{ className?: string }>;

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.62, ease } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

const doctor = {
  name: "Dr. Kavish Silva",
  specialty: "Consultant Cardiologist",
  hospital: "Healio Central Hospital",
  department: "Cardiology Department",
  experience: "12 years",
  license: "SLMC-DR-94218",
  availability: "Available for consultations",
  email: "kavish.silva@healio.care",
  avatar: "/illustrations/testimonial-avatar-doctor.svg",
};

const stats = [
  { label: "Today's Appointments", value: "16", helper: "4 telemedicine", icon: CalendarClock, accent: "from-sky-500 to-cyan-400" },
  { label: "Pending Requests", value: "07", helper: "Needs review", icon: Timer, accent: "from-amber-500 to-orange-400" },
  { label: "Completed Consultations", value: "1,284", helper: "+18 this week", icon: CheckCircle2, accent: "from-emerald-500 to-teal-400" },
  { label: "Active Telemedicine", value: "02", helper: "Next in 12 min", icon: Video, accent: "from-indigo-500 to-blue-400" },
];

const actions = [
  { label: "Manage Availability", icon: CalendarCheck, description: "Update clinic and video slots" },
  { label: "View Appointments", icon: ClipboardPlus, description: "Review today's consultation queue" },
  { label: "Join Telemedicine", icon: Video, description: "Open active online session" },
  { label: "View Patient Reports", icon: FileHeart, description: "Check attached lab results" },
  { label: "Issue Prescription", icon: Pill, description: "Create a digital prescription" },
];

const appointments = [
  {
    patient: "Hasindu Chanuka",
    type: "Video consultation",
    time: "09:30 AM",
    status: "Active",
    statusClass: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
    priority: "Follow-up ECG review",
    canJoin: true,
  },
  {
    patient: "Nadia Perera",
    type: "Clinic appointment",
    time: "10:15 AM",
    status: "Confirmed",
    statusClass: "bg-sky-500/12 text-sky-700 dark:text-sky-300",
    priority: "Blood pressure assessment",
    canJoin: false,
  },
  {
    patient: "Maya Chen",
    type: "Appointment request",
    time: "11:00 AM",
    status: "Pending",
    statusClass: "bg-amber-500/12 text-amber-700 dark:text-amber-300",
    priority: "Chest pain triage",
    canJoin: false,
  },
  {
    patient: "Aaron Silva",
    type: "Video consultation",
    time: "12:30 PM",
    status: "Ready",
    statusClass: "bg-indigo-500/12 text-indigo-700 dark:text-indigo-300",
    priority: "Medication refill",
    canJoin: true,
  },
];

const availability = [
  { day: "Mon", slots: ["08:30 - 11:30", "14:00 - 17:00"], active: true },
  { day: "Tue", slots: ["09:00 - 12:00", "Video: 16:00 - 18:00"], active: true },
  { day: "Wed", slots: ["Surgery rounds", "15:00 - 17:30"], active: false },
  { day: "Thu", slots: ["08:30 - 12:30", "14:30 - 16:30"], active: true },
  { day: "Fri", slots: ["09:00 - 13:00", "Video: 15:00 - 17:00"], active: true },
];

const patients = [
  { name: "Hasindu Chanuka", date: "Apr 12, 2026", condition: "Cardiac follow-up", reports: 4 },
  { name: "Nadia Perera", date: "Apr 11, 2026", condition: "Hypertension review", reports: 2 },
  { name: "Maya Chen", date: "Apr 08, 2026", condition: "General cardiac screening", reports: 3 },
];

const sessions = [
  { title: "Cardiology video review", patient: "Hasindu Chanuka", time: "09:30 AM", status: "Live", tone: "bg-emerald-400 text-emerald-950" },
  { title: "Medication follow-up", patient: "Aaron Silva", time: "12:30 PM", status: "Upcoming", tone: "bg-sky-400 text-sky-950" },
  { title: "Report explanation", patient: "Nadia Perera", time: "04:00 PM", status: "Scheduled", tone: "bg-indigo-400 text-indigo-950" },
];

const activities = [
  { title: "Completed ECG review", detail: "Hasindu Chanuka consultation notes saved", time: "8 min ago", icon: CheckCircle2 },
  { title: "Prescription issued", detail: "Atorvastatin 10mg plan sent to patient portal", time: "24 min ago", icon: Pill },
  { title: "Appointment request accepted", detail: "Maya Chen confirmed for 11:00 AM clinic visit", time: "1 hr ago", icon: CalendarCheck },
  { title: "Report reviewed", detail: "Cardiac stress test file marked as reviewed", time: "2 hrs ago", icon: FileText },
];

export default function DoctorDashboardPage() {
  const [isDark, setIsDark] = useState(false);
  const [sessionModalOpen, setSessionModalOpen] = useState(false);

  return (
    <div className={cn(isDark && "dark")}>
      <main className="min-h-screen overflow-hidden bg-[#f4f9fc] text-slate-950 transition-colors duration-500 dark:bg-[#020817] dark:text-white [&_a]:cursor-pointer [&_button]:cursor-pointer">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.14),transparent_28%),linear-gradient(135deg,rgba(248,252,255,0.96),rgba(236,253,245,0.44))] dark:bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.15),transparent_30%),linear-gradient(135deg,rgba(2,8,23,0.98),rgba(8,13,31,0.9))]" />
        <div className="pointer-events-none fixed left-8 top-8 h-64 w-[52rem] rounded-full bg-sky-200/30 blur-3xl dark:bg-sky-500/10" />
        <div className="pointer-events-none fixed bottom-8 right-8 h-72 w-[42rem] rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-500/10" />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative mx-auto flex w-full max-w-[1540px] flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8"
        >
          <DashboardHeader
            isDark={isDark}
            onCreateSession={() => setSessionModalOpen(true)}
            onToggleDark={() => setIsDark((value) => !value)}
          />

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12 [grid-auto-flow:dense]">
            <motion.div variants={fadeUp} className="h-full md:col-span-1 xl:col-span-3 xl:row-span-2">
              <DoctorProfileCard />
            </motion.div>

            <motion.div variants={fadeUp} className="h-full md:col-span-1 xl:col-span-9">
              <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <StatCard key={stat.label} {...stat} />
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="h-full md:col-span-2 xl:col-span-9">
              <QuickActions />
            </motion.div>

            <motion.div variants={fadeUp} className="h-full md:col-span-2 xl:col-span-8">
              <AppointmentManagement />
            </motion.div>
            <motion.div variants={fadeUp} className="h-full md:col-span-1 xl:col-span-4">
              <AvailabilityManagement />
            </motion.div>

            <motion.div variants={fadeUp} className="h-full md:col-span-1 xl:col-span-5">
              <PatientRecordsPreview />
            </motion.div>
            <motion.div variants={fadeUp} className="h-full md:col-span-2 xl:col-span-7">
              <TelemedicineSessions />
            </motion.div>

            <motion.div variants={fadeUp} className="h-full md:col-span-1 xl:col-span-4">
              <ProductivityShortcuts />
            </motion.div>
            <motion.div variants={fadeUp} className="h-full md:col-span-2 xl:col-span-8">
              <PerformanceActivity />
            </motion.div>
          </section>
        </motion.div>
        <AnimatePresence>
          {sessionModalOpen && <CreateSessionModal onClose={() => setSessionModalOpen(false)} />}
        </AnimatePresence>
      </main>
    </div>
  );
}

function DashboardHeader({
  isDark,
  onCreateSession,
  onToggleDark,
}: {
  isDark: boolean;
  onCreateSession: () => void;
  onToggleDark: () => void;
}) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <motion.header variants={fadeUp} className="sticky top-3 z-30">
      <div className="rounded-[26px] border border-white/70 bg-white/76 px-4 py-3.5 shadow-2xl shadow-sky-950/8 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/74 dark:shadow-black/30">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-sky-600 to-emerald-500 text-white shadow-lg shadow-sky-500/30">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-sky-600 dark:text-sky-300">Doctor Workspace</p>
              <h1 className="text-xl font-bold sm:text-2xl">Good morning, Dr. Silva</h1>
              <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{doctor.specialty} · {doctor.department}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <label className="group flex min-h-12 flex-1 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 text-sm text-slate-500 shadow-sm transition focus-within:border-sky-300 focus-within:ring-4 focus-within:ring-sky-200/40 dark:border-white/10 dark:bg-white/8 dark:text-slate-300 dark:focus-within:ring-sky-400/10 md:w-[390px]">
              <Search className="h-5 w-5 text-slate-400 transition group-focus-within:text-sky-500" />
              <input
                className="w-full bg-transparent font-medium outline-none placeholder:text-slate-400"
                placeholder="Search patients, reports, appointments..."
              />
            </label>

            <div className="flex items-center gap-2">
              <Button className="hidden h-12 rounded-2xl bg-gradient-to-r from-sky-600 to-emerald-500 px-4 shadow-lg shadow-sky-500/20 hover:from-sky-500 hover:to-emerald-400 sm:inline-flex" onClick={onCreateSession}>
                <Video className="h-4 w-4" />
                Create Session
              </Button>
              <HeaderIconButton ariaLabel="Notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-white dark:ring-slate-950" />
              </HeaderIconButton>
              <HeaderIconButton ariaLabel="Toggle theme" onClick={onToggleDark}>
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </HeaderIconButton>
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((value) => !value)}
                  className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-lg dark:border-white/10 dark:bg-white/8"
                >
                  <Image src={doctor.avatar} alt={`${doctor.name} avatar`} width={34} height={34} className="rounded-xl" />
                  <span className="hidden sm:block">
                    <span className="block text-sm font-bold">Dr. Silva</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">Cardiology</span>
                  </span>
                  <ChevronDown className={cn("h-4 w-4 text-slate-400 transition", profileOpen && "rotate-180 text-sky-500")} />
                </button>
                <AnimatePresence>{profileOpen && <ProfileMenu />}</AnimatePresence>
              </div>
            </div>
            <Button className="h-12 w-full rounded-2xl bg-gradient-to-r from-sky-600 to-emerald-500 shadow-lg shadow-sky-500/20 hover:from-sky-500 hover:to-emerald-400 sm:hidden" onClick={onCreateSession}>
              <Video className="h-4 w-4" />
              Create Session
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

function ProfileMenu() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.18, ease }}
      className="absolute right-0 top-14 z-50 w-52 origin-top-right overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-2 shadow-2xl shadow-sky-950/12 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95"
    >
      <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-sky-50 hover:text-sky-700 dark:text-slate-200 dark:hover:bg-sky-400/10 dark:hover:text-sky-200">
        <Home className="h-4 w-4" />
        Home
      </Link>
      <Link href="/signin" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10">
        <LogOut className="h-4 w-4" />
        Logout
      </Link>
    </motion.div>
  );
}

function CreateSessionModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 px-4 py-6 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease }}
      onMouseDown={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.96 }}
        transition={{ duration: 0.24, ease }}
        className="w-full max-w-5xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <SessionGenerationForm onCancel={onClose} />
      </motion.div>
    </motion.div>
  );
}

function DoctorProfileCard() {
  const details = [
    { label: "Specialty", value: doctor.specialty, icon: HeartPulse },
    { label: "Hospital", value: doctor.hospital, icon: Hospital },
    { label: "Department", value: doctor.department, icon: UsersRound },
    { label: "Experience", value: doctor.experience, icon: Activity },
    { label: "License No.", value: doctor.license, icon: ShieldCheck },
    { label: "Work Email", value: doctor.email, icon: MailPlus },
  ];

  return (
    <Card className="h-full flex flex-col rounded-[28px] p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-[30px] bg-gradient-to-br from-sky-500 to-emerald-500 blur-md" />
            <Image
              src={doctor.avatar}
              alt={`${doctor.name} profile photo`}
              width={96}
              height={96}
              className="relative rounded-[30px] border-4 border-white bg-sky-50 shadow-xl dark:border-slate-900"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{doctor.name}</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{doctor.specialty}</p>
            <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/12 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {doctor.availability}
            </span>
          </div>
        </div>
        <Button size="icon" variant="outline" className="rounded-2xl">
          <Edit3 className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-5 grid gap-2.5">
        {details.map((detail) => (
          <div key={detail.label} className="flex gap-3 rounded-2xl border border-slate-200/70 bg-white/62 p-3 dark:border-white/10 dark:bg-white/[0.05]">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
              <detail.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{detail.label}</p>
              <p className="mt-1 truncate text-sm font-bold text-slate-700 dark:text-slate-100">{detail.value}</p>
            </div>
          </div>
        ))}
      </div>

      <Button className="mt-5 w-full rounded-2xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
        <Edit3 className="h-4 w-4" />
        Edit Doctor Profile
      </Button>
    </Card>
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
      <p className="mt-4 text-4xl font-bold">{value}</p>
      <p className="mt-2 text-sm font-bold text-slate-600 dark:text-slate-300">{label}</p>
      <p className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-300">{helper}</p>
    </Card>
  );
}

function QuickActions() {
  return (
    <Card className="h-full flex flex-col rounded-[28px] p-5">
      <SectionTitle eyebrow="Quick actions" title="Clinical productivity shortcuts" />
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {actions.map((action) => (
          <button
            key={action.label}
            className="group h-full flex flex-col rounded-[24px] border border-slate-200/70 bg-white/68 p-4 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:bg-sky-50/80 hover:shadow-xl hover:shadow-sky-500/10 dark:border-white/10 dark:bg-white/[0.05] dark:hover:bg-sky-400/10"
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-sky-600 to-emerald-500 text-white shadow-lg shadow-sky-500/25 transition group-hover:scale-105">
              <action.icon className="h-6 w-6" />
            </div>
            <p className="mt-4 text-sm font-bold">{action.label}</p>
            <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{action.description}</p>
          </button>
        ))}
      </div>
    </Card>
  );
}

function AppointmentManagement() {
  return (
    <Card className="h-full flex flex-col rounded-[28px] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionTitle eyebrow="Appointment management" title="Today&apos;s consultation queue" />
        <Button variant="outline" className="rounded-2xl">
          <CalendarCheck className="h-4 w-4" />
          View Calendar
        </Button>
      </div>

      <div className="mt-5 hidden overflow-hidden rounded-[24px] border border-slate-200/70 bg-white/60 dark:border-white/10 dark:bg-white/[0.05] lg:block">
        <div className="grid grid-cols-[1fr_0.9fr_0.55fr_0.55fr_1.1fr] gap-4 border-b border-slate-200/70 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:border-white/10">
          <span>Patient</span>
          <span>Type</span>
          <span>Time</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>
        {appointments.map((appointment) => (
          <div key={`${appointment.patient}-${appointment.time}`} className="grid grid-cols-[1fr_0.9fr_0.55fr_0.55fr_1.1fr] items-center gap-4 border-b border-slate-200/70 px-5 py-4 last:border-b-0 dark:border-white/10">
            <div>
              <p className="font-bold">{appointment.patient}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{appointment.priority}</p>
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{appointment.type}</p>
            <p className="text-sm font-bold">{appointment.time}</p>
            <span className={cn("w-fit rounded-full px-3 py-1.5 text-xs font-bold", appointment.statusClass)}>{appointment.status}</span>
            <AppointmentActions canJoin={appointment.canJoin} />
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3.5 lg:hidden">
        {appointments.map((appointment) => (
          <div key={`${appointment.patient}-${appointment.time}`} className="rounded-[26px] border border-slate-200/70 bg-white/64 p-4 dark:border-white/10 dark:bg-white/[0.05]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold">{appointment.patient}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{appointment.type} · {appointment.time}</p>
              </div>
              <span className={cn("rounded-full px-3 py-1.5 text-xs font-bold", appointment.statusClass)}>{appointment.status}</span>
            </div>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{appointment.priority}</p>
            <AppointmentActions canJoin={appointment.canJoin} mobile />
          </div>
        ))}
      </div>
    </Card>
  );
}

function AppointmentActions({ canJoin, mobile = false }: { canJoin: boolean; mobile?: boolean }) {
  return (
    <div className={cn("flex flex-wrap items-center justify-end gap-2", mobile && "mt-4 justify-start")}>
      {canJoin ? (
        <Button className="rounded-2xl bg-emerald-500 hover:bg-emerald-400">
          <Video className="h-4 w-4" />
          Join
        </Button>
      ) : (
        <>
          <Button variant="outline" size="icon" className="rounded-2xl text-emerald-600">
            <Check className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-2xl text-rose-500">
            <X className="h-4 w-4" />
          </Button>
        </>
      )}
      <Button variant="outline" className="rounded-2xl">
        View Details
      </Button>
    </div>
  );
}

function AvailabilityManagement() {
  return (
    <Card className="h-full flex flex-col rounded-[28px] p-5">
      <div className="flex items-start justify-between gap-4">
        <SectionTitle eyebrow="Availability" title="Weekly schedule" />
        <Button size="icon" variant="outline" className="rounded-2xl">
          <Edit3 className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-5 rounded-[24px] bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-4 text-white shadow-2xl shadow-sky-950/20">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-sky-100">Current status</p>
            <h3 className="mt-2 text-2xl font-bold">Available today</h3>
            <p className="mt-2 text-sm text-slate-300">Clinic: 08:30 AM - 12:30 PM</p>
          </div>
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-white/10 ring-1 ring-white/15">
            <Clock3 className="h-8 w-8 text-emerald-300" />
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-2.5">
        {availability.map((day) => (
          <div key={day.day} className="rounded-[22px] border border-slate-200/70 bg-white/62 p-3.5 dark:border-white/10 dark:bg-white/[0.05]">
            <div className="flex items-center justify-between gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-500/10 text-sm font-bold text-sky-700 dark:text-sky-300">{day.day}</span>
              <span className={cn("rounded-full px-3 py-1.5 text-xs font-bold", day.active ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300" : "bg-slate-500/10 text-slate-500 dark:text-slate-300")}>
                {day.active ? "Open" : "Limited"}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {day.slots.map((slot) => (
                <span key={slot} className="rounded-full bg-slate-950/5 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                  {slot}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button className="mt-5 w-full rounded-2xl">
        <CalendarCheck className="h-4 w-4" />
        Edit Schedule
      </Button>
    </Card>
  );
}

function PatientRecordsPreview() {
  return (
    <Card className="h-full flex flex-col rounded-[28px] p-5">
      <SectionTitle eyebrow="Patient records" title="Recently consulted patients" />
      <div className="mt-5 grid gap-3.5">
        {patients.map((patient) => (
          <div key={patient.name} className="rounded-[26px] border border-slate-200/70 bg-white/62 p-4 transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-500/10 dark:border-white/10 dark:bg-white/[0.05]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-sky-100 to-emerald-100 text-sky-600 dark:from-sky-500/20 dark:to-emerald-500/20 dark:text-sky-300">
                  <UserRound className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">{patient.name}</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{patient.condition}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-400">Last consultation: {patient.date}</p>
                </div>
              </div>
              <span className="rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-700 dark:text-blue-300">{patient.reports} reports</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" className="rounded-2xl">
                <FileText className="h-4 w-4" />
                View Reports
              </Button>
              <Button variant="outline" className="rounded-2xl">
                <NotebookPen className="h-4 w-4" />
                View Notes
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function TelemedicineSessions() {
  const [showSessionForm, setShowSessionForm] = useState(false);

  return (
    <Card className="h-full flex flex-col rounded-[28px] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionTitle eyebrow="Telemedicine" title="Online consultation sessions" />
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-2xl" onClick={() => setShowSessionForm((value) => !value)}>
            <CalendarClock className="h-4 w-4" />
            {showSessionForm ? "Hide Form" : "Create Session"}
          </Button>
          <Button className="rounded-2xl bg-gradient-to-r from-sky-600 to-emerald-500">
            <Video className="h-4 w-4" />
            Open Video Room
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <AnimatePresence mode="wait">
          {showSessionForm ? (
            <SessionGenerationForm key="session-form" onCancel={() => setShowSessionForm(false)} />
          ) : (
            <motion.div
              key="session-summary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease }}
              className="rounded-[24px] border border-sky-200/80 bg-sky-50/75 p-4 shadow-sm dark:border-sky-300/20 dark:bg-sky-400/10"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">Create video consultation</p>
                  <h3 className="mt-2 text-xl font-bold">Generate a secure patient session</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Select a patient, reserve a virtual slot, and generate a meeting link with preparation notes.
                  </p>
                </div>
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-sky-600 to-emerald-500 text-white shadow-lg shadow-sky-500/25">
                  <CalendarClock className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Patient", value: "Hasindu Chanuka" },
                  { label: "Date", value: "Apr 12, 2026" },
                  { label: "Time slot", value: "04:30 PM" },
                  { label: "Duration", value: "30 minutes" },
                ].map((field) => (
                  <div key={field.label} className="rounded-2xl border border-white/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/[0.06]">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{field.label}</p>
                    <p className="mt-1 text-sm font-bold text-slate-700 dark:text-slate-100">{field.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 rounded-2xl border border-white/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/[0.06]">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Preparation note</p>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">Ask patient to keep FBC report and latest blood pressure readings ready.</p>
              </div>

              <Button className="mt-4 w-full rounded-2xl bg-gradient-to-r from-sky-600 to-emerald-500" onClick={() => setShowSessionForm(true)}>
                <Video className="h-4 w-4" />
                Create Session With Patient
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-3.5 lg:grid-cols-3 xl:grid-cols-1">
          {sessions.map((session) => (
            <div key={`${session.title}-${session.time}`} className="relative overflow-hidden rounded-[24px] bg-slate-950 p-4 text-white shadow-2xl shadow-sky-950/15 transition duration-300 hover:-translate-y-1">
              <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-sky-400/25 blur-2xl" />
              <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl" />
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between xl:flex-row">
                <div className="min-w-0">
                  <span className={cn("rounded-full px-3 py-1.5 text-xs font-bold", session.tone)}>{session.status}</span>
                  <h3 className="mt-4 text-lg font-bold">{session.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{session.patient} · {session.time}</p>
                </div>
                <Button className="rounded-2xl bg-white text-slate-950 hover:bg-sky-50">
                  Join Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function SessionGenerationForm({ onCancel }: { onCancel: () => void }) {
  const labelClass = "grid min-w-0 gap-1.5";
  const fieldClass = "h-11 w-full min-w-0 rounded-2xl border border-white/70 bg-white/80 px-3 text-sm font-semibold outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-400/15 dark:border-white/10 dark:bg-white/[0.06]";
  const textareaClass = "min-h-24 w-full min-w-0 rounded-2xl border border-white/70 bg-white/80 px-3 py-3 text-sm font-semibold outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-400/15 dark:border-white/10 dark:bg-white/[0.06]";

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.22, ease }}
      onSubmit={(event) => {
        event.preventDefault();
        onCancel();
      }}
      className="max-h-[calc(100vh-2rem)] w-full overflow-y-auto rounded-[24px] border border-sky-200/80 bg-sky-50/75 p-4 shadow-sm dark:border-sky-300/20 dark:bg-sky-400/10 sm:p-5 xl:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">Generate session</p>
          <h3 className="mt-2 text-xl font-bold">Create video consultation</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Generate a secure telemedicine session and notify the selected patient.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-white/70 text-slate-500 transition hover:border-rose-300 hover:text-rose-500 dark:border-white/10 dark:bg-white/[0.06]"
          aria-label="Close session form"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Patient</span>
          <select className={fieldClass}>
            {patients.map((patient) => (
              <option key={patient.name}>{patient.name}</option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Session title</span>
          <input className={fieldClass} defaultValue="Cardiology video review" />
        </label>
        <label className={labelClass}>
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Date</span>
          <input type="date" className={fieldClass} defaultValue="2026-04-12" />
        </label>
        <label className={labelClass}>
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Start time</span>
          <input type="time" className={fieldClass} defaultValue="16:30" />
        </label>
        <label className={cn(labelClass, "sm:col-span-2")}>
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Duration</span>
          <select className={fieldClass}>
            <option>15 minutes</option>
            <option>30 minutes</option>
            <option>45 minutes</option>
            <option>60 minutes</option>
          </select>
        </label>
        <label className={cn(labelClass, "sm:col-span-2")}>
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Preparation note</span>
          <textarea className={textareaClass} defaultValue="Please keep your FBC report and latest blood pressure readings ready before joining." />
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button type="submit" className="flex-1 rounded-2xl bg-gradient-to-r from-sky-600 to-emerald-500">
          <Video className="h-4 w-4" />
          Generate Session
        </Button>
        <Button type="button" variant="outline" className="flex-1 rounded-2xl" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </motion.form>
  );
}

function ProductivityShortcuts() {
  return (
    <Card className="h-full flex flex-col rounded-[28px] p-5">
      <SectionTitle eyebrow="Consultation tools" title="Notes and prescriptions" />
      <div className="mt-5 grid gap-3.5">
        <ShortcutCard
          icon={NotebookPen}
          title="Add consultation notes"
          description="Capture diagnosis, vitals, follow-up tasks, and care instructions before the next patient."
          action="Add Notes"
        />
        <ShortcutCard
          icon={Pill}
          title="Issue digital prescription"
          description="Create medication plans with dosage, refills, and patient instructions in a focused workflow."
          action="Create Prescription"
        />
      </div>
    </Card>
  );
}

function ShortcutCard({ icon: Icon, title, description, action }: { icon: Icon; title: string; description: string; action: string }) {
  return (
    <div className="rounded-[24px] border border-slate-200/70 bg-white/64 p-4 transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/10 dark:border-white/10 dark:bg-white/[0.05]">
      <div className="flex items-start gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-sky-600 to-emerald-500 text-white shadow-lg shadow-sky-500/20">
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
          <Button variant="outline" className="mt-4 rounded-2xl">
            {action}
          </Button>
        </div>
      </div>
    </div>
  );
}

function PerformanceActivity() {
  return (
    <Card className="h-full flex flex-col rounded-[28px] p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <SectionTitle eyebrow="Performance and activity" title="Clinical throughput overview" />
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "On-time", value: "94%" },
            { label: "Avg consult", value: "18m" },
            { label: "Satisfaction", value: "4.9" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200/70 bg-white/64 px-4 py-3 text-center dark:border-white/10 dark:bg-white/[0.05]">
              <p className="text-lg font-bold">{item.value}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.45fr_0.55fr]">
        <div className="rounded-[24px] border border-slate-200/70 bg-white/62 p-4 dark:border-white/10 dark:bg-white/[0.05]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Appointment trend</p>
              <h3 className="mt-2 text-3xl font-bold">+18%</h3>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
              <BarChart3 className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-6 flex h-28 items-end gap-2">
            {[42, 68, 54, 82, 64, 92, 76].map((height, index) => (
              <div key={index} className="flex flex-1 items-end rounded-full bg-slate-950/5 p-1 dark:bg-white/10">
                <div
                  className="w-full rounded-full bg-gradient-to-t from-sky-600 to-emerald-400"
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">Consultation volume is trending higher than last week while maintaining a strong on-time rate.</p>
        </div>

        <div className="space-y-1">
          {activities.map((activity, index) => (
            <div key={activity.title} className="relative flex gap-4 pb-5 last:pb-0">
              {index !== activities.length - 1 && <div className="absolute left-6 top-12 h-[calc(100%-3rem)] w-px bg-gradient-to-b from-sky-300 to-emerald-300 dark:from-sky-400/40 dark:to-emerald-400/40" />}
              <div className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-sky-600 to-emerald-500 text-white shadow-lg shadow-sky-500/25">
                <activity.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1 rounded-[24px] border border-slate-200/70 bg-white/58 p-4 dark:border-white/10 dark:bg-white/[0.05]">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="font-bold">{activity.title}</h3>
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-300">{activity.time}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{activity.detail}</p>
              </div>
            </div>
          ))}
        </div>
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
