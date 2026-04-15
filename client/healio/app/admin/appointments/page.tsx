"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  Edit3,
  Filter,
  Trash2,
  XCircle,
} from "lucide-react";

import { getAllDoctors } from "@/service/doctorApi";
import {
  AppointmentResponse,
  CreateAppointmentPayload,
  cancelAppointment,
  completeAppointment,
  confirmAppointment,
  createAppointment,
  deleteAppointment,
  getAllAppointments,
  noShowAppointment,
  updateAppointment,
} from "@/service/appointmentApi";
import ToastUtils from "@/utils/toastUtils";
import { AdminPage, Button, GlassCard, SectionHeader, StatusBadge } from "../_components/admin-ui";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [doctorOptions, setDoctorOptions] = useState<Array<{ id: string; name: string }>>([]);

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<AppointmentResponse | null>(null);
  const [deletingAppointment, setDeletingAppointment] = useState<AppointmentResponse | null>(null);
  const [cancelTarget, setCancelTarget] = useState<AppointmentResponse | null>(null);

  useEffect(() => {
    const loadAppointments = async () => {
      setIsLoading(true);
      const result = await getAllAppointments();
      if (result.success) {
        setAppointments(result.data ?? []);
      }
      setIsLoading(false);
    };

    void loadAppointments();
  }, []);

  useEffect(() => {
    const loadDoctors = async () => {
      const result = await getAllDoctors();
      if (!result.success || !result.data) return;

      const options = result.data.map((doctor) => ({
        id: doctor.userId,
        name: doctor.userInfo?.username ? `Dr. ${doctor.userInfo.username}` : `Dr. ${doctor.specialization}`,
      }));
      setDoctorOptions(options);
    };

    void loadDoctors();
  }, []);

  const refreshAppointments = async () => {
    const result = await getAllAppointments();
    if (result.success) {
      setAppointments(result.data ?? []);
    }
  };

  const handleStatusAction = async (
    appointment: AppointmentResponse,
    action: "confirm" | "complete" | "noShow",
  ) => {
    setActionLoadingId(appointment.id);

    const result =
      action === "confirm"
        ? await confirmAppointment(appointment.id)
        : action === "complete"
          ? await completeAppointment(appointment.id)
          : await noShowAppointment(appointment.id);

    if (result.success) {
      await refreshAppointments();
    }

    setActionLoadingId(null);
  };

  const handleDelete = async (appointmentId: string) => {
    setActionLoadingId(appointmentId);
    const result = await deleteAppointment(appointmentId);
    if (result.success) {
      setDeletingAppointment(null);
      await refreshAppointments();
    }
    setActionLoadingId(null);
  };

  const statusStats = useMemo(() => {
    const scheduled = appointments.filter((item) => ["PENDING", "CONFIRMED"].includes(item.status)).length;
    const completed = appointments.filter((item) => item.status === "COMPLETED").length;
    const cancelled = appointments.filter((item) => ["CANCELLED", "NO_SHOW"].includes(item.status)).length;
    const online = appointments.filter((item) => item.reason?.toLowerCase().includes("telemedicine")).length;

    return [scheduled, completed, cancelled, online];
  }, [appointments]);

  return (
    <AdminPage
      eyebrow="Appointments"
      title="Appointments"
      description="Monitor scheduled, completed, and cancelled appointments across clinic and online consultation channels."
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4 [grid-auto-flow:dense]">
        <GlassCard className="xl:col-span-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <SectionHeader
              title="Appointment Table"
              action={
                <Button className="rounded-2xl" onClick={() => setIsScheduleOpen(true)}>
                  <CalendarClock className="h-4 w-4" />
                  Schedule Appointment
                </Button>
              }
            />
            <div className="flex flex-wrap gap-2">
              {["Date", "Status", "Doctor"].map((filter) => (
                <Button key={filter} variant="outline" className="rounded-2xl">
                  <Filter className="h-4 w-4" />
                  {filter}
                </Button>
              ))}
            </div>
          </div>
          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200/70 dark:border-white/10">
            <div className="hidden grid-cols-[1fr_1fr_0.85fr_0.55fr_0.55fr_1.25fr] gap-4 border-b border-slate-200/70 bg-slate-950/[0.03] px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:border-white/10 dark:bg-white/[0.04] lg:grid">
              <span>Patient</span>
              <span>Doctor</span>
              <span>Date / Time</span>
              <span>Status</span>
              <span>Type</span>
              <span className="text-right">Actions</span>
            </div>
            {isLoading && (
              <div className="px-4 py-5 text-sm font-semibold text-slate-500 dark:text-slate-300">
                Loading appointments...
              </div>
            )}
            {!isLoading && appointments.length === 0 && (
              <div className="px-4 py-5 text-sm font-semibold text-slate-500 dark:text-slate-300">
                No appointments available.
              </div>
            )}
            {appointments.map((item) => (
              <div
                key={item.id}
                className="grid gap-3 border-b border-slate-200/70 px-4 py-4 last:border-b-0 dark:border-white/10 lg:grid-cols-[1fr_1fr_0.85fr_0.55fr_0.55fr_1.25fr] lg:items-center"
              >
                <p className="font-bold">
                  {item.patient?.userInfo?.firstName || "Patient"} {item.patient?.userInfo?.lastName || ""}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {item.doctor?.userInfo?.firstName || "Doctor"} {item.doctor?.userInfo?.lastName || ""}
                </p>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  {item.appointmentDate} · {item.appointmentTime}
                </p>
                <StatusBadge status={item.status} />
                <span className="w-fit rounded-full bg-slate-950/5 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                  {item.reason?.toLowerCase().includes("telemedicine") ? "Online" : "Offline"}
                </span>
                <AppointmentActions
                  item={item}
                  isLoading={actionLoadingId === item.id}
                  onConfirm={() => void handleStatusAction(item, "confirm")}
                  onComplete={() => void handleStatusAction(item, "complete")}
                  onNoShow={() => void handleStatusAction(item, "noShow")}
                  onCancel={() => setCancelTarget(item)}
                  onEdit={() => setEditingAppointment(item)}
                  onDelete={() => setDeletingAppointment(item)}
                />
              </div>
            ))}
          </div>
        </GlassCard>

        {["Scheduled", "Completed", "Cancelled", "Online"].map((item, index) => (
          <GlassCard key={item}>
            <CalendarClock className="h-6 w-6 text-sky-500" />
            <p className="mt-5 text-3xl font-bold">{statusStats[index]}</p>
            <p className="mt-2 text-sm font-bold text-slate-600 dark:text-slate-300">{item} today</p>
          </GlassCard>
        ))}
      </div>

      {isScheduleOpen && (
        <AdminScheduleModal
          doctors={doctorOptions}
          onClose={() => setIsScheduleOpen(false)}
          onSubmit={async (payload) => {
            const result = await createAppointment(payload);
            if (result.success) {
              setIsScheduleOpen(false);
              await refreshAppointments();
            }
          }}
        />
      )}

      {editingAppointment && (
        <EditAppointmentModal
          appointment={editingAppointment}
          onClose={() => setEditingAppointment(null)}
          onSubmit={async (payload) => {
            const result = await updateAppointment(editingAppointment.id, payload);
            if (result.success) {
              setEditingAppointment(null);
              await refreshAppointments();
            }
          }}
        />
      )}

      {cancelTarget && (
        <CancelAppointmentModal
          onClose={() => setCancelTarget(null)}
          onSubmit={async (reason) => {
            setActionLoadingId(cancelTarget.id);
            const result = await cancelAppointment(cancelTarget.id, reason);
            if (result.success) {
              setCancelTarget(null);
              await refreshAppointments();
            }
            setActionLoadingId(null);
          }}
        />
      )}

      {deletingAppointment && (
        <DeleteAppointmentModal
          appointment={deletingAppointment}
          isLoading={actionLoadingId === deletingAppointment.id}
          onClose={() => setDeletingAppointment(null)}
          onConfirm={() => void handleDelete(deletingAppointment.id)}
        />
      )}
    </AdminPage>
  );
}

