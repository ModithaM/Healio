"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Loader2, Plus, ShieldCheck, Stethoscope, XCircle } from "lucide-react";

import {
  getAllDoctors,
  getDoctorsByStatus,
  updateDoctorVerificationStatus,
  DoctorProfileResponse,
} from "@/service/doctorApi";
import { AdminPage, Button, GlassCard, SectionHeader, StatusBadge } from "../_components/admin-ui";

type FilterStatus = "ALL" | "PENDING" | "VERIFIED" | "REJECTED";

const STATUS_TABS: { label: string; value: FilterStatus }[] = [
  { label: "All Doctors", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Verified", value: "VERIFIED" },
  { label: "Rejected", value: "REJECTED" },
];

const STATUS_MAP: Record<string, string> = {
  VERIFIED: "Verified",
  PENDING: "Review",
  REJECTED: "Inactive",
};

export default function DoctorsManagementPage() {
  const [doctors, setDoctors] = useState<DoctorProfileResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("ALL");
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const loadDoctors = useCallback(async () => {
    setIsLoading(true);
    const result =
      activeFilter === "ALL"
        ? await getAllDoctors()
        : await getDoctorsByStatus(activeFilter);

    if (result.success && result.data) {
      setDoctors(result.data);
    } else {
      setDoctors([]);
    }
    setIsLoading(false);
  }, [activeFilter]);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  const handleVerify = async (doctorId: string, status: "VERIFIED" | "REJECTED") => {
    setVerifyingId(doctorId);
    const result = await updateDoctorVerificationStatus(doctorId, status);
    if (result.success) {
      loadDoctors();
    }
    setVerifyingId(null);
  };

  return (
    <AdminPage
      eyebrow="Doctors"
      title="Doctors Management"
      description="Manage clinician profiles, specialties, availability, verification status, and hospital department coverage."
    >
      <div className="grid grid-cols-1 gap-6 [grid-auto-flow:dense]">
        <GlassCard>
          <SectionHeader
            title="Doctor List"
            action={
              <div className="flex flex-wrap items-center gap-3">
                {/* Filter tabs */}
                <div className="flex rounded-2xl border border-slate-200/70 bg-white/60 p-1 dark:border-white/10 dark:bg-white/[0.05]">
                  {STATUS_TABS.map((tab) => (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => setActiveFilter(tab.value)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                        activeFilter === tab.value
                          ? "bg-sky-500 text-white shadow-md"
                          : "text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-300"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <Button className="rounded-2xl">
                  <Plus className="h-4 w-4" />
                  Add Doctor
                </Button>
              </div>
            }
          />

          {isLoading ? (
            <div className="flex min-h-[200px] items-center justify-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-sky-500" />
              <p className="text-sm font-semibold text-slate-500">Loading doctors...</p>
            </div>
          ) : doctors.length === 0 ? (
            <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 p-8 text-center dark:border-white/10">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 dark:bg-white/5">
                <Stethoscope className="h-7 w-7 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                No doctors found
                {activeFilter !== "ALL" && ` with status "${activeFilter}"`}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {doctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  isVerifying={verifyingId === doctor.id}
                  onVerify={(status) => handleVerify(doctor.id, status)}
                />
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </AdminPage>
  );
}

function DoctorCard({
  doctor,
  isVerifying,
  onVerify,
}: {
  doctor: DoctorProfileResponse;
  isVerifying: boolean;
  onVerify: (status: "VERIFIED" | "REJECTED") => void;
}) {
  const displayName = doctor.userInfo?.username
    ? `Dr. ${doctor.userInfo.username}`
    : `Dr. ${doctor.userId.slice(0, 8)}`;

  const mappedStatus = STATUS_MAP[doctor.verificationStatus] || doctor.verificationStatus;

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/64 p-4 transition hover:-translate-y-1 hover:border-sky-300 dark:border-white/10 dark:bg-white/[0.05]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-[52px] w-[52px] place-items-center rounded-2xl bg-gradient-to-br from-sky-100 to-emerald-100 text-sky-600 dark:from-sky-500/20 dark:to-emerald-500/20 dark:text-sky-300">
            <Stethoscope className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-bold">{displayName}</h3>
            <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
              {doctor.specialization}
            </p>
          </div>
        </div>
        <StatusBadge status={mappedStatus} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <InfoCell label="Experience" value={`${doctor.experienceYears} yrs`} />
        <InfoCell
          label="Fee"
          value={`LKR ${Number(doctor.consultationFee).toLocaleString()}`}
        />
      </div>

      {doctor.licenseNumber && (
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-sky-500/8 px-3 py-2">
          <ShieldCheck className="h-4 w-4 shrink-0 text-sky-600 dark:text-sky-300" />
          <p className="truncate text-xs font-bold text-sky-700 dark:text-sky-300">
            {doctor.licenseNumber}
          </p>
        </div>
      )}

      {doctor.verificationStatus === "PENDING" && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onVerify("VERIFIED")}
            disabled={isVerifying}
            className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500/10 px-3 py-2.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-500 hover:text-white disabled:opacity-50 dark:text-emerald-300 dark:hover:text-white"
          >
            {isVerifying ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5" />
            )}
            Verify
          </button>
          <button
            type="button"
            onClick={() => onVerify("REJECTED")}
            disabled={isVerifying}
            className="flex items-center justify-center gap-2 rounded-2xl bg-rose-500/10 px-3 py-2.5 text-xs font-bold text-rose-700 transition hover:bg-rose-500 hover:text-white disabled:opacity-50 dark:text-rose-300 dark:hover:text-white"
          >
            {isVerifying ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <XCircle className="h-3.5 w-3.5" />
            )}
            Reject
          </button>
        </div>
      )}

      {doctor.verificationStatus === "REJECTED" && (
        <button
          type="button"
          onClick={() => onVerify("VERIFIED")}
          disabled={isVerifying}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500/10 px-3 py-2.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-500 hover:text-white disabled:opacity-50 dark:text-emerald-300 dark:hover:text-white"
        >
          {isVerifying ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <ShieldCheck className="h-3.5 w-3.5" />
          )}
          Re-verify Doctor
        </button>
      )}

      {doctor.verificationStatus === "VERIFIED" && (
        <div className="mt-4 flex gap-2">
          <Button variant="outline" className="flex-1 rounded-2xl">
            Edit
          </Button>
          <Button className="flex-1 rounded-2xl">
            <Stethoscope className="h-4 w-4" />
            View
          </Button>
        </div>
      )}

      {doctor.userInfo?.email && (
        <p className="mt-3 truncate text-center text-xs text-slate-400">
          {doctor.userInfo.email}
        </p>
      )}
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-950/[0.04] p-3 text-center dark:bg-white/10">
      <p className="truncate text-sm font-bold">{value}</p>
      <p className="mt-1 text-xs font-semibold text-slate-400">{label}</p>
    </div>
  );
}
