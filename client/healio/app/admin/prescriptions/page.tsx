"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Filter, Pill } from "lucide-react";

import { PrescriptionResponse, getAllAppointments } from "@/service/appointmentApi";
import { AdminPage, Button, GlassCard, SectionHeader } from "../_components/admin-ui";

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<PrescriptionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionResponse | null>(null);
  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterPatient, setFilterPatient] = useState("");

  useEffect(() => {
    const loadPrescriptions = async () => {
      setIsLoading(true);
      const result = await getAllAppointments();
      if (result.success && result.data) {
        const allPrescriptions = result.data
          .filter((appointment) => Boolean(appointment.prescription))
          .map((appointment) => appointment.prescription)
          .filter((item): item is PrescriptionResponse => Boolean(item));

        setPrescriptions(allPrescriptions);
      }
      setIsLoading(false);
    };

    void loadPrescriptions();
  }, []);

  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter((prescription) => {
      const matchDoctor =
        !filterDoctor || prescription.doctorId.toLowerCase().includes(filterDoctor.toLowerCase());
      const matchPatient =
        !filterPatient || prescription.patientId.toLowerCase().includes(filterPatient.toLowerCase());
      return matchDoctor && matchPatient;
    });
  }, [prescriptions, filterDoctor, filterPatient]);

  const stats = useMemo(() => {
    return {
      total: prescriptions.length,
      withMedications: prescriptions.filter((item) => item.items && item.items.length > 0).length,
      today: prescriptions.filter((item) => {
        const issuedDate = new Date(item.issuedDate);
        const today = new Date();
        return issuedDate.toDateString() === today.toDateString();
      }).length,
    };
  }, [prescriptions]);

  return (
    <AdminPage
      eyebrow="Prescriptions"
      title="Prescriptions"
      description="View and review prescriptions issued for completed consultations."
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 [grid-auto-flow:dense]">
        <GlassCard className="xl:col-span-3">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <SectionHeader title="Prescription Table" />
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Doctor" },
                { label: "Patient" },
              ].map((item) => (
                <Button key={item.label} variant="outline" className="rounded-2xl">
                  <Filter className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Filter by Doctor ID</label>
              <input
                type="text"
                value={filterDoctor}
                onChange={(event) => setFilterDoctor(event.target.value)}
                placeholder="Search doctor ID"
                className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Filter by Patient ID</label>
              <input
                type="text"
                value={filterPatient}
                onChange={(event) => setFilterPatient(event.target.value)}
                placeholder="Search patient ID"
                className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200/70 dark:border-white/10">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200/70 bg-slate-950/[0.03] text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:border-white/10 dark:bg-white/[0.04]">
                  <th className="px-4 py-3">Patient ID</th>
                  <th className="px-4 py-3">Doctor ID</th>
                  <th className="px-4 py-3">Appointment ID</th>
                  <th className="px-4 py-3">Diagnosis</th>
                  <th className="px-4 py-3">Issued Date</th>
                  <th className="px-4 py-3">Medicines</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={7} className="px-4 py-5 text-sm font-semibold text-slate-500 dark:text-slate-300">
                      Loading prescriptions...
                    </td>
                  </tr>
                )}

                {!isLoading && filteredPrescriptions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-5 text-sm font-semibold text-slate-500 dark:text-slate-300">
                      No prescriptions available.
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  filteredPrescriptions.map((item) => (
                    <tr key={item.id} className="border-b border-slate-200/70 dark:border-white/10">
                      <td className="px-4 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {item.patientId.slice(0, 12)}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">{item.doctorId.slice(0, 12)}</td>
                      <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">{item.appointmentId.slice(0, 12)}</td>
                      <td className="px-4 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">{item.diagnosis || "N/A"}</td>
                      <td className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400">{item.issuedDate}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Pill className="h-4 w-4 text-emerald-500" />
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                            {item.items?.length || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Button size="sm" variant="outline" className="rounded-xl" onClick={() => setSelectedPrescription(item)}>
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard>
          <Pill className="h-6 w-6 text-emerald-500" />
          <p className="mt-5 text-3xl font-bold">{stats.total}</p>
          <p className="mt-2 text-sm font-bold text-slate-600 dark:text-slate-300">Total Prescriptions</p>
        </GlassCard>

        <GlassCard>
          <div className="grid h-6 w-6 place-items-center rounded-full bg-sky-500/20">
            <Pill className="h-4 w-4 text-sky-500" />
          </div>
          <p className="mt-5 text-3xl font-bold">{stats.today}</p>
          <p className="mt-2 text-sm font-bold text-slate-600 dark:text-slate-300">Issued Today</p>
        </GlassCard>

        <GlassCard>
          <div className="grid h-6 w-6 place-items-center rounded-full bg-amber-500/20">
            <Pill className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-5 text-3xl font-bold">{stats.withMedications}</p>
          <p className="mt-2 text-sm font-bold text-slate-600 dark:text-slate-300">With Medications</p>
        </GlassCard>
      </div>

      {selectedPrescription && (
        <PrescriptionDetailsModal
          prescription={selectedPrescription}
          onClose={() => setSelectedPrescription(null)}
        />
      )}
    </AdminPage>
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
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/20 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold">Prescription Details</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">ID: {prescription.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            aria-label="Close prescription details"
          >
            ×
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Patient ID</p>
            <p className="mt-2 font-semibold text-slate-900 dark:text-white">{prescription.patientId}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Doctor ID</p>
            <p className="mt-2 font-semibold text-slate-900 dark:text-white">{prescription.doctorId}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Appointment ID</p>
            <p className="mt-2 font-semibold text-slate-900 dark:text-white">{prescription.appointmentId}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Diagnosis</p>
            <p className="mt-2 font-semibold text-slate-900 dark:text-white">{prescription.diagnosis || "No diagnosis provided"}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Issued Date</p>
            <p className="mt-2 font-semibold text-slate-900 dark:text-white">{prescription.issuedDate}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Total Medications</p>
            <p className="mt-2 font-semibold text-slate-900 dark:text-white">{prescription.items?.length || 0}</p>
          </div>
        </div>

        {prescription.notes && (
          <div className="mt-6">
            <p className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Notes</p>
            <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
              {prescription.notes}
            </p>
          </div>
        )}

        <div className="mt-6">
          <h4 className="text-lg font-bold">Medications ({prescription.items?.length || 0})</h4>
          {prescription.items && prescription.items.length > 0 ? (
            <div className="mt-4 space-y-3">
              {prescription.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-800/50"
                >
                  <p className="font-bold text-slate-900 dark:text-white">{item.medicineName}</p>
                  <p className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-400">
                    <span>
                      <strong>Dosage:</strong> {item.dosage}
                    </span>
                    <span>
                      <strong>Frequency:</strong> {item.frequency}
                    </span>
                    {item.duration && (
                      <span>
                        <strong>Duration:</strong> {item.duration}
                      </span>
                    )}
                  </p>
                  {item.instructions && (
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                      <strong>Instructions:</strong> {item.instructions}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">No medications added.</p>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" className="rounded-2xl" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