function AppointmentActions({
  item,
  isLoading,
  onConfirm,
  onComplete,
  onNoShow,
  onCancel,
  onEdit,
  onDelete,
}: {
  item: AppointmentResponse;
  isLoading: boolean;
  onConfirm: () => void;
  onComplete: () => void;
  onNoShow: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-wrap justify-start gap-2 lg:justify-end">
      {item.status === "PENDING" && (
        <Button size="sm" variant="outline" className="rounded-xl" disabled={isLoading} onClick={onConfirm}>
          <CheckCircle2 className="h-4 w-4" />
          Confirm
        </Button>
      )}
      {item.status === "CONFIRMED" && (
        <>
          <Button size="sm" variant="outline" className="rounded-xl" disabled={isLoading} onClick={onComplete}>
            <CheckCircle2 className="h-4 w-4" />
            Complete
          </Button>
          <Button size="sm" variant="outline" className="rounded-xl" disabled={isLoading} onClick={onNoShow}>
            <Clock3 className="h-4 w-4" />
            No Show
          </Button>
        </>
      )}
      {["PENDING", "CONFIRMED"].includes(item.status) && (
        <Button size="sm" variant="outline" className="rounded-xl" disabled={isLoading} onClick={onCancel}>
          <XCircle className="h-4 w-4" />
          Cancel
        </Button>
      )}
      {["PENDING", "CONFIRMED"].includes(item.status) && (
        <Button size="sm" variant="outline" className="rounded-xl" disabled={isLoading} onClick={onEdit}>
          <Edit3 className="h-4 w-4" />
          Modify
        </Button>
      )}
      <Button size="sm" variant="outline" className="rounded-xl text-rose-600 dark:text-rose-300" disabled={isLoading} onClick={onDelete}>
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>
    </div>
  );
}

