"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Home,
  LogOut,
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
import { AnimatePresence, motion, type Variants } from "framer-motion";
import type { ComponentType, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AgoraMeeting } from "@/components/telemedicine/AgoraMeeting";
import { TelemedicineSessionTable } from "@/components/telemedicine/TelemedicineSessionTable";
import { useTelemedicineSessions } from "@/hooks/useTelemedicineSessions";
import { getApiErrorMessage } from "@/lib/apiError";
import { cn } from "@/lib/utils";
import { getTelemedicineJoinDetails, startTelemedicineSession } from "@/service/telemedicine";
import { useAuthStore } from "@/store/authStore";
import PatientProfileForm from "@/components/PatientProfileForm";
import { getPatientProfileByUserId, PatientProfileResponse } from "@/service/patientApi";
import { getAllDoctors } from "@/service/doctorApi";
import {
  AppointmentResponse,
  CreateAppointmentPayload,
  PrescriptionResponse,
  cancelAppointment,
  createAppointment,
  getAppointmentsByPatientId,
  getPrescriptionsByPatientId,
  updateAppointment,
} from "@/service/appointmentApi";
import type { MeetingJoinDetails, TelemedicineSession } from "@/types/telemedicine/types";
import ToastUtils from "@/utils/toastUtils";

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

const actions = [
  { label: "Book Appointment", icon: Plus, description: "Find a doctor and reserve a slot" },
  { label: "Join Telemedicine Session", icon: Video, description: "Enter your secure video room" },
  { label: "Upload Medical Report", icon: UploadCloud, description: "Add lab reports or scans" },
  { label: "View Prescriptions", icon: Pill, description: "Check recent medicine plans" },
  { label: "Update Profile", icon: Edit3, description: "Keep health details current" },
];

const reports = [
  { name: "Full Blood Count Report", date: "Apr 10, 2026", type: "PDF", size: "1.8 MB" },
  { name: "Cardiac Stress Test Results", date: "Mar 28, 2026", type: "PDF", size: "3.4 MB" },
  { name: "Chest X-Ray Scan", date: "Mar 12, 2026", type: "PNG", size: "5.1 MB" },
];

const activities = [
  { title: "Telemedicine appointment booked", detail: "Cardiology session scheduled for today at 4:30 PM", time: "25 min ago", icon: Video },
  { title: "Medical report uploaded", detail: "Full Blood Count Report added to your record vault", time: "2 days ago", icon: FilePlus2 },
  { title: "Consultation completed", detail: "General Medicine follow-up marked as complete", time: "1 week ago", icon: CheckCircle2 },
  { title: "Prescription received", detail: "Medication plan shared by Dr. Amelia Fernando", time: "1 week ago", icon: Pill },
];

