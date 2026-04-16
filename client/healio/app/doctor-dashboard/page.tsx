"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  BarChart3,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ClipboardPlus,
  Clock3,
  Edit3,
  FileHeart,
  FileText,
  HeartPulse,
  Home,
  Loader2,
  LogOut,
  MailPlus,
  Moon,
  MoreHorizontal,
  NotebookPen,
  Pill,
  Plus,
  Search,
  ShieldCheck,
  Stethoscope,
  Sun,
  Timer,
  Trash2,
  UserRound,
  UsersRound,
  Video,
  Wallet,
} from "lucide-react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import type { ComponentType, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { AgoraMeeting } from "@/components/telemedicine/AgoraMeeting";
import { CreateSessionDialog } from "@/components/telemedicine/CreateSessionDialog";
import { TelemedicineSessionTable } from "@/components/telemedicine/TelemedicineSessionTable";
import { canJoinSession } from "@/components/telemedicine/telemedicine-utils";
import { usePatients } from "@/hooks/usePatients";
import { useTelemedicineSessions } from "@/hooks/useTelemedicineSessions";
import { getApiErrorMessage } from "@/lib/apiError";
import { cn } from "@/lib/utils";
import DoctorAvailabilityForm from "@/components/DoctorAvailabilityForm";
import DoctorProfileForm from "@/components/DoctorProfileForm";
import {
  deleteDoctorAvailability,
  deleteDoctorProfile,
  getDoctorProfileByUserId,
} from "@/service/doctorApi";
import {
  AppointmentResponse,
  cancelAppointment,
  completeAppointment,
  confirmAppointment,
  createPrescription,
  getAppointmentsByDoctorId,
  noShowAppointment,
} from "@/service/appointmentApi";
import { getPatientDocuments, type MedicalDocument } from "@/service/patientApi";
import {
  cancelTelemedicineSession,
  completeTelemedicineSession,
  deleteTelemedicineSession,
  getTelemedicineJoinDetails,
  startTelemedicineSession,
} from "@/service/telemedicine";
import { useAuthStore } from "@/store/authStore";
import type { DoctorAvailabilityResponse, DoctorProfileResponse } from "@/service/doctorApi";
import type { MeetingJoinDetails, TelemedicineSession } from "@/types/telemedicine/types";
import ToastUtils from "@/utils/toastUtils";

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

const actions = [
  { label: "Manage Availability", icon: CalendarCheck, description: "Update clinic and video slots" },
  { label: "View Appointments", icon: ClipboardPlus, description: "Review today's consultation queue" },
  { label: "Join Telemedicine", icon: Video, description: "Open active online session" },
  { label: "View Patient Reports", icon: FileHeart, description: "Check attached lab results" },
  { label: "Issue Prescription", icon: Pill, description: "Create a digital prescription" },
];

const activities = [
  { title: "Completed ECG review", detail: "Hasindu Chanuka consultation notes saved", time: "8 min ago", icon: CheckCircle2 },
  { title: "Prescription issued", detail: "Atorvastatin 10mg plan sent to patient portal", time: "24 min ago", icon: Pill },
  { title: "Appointment request accepted", detail: "Maya Chen confirmed for 11:00 AM clinic visit", time: "1 hr ago", icon: CalendarCheck },
  { title: "Report reviewed", detail: "Cardiac stress test file marked as reviewed", time: "2 hrs ago", icon: FileText },
];

// day ordering helper
const DAY_ORDER = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
const DAY_SHORT: Record<string, string> = {
  MONDAY: "Mon", TUESDAY: "Tue", WEDNESDAY: "Wed",
  THURSDAY: "Thu", FRIDAY: "Fri", SATURDAY: "Sat", SUNDAY: "Sun",
};

const formatTime = (t: string | number[]): string => {
  if (!t) return "";

  if (Array.isArray(t)) {
    return `${String(t[0]).padStart(2, "0")}:${String(t[1]).padStart(2, "0")}`;
  }
  return String(t).slice(0, 5);
};

const getCurrentDayOfWeek = (): string => {
  const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  return days[new Date().getDay()];
};

