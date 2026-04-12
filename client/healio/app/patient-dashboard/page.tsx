"use client";

import Image from "next/image";
import {
  Activity,
  Bell,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Download,
  Edit3,
  FilePlus2,
  FileText,
  HeartPulse,
  Mail,
  Moon,
  MoreHorizontal,
  Phone,
  Pill,
  Plus,
  Search,
  ShieldCheck,
  Stethoscope,
  Sun,
  UploadCloud,
  UserRound,
  Video,
  XCircle,
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
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const patient = {
  name: "Hasindu Chanuka",
  patientId: "HL-PAT-2048",
  email: "hasindu.chanuka@email.com",
  phone: "+94 77 248 9031",
  bloodGroup: "O+",
  age: "24 years",
  gender: "Male",
  emergencyContact: "Nimasha Perera · +94 71 555 2198",
  avatar: "/illustrations/testimonial-avatar-patient.svg",
};

const stats = [
  { label: "Upcoming Appointments", value: "03", icon: CalendarClock, accent: "from-sky-500 to-cyan-400", helper: "Next one today" },
  { label: "Completed Consultations", value: "18", icon: Stethoscope, accent: "from-emerald-500 to-teal-400", helper: "+4 this month" },
  { label: "Uploaded Medical Reports", value: "12", icon: FileText, accent: "from-blue-500 to-indigo-400", helper: "2 new uploads" },
  { label: "Active Prescriptions", value: "04", icon: Pill, accent: "from-lime-500 to-emerald-400", helper: "Refill reminders on" },
];

const actions = [
  { label: "Book Appointment", icon: Plus, description: "Find a doctor and reserve a slot" },
  { label: "Join Telemedicine Session", icon: Video, description: "Enter your secure video room" },
  { label: "Upload Medical Report", icon: UploadCloud, description: "Add lab reports or scans" },
  { label: "View Prescriptions", icon: Pill, description: "Check recent medicine plans" },
  { label: "Update Profile", icon: Edit3, description: "Keep health details current" },
];

const appointments = [
  {
    doctor: "Dr. Amelia Fernando",
    specialty: "Cardiology",
    date: "Today, Apr 12",
    time: "4:30 PM",
    status: "Telemedicine",
    tone: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
    canJoin: true,
  },
  {
    doctor: "Dr. Kavish Silva",
    specialty: "Dermatology",
    date: "Apr 15, 2026",
    time: "10:00 AM",
    status: "Confirmed",
    tone: "bg-sky-500/12 text-sky-700 dark:text-sky-300",
    canJoin: false,
  },
  {
    doctor: "Dr. Maya Chen",
    specialty: "General Medicine",
    date: "Apr 20, 2026",
    time: "8:45 AM",
    status: "Clinic visit",
    tone: "bg-indigo-500/12 text-indigo-700 dark:text-indigo-300",
    canJoin: false,
  },
];

const reports = [
  { name: "Full Blood Count Report", date: "Apr 10, 2026", type: "PDF", size: "1.8 MB" },
  { name: "Cardiac Stress Test Results", date: "Mar 28, 2026", type: "PDF", size: "3.4 MB" },
  { name: "Chest X-Ray Scan", date: "Mar 12, 2026", type: "PNG", size: "5.1 MB" },
];

const prescriptions = [
  {
    doctor: "Dr. Amelia Fernando",
    date: "Apr 08, 2026",
    summary: "Atorvastatin 10mg, Omega-3 supplement, 14-day follow-up",
  },
  {
    doctor: "Dr. Kavish Silva",
    date: "Mar 24, 2026",
    summary: "Cetirizine 10mg, topical recovery cream, hydration plan",
  },
];

const activities = [
  { title: "Telemedicine appointment booked", detail: "Cardiology session scheduled for today at 4:30 PM", time: "25 min ago", icon: Video },
  { title: "Medical report uploaded", detail: "Full Blood Count Report added to your record vault", time: "2 days ago", icon: FilePlus2 },
  { title: "Consultation completed", detail: "General Medicine follow-up marked as complete", time: "1 week ago", icon: CheckCircle2 },
  { title: "Prescription received", detail: "Medication plan shared by Dr. Amelia Fernando", time: "1 week ago", icon: Pill },
];

export default function PatientDashboardPage() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={cn(isDark && "dark")}>
      <main className="min-h-screen overflow-hidden bg-[#f4fbff] text-slate-950 transition-colors duration-500 dark:bg-[#020817] dark:text-white">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.2),transparent_30%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.88),rgba(236,253,245,0.38))] dark:bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.2),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.16),transparent_30%),linear-gradient(135deg,rgba(2,8,23,0.96),rgba(4,47,46,0.7))]" />
        <div className="pointer-events-none fixed inset-x-6 top-6 h-56 rounded-[48px] border border-white/60 bg-white/35 blur-3xl dark:border-white/10 dark:bg-sky-400/10" />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative mx-auto flex w-full max-w-[1500px] flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8"
        >
          <DashboardHeader isDark={isDark} onToggleDark={() => setIsDark((value) => !value)} />

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12 [grid-auto-flow:dense]">
            <motion.div variants={fadeUp} className="h-full md:col-span-1 xl:col-span-3 xl:row-span-2">
              <ProfileSummary />
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
              <AppointmentsSection />
            </motion.div>
            <motion.div variants={fadeUp} className="h-full md:col-span-1 xl:col-span-4">
              <ReportsSection />
            </motion.div>

            <motion.div variants={fadeUp} className="h-full md:col-span-1 xl:col-span-5">
              <PrescriptionSection />
            </motion.div>
            <motion.div variants={fadeUp} className="h-full md:col-span-1 xl:col-span-7">
              <ActivityTimeline />
            </motion.div>

          </section>
        </motion.div>
      </main>
    </div>
  );
}

