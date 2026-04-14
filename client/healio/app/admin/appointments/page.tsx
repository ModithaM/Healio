"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarClock, Filter } from "lucide-react";

import { getAllDoctors } from "@/service/doctorApi";
import {
  AppointmentResponse,
  CreateAppointmentPayload,
  createAppointment,
  getAllAppointments,
} from "@/service/appointmentApi";
import ToastUtils from "@/utils/toastUtils";
import { AdminPage, Button, GlassCard, SectionHeader, StatusBadge } from "../_components/admin-ui";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [doctorOptions, setDoctorOptions] = useState<Array<{ id: string; name: string }>>([]);

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

  const statusStats = useMemo(() => {
    const scheduled = appointments.filter((item) => ["PENDING", "CONFIRMED"].includes(item.status)).length;
    const completed = appointments.filter((item) => item.status === "COMPLETED").length;
    const cancelled = appointments.filter((item) => item.status === "CANCELLED").length;
    const online = appointments.filter((item) => item.reason?.toLowerCase().includes("telemedicine")).length;

    return [scheduled, completed, cancelled, online];
  }, [appointments]);

  return (
    <AdminPage eyebrow="Appointments" title="Appointments" description="Monitor scheduled, completed, and cancelled appointments across clinic and online consultation channels.">
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
                <Button key={filter} variant="outline" className="rounded-2xl"><Filter className="h-4 w-4" />{filter}</Button>
              ))}
            </div>
          </div>
          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200/70 dark:border-white/10">
            <div className="hidden grid-cols-[1fr_1fr_0.8fr_0.55fr_0.55fr_0.7fr] gap-4 border-b border-slate-200/70 bg-slate-950/[0.03] px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:border-white/10 dark:bg-white/[0.04] lg:grid">
              <span>Patient</span><span>Doctor</span><span>Date / Time</span><span>Status</span><span>Type</span><span className="text-right">Actions</span>
            </div>
            {isLoading && <div className="px-4 py-5 text-sm font-semibold text-slate-500 dark:text-slate-300">Loading appointments...</div>}
            {!isLoading && appointments.length === 0 && (
              <div className="px-4 py-5 text-sm font-semibold text-slate-500 dark:text-slate-300">No appointments available.</div>
            )}
            {appointments.map((item) => (
              <div key={item.id} className="grid gap-3 border-b border-slate-200/70 px-4 py-4 last:border-b-0 dark:border-white/10 lg:grid-cols-[1fr_1fr_0.8fr_0.55fr_0.55fr_0.7fr] lg:items-center">
                <p className="font-bold">{item.patient?.userInfo?.firstName || "Patient"} {item.patient?.userInfo?.lastName || ""}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.doctor?.userInfo?.firstName || "Doctor"} {item.doctor?.userInfo?.lastName || ""}</p>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{item.appointmentDate} · {item.appointmentTime}</p>
                <StatusBadge status={item.status} />
                <span className="w-fit rounded-full bg-slate-950/5 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">{item.reason?.toLowerCase().includes("telemedicine") ? "Online" : "Offline"}</span>
                <div className="flex justify-start lg:justify-end"><Button variant="outline" className="rounded-2xl">{item.id.slice(0, 8)}</Button></div>
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
    </AdminPage>
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
              <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
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
          <Button variant="outline" className="rounded-2xl" onClick={onClose}>Close</Button>
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