//main page
export default function DoctorDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [isDark, setIsDark] = useState(false);
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<TelemedicineSession | null>(null);
  const [meetingDetails, setMeetingDetails] = useState<MeetingJoinDetails | null>(null);
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentResponse | null>(null);
  const [prescriptionDiagnosis, setPrescriptionDiagnosis] = useState("");
  const [prescriptionNotes, setPrescriptionNotes] = useState("");
  const [prescriptionMedicineName, setPrescriptionMedicineName] = useState("");
  const [prescriptionDosage, setPrescriptionDosage] = useState("");
  const [prescriptionFrequency, setPrescriptionFrequency] = useState("");
  const [prescriptionDuration, setPrescriptionDuration] = useState("");
  const [prescriptionInstructions, setPrescriptionInstructions] = useState("");
  const doctorId = user?.userId ?? "doctor-17";
  const { patients: patientOptions } = usePatients(true);
  const {
    sessions: telemedicineSessions,
    isLoading: sessionsLoading,
    refetch: refetchTelemedicineSessions,
  } = useTelemedicineSessions({ doctorId, enabled: Boolean(doctorId) });

  const handleCreatedSession = () => {
    setEditingSession(null);
    void refetchTelemedicineSessions();
  };

  const handleCloseSessionDialog = () => {
    setSessionModalOpen(false);
    setEditingSession(null);
  };

  const handleOpenCreateSession = () => {
    setEditingSession(null);
    setSessionModalOpen(true);
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

  // Doctor service state
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfileResponse | null>(null);
  const [availabilitySlots, setAvailabilitySlots] = useState<DoctorAvailabilityResponse[]>([]);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // Patient reports modal state
  const [patientReportsModal, setPatientReportsModal] = useState(false);
  const [patientReportsLoading, setPatientReportsLoading] = useState(false);
  const [patientReports, setPatientReports] = useState<Array<{ patientId: string; patientName: string; documents: MedicalDocument[] }>>([]);

  // modal state
  const [profileModal, setProfileModal] = useState<"create" | "edit" | null>(null);
  const [availabilityModal, setAvailabilityModal] = useState<"add" | "edit" | null>(null);
  const [editingSlot, setEditingSlot] = useState<DoctorAvailabilityResponse | null>(null);

  const userId = user?.userId;
  const loadDoctorData = useCallback(async () => {
    if (!userId) return;

    setIsProfileLoading(true);
    const result = await getDoctorProfileByUserId(userId);

    if (result.success && result.data) {
      setDoctorProfile(result.data);
      setAvailabilitySlots(result.data.availabilitySlots || []);
    } else if (result.error === "Doctor profile not found") {
      setProfileModal("create");
    }
    setIsProfileLoading(false);
  }, [userId]);

  useEffect(() => {
    let isActive = true;

    if (!userId) {
      void Promise.resolve().then(() => {
        if (isActive) {
          setIsProfileLoading(false);
        }
      });

      return () => {
        isActive = false;
      };
    }

    void getDoctorProfileByUserId(userId).then((result) => {
      if (!isActive) return;

      if (result.success && result.data) {
        setDoctorProfile(result.data);
        setAvailabilitySlots(result.data.availabilitySlots || []);
      } else if (result.error === "Doctor profile not found") {
        setProfileModal("create");
      }
      setIsProfileLoading(false);
    });

    return () => {
      isActive = false;
    };
  }, [userId]);

  const handleProfileSuccess = () => {
    setProfileModal(null);
    loadDoctorData();
  };

  const handleAvailabilitySuccess = () => {
    setAvailabilityModal(null);
    setEditingSlot(null);
    loadDoctorData();
  };

  const handleDeleteSlot = async (slotId: string) => {
    if (!user?.userId) return;
    await deleteDoctorAvailability(user.userId, slotId);
    loadDoctorData();
  };

  const handleDeleteProfile = async () => {
    if (!user?.userId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete your doctor profile? This action cannot be undone."
    );
    if (!confirmed) return;

    setIsDeleteLoading(true);
    const result = await deleteDoctorProfile(user.userId);
    setIsDeleteLoading(false);

    if (result.success) {
      setDoctorProfile(null);
      setAvailabilitySlots([]);
      setProfileModal("create");
    }
  };

  const handleViewPatientReports = async () => {
    setPatientReportsModal(true);
    setPatientReportsLoading(true);
    setPatientReports([]);

    const uniquePatientIds = [...new Set(appointments.map((a) => a.patientId).filter(Boolean))];

    const results = await Promise.allSettled(
      uniquePatientIds.map(async (patientId) => {
        const docsResult = await getPatientDocuments(patientId);
        const patientName =
          appointments.find((a) => a.patientId === patientId)?.patient?.userInfo
            ? `${appointments.find((a) => a.patientId === patientId)?.patient?.userInfo?.firstName || ""} ${appointments.find((a) => a.patientId === patientId)?.patient?.userInfo?.lastName || ""}`.trim()
            : patientId;
        return {
          patientId,
          patientName: patientName || patientId,
          documents: docsResult.success ? (docsResult.data ?? []) : [],
        };
      })
    );

    const data = results
      .filter((r): r is PromiseFulfilledResult<{ patientId: string; patientName: string; documents: MedicalDocument[] }> => r.status === "fulfilled")
      .map((r) => r.value)
      .filter((r) => r.documents.length > 0);

    setPatientReports(data);
    setPatientReportsLoading(false);
  };

  const displayName = user?.firstName
    ? `Dr. ${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`
    : "Doctor";

  const handleEditSession = (session: TelemedicineSession) => {
    setEditingSession(session);
    setSessionModalOpen(true);
  };

  const handleDeleteSession = async (session: TelemedicineSession) => {
    if (!window.confirm(`Delete telemedicine session "${session.sessionTitle}"?`)) {
      return;
    }

    try {
      await deleteTelemedicineSession(session.id);
      ToastUtils.success("Telemedicine session deleted.");
      void refetchTelemedicineSessions();
    } catch (error) {
      ToastUtils.error(getApiErrorMessage(error, "Unable to delete telemedicine session."));
    }
  };

  const handleCancelSession = async (session: TelemedicineSession) => {
    if (!window.confirm(`Cancel telemedicine session "${session.sessionTitle}"?`)) {
      return;
    }

    try {
      await cancelTelemedicineSession(session.id);
      ToastUtils.success("Telemedicine session cancelled.");
      void refetchTelemedicineSessions();
    } catch (error) {
      ToastUtils.error(getApiErrorMessage(error, "Unable to cancel telemedicine session."));
    }
  };

  const handleCompleteSession = async (session: TelemedicineSession) => {
    if (!window.confirm(`Complete telemedicine session "${session.sessionTitle}"?`)) {
      return;
    }

    try {
      await completeTelemedicineSession(session.id);
      ToastUtils.success("Telemedicine session completed.");
      void refetchTelemedicineSessions();
    } catch (error) {
      ToastUtils.error(getApiErrorMessage(error, "Unable to complete telemedicine session."));
    }
  };

  const loadAppointments = useCallback(async () => {
    if (!doctorId) return;

    setAppointmentsLoading(true);
    const result = await getAppointmentsByDoctorId(doctorId);
    if (result.success) {
      setAppointments(result.data ?? []);
    } else if (result.error) {
      ToastUtils.error(result.error);
    }
    setAppointmentsLoading(false);
  }, [doctorId]);

  useEffect(() => {
    if (!doctorId) return;
    let isActive = true;

    void getAppointmentsByDoctorId(doctorId).then((result) => {
      if (!isActive) return;
      if (result.success) {
        setAppointments(result.data ?? []);
      } else if (result.error) {
        ToastUtils.error(result.error);
      }
      setAppointmentsLoading(false);
    });
    return () => {
      isActive = false;
    };
  }, [doctorId]);

  const handleAppointmentAction = async (
    appointment: AppointmentResponse,
    action: "confirm" | "complete" | "noShow" | "cancel",
  ) => {
    let result;
    if (action === "confirm") {
      result = await confirmAppointment(appointment.id);
    } else if (action === "complete") {
      result = await completeAppointment(appointment.id);
    } else if (action === "noShow") {
      result = await noShowAppointment(appointment.id);
    } else {
      const reason = window.prompt("Reason for cancellation (optional):") || undefined;
      result = await cancelAppointment(appointment.id, reason);
    }

    if (result?.success) {
      await loadAppointments();
    }
  };

  const handleCreatePrescription = async () => {
    if (!selectedAppointment) return;
    if (!prescriptionDiagnosis || !prescriptionMedicineName || !prescriptionDosage || !prescriptionFrequency) {
      ToastUtils.error("Please fill diagnosis and medication details.");
      return;
    }

    const result = await createPrescription(selectedAppointment.id, {
      diagnosis: prescriptionDiagnosis,
      notes: prescriptionNotes || undefined,
      items: [
        {
          medicineName: prescriptionMedicineName,
          dosage: prescriptionDosage,
          frequency: prescriptionFrequency,
          duration: prescriptionDuration || undefined,
          instructions: prescriptionInstructions || undefined,
        },
      ],
    });

    if (result.success) {
      setSelectedAppointment(null);
      setPrescriptionDiagnosis("");
      setPrescriptionNotes("");
      setPrescriptionMedicineName("");
      setPrescriptionDosage("");
      setPrescriptionFrequency("");
      setPrescriptionDuration("");
      setPrescriptionInstructions("");
      await loadAppointments();
    }
  };

  const dashboardStats = useMemo(() => {
    const pending = appointments.filter((item) => item.status === "PENDING").length;
    const completed = appointments.filter((item) => item.status === "COMPLETED").length;
    const today = appointments.filter((item) => item.appointmentDate === new Date().toISOString().slice(0, 10)).length;
    const activeTelemedicine = telemedicineSessions.filter((item) => item.status === "ONGOING").length;

    return [
      { label: "Today's Appointments", value: String(today).padStart(2, "0"), helper: "Scheduled today", icon: CalendarClock, accent: "from-sky-500 to-cyan-400" },
      { label: "Pending Requests", value: String(pending).padStart(2, "0"), helper: "Needs review", icon: Timer, accent: "from-amber-500 to-orange-400" },
      { label: "Completed Consultations", value: String(completed).padStart(2, "0"), helper: "Care completed", icon: CheckCircle2, accent: "from-emerald-500 to-teal-400" },
      { label: "Active Telemedicine", value: String(activeTelemedicine).padStart(2, "0"), helper: "Live rooms now", icon: Video, accent: "from-indigo-500 to-blue-400" },
    ];
  }, [appointments, telemedicineSessions]);

  return (
    <div className={cn(isDark && "dark")}>
      <main className="min-h-screen overflow-hidden bg-[#f4f9fc] text-slate-950 transition-colors duration-500 dark:bg-[#020817] dark:text-white [&_a]:cursor-pointer [&_button]:cursor-pointer">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.14),transparent_28%),linear-gradient(135deg,rgba(248,252,255,0.96),rgba(236,253,245,0.44))] dark:bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.15),transparent_30%),linear-gradient(135deg,rgba(2,8,23,0.98),rgba(8,13,31,0.9))]" />
        <div className="pointer-events-none fixed left-8 top-8 h-64 w-208 rounded-full bg-sky-200/30 blur-3xl dark:bg-sky-500/10" />
        <div className="pointer-events-none fixed bottom-8 right-8 h-72 w-2xl rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-500/10" />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative mx-auto flex w-full max-w-385 flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8"
        >
          <DashboardHeader
            isDark={isDark}
            specialty={doctorProfile?.specialization}
            onCreateSession={handleOpenCreateSession}
            onToggleDark={() => setIsDark((v) => !v)}
          />

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12 grid-flow-dense">
            <motion.div variants={fadeUp} className="h-full md:col-span-1 xl:col-span-3 xl:row-span-2">
              <DoctorProfileCard
                profile={doctorProfile}
                displayName={displayName}
                userEmail={user?.email || ""}
                isLoading={isProfileLoading}
                isDeleteLoading={isDeleteLoading}
                onEdit={() => setProfileModal("edit")}
                onDelete={handleDeleteProfile}
                onCreateProfile={() => setProfileModal("create")}
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
                onManageAvailability={() => setAvailabilityModal("add")}
                onViewAppointments={() => {
                  document.getElementById("appointment-management")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                onJoinTelemedicine={() => {
                  const nextJoinable = telemedicineSessions.find(canJoinSession);
                  if (nextJoinable) {
                    void handleJoinSession(nextJoinable);
                  } else {
                    document.getElementById("telemedicine-sessions")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                onViewPatientReports={() => void handleViewPatientReports()}
                onIssuePrescription={() => {
                  if (!appointments[0]) {
                    ToastUtils.error("No appointment is available to attach a prescription.");
                    return;
                  }
                  setSelectedAppointment(appointments[0]);
                }}
              />
            </motion.div>

            <motion.div variants={fadeUp} className="h-full md:col-span-2 xl:col-span-8">
              <TelemedicineQueueTable
                telemedicineSessions={telemedicineSessions}
                sessionsLoading={sessionsLoading}
                patientOptions={patientOptions}
                onJoinSession={handleJoinSession}
                onEditSession={handleEditSession}
                onDeleteSession={handleDeleteSession}
                onCancelSession={handleCancelSession}
                onCompleteSession={handleCompleteSession}
              />
            </motion.div>
            <motion.div variants={fadeUp} className="h-full md:col-span-1 xl:col-span-4">
              <AvailabilityManagement
                slots={availabilitySlots}
                isLoading={isProfileLoading}
                onAddSlot={() => setAvailabilityModal("add")}
                onEditSlot={(slot) => {
                  setEditingSlot(slot);
                  setAvailabilityModal("edit");
                }}
                onDeleteSlot={handleDeleteSlot}
              />
            </motion.div>

            <motion.div variants={fadeUp} className="h-full md:col-span-1 xl:col-span-5">
              <AppointmentManagement
                appointments={appointments}
                isLoading={appointmentsLoading}
                onConfirm={(appointment) => void handleAppointmentAction(appointment, "confirm")}
                onComplete={(appointment) => void handleAppointmentAction(appointment, "complete")}
                onNoShow={(appointment) => void handleAppointmentAction(appointment, "noShow")}
                onCancel={(appointment) => void handleAppointmentAction(appointment, "cancel")}
                onIssuePrescription={(appointment) => setSelectedAppointment(appointment)}
              />
            </motion.div>
            <motion.div id="telemedicine-sessions" variants={fadeUp} className="h-full md:col-span-2 xl:col-span-7">
              <TelemedicineSessions
                sessions={telemedicineSessions}
                isLoading={sessionsLoading}
                patientOptions={patientOptions}
                onJoinSession={handleJoinSession}
                onCompleteSession={handleCompleteSession}
                onCreateSession={handleOpenCreateSession}
              />
            </motion.div>

            <motion.div variants={fadeUp} className="h-full md:col-span-1 xl:col-span-4">
              <ProductivityShortcuts
                onIssuePrescription={() => {
                  if (!appointments[0]) {
                    ToastUtils.error("No appointment is available to attach a prescription.");
                    return;
                  }
                  setSelectedAppointment(appointments[0]);
                }}
              />
            </motion.div>
            <motion.div variants={fadeUp} className="h-full md:col-span-2 xl:col-span-8">
              <PerformanceActivity />
            </motion.div>
          </section>
        </motion.div>

        <AnimatePresence>
          {sessionModalOpen && (
            <CreateSessionDialog
              doctorId={doctorId}
              initialSession={editingSession}
              onClose={handleCloseSessionDialog}
              onCreated={handleCreatedSession}
            />
          )}
          {profileModal && (
            <DoctorProfileForm
              key={profileModal}
              userId={user?.userId || ""}
              mode={profileModal}
              initialData={
                profileModal === "edit" && doctorProfile
                  ? {
                      specialization: doctorProfile.specialization,
                      qualifications: doctorProfile.qualifications,
                      experienceYears: doctorProfile.experienceYears,
                      consultationFee: Number(doctorProfile.consultationFee),
                    }
                  : undefined
              }
              onSuccess={handleProfileSuccess}
              onClose={() => setProfileModal(null)}
            />
          )}
          {availabilityModal && (
            <DoctorAvailabilityForm
              key={availabilityModal + (editingSlot?.id || "")}
              userId={user?.userId || ""}
              mode={availabilityModal}
              initialData={availabilityModal === "edit" && editingSlot ? editingSlot : undefined}
              onSuccess={handleAvailabilitySuccess}
              onClose={() => {
                setAvailabilityModal(null);
                setEditingSlot(null);
              }}
            />
          )}
        </AnimatePresence>
        {meetingDetails && (
          <AgoraMeeting
            joinDetails={meetingDetails}
            participantLabel="Doctor consultation room"
            onLeave={() => {
              setMeetingDetails(null);
              void refetchTelemedicineSessions();
            }}
          />
        )}
        {selectedAppointment && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4">
            <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/20 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900">
              <h3 className="text-xl font-bold">Create Prescription</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Appointment: {selectedAppointment.id}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  {
                    label: "Patient",
                    value: `${selectedAppointment.patient?.userInfo?.firstName || "Patient"} ${selectedAppointment.patient?.userInfo?.lastName || ""}`.trim(),
                  },
                  { label: "Patient Email", value: selectedAppointment.patient?.userInfo?.email || "Not available" },
                  { label: "Appointment Date", value: selectedAppointment.appointmentDate },
                  { label: "Appointment Time", value: selectedAppointment.appointmentTime },
                ].map((field) => (
                  <div key={field.label} className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{field.label}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">{field.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Visit context</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Reason: {selectedAppointment.reason || "General consultation"}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Status: {selectedAppointment.status}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Payment: {selectedAppointment.paymentStatus ?? "UNPAID"} · {(selectedAppointment.consultationFee ?? 0).toFixed(2)} {selectedAppointment.currency ?? "USD"}
                </p>
              </div>
              <div className="mt-4 grid gap-3">
                <input value={prescriptionDiagnosis} onChange={(event) => setPrescriptionDiagnosis(event.target.value)} placeholder="Diagnosis" className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-slate-800" />
                <textarea value={prescriptionNotes} onChange={(event) => setPrescriptionNotes(event.target.value)} placeholder="Notes" className="min-h-20 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-800" />
                <input value={prescriptionMedicineName} onChange={(event) => setPrescriptionMedicineName(event.target.value)} placeholder="Medicine name" className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-slate-800" />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input value={prescriptionDosage} onChange={(event) => setPrescriptionDosage(event.target.value)} placeholder="Dosage" className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-slate-800" />
                  <input value={prescriptionFrequency} onChange={(event) => setPrescriptionFrequency(event.target.value)} placeholder="Frequency" className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-slate-800" />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input value={prescriptionDuration} onChange={(event) => setPrescriptionDuration(event.target.value)} placeholder="Duration" className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-slate-800" />
                  <input value={prescriptionInstructions} onChange={(event) => setPrescriptionInstructions(event.target.value)} placeholder="Instructions" className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-slate-800" />
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <Button variant="outline" className="rounded-2xl" onClick={() => setSelectedAppointment(null)}>
                  Close
                </Button>
                <Button className="rounded-2xl bg-linear-to-r from-sky-500 to-emerald-500" onClick={() => void handleCreatePrescription()}>
                  Save Prescription
                </Button>
              </div>
            </div>
          </div>
        )}
        {patientReportsModal && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/20 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">Patient Uploaded Reports</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Medical documents uploaded by your patients
                  </p>
                </div>
                <Button variant="outline" className="rounded-2xl" onClick={() => setPatientReportsModal(false)}>
                  Close
                </Button>
              </div>
              <div className="mt-5">
                {patientReportsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
                  </div>
                ) : patientReports.length === 0 ? (
                  <div className="rounded-[22px] border border-dashed border-slate-200 p-8 text-center dark:border-white/10">
                    <FileHeart className="mx-auto h-10 w-10 text-slate-400" />
                    <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
                      No patient reports found. Reports are uploaded by patients from their dashboard.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {patientReports.map((entry) => (
                      <div key={entry.patientId} className="rounded-[22px] border border-slate-200/70 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="grid h-10 w-10 place-items-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
                            <UserRound className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-100">{entry.patientName}</p>
                            <p className="text-xs text-slate-400">{entry.documents.length} document{entry.documents.length !== 1 ? "s" : ""}</p>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          {entry.documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-white p-3 dark:border-white/10 dark:bg-slate-800">
                              <div className="flex items-center gap-3 min-w-0">
                                <FileText className="h-4 w-4 shrink-0 text-sky-500" />
                                <span className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">{doc.fileName}</span>
                              </div>
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 rounded-xl border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-700 transition hover:bg-sky-100 dark:border-sky-400/30 dark:bg-sky-400/10 dark:text-sky-300 dark:hover:bg-sky-400/20"
                              >
                                View
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

//Header
function DashboardHeader({
  isDark,
  specialty,
  onCreateSession,
  onToggleDark,
}: {
  isDark: boolean;
  specialty?: string;
  onCreateSession: () => void;
  onToggleDark: () => void;
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const displayName = user?.firstName ? `Dr. ${user.firstName}` : "Doctor";

  const handleLogout = () => {
    logout();
    router.push("/signin");
  };

  return (
    <motion.header variants={fadeUp} className="sticky top-3 z-30">
      <div className="rounded-[26px] border border-white/70 bg-white/76 px-4 py-3.5 shadow-2xl shadow-sky-950/8 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/74 dark:shadow-black/30">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-linear-to-br from-sky-600 to-emerald-500 text-white shadow-lg shadow-sky-500/30">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-sky-600 dark:text-sky-300">Doctor Workspace</p>
              <h1 className="text-xl font-bold sm:text-2xl">Welcome, {displayName}</h1>
              <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
                {specialty || "Healio Medical Center"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <label className="group flex min-h-12 flex-1 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 text-sm text-slate-500 shadow-sm transition focus-within:border-sky-300 focus-within:ring-4 focus-within:ring-sky-200/40 dark:border-white/10 dark:bg-white/8 dark:text-slate-300 dark:focus-within:ring-sky-400/10 md:w-97.5">
              <Search className="h-5 w-5 text-slate-400 transition group-focus-within:text-sky-500" />
              <input
                className="w-full bg-transparent font-medium outline-none placeholder:text-slate-400"
                placeholder="Search patients, reports, appointments..."
              />
            </label>

            <div className="flex items-center gap-2">
              <Link href="/" className="hidden h-12 items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/80 px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 dark:border-white/10 dark:bg-white/8 dark:text-slate-200 dark:hover:bg-sky-400/10 sm:inline-flex">
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Button className="hidden h-12 rounded-2xl bg-linear-to-r from-sky-600 to-emerald-500 px-4 shadow-lg shadow-sky-500/20 hover:from-sky-500 hover:to-emerald-400 sm:inline-flex" onClick={onCreateSession}>
                <Video className="h-4 w-4" />
                Create Session
              </Button>
              <NotificationBell dashboardHref="/doctor-dashboard" badgeClassName="bg-amber-400" />
              <HeaderIconButton ariaLabel="Toggle theme" onClick={onToggleDark}>
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </HeaderIconButton>
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-lg dark:border-white/10 dark:bg-white/8"
                >
                  <div className="grid h-8.5 w-8.5 place-items-center rounded-xl bg-linear-to-br from-sky-500 to-emerald-500 text-white text-sm font-bold">
                    {user?.firstName?.charAt(0) || "D"}
                  </div>
                  <span className="hidden sm:block">
                    <span className="block text-sm font-bold">{displayName}</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">Doctor</span>
                  </span>
                  <ChevronDown className={cn("h-4 w-4 text-slate-400 transition", profileOpen && "rotate-180 text-sky-500")} />
                </button>
                <AnimatePresence>{profileOpen && <ProfileMenu onLogout={handleLogout} />}</AnimatePresence>
              </div>
            </div>
            <Button className="h-12 w-full rounded-2xl bg-linear-to-r from-sky-600 to-emerald-500 shadow-lg shadow-sky-500/20 hover:from-sky-500 hover:to-emerald-400 sm:hidden" onClick={onCreateSession}>
              <Video className="h-4 w-4" />
              Create Session
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
      <Link href="/doctor-dashboard" className="flex min-h-12 items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-700 transition hover:bg-sky-50 hover:text-sky-700 dark:text-slate-200 dark:hover:bg-sky-400/10">
        <Stethoscope className="h-4 w-4" />
        Doctor Dashboard
      </Link>
      <button type="button" onClick={onLogout} className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-rose-600 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10">
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </motion.div>
  );
}

// Doctor profile Card
function DoctorProfileCard({
  profile,
  displayName,
  userEmail,
  isLoading,
  isDeleteLoading,
  onEdit,
  onDelete,
  onCreateProfile,
}: {
  profile: DoctorProfileResponse | null;
  displayName: string;
  userEmail: string;
  isLoading: boolean;
  isDeleteLoading: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onCreateProfile: () => void;
}) {
  const verificationColor =
    profile?.verificationStatus === "VERIFIED"
      ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
      : profile?.verificationStatus === "REJECTED"
      ? "bg-rose-500/12 text-rose-700 dark:text-rose-300"
      : "bg-amber-500/12 text-amber-700 dark:text-amber-300";

  const verificationDot =
    profile?.verificationStatus === "VERIFIED"
      ? "bg-emerald-500"
      : profile?.verificationStatus === "REJECTED"
      ? "bg-rose-500"
      : "bg-amber-500";

  const verificationLabel =
    profile?.verificationStatus === "VERIFIED"
      ? "Verified doctor"
      : profile?.verificationStatus === "REJECTED"
      ? "Verification rejected"
      : "Pending verification";

  if (isLoading) {
    return (
      <Card className="h-full flex flex-col items-center justify-center rounded-[28px] p-5 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
        <p className="text-sm font-semibold text-slate-500">Loading profile...</p>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="h-full flex flex-col items-center justify-center rounded-[28px] p-5 gap-4 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-3xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
          <Stethoscope className="h-8 w-8" />
        </div>
        <div>
          <h3 className="text-lg font-bold">No Doctor Profile</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Complete your doctor profile to start accepting appointments and managing your schedule.
          </p>
        </div>
        <Button
          className="w-full rounded-2xl bg-linear-to-r from-sky-600 to-emerald-500"
          onClick={onCreateProfile}
        >
          <Plus className="h-4 w-4" />
          Create Doctor Profile
        </Button>
      </Card>
    );
  }

  const details = [
    { label: "Specialty", value: profile.specialization, icon: HeartPulse },
    { label: "License No.", value: profile.licenseNumber, icon: ShieldCheck },
    { label: "Experience", value: `${profile.experienceYears} years`, icon: Activity },
    { label: "Consult Fee", value: `LKR ${Number(profile.consultationFee).toLocaleString()}`, icon: UsersRound },
    { label: "Work Email", value: profile.userInfo?.email || userEmail, icon: MailPlus },
    ...(profile.qualifications
      ? [{ label: "Qualifications", value: profile.qualifications, icon: FileText }]
      : []),
  ];

  return (
    <Card className="h-full flex flex-col rounded-[28px] p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-[30px] bg-linear-to-br from-sky-500 to-emerald-500 blur-md" />
            <div className="relative grid h-24 w-24 place-items-center rounded-[30px] border-4 border-white bg-linear-to-br from-sky-100 to-emerald-100 text-sky-600 shadow-xl dark:border-slate-900 dark:from-sky-500/20 dark:to-emerald-500/20 dark:text-sky-300">
              <Stethoscope className="h-10 w-10" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{displayName}</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
              {profile.specialization}
            </p>
            <span className={cn("mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold", verificationColor)}>
              <span className={cn("h-2 w-2 rounded-full", verificationDot)} />
              {verificationLabel}
            </span>
          </div>
        </div>
        <Button size="icon" variant="outline" className="rounded-2xl" onClick={onEdit}>
          <Edit3 className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-5 grid gap-2.5">
        {details.map((detail) => (
          <div key={detail.label} className="flex gap-3 rounded-2xl border border-slate-200/70 bg-white/62 p-3 dark:border-white/10 dark:bg-white/5">
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

      <div className="mt-5 flex flex-col gap-2.5">
        <Button className="w-full rounded-2xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200" onClick={onEdit}>
          <Edit3 className="h-4 w-4" />
          Edit Doctor Profile
        </Button>
        <Button
          className="w-full rounded-2xl bg-red-600 hover:bg-red-800 dark:bg-red-700 dark:hover:bg-red-900 text-white disabled:opacity-50"
          disabled={isDeleteLoading}
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
          {isDeleteLoading ? "Deleting..." : "Delete Profile"}
        </Button>
      </div>
    </Card>
  );
}

//Stat Card
function StatCard({ label, value, helper, icon: Icon, accent }: { label: string; value: string; helper: string; icon: Icon; accent: string }) {
  return (
    <Card className="group h-full flex flex-col rounded-3xl p-4 transition duration-300 hover:-translate-y-1 hover:border-sky-300/70 hover:shadow-2xl hover:shadow-sky-500/10">
      <div className="flex items-start justify-between">
        <div className={cn("grid h-12 w-12 place-items-center rounded-2xl bg-linear-to-br text-white shadow-lg", accent)}>
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

// quick Actions
function QuickActions({
  onManageAvailability,
  onViewAppointments,
  onJoinTelemedicine,
  onViewPatientReports,
  onIssuePrescription,
}: {
  onManageAvailability: () => void;
  onViewAppointments: () => void;
  onJoinTelemedicine: () => void;
  onViewPatientReports: () => void;
  onIssuePrescription: () => void;
}) {
  const actionHandlers: Record<string, () => void> = {
    "Manage Availability": onManageAvailability,
    "View Appointments": onViewAppointments,
    "Join Telemedicine": onJoinTelemedicine,
    "View Patient Reports": onViewPatientReports,
    "Issue Prescription": onIssuePrescription,
  };

  return (
    <Card className="h-full flex flex-col rounded-[28px] p-5">
      <SectionTitle eyebrow="Quick actions" title="Clinical productivity shortcuts" />
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={actionHandlers[action.label]}
            className="group h-full flex flex-col rounded-3xl border border-slate-200/70 bg-white/68 p-4 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:bg-sky-50/80 hover:shadow-xl hover:shadow-sky-500/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-sky-400/10"
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-linear-to-br from-sky-600 to-emerald-500 text-white shadow-lg shadow-sky-500/25 transition group-hover:scale-105">
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

function TelemedicineQueueTable({
  telemedicineSessions,
  sessionsLoading,
  patientOptions,
  onJoinSession,
  onEditSession,
  onDeleteSession,
  onCancelSession,
  onCompleteSession,
}: {
  telemedicineSessions: TelemedicineSession[];
  sessionsLoading: boolean;
  patientOptions: { id: string; fullName: string }[];
  onJoinSession: (session: TelemedicineSession) => void;
  onEditSession: (session: TelemedicineSession) => void;
  onDeleteSession: (session: TelemedicineSession) => void;
  onCancelSession: (session: TelemedicineSession) => void;
  onCompleteSession: (session: TelemedicineSession) => void;
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
        <SectionTitle eyebrow="Telemedicine" title="Session queue" />
        <Button variant="outline" className="rounded-2xl">
          <Video className="h-4 w-4" />
          Online Rooms
        </Button>
      </div>

      <TelemedicineSessionTable
        sessions={sortedTelemedicineSessions}
        isLoading={sessionsLoading}
        viewer="doctor"
        patients={patientOptions}
        onJoin={onJoinSession}
        onEdit={onEditSession}
        onDelete={onDeleteSession}
        onCancel={onCancelSession}
        onComplete={onCompleteSession}
        pageSize={6}
      />
    </Card>
  );
}

//availability management
function AvailabilityManagement({
  slots,
  isLoading,
  onAddSlot,
  onEditSlot,
  onDeleteSlot,
}: {
  slots: DoctorAvailabilityResponse[];
  isLoading: boolean;
  onAddSlot: () => void;
  onEditSlot: (slot: DoctorAvailabilityResponse) => void;
  onDeleteSlot: (slotId: string) => void;
}) {
  const today = getCurrentDayOfWeek();
  const todaySlots = slots.filter((s) => s.dayOfWeek === today && s.isActive);
  const isAvailableToday = todaySlots.length > 0;

  // Group slots by day, preserving Mon–Sun order
  const slotsByDay: Record<string, DoctorAvailabilityResponse[]> = {};
  DAY_ORDER.forEach((day) => {
    const daySlots = slots.filter((s) => s.dayOfWeek === day);
    if (daySlots.length > 0) slotsByDay[day] = daySlots;
  });

  const displayDays = Object.entries(slotsByDay);

  return (
    <Card className="h-full flex flex-col rounded-[28px] p-5">
      <div className="flex items-start justify-between gap-4">
        <SectionTitle eyebrow="Availability" title="Weekly schedule" />
        <Button size="icon" variant="outline" className="rounded-2xl" onClick={onAddSlot}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-5 rounded-3xl bg-linear-to-br from-slate-950 via-slate-900 to-sky-950 p-4 text-white shadow-2xl shadow-sky-950/20">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-sky-100">Current status</p>
            <h3 className="mt-2 text-2xl font-bold">
              {isLoading ? "Loading..." : isAvailableToday ? "Available today" : "Not available today"}
            </h3>
            {isAvailableToday && todaySlots[0] && (
              <p className="mt-2 text-sm text-slate-300">
                {formatTime(todaySlots[0].startTime)} – {formatTime(todaySlots[0].endTime)}
              </p>
            )}
            {!isAvailableToday && !isLoading && slots.length === 0 && (
              <p className="mt-2 text-sm text-slate-400">No availability slots set</p>
            )}
          </div>
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-white/10 ring-1 ring-white/15">
            <Clock3 className="h-8 w-8 text-emerald-300" />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-4 flex flex-1 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-sky-500" />
        </div>
      ) : displayDays.length === 0 ? (
        <div className="mt-4 flex flex-1 flex-col items-center justify-center gap-3 rounded-[22px] border border-dashed border-slate-200 p-6 text-center dark:border-white/10">
          <CalendarCheck className="h-8 w-8 text-slate-400" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            No availability slots yet
          </p>
          <Button className="rounded-2xl bg-linear-to-r from-sky-600 to-emerald-500" onClick={onAddSlot}>
            <Plus className="h-4 w-4" />
            Add Slot
          </Button>
        </div>
      ) : (
        <div className="mt-4 grid gap-2.5 overflow-y-auto">
          {displayDays.map(([day, daySlots]) => (
            <div key={day} className="rounded-[22px] border border-slate-200/70 bg-white/62 p-3.5 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-500/10 text-sm font-bold text-sky-700 dark:text-sky-300">
                  {DAY_SHORT[day] || day.slice(0, 3)}
                </span>
                <span className={cn("rounded-full px-3 py-1.5 text-xs font-bold", daySlots.some((s) => s.isActive) ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300" : "bg-slate-500/10 text-slate-500 dark:text-slate-300")}>
                  {daySlots.some((s) => s.isActive) ? "Open" : "Inactive"}
                </span>
              </div>
              <div className="mt-3 grid gap-2">
                {daySlots.map((slot) => (
                  <div key={slot.id} className="flex items-center justify-between gap-2">
                    <span className={cn("flex-1 rounded-full px-3 py-1.5 text-xs font-bold", slot.isActive ? "bg-slate-950/5 text-slate-600 dark:bg-white/10 dark:text-slate-300" : "bg-slate-100/60 text-slate-400 line-through dark:bg-white/5")}>
                      {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                    </span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => onEditSlot(slot)}
                        className="grid h-7 w-7 place-items-center rounded-xl border border-slate-200/70 bg-white/80 text-slate-500 transition hover:border-sky-300 hover:text-sky-600 dark:border-white/10 dark:bg-white/5 dark:hover:text-sky-300"
                        aria-label="Edit slot"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteSlot(slot.id)}
                        className="grid h-7 w-7 place-items-center rounded-xl border border-slate-200/70 bg-white/80 text-slate-500 transition hover:border-rose-300 hover:text-rose-500 dark:border-white/10 dark:bg-white/5 dark:hover:text-rose-400"
                        aria-label="Delete slot"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Button className="mt-5 w-full rounded-2xl" onClick={onAddSlot}>
        <Plus className="h-4 w-4" />
        Add Availability Slot
      </Button>
    </Card>
  );
}

//Patient Records review
function AppointmentManagement({
  appointments,
  isLoading,
  onConfirm,
  onComplete,
  onNoShow,
  onCancel,
  onIssuePrescription,
}: {
  appointments: AppointmentResponse[];
  isLoading: boolean;
  onConfirm: (appointment: AppointmentResponse) => void;
  onComplete: (appointment: AppointmentResponse) => void;
  onNoShow: (appointment: AppointmentResponse) => void;
  onCancel: (appointment: AppointmentResponse) => void;
  onIssuePrescription: (appointment: AppointmentResponse) => void;
}) {
  return (
    <Card id="appointment-management" className="h-full flex flex-col rounded-[28px] p-5">
      <SectionTitle eyebrow="Appointments" title="Consultation queue" />
      <div className="mt-5 grid gap-3.5">
        {isLoading && (
          <div className="rounded-[22px] border border-slate-200/70 bg-white/62 p-4 text-sm font-semibold text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            Loading appointments...
          </div>
        )}
        {!isLoading && appointments.length === 0 && (
          <div className="rounded-[22px] border border-dashed border-sky-300 bg-sky-50/70 p-4 text-sm font-semibold text-slate-500 dark:border-sky-300/30 dark:bg-sky-400/10 dark:text-slate-300">
            No appointments assigned yet.
          </div>
        )}
        {appointments.slice(0, 6).map((appointment) => (
          <div key={appointment.id} className="rounded-[26px] border border-slate-200/70 bg-white/62 p-4 transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-500/10 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-linear-to-br from-sky-100 to-emerald-100 text-sky-600 dark:from-sky-500/20 dark:to-emerald-500/20 dark:text-sky-300">
                  <UserRound className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">
                    {appointment.patient?.userInfo?.firstName || "Patient"} {appointment.patient?.userInfo?.lastName || ""}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {appointment.patient?.userInfo?.email || "Patient contact not available"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{appointment.reason || "General consultation"}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-400">
                    {appointment.appointmentDate} at {appointment.appointmentTime}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-bold",
                      (appointment.paymentStatus ?? "UNPAID") === "PAID"
                        ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
                        : (appointment.paymentStatus ?? "UNPAID") === "PENDING"
                          ? "bg-amber-500/12 text-amber-700 dark:text-amber-300"
                          : (appointment.paymentStatus ?? "UNPAID") === "FAILED"
                            ? "bg-rose-500/12 text-rose-700 dark:text-rose-300"
                            : "bg-indigo-500/12 text-indigo-700 dark:text-indigo-300",
                    )}>
                      Payment: {appointment.paymentStatus ?? "UNPAID"}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-950/5 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                      <Wallet className="h-3.5 w-3.5 text-sky-500" />
                      {(appointment.consultationFee ?? 0).toFixed(2)} {appointment.currency ?? "USD"}
                    </span>
                  </div>
                </div>
              </div>
              <span className={cn(
                "rounded-full px-3 py-1.5 text-xs font-bold",
                appointment.status === "CANCELLED"
                  ? "bg-rose-500/12 text-rose-700 dark:text-rose-300"
                  : appointment.status === "COMPLETED"
                    ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
                    : appointment.status === "CONFIRMED"
                      ? "bg-sky-500/12 text-sky-700 dark:text-sky-300"
                      : "bg-amber-500/12 text-amber-700 dark:text-amber-300",
              )}>{appointment.status}</span>
            </div>
            <div className="mt-4 rounded-[22px] bg-slate-950/3 px-4 py-3 text-sm text-slate-600 dark:bg-white/4 dark:text-slate-300">
              <p className="font-bold text-slate-700 dark:text-slate-100">Patient visit summary</p>
              <p className="mt-1">Patient ID: {appointment.patientId}</p>
              <p className="mt-1">Doctor ID: {appointment.doctorId}</p>
              <p className="mt-1">Appointment ID: {appointment.id}</p>
              {appointment.status === "CANCELLED" && appointment.cancelReason && (
                <p className="mt-1">Cancellation reason: {appointment.cancelReason}</p>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {appointment.status === "PENDING" && (
                <>
                  <Button variant="outline" className="rounded-2xl" onClick={() => onConfirm(appointment)}>
                    Confirm
                  </Button>
                  <Button variant="outline" className="rounded-2xl text-rose-500" onClick={() => onCancel(appointment)}>
                    Cancel
                  </Button>
                </>
              )}
              {appointment.status === "CONFIRMED" && (
                <>
                  <Button variant="outline" className="rounded-2xl" onClick={() => onComplete(appointment)}>
                    Complete
                  </Button>
                  <Button variant="outline" className="rounded-2xl" onClick={() => onNoShow(appointment)}>
                    No-show
                  </Button>
                  <Button variant="outline" className="rounded-2xl text-rose-500" onClick={() => onCancel(appointment)}>
                    Cancel
                  </Button>
                </>
              )}
              {!["PENDING", "CONFIRMED"].includes(appointment.status) && (
                <Button variant="outline" className="rounded-2xl" onClick={() => onIssuePrescription(appointment)}>
                  <Pill className="h-4 w-4" />
                  Issue Prescription
                </Button>
              )}
              {appointment.status === "CONFIRMED" && (
                <Button variant="outline" className="rounded-2xl" onClick={() => onIssuePrescription(appointment)}>
                  <Pill className="h-4 w-4" />
                  Issue Prescription
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

//Telemedicine Sessions
function TelemedicineSessions({
  sessions,
  isLoading,
  patientOptions,
  onJoinSession,
  onCompleteSession,
  onCreateSession,
}: {
  sessions: TelemedicineSession[];
  isLoading: boolean;
  patientOptions: { id: string; fullName: string }[];
  onJoinSession: (session: TelemedicineSession) => void;
  onCompleteSession: (session: TelemedicineSession) => void;
  onCreateSession: () => void;
}) {
  const nextJoinableSession = sessions.find(canJoinSession);
  const latestSessions = useMemo(
    () =>
      [...sessions]
        .sort((current, next) => Date.parse(next.createdAt) - Date.parse(current.createdAt))
        .slice(0, 4),
    [sessions],
  );

  return (
    <Card className="h-full flex flex-col rounded-[28px] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionTitle eyebrow="Telemedicine" title="Online consultation sessions" />
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-2xl" onClick={onCreateSession}>
            <CalendarClock className="h-4 w-4" />
            Create Session
          </Button>
          <Button
            className="rounded-2xl bg-linear-to-r from-sky-600 to-emerald-500"
            disabled={!nextJoinableSession}
            onClick={() => nextJoinableSession && onJoinSession(nextJoinableSession)}
          >
            <Video className="h-4 w-4" />
            Open Next Room
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease }}
          className="rounded-3xl border border-sky-200/80 bg-sky-50/75 p-4 shadow-sm dark:border-sky-300/20 dark:bg-sky-400/10"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">Create video consultation</p>
              <h3 className="mt-2 text-xl font-bold">Generate a secure patient session</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Select a patient, reserve a virtual slot, and generate a meeting room.
              </p>
            </div>
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-sky-600 to-emerald-500 text-white shadow-lg shadow-sky-500/25">
              <CalendarClock className="h-6 w-6" />
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { label: "Active sessions", value: String(sessions.filter((session) => session.status === "ONGOING").length) },
              { label: "Scheduled", value: String(sessions.filter((session) => session.status === "SCHEDULED").length) },
              { label: "Patients loaded", value: String(patientOptions.length) },
              { label: "Gateway route", value: "/v1/telemedicine-service" },
            ].map((field) => (
              <div key={field.label} className="rounded-2xl border border-white/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/6">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{field.label}</p>
                <p className="mt-1 truncate text-sm font-bold text-slate-700 dark:text-slate-100">{field.value}</p>
              </div>
            ))}
          </div>

          <Button className="mt-4 w-full rounded-2xl bg-linear-to-r from-sky-600 to-emerald-500" onClick={onCreateSession}>
            <Video className="h-4 w-4" />
            Create Session With Patient
          </Button>
        </motion.div>

        <div className="grid gap-3.5 lg:grid-cols-3 xl:grid-cols-1">
          {isLoading && (
            <div className="rounded-3xl border border-slate-200/70 bg-white/64 p-4 text-sm font-bold text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              Loading sessions...
            </div>
          )}
          {!isLoading && latestSessions.map((session) => (
            <div key={session.id} className="relative overflow-hidden rounded-3xl bg-slate-950 p-4 text-white shadow-2xl shadow-sky-950/15 transition duration-300 hover:-translate-y-1">
              <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-sky-400/25 blur-2xl" />
              <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl" />
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between xl:flex-row">
                <div className="min-w-0">
                  <span className="rounded-full bg-sky-400 px-3 py-1.5 text-xs font-bold text-sky-950">{session.status}</span>
                  <h3 className="mt-4 text-lg font-bold">{session.sessionTitle}</h3>
                  <p className="mt-2 text-sm text-slate-300">{patientOptions.find((patient) => patient.id === session.patientId)?.fullName ?? session.patientId}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {canJoinSession(session) && (
                    <Button className="rounded-2xl bg-sky-100 px-4 font-bold text-sky-900 hover:bg-sky-200" onClick={() => onJoinSession(session)}>
                      Join Now
                    </Button>
                  )}
                  {session.status === "ONGOING" && (
                    <Button className="rounded-2xl bg-emerald-500 px-4 font-bold text-white hover:bg-emerald-400" onClick={() => onCompleteSession(session)}>
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {!isLoading && sessions.length === 0 && (
            <div className="rounded-3xl border border-dashed border-sky-300 bg-sky-50/70 p-4 text-sm font-semibold text-slate-500 dark:border-sky-300/30 dark:bg-sky-400/10 dark:text-slate-300">
              No online sessions yet.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

//Productivity Shortcuts
function ProductivityShortcuts({ onIssuePrescription }: { onIssuePrescription: () => void }) {
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
          onClick={onIssuePrescription}
        />
      </div>
    </Card>
  );
}

function ShortcutCard({ icon: Icon, title, description, action, onClick }: { icon: Icon; title: string; description: string; action: string; onClick?: () => void }) {
  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white/64 p-4 transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/10 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-start gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-sky-600 to-emerald-500 text-white shadow-lg shadow-sky-500/20">
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
          <Button variant="outline" className="mt-4 rounded-2xl" onClick={onClick}>
            {action}
          </Button>
        </div>
      </div>
    </div>
  );
}

//Performance Activity
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
            <div key={item.label} className="rounded-2xl border border-slate-200/70 bg-white/64 px-4 py-3 text-center dark:border-white/10 dark:bg-white/5">
              <p className="text-lg font-bold">{item.value}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.45fr_0.55fr]">
        <div className="rounded-3xl border border-slate-200/70 bg-white/62 p-4 dark:border-white/10 dark:bg-white/5">
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
                <div className="w-full rounded-full bg-linear-to-t from-sky-600 to-emerald-400" style={{ height: `${height}%` }} />
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">Consultation volume is trending higher than last week while maintaining a strong on-time rate.</p>
        </div>

        <div className="space-y-1">
          {activities.map((activity, index) => (
            <div key={activity.title} className="relative flex gap-4 pb-5 last:pb-0">
              {index !== activities.length - 1 && <div className="absolute left-6 top-12 h-[calc(100%-3rem)] w-px bg-linear-to-b from-sky-300 to-emerald-300 dark:from-sky-400/40 dark:to-emerald-400/40" />}
              <div className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-sky-600 to-emerald-500 text-white shadow-lg shadow-sky-500/25">
                <activity.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1 rounded-3xl border border-slate-200/70 bg-white/58 p-4 dark:border-white/10 dark:bg-white/5">
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

//Shared helpers
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