function DashboardHeader({ isDark, onToggleDark }: { isDark: boolean; onToggleDark: () => void }) {
  return (
    <motion.header variants={fadeUp} className="sticky top-3 z-30">
      <div className="rounded-[26px] border border-white/70 bg-white/72 px-4 py-3.5 shadow-2xl shadow-sky-950/8 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/72 dark:shadow-black/30">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 text-white shadow-lg shadow-sky-500/30">
              <HeartPulse className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-sky-600 dark:text-sky-300">Healio Patient Care</p>
              <h1 className="text-xl font-bold sm:text-2xl">Welcome back, Hasindu</h1>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <label className="group flex min-h-12 flex-1 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 text-sm text-slate-500 shadow-sm transition focus-within:border-sky-300 focus-within:ring-4 focus-within:ring-sky-200/40 dark:border-white/10 dark:bg-white/8 dark:text-slate-300 dark:focus-within:ring-sky-400/10 md:w-[360px]">
              <Search className="h-5 w-5 text-slate-400 transition group-focus-within:text-sky-500" />
              <input
                className="w-full bg-transparent font-medium outline-none placeholder:text-slate-400"
                placeholder="Search doctors, reports, prescriptions..."
              />
            </label>

            <div className="flex items-center gap-2">
              <Button className="hidden h-12 rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 px-4 shadow-lg shadow-sky-500/20 hover:from-sky-400 hover:to-emerald-400 sm:inline-flex">
                <CalendarClock className="h-4 w-4" />
                Book Appointment
              </Button>
              <HeaderIconButton ariaLabel="Notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-950" />
              </HeaderIconButton>
              <HeaderIconButton ariaLabel="Toggle theme" onClick={onToggleDark}>
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </HeaderIconButton>
              <button className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-lg dark:border-white/10 dark:bg-white/8">
                <Image src={patient.avatar} alt={`${patient.name} avatar`} width={34} height={34} className="rounded-xl" />
                <span className="hidden sm:block">
                  <span className="block text-sm font-bold">{patient.name.split(" ")[0]}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">Patient</span>
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <Button className="h-12 w-full rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 shadow-lg shadow-sky-500/20 hover:from-sky-400 hover:to-emerald-400 sm:hidden">
              <CalendarClock className="h-4 w-4" />
              Book Appointment
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

function ProfileSummary() {
  const details = [
    { label: "Patient ID", value: patient.patientId, icon: ShieldCheck },
    { label: "Email", value: patient.email, icon: Mail },
    { label: "Phone", value: patient.phone, icon: Phone },
    { label: "Blood Group", value: patient.bloodGroup, icon: HeartPulse },
    { label: "Age", value: patient.age, icon: Activity },
    { label: "Gender", value: patient.gender, icon: UserRound },
    { label: "Emergency Contact", value: patient.emergencyContact, icon: Bell },
  ];

  return (
    <Card className="h-full flex flex-col rounded-[28px] p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-sky-400 to-emerald-400 blur-md" />
            <Image
              src={patient.avatar}
              alt={`${patient.name} profile avatar`}
              width={92}
              height={92}
              className="relative rounded-[28px] border-4 border-white bg-sky-50 shadow-xl dark:border-slate-900"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{patient.name}</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">Primary patient account</p>
          </div>
        </div>
        <Button size="icon" variant="outline" className="rounded-2xl">
          <Edit3 className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-5 grid gap-2.5">
        {details.map((detail) => (
          <div key={detail.label} className="flex gap-3 rounded-2xl border border-slate-200/70 bg-white/58 p-3 dark:border-white/10 dark:bg-white/[0.05]">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
              <detail.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{detail.label}</p>
              <p className="mt-1 text-sm font-bold text-slate-700 dark:text-slate-100">{detail.value}</p>
            </div>
          </div>
        ))}
      </div>

      <Button className="mt-5 w-full rounded-2xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
        <Edit3 className="h-4 w-4" />
        Edit Profile
      </Button>
    </Card>
  );
}

function StatCard({ label, value, icon: Icon, accent, helper }: { label: string; value: string; icon: Icon; accent: string; helper: string }) {
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
      <SectionTitle eyebrow="Quick actions" title="What would you like to do next?" />
      <div className="mt-4 grid gap-2.5 md:grid-cols-2 xl:grid-cols-5">
        {actions.map((action) => (
          <button
            key={action.label}
            className="group h-full flex flex-col rounded-[20px] border border-slate-200/70 bg-white/68 p-3 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:bg-sky-50/80 hover:shadow-xl hover:shadow-sky-500/10 dark:border-white/10 dark:bg-white/[0.05] dark:hover:bg-sky-400/10"
          >
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 text-white shadow-lg shadow-sky-500/25 transition group-hover:scale-105">
              <action.icon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-bold">{action.label}</p>
            <p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400">{action.description}</p>
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <EmptyState
          icon={CalendarClock}
          image="/illustrations/homepage-appointment-scheduling.svg"
          title="No pending appointment requests"
          description="When a doctor reviews a booking request, confirmations and required actions will appear here."
          action="Browse Doctors"
          compact
        />
        <EmptyState
          icon={FileText}
          image="/illustrations/homepage-report-uploads.svg"
          title="No missing medical reports"
          description="Your required report checklist is clear. We will highlight any future uploads your care team requests."
          action="Upload New Report"
          compact
        />
      </div>
    </Card>
  );
}

function AppointmentsSection() {
  return (
    <Card className="h-full flex flex-col rounded-[28px] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionTitle eyebrow="Upcoming appointments" title="Your next care visits" />
        <Button variant="outline" className="rounded-2xl">
          <Plus className="h-4 w-4" />
          New Booking
        </Button>
      </div>
      <div className="mt-5 grid gap-3.5">
        {appointments.map((appointment) => (
          <div
            key={`${appointment.doctor}-${appointment.date}`}
            className="grid gap-4 rounded-[26px] border border-slate-200/70 bg-white/64 p-4 transition duration-300 hover:-translate-y-1 hover:border-sky-300/70 hover:shadow-xl hover:shadow-sky-500/10 dark:border-white/10 dark:bg-white/[0.05] lg:grid-cols-[1.1fr_0.8fr_auto]"
          >
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-sky-100 to-emerald-100 text-sky-600 dark:from-sky-500/20 dark:to-emerald-500/20 dark:text-sky-200">
                <Stethoscope className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-bold">{appointment.doctor}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{appointment.specialty}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-2xl bg-slate-950/5 px-3 py-2 text-sm font-bold dark:bg-white/10">
                <Clock3 className="h-4 w-4 text-sky-500" />
                {appointment.date} · {appointment.time}
              </span>
              <span className={cn("rounded-2xl px-3 py-2 text-sm font-bold", appointment.tone)}>{appointment.status}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              {appointment.canJoin && (
                <Button className="rounded-2xl bg-emerald-500 hover:bg-emerald-400">
                  <Video className="h-4 w-4" />
                  Join
                </Button>
              )}
              <Button variant="outline" className="rounded-2xl">
                Reschedule
              </Button>
              <Button variant="ghost" size="icon" className="rounded-2xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10">
                <XCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ReportsSection() {
  return (
    <Card className="h-full flex flex-col rounded-[28px] p-5">
      <div className="flex items-center justify-between gap-4">
        <SectionTitle eyebrow="Medical reports" title="Uploaded files" />
        <Button size="icon" className="rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500">
          <UploadCloud className="h-5 w-5" />
        </Button>
      </div>
      <div className="mt-5 grid gap-2.5">
        {reports.map((report) => (
          <div key={report.name} className="flex items-center justify-between gap-3 rounded-[24px] border border-slate-200/70 bg-white/62 p-4 dark:border-white/10 dark:bg-white/[0.05]">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-300">
                <FileText className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{report.name}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {report.date} · {report.type} · {report.size}
                </p>
              </div>
            </div>
            <Button variant="outline" size="icon" className="shrink-0 rounded-2xl">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-[22px] border border-dashed border-sky-300 bg-sky-50/70 p-4 text-sm font-bold text-sky-700 transition hover:-translate-y-1 hover:bg-sky-100 dark:border-sky-300/30 dark:bg-sky-400/10 dark:text-sky-200">
        <UploadCloud className="h-5 w-5" />
        Upload new report
      </button>
    </Card>
  );
}

function PrescriptionSection() {
  return (
    <Card className="h-full flex flex-col rounded-[28px] p-5">
      <SectionTitle eyebrow="Prescriptions" title="Recent medication plans" />
      <div className="mt-5 grid gap-3.5">
        {prescriptions.map((prescription) => (
          <div key={`${prescription.doctor}-${prescription.date}`} className="rounded-[26px] border border-slate-200/70 bg-white/62 p-5 dark:border-white/10 dark:bg-white/[0.05]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                  <Pill className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">{prescription.doctor}</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{prescription.date}</p>
                </div>
              </div>
              <Button variant="outline" className="rounded-2xl">
                View Details
              </Button>
            </div>
            <p className="mt-4 rounded-2xl bg-emerald-50/80 p-4 text-sm leading-6 text-slate-600 dark:bg-emerald-400/10 dark:text-slate-300">{prescription.summary}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ActivityTimeline() {
  return (
    <Card className="h-full flex flex-col rounded-[28px] p-5">
      <SectionTitle eyebrow="Health activity" title="Recent timeline" />
      <div className="mt-5 space-y-1">
        {activities.map((activity, index) => (
          <div key={activity.title} className="relative flex gap-4 pb-6 last:pb-0">
            {index !== activities.length - 1 && <div className="absolute left-6 top-12 h-[calc(100%-3rem)] w-px bg-gradient-to-b from-sky-300 to-emerald-300 dark:from-sky-400/40 dark:to-emerald-400/40" />}
            <div className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 text-white shadow-lg shadow-sky-500/25">
              <activity.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 rounded-[24px] border border-slate-200/70 bg-white/58 p-4 dark:border-white/10 dark:bg-white/[0.05]">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-bold">{activity.title}</h3>
                <span className="text-xs font-bold text-sky-600 dark:text-sky-300">{activity.time}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{activity.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function EmptyState({
  icon: Icon,
  image,
  title,
  description,
  action,
  compact = false,
}: {
  icon: Icon;
  image: string;
  title: string;
  description: string;
  action: string;
  compact?: boolean;
}) {
  return (
    <Card className={cn("h-full flex flex-col overflow-hidden rounded-[28px]", compact ? "p-3.5" : "p-5")}>
      <div className={cn("grid gap-4 sm:items-center", compact ? "sm:grid-cols-[92px_1fr]" : "sm:grid-cols-[128px_1fr]")}>
        <div className={cn("relative rounded-[24px] bg-gradient-to-br from-sky-100 via-white to-emerald-100 dark:from-sky-500/15 dark:via-white/5 dark:to-emerald-500/15", compact ? "h-24" : "h-32")}>
          <Image src={image} alt="" fill className="object-contain p-4" sizes={compact ? "92px" : "150px"} />
        </div>
        <div>
          <div className={cn("mb-3 grid place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300", compact ? "h-9 w-9" : "h-11 w-11")}>
            <Icon className="h-5 w-5" />
          </div>
          <h3 className={cn("font-bold", compact ? "text-base" : "text-xl")}>{title}</h3>
          <p className={cn("mt-2 text-sm text-slate-500 dark:text-slate-400", compact ? "line-clamp-2 leading-5" : "leading-6")}>{description}</p>
          <Button variant="outline" className={cn("rounded-2xl", compact ? "mt-3 h-9 px-3" : "mt-5")}>
            {action}
          </Button>
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