export default function PatientDashboardPage() {
  const [isDark, setIsDark] = useState(false);
  const [patientProfile, setPatientProfile] = useState<PatientProfileResponse | null>(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [meetingDetails, setMeetingDetails] = useState<MeetingJoinDetails | null>(null);
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionResponse[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionResponse | null>(null);
  const [doctorOptions, setDoctorOptions] = useState<Array<{ id: string; name: string }>>([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAppointmentsLoading, setIsAppointmentsLoading] = useState(false);
  const user = useAuthStore((state) => state.user);
  const patientId = user?.userId ?? patient.patientId;
  const {
    sessions: telemedicineSessions,
    isLoading: sessionsLoading,
    refetch: refetchTelemedicineSessions,
  } = useTelemedicineSessions({ patientId, enabled: Boolean(patientId) });

  useEffect(() => {
    const loadPatientProfile = async () => {
      if (!user?.userId) {
        setIsLoadingProfile(false);
        return;
      }

      setIsLoadingProfile(true);
      const result = await getPatientProfileByUserId(user.userId);

      if (result.success && result.data) {
        setPatientProfile(result.data);
        setShowProfileForm(false);
      } else {
        setPatientProfile(null);
        setShowProfileForm(true);
      }

      setIsLoadingProfile(false);
    };

    loadPatientProfile();
  }, [user?.userId]);

  const loadAppointmentData = async () => {
    if (!user?.userId) return;

    setIsAppointmentsLoading(true);

    const [appointmentsResult, prescriptionsResult] = await Promise.all([
      getAppointmentsByPatientId(user.userId),
      getPrescriptionsByPatientId(user.userId),
    ]);

    if (appointmentsResult.success) {
      setAppointments(appointmentsResult.data ?? []);
    } else if (appointmentsResult.error) {
      ToastUtils.error(appointmentsResult.error);
    }

    if (prescriptionsResult.success) {
      setPrescriptions(prescriptionsResult.data ?? []);
    } else if (prescriptionsResult.error) {
      ToastUtils.error(prescriptionsResult.error);
    }

    setIsAppointmentsLoading(false);
  };

  useEffect(() => {
    if (!user?.userId) return;

    void loadAppointmentData();
  }, [user?.userId]);

  useEffect(() => {
    const loadDoctors = async () => {
      const result = await getAllDoctors();
      if (!result.success || !result.data) return;

      const normalized = result.data.map((doctor) => ({
        id: doctor.userId,
        name: doctor.userInfo?.username
          ? `Dr. ${doctor.userInfo.username}`
          : `Dr. ${doctor.specialization}`,
      }));
      setDoctorOptions(normalized);
    };

    void loadDoctors();
  }, []);

  const handleProfileCreated = () => {
    setShowProfileForm(false);
    if (user?.userId) {
      getPatientProfileByUserId(user.userId).then((result) => {
        if (result.success && result.data) {
          setPatientProfile(result.data);
        }
      });
    }
  };

  const handleJoinSession = async (session: TelemedicineSession) => {
    try {
      const details =
        session.status === "ONGOING"
          ? await getTelemedicineJoinDetails(session.id)
          : await startTelemedicineSession(session.id);
      setMeetingDetails(details);
      void refetchTelemedicineSessions();
    } catch (error) {
      ToastUtils.error(getApiErrorMessage(error, "Unable to open telemedicine session."));
    }
  };

  const handleBookAppointment = async (payload: CreateAppointmentPayload) => {
    const result = await createAppointment(payload);
    if (result.success) {
      setIsBookingModalOpen(false);
      await loadAppointmentData();
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    const reason = window.prompt("Reason for cancellation (optional):") || undefined;
    const result = await cancelAppointment(appointmentId, reason);
    if (result.success) {
      await loadAppointmentData();
    }
  };

  const handleRescheduleAppointment = async (appointment: AppointmentResponse) => {
    const date = window.prompt("New date (YYYY-MM-DD):", appointment.appointmentDate);
    const time = window.prompt("New time (HH:mm:ss):", appointment.appointmentTime);

    if (!date || !time) return;

    const result = await updateAppointment(appointment.id, {
      appointmentDate: date,
      appointmentTime: time,
    });

    if (result.success) {
      await loadAppointmentData();
    }
  };

  const dashboardStats = useMemo(() => {
    const upcoming = appointments.filter((item) => ["PENDING", "CONFIRMED"].includes(item.status)).length;
    const completed = appointments.filter((item) => item.status === "COMPLETED").length;
    const activePrescriptions = prescriptions.length;

    return [
      {
        label: "Upcoming Appointments",
        value: String(upcoming).padStart(2, "0"),
        icon: CalendarClock,
        accent: "from-sky-500 to-cyan-400",
        helper: "Scheduled visits",
      },
      {
        label: "Completed Consultations",
        value: String(completed).padStart(2, "0"),
        icon: Stethoscope,
        accent: "from-emerald-500 to-teal-400",
        helper: "Care history",
      },
      {
        label: "Uploaded Medical Reports",
        value: String(reports.length).padStart(2, "0"),
        icon: FileText,
        accent: "from-blue-500 to-indigo-400",
        helper: "Stored reports",
      },
      {
        label: "Active Prescriptions",
        value: String(activePrescriptions).padStart(2, "0"),
        icon: Pill,
        accent: "from-lime-500 to-emerald-400",
        helper: "Medication plans",
      },
    ];
  }, [appointments, prescriptions]);

  if (isLoadingProfile) {
    return (
      <div className={cn(isDark && "dark")}>
        <main className="min-h-screen bg-[#f4fbff] dark:bg-[#020817] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-sky-200 border-t-sky-500 dark:border-sky-900 dark:border-t-sky-400"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={cn(isDark && "dark")}>
      <main className="min-h-screen overflow-hidden bg-[#f4fbff] text-slate-950 transition-colors duration-500 dark:bg-[#020817] dark:text-white [&_a]:cursor-pointer [&_button]:cursor-pointer">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.2),transparent_30%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.88),rgba(236,253,245,0.38))] dark:bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.2),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.16),transparent_30%),linear-gradient(135deg,rgba(2,8,23,0.96),rgba(4,47,46,0.7))]" />
        <div className="pointer-events-none fixed inset-x-6 top-6 h-56 rounded-[48px] border border-white/60 bg-white/35 blur-3xl dark:border-white/10 dark:bg-sky-400/10" />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative mx-auto flex w-full max-w-[1500px] flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8"
        >
          <DashboardHeader
            isDark={isDark}
            onToggleDark={() => setIsDark((value) => !value)}
            onBookAppointment={() => setIsBookingModalOpen(true)}
          />

          {showProfileForm && user && (
            <PatientProfileForm
              userId={user.userId}
              mode={patientProfile ? "edit" : "create"}
              initialData={patientProfile || undefined}
              onSuccess={handleProfileCreated}
              onClose={() => setShowProfileForm(false)}
            />
          )}

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12 [grid-auto-flow:dense]">
            <motion.div variants={fadeUp} className="h-full md:col-span-1 xl:col-span-3 xl:row-span-2">
              <ProfileSummary 
                profile={patientProfile} 
                defaultPatient={patient}
                onEditProfile={() => setShowProfileForm(true)}
              />
            </motion.div>

            <motion.div variants={fadeUp} className="h-full md:col-span-1 xl:col-span-9">
              <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {dashboardStats.map((stat) => (
                  <StatCard key={stat.label} {...stat} />
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="h-full md:col-span-2 xl:col-span-9">
              <QuickActions
                onEditProfile={() => setShowProfileForm(true)}
                onBookAppointment={() => setIsBookingModalOpen(true)}
                onViewPrescriptions={() => {
                  document.getElementById("patient-prescriptions")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              />
            </motion.div>

            <motion.div variants={fadeUp} className="h-full md:col-span-2 xl:col-span-8">
              <AppointmentsSection
                appointments={appointments}
                isLoading={isAppointmentsLoading}
                telemedicineSessions={telemedicineSessions}
                sessionsLoading={sessionsLoading}
                onBookAppointment={() => setIsBookingModalOpen(true)}
                onJoinSession={handleJoinSession}
                onCancelAppointment={handleCancelAppointment}
                onRescheduleAppointment={handleRescheduleAppointment}
              />
            </motion.div>
            <motion.div variants={fadeUp} className="h-full md:col-span-1 xl:col-span-4">
              <ReportsSection />
            </motion.div>

            <motion.div variants={fadeUp} className="h-full md:col-span-1 xl:col-span-5">
              <PrescriptionSection
                prescriptions={prescriptions}
                isLoading={isAppointmentsLoading}
                onViewDetails={(prescription) => setSelectedPrescription(prescription)}
              />
            </motion.div>
            <motion.div variants={fadeUp} className="h-full md:col-span-1 xl:col-span-7">
              <ActivityTimeline />
            </motion.div>

          </section>
        </motion.div>
        {meetingDetails && (
          <AgoraMeeting
            joinDetails={meetingDetails}
            participantLabel="Patient consultation room"
            onLeave={() => {
              setMeetingDetails(null);
              void refetchTelemedicineSessions();
            }}
          />
        )}
        {isBookingModalOpen && (
          <BookingModal
            doctors={doctorOptions}
            patientId={user?.userId ?? ""}
            onClose={() => setIsBookingModalOpen(false)}
            onSubmit={handleBookAppointment}
          />
        )}
        {selectedPrescription && (
          <PrescriptionDetailsModal
            prescription={selectedPrescription}
            onClose={() => setSelectedPrescription(null)}
          />
        )}
      </main>
    </div>
  );
}

function DashboardHeader({
  isDark,
  onToggleDark,
  onBookAppointment,
}: {
  isDark: boolean;
  onToggleDark: () => void;
  onBookAppointment: () => void;
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const displayName = user?.firstName || patient.name.split(" ")[0];

  const handleLogout = () => {
    logout();
    router.push("/signin");
  };

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
              <h1 className="text-xl font-bold sm:text-2xl">Welcome back, {displayName}</h1>
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
              <Link href="/" className="hidden h-12 items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/80 px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 dark:border-white/10 dark:bg-white/8 dark:text-slate-200 dark:hover:bg-sky-400/10 sm:inline-flex">
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Button
                className="hidden h-12 rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 px-4 shadow-lg shadow-sky-500/20 hover:from-sky-400 hover:to-emerald-400 sm:inline-flex"
                onClick={onBookAppointment}
              >
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
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((value) => !value)}
                  className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-lg dark:border-white/10 dark:bg-white/8"
                >
                  <Image src={patient.avatar} alt={`${patient.name} avatar`} width={34} height={34} className="rounded-xl" />
                  <span className="hidden sm:block">
                    <span className="block text-sm font-bold">{displayName}</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">Patient</span>
                  </span>
                  <ChevronDown className={cn("h-4 w-4 text-slate-400 transition", profileOpen && "rotate-180 text-sky-500")} />
                </button>
                <AnimatePresence>{profileOpen && <ProfileMenu onLogout={handleLogout} />}</AnimatePresence>
              </div>
            </div>
            <Button
              className="h-12 w-full rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 shadow-lg shadow-sky-500/20 hover:from-sky-400 hover:to-emerald-400 sm:hidden"
              onClick={onBookAppointment}
            >
              <CalendarClock className="h-4 w-4" />
              Book Appointment
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

function ProfileMenu({ onLogout }: { onLogout: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.2, ease }}
      className="absolute right-0 top-14 z-50 w-72 origin-top-right overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-2xl shadow-sky-950/12 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95"
    >
      <Link href="/" className="flex min-h-12 items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-700 transition hover:bg-sky-50 hover:text-sky-700 dark:text-slate-200 dark:hover:bg-sky-400/10 dark:hover:text-sky-200">
        <Home className="h-4 w-4" />
        Home
      </Link>
      <Link href="/patient-dashboard" className="flex min-h-12 items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-700 transition hover:bg-sky-50 hover:text-sky-700 dark:text-slate-200 dark:hover:bg-sky-400/10">
        <UserRound className="h-4 w-4" />
        Patient Dashboard
      </Link>
      <button type="button" onClick={onLogout} className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-rose-600 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10">
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </motion.div>
  );
}

function ProfileSummary({ 
  profile, 
  defaultPatient,
  onEditProfile
}: { 
  profile: PatientProfileResponse | null; 
  defaultPatient: typeof patient;
  onEditProfile?: () => void;
}) {
  const user = useAuthStore((state) => state.user);
  const displayName = user ? `${user.firstName} ${user.lastName}` : defaultPatient.name;
  const displayEmail = user?.email || defaultPatient.email;

  const details = [
    { label: "Patient ID", value: profile?.id || defaultPatient.patientId, icon: ShieldCheck },
    { label: "Email", value: displayEmail, icon: Mail },
    { label: "Blood Group", value: profile?.bloodGroup || defaultPatient.bloodGroup, icon: HeartPulse },
    { label: "Gender", value: profile?.gender ? profile.gender.charAt(0) + profile.gender.slice(1).toLowerCase() : defaultPatient.gender, icon: UserRound },
    { label: "Date of Birth", value: profile?.dateOfBirth || defaultPatient.age, icon: Activity },
    { label: "Emergency Contact", value: profile?.emergencyContactName || defaultPatient.emergencyContact, icon: Bell },
  ];

  return (
    <Card className="h-full flex flex-col overflow-hidden rounded-[28px] p-5">
      <div className="flex items-start justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-sky-400 to-emerald-400 blur-md" />
            <Image
              src={defaultPatient.avatar}
              alt={`${displayName} profile avatar`}
              width={92}
              height={92}
              className="relative rounded-[28px] border-4 border-white bg-sky-50 shadow-xl dark:border-slate-900"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-2xl font-bold">{displayName}</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
              {profile ? "Profile completed" : "Profile pending"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-2.5 overflow-y-auto min-h-0">
        {details.map((detail) => (
          <div key={detail.label} className="flex gap-3 rounded-2xl border border-slate-200/70 bg-white/58 p-3 dark:border-white/10 dark:bg-white/[0.05] shrink-0">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
              <detail.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{detail.label}</p>
              <p className="mt-1 truncate text-sm font-bold text-slate-700 dark:text-slate-100">{detail.value || "Not provided"}</p>
            </div>
          </div>
        ))}
      </div>

      <Button 
        onClick={onEditProfile}
        className="mt-5 w-full shrink-0 rounded-2xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
      >
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

function QuickActions({
  onEditProfile,
  onBookAppointment,
  onViewPrescriptions,
}: {
  onEditProfile?: () => void;
  onBookAppointment?: () => void;
  onViewPrescriptions?: () => void;
}) {
  const handleActionClick = (label: string) => {
    if (label === "Update Profile" && onEditProfile) {
      onEditProfile();
    }
    if (label === "Book Appointment" && onBookAppointment) {
      onBookAppointment();
    }
    if (label === "View Prescriptions" && onViewPrescriptions) {
      onViewPrescriptions();
    }
  };

  return (
    <Card className="h-full flex flex-col rounded-[28px] p-5">
      <SectionTitle eyebrow="Quick actions" title="What would you like to do next?" />
      <div className="mt-4 grid gap-2.5 md:grid-cols-2 xl:grid-cols-5">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => handleActionClick(action.label)}
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

function AppointmentsSection({
  appointments,
  isLoading,
  telemedicineSessions,
  sessionsLoading,
  onBookAppointment,
  onJoinSession,
  onCancelAppointment,
  onRescheduleAppointment,
}: {
  appointments: AppointmentResponse[];
  isLoading: boolean;
  telemedicineSessions: TelemedicineSession[];
  sessionsLoading: boolean;
  onBookAppointment: () => void;
  onJoinSession: (session: TelemedicineSession) => void;
  onCancelAppointment: (appointmentId: string) => void;
  onRescheduleAppointment: (appointment: AppointmentResponse) => void;
}) {
  const sortedTelemedicineSessions = useMemo(() => {
    const statusPriority: Record<TelemedicineSession["status"], number> = {
      SCHEDULED: 0,
      WAITING: 1,
      ONGOING: 2,
      COMPLETED: 3,
      CANCELLED: 4,
    };

    return [...telemedicineSessions].sort((current, next) => {
      const priorityDifference = statusPriority[current.status] - statusPriority[next.status];

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      return Date.parse(current.scheduledStartTime) - Date.parse(next.scheduledStartTime);
    });
  }, [telemedicineSessions]);

  return (
    <Card className="h-full flex flex-col rounded-[28px] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionTitle eyebrow="Upcoming appointments" title="Your next care visits" />
        <Button variant="outline" className="rounded-2xl" onClick={onBookAppointment}>
          <Plus className="h-4 w-4" />
          New Booking
        </Button>
      </div>
      <div className="mt-5 grid gap-3.5">
        {isLoading && (
          <div className="rounded-[22px] border border-slate-200/70 bg-white/62 p-4 text-sm font-semibold text-slate-500 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">
            Loading appointments...
          </div>
        )}
        {!isLoading && appointments.length === 0 && (
          <div className="rounded-[22px] border border-dashed border-sky-300 bg-sky-50/70 p-4 text-sm font-semibold text-slate-500 dark:border-sky-300/30 dark:bg-sky-400/10 dark:text-slate-300">
            No appointments yet. Use New Booking to schedule your first appointment.
          </div>
        )}
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="grid gap-4 rounded-[26px] border border-slate-200/70 bg-white/64 p-4 transition duration-300 hover:-translate-y-1 hover:border-sky-300/70 hover:shadow-xl hover:shadow-sky-500/10 dark:border-white/10 dark:bg-white/[0.05] lg:grid-cols-[1.1fr_0.8fr_auto]"
          >
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-sky-100 to-emerald-100 text-sky-600 dark:from-sky-500/20 dark:to-emerald-500/20 dark:text-sky-200">
                <Stethoscope className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-bold">
                  {appointment.doctor?.userInfo?.firstName || "Doctor"} {appointment.doctor?.userInfo?.lastName || ""}
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{appointment.doctor?.specialization || "General"}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-2xl bg-slate-950/5 px-3 py-2 text-sm font-bold dark:bg-white/10">
                <Clock3 className="h-4 w-4 text-sky-500" />
                {appointment.appointmentDate} · {appointment.appointmentTime}
              </span>
              <span className={cn(
                "rounded-2xl px-3 py-2 text-sm font-bold",
                appointment.status === "CANCELLED"
                  ? "bg-rose-500/12 text-rose-700 dark:text-rose-300"
                  : appointment.status === "CONFIRMED"
                    ? "bg-sky-500/12 text-sky-700 dark:text-sky-300"
                    : appointment.status === "COMPLETED"
                      ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
                      : "bg-indigo-500/12 text-indigo-700 dark:text-indigo-300",
              )}>
                {appointment.status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              <Button variant="outline" className="rounded-2xl" onClick={() => onRescheduleAppointment(appointment)}>
                Reschedule
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onCancelAppointment(appointment.id)}
                className="rounded-2xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
              >
                <XCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-1 flex-col">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-300">Telemedicine</p>
          <h3 className="mt-1 text-lg font-bold">Online consultation sessions</h3>
        </div>
        <TelemedicineSessionTable
          sessions={sortedTelemedicineSessions}
          isLoading={sessionsLoading}
          viewer="patient"
          onJoin={onJoinSession}
          pageSize={6}
        />
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

function PrescriptionSection({
  prescriptions,
  isLoading,
  onViewDetails,
}: {
  prescriptions: PrescriptionResponse[];
  isLoading: boolean;
  onViewDetails: (prescription: PrescriptionResponse) => void;
}) {
  return (
    <Card id="patient-prescriptions" className="h-full flex flex-col rounded-[28px] p-5">
      <SectionTitle eyebrow="Prescriptions" title="Recent medication plans" />
      <div className="mt-5 grid gap-3.5">
        {isLoading && (
          <div className="rounded-[22px] border border-slate-200/70 bg-white/62 p-4 text-sm font-semibold text-slate-500 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">
            Loading prescriptions...
          </div>
        )}
        {!isLoading && prescriptions.length === 0 && (
          <div className="rounded-[22px] border border-dashed border-sky-300 bg-sky-50/70 p-4 text-sm font-semibold text-slate-500 dark:border-sky-300/30 dark:bg-sky-400/10 dark:text-slate-300">
            No prescriptions available yet.
          </div>
        )}
        {prescriptions.map((prescription) => (
          <div key={prescription.id} className="rounded-[26px] border border-slate-200/70 bg-white/62 p-5 dark:border-white/10 dark:bg-white/[0.05]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                  <Pill className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">Doctor ID: {prescription.doctorId}</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{prescription.issuedDate}</p>
                </div>
              </div>
              <Button variant="outline" className="rounded-2xl" onClick={() => onViewDetails(prescription)}>
                View Details
              </Button>
            </div>
            <p className="mt-4 rounded-2xl bg-emerald-50/80 p-4 text-sm leading-6 text-slate-600 dark:bg-emerald-400/10 dark:text-slate-300">
              {prescription.diagnosis}
              {prescription.notes ? ` - ${prescription.notes}` : ""}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function PrescriptionDetailsModal({
  prescription,
  onClose,
}: {
  prescription: PrescriptionResponse;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-white/20 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold">Prescription Details</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Issued: {prescription.issuedDate}</p>
          </div>
          <Button variant="outline" className="rounded-2xl" onClick={onClose}>Close</Button>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Diagnosis</p>
          <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">{prescription.diagnosis}</p>
          {prescription.notes && (
            <>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Notes</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{prescription.notes}</p>
            </>
          )}
        </div>

        <div className="mt-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Medicines</p>
          <div className="mt-2 grid gap-3">
            {prescription.items.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200/70 bg-white p-4 dark:border-white/10 dark:bg-white/[0.04]">
                <p className="font-bold">{item.medicineName}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.dosage} · {item.frequency}</p>
                {(item.duration || item.instructions) && (
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {item.duration ? `Duration: ${item.duration}. ` : ""}
                    {item.instructions ? `Instructions: ${item.instructions}` : ""}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingModal({
  doctors,
  patientId,
  onClose,
  onSubmit,
}: {
  doctors: Array<{ id: string; name: string }>;
  patientId: string;
  onClose: () => void;
  onSubmit: (payload: CreateAppointmentPayload) => Promise<void>;
}) {
  const [doctorId, setDoctorId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4">
      <div className="w-full max-w-lg rounded-3xl border border-white/20 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900">
        <h3 className="text-xl font-bold">Book Appointment</h3>
        <div className="mt-4 grid gap-3">
          <select
            value={doctorId}
            onChange={(event) => setDoctorId(event.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-slate-800"
          >
            <option value="">Select doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={appointmentDate}
            onChange={(event) => setAppointmentDate(event.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-slate-800"
          />
          <input
            type="time"
            value={appointmentTime}
            onChange={(event) => setAppointmentTime(event.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-slate-800"
          />
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Reason"
            className="min-h-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-800"
          />
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" className="rounded-2xl" onClick={onClose}>
            Close
          </Button>
          <Button
            className="rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500"
            onClick={() => {
              if (!doctorId || !appointmentDate || !appointmentTime) {
                ToastUtils.error("Please fill doctor, date, and time.");
                return;
              }

              const normalizedTime = appointmentTime.length === 5 ? `${appointmentTime}:00` : appointmentTime;
              void onSubmit({
                patientId,
                doctorId,
                appointmentDate,
                appointmentTime: normalizedTime,
                reason: reason || undefined,
              });
            }}
          >
            Confirm Booking
          </Button>
        </div>
      </div>
    </div>
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