function AdminScheduleModal({
  doctors,
  onClose,
  onSubmit,
}: {
  doctors: Array<{ id: string; name: string }>;
  onClose: () => void;
  onSubmit: (payload: CreateAppointmentPayload) => Promise<void>;
}) {
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4">
      <div className="w-full max-w-xl rounded-3xl border border-white/20 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900">
        <h3 className="text-xl font-bold">Schedule Appointment</h3>
        <div className="mt-4 grid gap-3">
          <input
            value={patientId}
            onChange={(event) => setPatientId(event.target.value)}
            placeholder="Patient userId"
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-slate-800"
          />
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
          </div>
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Reason"
            className="min-h-20 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-800"
          />
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" className="rounded-2xl" onClick={onClose}>
            Close
          </Button>
          <Button
            className="rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500"
            onClick={() => {
              if (!patientId || !doctorId || !appointmentDate || !appointmentTime) {
                ToastUtils.error("Please fill patient, doctor, date, and time.");
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
            Create Appointment
          </Button>
        </div>
      </div>
    </div>
  );
}

function EditAppointmentModal({
  appointment,
  onClose,
  onSubmit,
}: {
  appointment: AppointmentResponse;
  onClose: () => void;
  onSubmit: (payload: { appointmentDate?: string; appointmentTime?: string; reason?: string }) => Promise<void>;
}) {
  const [appointmentDate, setAppointmentDate] = useState(appointment.appointmentDate || "");
  const [appointmentTime, setAppointmentTime] = useState((appointment.appointmentTime || "").slice(0, 5));
  const [reason, setReason] = useState(appointment.reason || "");

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4">
      <div className="w-full max-w-lg rounded-3xl border border-white/20 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900">
        <h3 className="text-xl font-bold">Modify Appointment</h3>
        <div className="mt-4 grid gap-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
          </div>
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
            className="rounded-2xl"
            onClick={() => {
              const normalizedTime = appointmentTime.length === 5 ? `${appointmentTime}:00` : appointmentTime;
              void onSubmit({
                appointmentDate: appointmentDate || undefined,
                appointmentTime: normalizedTime || undefined,
                reason: reason || undefined,
              });
            }}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

function CancelAppointmentModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
}) {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4">
      <div className="w-full max-w-lg rounded-3xl border border-white/20 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900">
        <h3 className="text-xl font-bold">Cancel Appointment</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Add a reason so this cancellation is clear in audit and patient history.
        </p>
        <textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Cancellation reason"
          className="mt-4 min-h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-800"
        />
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" className="rounded-2xl" onClick={onClose}>
            Close
          </Button>
          <Button
            className="rounded-2xl bg-rose-500 hover:bg-rose-600"
            onClick={() => {
              if (!reason.trim()) {
                ToastUtils.error("Please provide a cancellation reason.");
                return;
              }
              void onSubmit(reason.trim());
            }}
          >
            Confirm Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

function DeleteAppointmentModal({
  appointment,
  isLoading,
  onClose,
  onConfirm,
}: {
  appointment: AppointmentResponse;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4">
      <div className="w-full max-w-lg rounded-3xl border border-white/20 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900">
        <h3 className="text-xl font-bold">Delete Appointment</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          This action is permanent. Appointment ID: {appointment.id}
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" className="rounded-2xl" onClick={onClose}>
            Close
          </Button>
          <Button
            className="rounded-2xl bg-rose-500 hover:bg-rose-600"
            disabled={isLoading}
            onClick={onConfirm}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
