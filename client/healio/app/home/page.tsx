"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  type Variants,
} from "framer-motion";
import {
  Activity,
  Ambulance,
  ArrowRight,
  BadgeCheck,
  Bell,
  Brain,
  CalendarCheck,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Database,
  FileHeart,
  FileText,
  HeartPulse,
  Hospital,
  Laptop,
  LockKeyhole,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Moon,
  Phone,
  Pill,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Sun,
  Syringe,
  UserCheck,
  UserPlus,
  UsersRound,
  Video,
  X,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import type { ComponentType, ReactNode } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Icon = ComponentType<{ className?: string }>;

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

const imageBank = {
  hero: "/illustrations/hero-telemedicine-doctor.svg",
  heroSecond: "/illustrations/hero-patient-dashboard.svg",
  about: "/illustrations/about-healthcare-platform.svg",
  aboutInset: "/illustrations/about-care-workflow.svg",
  telemedicine:
    "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1400&q=86",
  cta:
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=86",
};

const navItems = [
  { label: "Home", href: "/" },
  { label: "Doctors", href: "#doctors" },
  { label: "Services", href: "#services" },
  { label: "Appointments", href: "#process" },
  { label: "Telemedicine", href: "#telemedicine" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const services = [
  {
    icon: UsersRound,
    title: "Patient Management",
    description: "Profiles, visit history, insurance notes, and care plans in one connected workspace.",
    image:
      "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=900&q=84",
  },
  {
    icon: Stethoscope,
    title: "Doctor Management",
    description: "Manage departments, credentials, clinic schedules, and consultation workflows.",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=900&q=84",
  },
  {
    icon: CalendarCheck,
    title: "Appointment Scheduling",
    description: "Book, reschedule, remind, and track in-person or virtual care visits.",
    image:
      "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=900&q=84",
  },
  {
    icon: Video,
    title: "Telemedicine Video Consultation",
    description: "Secure video rooms with patient context, notes, prescriptions, and follow-ups.",
    image:
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=900&q=84",
  },
  {
    icon: Pill,
    title: "Digital Prescriptions",
    description: "Create prescriptions, share care instructions, and reduce manual handoffs.",
    image:
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=900&q=84",
  },
  {
    icon: Bell,
    title: "Notifications & Alerts",
    description: "Automated reminders for appointments, lab reports, payments, and follow-up care.",
    image:
      "https://images.unsplash.com/photo-1581093458791-9f3c3ae95d0f?auto=format&fit=crop&w=900&q=84",
  },
  {
    icon: FileText,
    title: "Medical Report Uploads",
    description: "Upload reports, scans, and lab files into a secure patient timeline.",
    image:
      "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&w=900&q=84",
  },
  {
    icon: Laptop,
    title: "Admin Dashboard",
    description: "Track hospital operations, bookings, revenue signals, and care team performance.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=84",
  },
];

const processSteps = [
  { icon: UserPlus, title: "Register / Sign in", description: "Create a secure profile for patients and care teams." },
  { icon: Hospital, title: "Search departments", description: "Find doctors by specialty, location, and availability." },
  { icon: CalendarCheck, title: "Book appointment", description: "Reserve an in-person or online consultation instantly." },
  { icon: Video, title: "Attend consultation", description: "Join a secure video visit with clinical context ready." },
  { icon: ClipboardCheck, title: "Get follow-up", description: "Receive prescriptions, reminders, and care instructions." },
];

const stats = [
  { icon: UsersRound, value: "10,000+", label: "Patients served" },
  { icon: Stethoscope, value: "500+", label: "Doctors onboarded" },
  { icon: CalendarCheck, value: "25,000+", label: "Appointments managed" },
  { icon: HeartPulse, value: "98%", label: "Patient satisfaction" },
];

const departments = [
  {
    title: "Cardiology",
    description: "Heart care, ECG reviews, cardiac follow-ups.",
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=900&q=84",
    icon: HeartPulse,
  },
  {
    title: "Neurology",
    description: "Neurological assessments and specialist care.",
    image:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=900&q=84",
    icon: Brain,
  },
  {
    title: "Pediatrics",
    description: "Child-friendly visits, vaccination reminders.",
    image:
      "https://images.unsplash.com/photo-1631217872822-7c26d0b6b9e7?auto=format&fit=crop&w=900&q=84",
    icon: Syringe,
  },
  {
    title: "Orthopedics",
    description: "Joint care, injury visits, recovery planning.",
    image:
      "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?auto=format&fit=crop&w=900&q=84",
    icon: Activity,
  },
  {
    title: "Dermatology",
    description: "Skin care consults and treatment follow-ups.",
    image:
      "https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?auto=format&fit=crop&w=900&q=84",
    icon: Sparkles,
  },
  {
    title: "General Medicine",
    description: "Everyday health visits and long-term care.",
    image:
      "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=900&q=84",
    icon: BadgeCheck,
  },
];

const reasons = [
  { icon: ShieldCheck, title: "Trusted healthcare ecosystem", description: "Connect patients, clinicians, admins, and care records with confidence." },
  { icon: Stethoscope, title: "Easy doctor access", description: "Surface the right doctor at the right time across clinics and virtual channels." },
  { icon: LockKeyhole, title: "Secure data", description: "Protect sensitive medical workflows with thoughtful permissions and audit-ready records." },
  { icon: Video, title: "Video consultations", description: "Support online visits without losing clinical context or follow-up continuity." },
  { icon: Clock3, title: "Fast appointment workflow", description: "Reduce waiting time with live schedules, reminders, and quick booking." },
  { icon: Pill, title: "Digital prescriptions", description: "Send prescriptions and care instructions after every consultation." },
];

const testimonials = [
  {
    quote:
      "The online consultation flow feels calm and professional. My doctor had my history ready before the call started.",
    name: "Nadia Perera",
    role: "Telemedicine patient",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=180&q=80",
  },
  {
    quote:
      "Healio brought appointment booking, patient notes, and virtual visits into one clean workflow for our outpatient team.",
    name: "Dr. Aaron Silva",
    role: "Family physician",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=180&q=80",
  },
  {
    quote:
      "Digital reminders and prescriptions made follow-up care easier. It finally feels like the hospital system respects my time.",
    name: "Maya Chen",
    role: "Patient",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=180&q=80",
  },
];

const articles = [
  {
    category: "Telemedicine",
    date: "Apr 08, 2026",
    title: "Preparing for a secure video consultation",
    description: "A simple checklist for sharing symptoms, reports, and follow-up questions before your online visit.",
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=84",
  },
  {
    category: "Patient Care",
    date: "Apr 02, 2026",
    title: "How digital prescriptions improve continuity",
    description: "Why connected prescriptions, instructions, and reminders reduce missed steps after a consultation.",
    image:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=900&q=84",
  },
  {
    category: "Appointments",
    date: "Mar 28, 2026",
    title: "Benefits of online doctor appointments",
    description: "How live availability and automated reminders make care access faster for patients and clinics.",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=84",
  },
];

export default function HomePage() {
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  return (
    <div className={cn(isDark && "dark")}>
      <main className="min-h-screen overflow-hidden bg-[#f7fcff] text-slate-950 transition-colors duration-500 dark:bg-[#030712] dark:text-white">
        <Header
          isDark={isDark}
          menuOpen={menuOpen}
          scrolled={scrolled}
          onToggleDark={() => setIsDark((value) => !value)}
          onToggleMenu={() => setMenuOpen((value) => !value)}
          onCloseMenu={() => setMenuOpen(false)}
        />

        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ProcessSection />
        <TelemedicineSection />
        <StatsSection />
        <DepartmentsSection />
        <WhyChooseSection />
        <TestimonialsSection />
        <ArticlesSection />
        <CtaSection />
        <Footer />
      </main>
    </div>
  );
}

function Header({
  isDark,
  menuOpen,
  scrolled,
  onToggleDark,
  onToggleMenu,
  onCloseMenu,
}: {
  isDark: boolean;
  menuOpen: boolean;
  scrolled: boolean;
  onToggleDark: () => void;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="hidden border-b border-white/15 bg-slate-950 px-4 py-2 text-sm text-slate-200 dark:bg-black sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <InfoItem icon={Phone} text="Emergency: +94 77 245 8890" />
            <InfoItem icon={Mail} text="care@healio.health" />
            <InfoItem icon={MapPin} text="Colombo Digital Care Center" />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase text-sky-200">Follow us</span>
            {[FaFacebookF, FaInstagram, FaTwitter].map((Icon, index) => (
              <Link
                key={index}
                href="#"
                className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-white/80 transition hover:border-sky-300 hover:text-sky-300"
              >
                <Icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <nav
        className={cn(
          "border-b px-4 py-4 transition duration-300 sm:px-6 lg:px-8",
          scrolled
            ? "border-slate-200/80 bg-white/82 shadow-lg shadow-sky-950/5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/82"
            : "border-white/35 bg-white/45 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/45"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br from-sky-500 to-emerald-500 text-white shadow-lg shadow-sky-500/25">
              <HeartPulse className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-xl font-bold leading-none">Healio</span>
              <span className="text-xs font-semibold uppercase text-sky-600 dark:text-sky-300">Hospital SaaS</span>
            </span>
          </Link>

          <div className="hidden items-center gap-6 xl:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-semibold text-slate-600 transition hover:text-sky-500 dark:text-slate-300 dark:hover:text-sky-300"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 xl:flex">
            <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={onToggleDark}>
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <LinkButton href="/signin" variant="outline">
              Login
            </LinkButton>
            <LinkButton href="/signup">
              Sign Up
              <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>

          <div className="flex items-center gap-2 xl:hidden">
            <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={onToggleDark}>
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="outline" size="icon" aria-label="Toggle menu" onClick={onToggleMenu}>
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-4 grid max-w-7xl gap-2 rounded-lg border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95 xl:hidden"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={onCloseMenu}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-sky-50 dark:text-slate-200 dark:hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-3">
              <LinkButton href="/signin" variant="outline" onClick={onCloseMenu}>
                Login
              </LinkButton>
              <LinkButton href="/signup" onClick={onCloseMenu}>
                Sign Up
              </LinkButton>
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_left,rgba(14,165,233,0.16),transparent_34%),linear-gradient(135deg,#f9fdff_0%,#eaf8ff_46%,#f6fff9_100%)] px-4 pb-20 pt-40 dark:bg-[radial-gradient(ellipse_at_top_left,rgba(14,165,233,0.22),transparent_34%),linear-gradient(135deg,#020617_0%,#07111f_50%,#03130e_100%)] sm:px-6 lg:px-8 lg:pt-48">
      <div className="absolute inset-x-0 bottom-0 h-24 rounded-t-[48px] bg-[#f7fcff] dark:bg-[#030712]" />
      <div className="absolute left-1/2 top-32 h-px w-[90rem] -translate-x-1/2 bg-gradient-to-r from-transparent via-sky-300/70 to-transparent" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div variants={stagger} initial="hidden" animate="show" className="relative z-10">
          <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-lg border border-sky-200/80 bg-white/70 px-3 py-2 text-sm font-bold text-sky-700 shadow-sm backdrop-blur-md dark:border-sky-300/20 dark:bg-white/10 dark:text-sky-200">
            <Sparkles className="h-4 w-4" />
            Digital care operations, beautifully connected
          </motion.div>
          <motion.h1 variants={fadeUp} className="max-w-5xl text-5xl font-bold leading-[1.02] text-slate-950 sm:text-6xl lg:text-7xl dark:text-white">
            Smart Hospital Management & Telemedicine Platform
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Book appointments, manage medical records, consult doctors online, issue digital prescriptions, and coordinate modern hospital workflows from one premium healthcare platform.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="/signin" size="lg">
              Book Appointment
              <ArrowRight className="h-5 w-5" />
            </LinkButton>
            <LinkButton href="#services" size="lg" variant="secondary">
              Explore Services
              <ChevronRight className="h-5 w-5" />
            </LinkButton>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
            {["Secure by design", "Live doctor schedules", "Patient-first experience"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                <BadgeCheck className="h-4 w-4 text-emerald-500" />
                {item}
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 46 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease }} className="relative min-h-[640px]">
          <div className="absolute inset-6 rounded-[42px] bg-gradient-to-br from-sky-300/30 via-indigo-300/15 to-emerald-300/30 blur-3xl" />
          <div className="absolute right-0 top-8 w-[78%] overflow-hidden rounded-[44px] rounded-bl-lg border border-white/75 bg-white/45 shadow-2xl shadow-sky-950/20 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.08]">
            <div className="relative aspect-[4/5]">
              <div className="absolute inset-6 rounded-[36px] bg-gradient-to-br from-sky-200/65 via-indigo-100/45 to-emerald-100/55 blur-2xl dark:from-sky-500/20 dark:via-indigo-500/15 dark:to-emerald-500/15" />
              <Image src={imageBank.hero} alt="Illustration of a doctor managing telemedicine care" fill priority className="object-contain p-5" sizes="(max-width: 1024px) 90vw, 620px" />
              <div className="absolute bottom-5 left-5 right-5 rounded-lg border border-white/35 bg-slate-950/55 p-4 text-white shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold">Today&apos;s care flow</p>
                    <p className="text-xs text-white/75">Appointments, triage, video calls</p>
                  </div>
                  <span className="rounded-lg bg-emerald-400 px-3 py-1 text-xs font-bold text-emerald-950">Live</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-8 left-0 w-[48%] overflow-hidden rounded-[34px] rounded-tr-lg border border-white/75 bg-white/55 shadow-2xl shadow-emerald-950/15 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.08]">
            <div className="relative aspect-[4/5]">
              <div className="absolute inset-5 rounded-[26px] bg-gradient-to-br from-cyan-100/80 via-white/40 to-emerald-100/70 blur-xl dark:from-cyan-500/15 dark:via-white/5 dark:to-emerald-500/15" />
              <Image src={imageBank.heroSecond} alt="Illustration of a patient dashboard and appointment cards" fill className="object-contain p-4" sizes="(max-width: 1024px) 55vw, 330px" />
            </div>
          </div>
          <FloatingBadge className="left-0 top-16" icon={Video} label="24/7 Telemedicine" detail="Secure video sessions" />
          <FloatingBadge className="right-0 top-[45%]" icon={UserCheck} label="200+ Verified Doctors" detail="Across departments" />
          <FloatingBadge className="bottom-32 right-6" icon={Database} label="Secure Medical Records" detail="Protected access" />
          <Card className="absolute left-10 top-[46%] hidden w-64 p-4 lg:block">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-sky-500 text-white">
                <CalendarCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold">Instant Booking</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Next slot in 12 minutes</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <Section id="about" eyebrow="Platform intro" title="A Smarter Way to Manage Healthcare Digitally">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="relative min-h-[560px]">
          <div className="absolute left-0 top-0 w-[78%] overflow-hidden rounded-[42px] rounded-br-lg border border-white/75 bg-white/55 shadow-2xl shadow-sky-950/15 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.08]">
            <div className="relative aspect-[4/5]">
              <div className="absolute inset-6 rounded-[36px] bg-gradient-to-br from-sky-100/85 via-white/55 to-emerald-100/75 blur-2xl dark:from-sky-500/15 dark:via-white/5 dark:to-emerald-500/15" />
              <Image src={imageBank.about} alt="Animated illustration of a connected healthcare platform dashboard" fill className="object-contain p-6" sizes="(max-width: 1024px) 80vw, 560px" />
            </div>
          </div>
          <div className="absolute bottom-4 right-0 w-[52%] overflow-hidden rounded-[34px] rounded-tl-lg border border-white/75 bg-white/60 shadow-2xl shadow-emerald-950/15 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.08]">
            <div className="relative aspect-[4/5]">
              <div className="absolute inset-5 rounded-[28px] bg-gradient-to-br from-cyan-100/80 via-indigo-50/55 to-emerald-100/80 blur-xl dark:from-cyan-500/15 dark:via-indigo-500/10 dark:to-emerald-500/15" />
              <Image src={imageBank.aboutInset} alt="Animated illustration of a digital care workflow" fill className="object-contain p-4" sizes="(max-width: 1024px) 55vw, 340px" />
            </div>
          </div>
          <Card className="absolute bottom-24 left-8 max-w-72 p-5">
            <p className="text-4xl font-bold text-sky-500">12 min</p>
            <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">average online booking completion</p>
          </Card>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
          <motion.p variants={fadeUp} className="text-sm font-bold uppercase text-sky-600 dark:text-sky-300">Connected hospital workflows</motion.p>
          <motion.h2 variants={fadeUp} className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
            Designed for patients, doctors, and hospital administrators.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
            Healio brings appointments, consultations, prescriptions, medical records, department schedules, and patient notifications into one carefully structured healthcare experience.
          </motion.p>
          <motion.div variants={stagger} className="mt-8 grid gap-4">
            {[
              { icon: ShieldCheck, title: "Secure platform", description: "Protect sensitive health records with structured access controls." },
              { icon: Video, title: "Real-time consultation", description: "Support online care with video sessions and clinical notes." },
              { icon: CalendarCheck, title: "Easy appointment management", description: "Keep patients and departments aligned with live schedules." },
            ].map((item) => (
              <motion.div variants={fadeUp} key={item.title} className="flex gap-4 rounded-lg border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/[0.06]">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-emerald-500/12 text-emerald-600 dark:text-emerald-300">
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}

function ServicesSection() {
  return (
    <section id="services" className="relative overflow-hidden rounded-t-[48px] bg-slate-950 px-4 py-24 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(14,165,233,0.22),transparent_42%),radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.14),transparent_38%)]" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Services"
          title="Hospital management modules with depth and clarity"
          description="A rich operating layer for patient care, virtual visits, clinical teams, and administrative control."
          inverted
        />
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => (
            <motion.div variants={fadeUp} key={service.title} className={cn(index === 0 && "xl:col-span-2", index === 3 && "xl:col-span-2")}>
              <ServiceCard service={service} wide={index === 0 || index === 3} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <Section id="process" eyebrow="How it works" title="A polished care journey from sign-in to follow-up">
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="relative grid gap-5 lg:grid-cols-5">
        <div className="absolute left-10 right-10 top-10 hidden h-px bg-gradient-to-r from-transparent via-sky-300 to-transparent lg:block" />
        {processSteps.map((step, index) => (
          <motion.div variants={fadeUp} key={step.title} className="relative">
            <Card className="group h-full p-5 transition hover:-translate-y-1 hover:border-sky-300/60 hover:shadow-2xl hover:shadow-sky-500/10">
              <div className="relative z-10 grid h-16 w-16 place-items-center rounded-lg bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/25">
                <step.icon className="h-7 w-7" />
              </div>
              <p className="mt-6 text-sm font-bold text-sky-600 dark:text-sky-300">Step {index + 1}</p>
              <h3 className="mt-2 text-xl font-bold">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{step.description}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

function TelemedicineSection() {
  return (
    <section id="telemedicine" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-12 overflow-hidden rounded-[44px] bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-6 text-white shadow-2xl shadow-sky-950/20 dark:from-black dark:via-slate-950 dark:to-emerald-950 md:grid-cols-2 lg:p-12">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm font-bold text-sky-100 backdrop-blur-md">
            <LockKeyhole className="h-4 w-4" />
            Secure telemedicine suite
          </motion.div>
          <motion.h2 variants={fadeUp} className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
            Consult Trusted Doctors From Anywhere
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 text-lg leading-8 text-slate-300">
            Give patients a private video room, appointment context, report attachments, prescriptions, and follow-up reminders without fragmenting the care experience.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            {["Live call", "Patient info", "Secure connection", "Prescription ready"].map((item) => (
              <span key={item} className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm font-bold text-white backdrop-blur-md">
                {item}
              </span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.75, ease }} className="relative min-h-[520px]">
          <div className="absolute inset-6 rounded-[40px] bg-gradient-to-br from-sky-400/25 via-indigo-400/20 to-emerald-400/25 blur-3xl" />
          <div className="absolute inset-x-0 top-4 overflow-hidden rounded-[38px] border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur-md">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[30px]">
              <Image src={imageBank.telemedicine} alt="Doctor conducting a telemedicine video consultation" fill className="object-cover" sizes="(max-width: 768px) 90vw, 560px" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
              <div className="absolute left-4 right-4 top-4 flex items-center justify-between rounded-lg border border-white/15 bg-slate-950/55 px-4 py-3 backdrop-blur-md">
                <span className="flex items-center gap-2 text-sm font-bold">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  Live call
                </span>
                <span className="text-sm text-white/80">18:42</span>
              </div>
              <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-3">
                {[MessageCircle, PlayCircle, X].map((Icon, index) => (
                  <button key={index} className="grid h-11 w-11 place-items-center rounded-lg bg-white/20 text-white backdrop-blur-md transition hover:scale-105 hover:bg-white/30">
                    <Icon className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <FloatingBadge className="bottom-24 left-0" icon={FileHeart} label="Patient info" detail="Records synced" dark />
          <FloatingBadge className="bottom-8 right-0" icon={ShieldCheck} label="Secure connection" detail="Encrypted visit" dark />
        </motion.div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <motion.div variants={fadeUp} key={stat.label}>
            <Card className="group overflow-hidden p-7 text-center transition hover:-translate-y-1 hover:border-emerald-300/60">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-emerald-500/12 text-emerald-600 transition group-hover:scale-110 dark:text-emerald-300">
                <stat.icon className="h-7 w-7" />
              </div>
              <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }} className="mt-5 text-5xl font-bold text-slate-950 dark:text-white">
                {stat.value}
              </motion.p>
              <p className="mt-2 font-semibold text-slate-600 dark:text-slate-300">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function DepartmentsSection() {
  return (
    <Section id="doctors" eyebrow="Departments" title="Specialty care, presented with clarity">
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {departments.map((department) => (
          <motion.div variants={fadeUp} key={department.title}>
            <DepartmentCard department={department} />
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

function WhyChooseSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#eaf8ff_0%,#f8fffb_100%)] px-4 py-24 dark:bg-[linear-gradient(135deg,#07111f_0%,#03130e_100%)] sm:px-6 lg:px-8">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300 to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <SectionHeading
          eyebrow="Why choose Healio"
          title="A premium care platform with operational strength"
          description="Hospitals need more than a booking page. Healio gives every patient interaction a connected clinical and administrative backbone."
        />
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="grid gap-4 sm:grid-cols-2">
          {reasons.map((reason) => (
            <motion.div variants={fadeUp} key={reason.title}>
              <Card className="h-full p-5 transition hover:-translate-y-1 hover:border-sky-300/60">
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-sky-500/12 text-sky-600 dark:text-sky-300">
                  <reason.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold">{reason.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{reason.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <Section eyebrow="Testimonials" title="Patients and care teams feel the difference">
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="grid gap-5 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <motion.div variants={fadeUp} key={testimonial.name}>
            <Card className="h-full p-6">
              <div className="flex gap-1 text-emerald-500">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Sparkles key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-5 text-lg leading-8 text-slate-700 dark:text-slate-200">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="mt-8 flex items-center gap-4">
                <Image src={testimonial.avatar} alt={testimonial.name} width={56} height={56} className="h-14 w-14 rounded-lg object-cover" />
                <div>
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

function ArticlesSection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Health articles" title="Useful reading for digital-first care" description="Practical guidance for patients, doctors, and care teams moving toward smarter healthcare experiences." />
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="grid gap-5 lg:grid-cols-3">
          {articles.map((article) => (
            <motion.article variants={fadeUp} key={article.title}>
              <Card className="group h-full overflow-hidden p-3 transition hover:-translate-y-1 hover:border-sky-300/60 hover:shadow-2xl hover:shadow-sky-500/10">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                  <Image src={article.image} alt={article.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 1024px) 90vw, 390px" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase text-sky-600 dark:text-sky-300">
                    <span>{article.category}</span>
                    <span>{article.date}</span>
                  </div>
                  <h3 className="mt-4 text-2xl font-bold leading-tight">{article.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{article.description}</p>
                  <Link href="#" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-sky-600 transition hover:text-emerald-500 dark:text-sky-300">
                    Read More
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </Card>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="relative mx-auto max-w-7xl overflow-hidden rounded-[44px] bg-slate-950 p-8 text-white shadow-2xl shadow-sky-950/20 md:p-12">
        <Image src={imageBank.cta} alt="Modern hospital care team" fill className="object-cover opacity-30" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/88 to-sky-950/65" />
        <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-bold uppercase text-sky-200">Start smarter care</p>
            <h2 className="mt-3 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">Experience Smarter Healthcare Today</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Book appointments, connect with doctors digitally, and give every patient visit a modern healthcare experience.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
            <LinkButton href="/signup" size="lg" className="bg-white text-slate-950 hover:bg-slate-100">
              Get Started
              <ArrowRight className="h-5 w-5" />
            </LinkButton>
            <LinkButton href="/signin" size="lg" variant="secondary" className="bg-white/10 text-white ring-white/20 hover:bg-white/15">
              Book Consultation
            </LinkButton>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-[#020617] px-4 pt-20 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(14,165,233,0.18),transparent_35%),radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.14),transparent_35%)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-gradient-to-br from-sky-500 to-emerald-500 text-white">
                <HeartPulse className="h-6 w-6" />
              </span>
              <span className="text-2xl font-bold">Healio</span>
            </Link>
            <p className="mt-5 max-w-sm leading-7 text-slate-300">
              Premium hospital management and telemedicine software for connected patient care, clinical teams, and digital health operations.
            </p>
            <div className="mt-6 flex gap-3">
            {[FaFacebookF, FaInstagram, FaTwitter].map((Icon, index) => (
                <Link key={index} href="#" className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/5 text-white/80 transition hover:border-sky-300 hover:text-sky-300">
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
          <FooterGroup title="Quick links" links={["Home", "Doctors", "About", "Contact"]} />
          <FooterGroup title="Services" links={["Appointments", "Telemedicine", "Digital Records", "Admin Dashboard"]} />
          <div>
            <h3 className="font-bold">Contact info</h3>
            <div className="mt-5 grid gap-4 text-sm text-slate-300">
              <InfoItem icon={Phone} text="+94 77 245 8890" />
              <InfoItem icon={Mail} text="care@healio.health" />
              <InfoItem icon={MapPin} text="Colombo Digital Care Center" />
              <InfoItem icon={Ambulance} text="24/7 emergency support" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 py-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Healio. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow={eyebrow} title={title} />
        {children}
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  inverted,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  inverted?: boolean;
}) {
  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="mb-12 max-w-3xl">
      <p className={cn("text-sm font-bold uppercase", inverted ? "text-sky-200" : "text-sky-600 dark:text-sky-300")}>{eyebrow}</p>
      <h2 className={cn("mt-3 text-4xl font-bold leading-tight sm:text-5xl", inverted ? "text-white" : "text-slate-950 dark:text-white")}>{title}</h2>
      {description && <p className={cn("mt-5 text-lg leading-8", inverted ? "text-slate-300" : "text-slate-600 dark:text-slate-300")}>{description}</p>}
    </motion.div>
  );
}

function LinkButton({
  href,
  children,
  className,
  variant = "default",
  size = "default",
  onClick,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "secondary" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  onClick?: () => void;
}) {
  const variants = {
    default:
      "bg-sky-500 text-white shadow-lg shadow-sky-500/25 hover:bg-sky-400 active:scale-[0.98]",
    secondary:
      "bg-white/75 text-slate-950 shadow-sm ring-1 ring-slate-200/70 hover:bg-white dark:bg-white/10 dark:text-white dark:ring-white/15 dark:hover:bg-white/15",
    ghost:
      "text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10",
    outline:
      "border border-slate-200 bg-white/60 text-slate-900 hover:border-sky-300 hover:bg-sky-50 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-sky-300/50 dark:hover:bg-sky-400/10",
  };

  const sizes = {
    default: "h-11 px-5 text-sm",
    sm: "h-9 px-3 text-sm",
    lg: "h-12 px-6 text-base",
    icon: "h-10 w-10",
  };

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </Link>
  );
}

function ServiceCard({
  service,
  wide,
}: {
  service: { icon: Icon; title: string; description: string; image: string };
  wide: boolean;
}) {
  return (
    <Card className={cn("group relative h-full overflow-hidden border-white/10 bg-white/[0.07] p-3 text-white transition duration-300 hover:-translate-y-1 hover:border-sky-300/50 hover:bg-white/[0.1]", wide ? "min-h-[380px]" : "min-h-[330px]")}>
      <Image src={service.image} alt={service.title} fill className="object-cover opacity-28 transition duration-500 group-hover:scale-105 group-hover:opacity-[0.36]" sizes={wide ? "(max-width: 1280px) 90vw, 620px" : "(max-width: 1280px) 50vw, 300px"} />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/72 to-transparent" />
      <div className="relative flex h-full flex-col justify-end p-4">
        <div className="mb-5 grid h-12 w-12 place-items-center rounded-lg bg-white/15 text-sky-100 backdrop-blur-md">
          <service.icon className="h-6 w-6" />
        </div>
        <h3 className="text-2xl font-bold">{service.title}</h3>
        <p className="mt-3 max-w-xl leading-7 text-slate-300">{service.description}</p>
      </div>
    </Card>
  );
}

function DepartmentCard({
  department,
}: {
  department: { icon: Icon; title: string; description: string; image: string };
}) {
  return (
    <Card className="group overflow-hidden p-3 transition hover:-translate-y-1 hover:border-sky-300/60 hover:shadow-2xl hover:shadow-sky-500/10">
      <div className="relative aspect-[5/4] overflow-hidden rounded-lg">
        <Image src={department.image} alt={department.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 1280px) 90vw, 390px" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/76 via-slate-950/12 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="mb-3 grid h-12 w-12 place-items-center rounded-lg bg-white/18 backdrop-blur-md">
            <department.icon className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold">{department.title}</h3>
          <p className="mt-2 text-sm leading-6 text-white/80">{department.description}</p>
          <Link href="#" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-sky-100">
            View Doctors
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Card>
  );
}

function FloatingBadge({
  icon: Icon,
  label,
  detail,
  className,
  dark,
}: {
  icon: Icon;
  label: string;
  detail: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease, delay: 0.2 }}
      className={cn(
        "absolute z-20 hidden rounded-lg border p-4 shadow-2xl backdrop-blur-md sm:block",
        dark
          ? "border-white/15 bg-white/[0.12] text-white shadow-black/30"
          : "border-white/70 bg-white/72 text-slate-950 shadow-sky-950/10 dark:border-white/10 dark:bg-slate-950/60 dark:text-white",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-sky-500 text-white">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold">{label}</p>
          <p className={cn("text-xs", dark ? "text-white/70" : "text-slate-500 dark:text-slate-400")}>{detail}</p>
        </div>
      </div>
    </motion.div>
  );
}

function InfoItem({ icon: Icon, text }: { icon: Icon; text: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Icon className="h-4 w-4 text-sky-300" />
      {text}
    </span>
  );
}

function FooterGroup({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="font-bold">{title}</h3>
      <div className="mt-5 grid gap-3 text-sm text-slate-300">
        {links.map((link) => (
          <Link key={link} href="#" className="transition hover:text-sky-300">
            {link}
          </Link>
        ))}
      </div>
    </div>
  );
}
