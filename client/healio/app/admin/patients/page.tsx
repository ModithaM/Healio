"use client";

import { useEffect, useState } from "react";
import { Filter, Pencil, Plus, Search, Trash2, UserRound, X } from "lucide-react";

import { getAllPatients, PatientProfileResponse, deletePatientProfile } from "@/service/patientApi";
import { AdminPage, Button, GlassCard, SectionHeader, StatusBadge } from "../_components/admin-ui";

export default function PatientsManagementPage() {
  const [patients, setPatients] = useState<PatientProfileResponse[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientProfileResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<PatientProfileResponse | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "create">("view");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setIsLoading(true);
    const result = await getAllPatients();
    if (result.success && result.data) {
      setPatients(result.data);
      setFilteredPatients(result.data);
    }
    setIsLoading(false);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = patients.filter(
      (patient) =>
        (patient.userInfo?.userDetails?.firstName || "")
          .toLowerCase()
          .includes(value.toLowerCase()) ||
        (patient.userInfo?.userDetails?.lastName || "")
          .toLowerCase()
          .includes(value.toLowerCase()) ||
        (patient.userInfo?.email || "").toLowerCase().includes(value.toLowerCase()) ||
        (patient.id || "").toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

  const handleDelete = async (patientId: string, userId: string) => {
    const result = await deletePatientProfile(userId);
    if (result.success) {
      setPatients(patients.filter((p) => p.id !== patientId));
      setFilteredPatients(filteredPatients.filter((p) => p.id !== patientId));
      setDeleteConfirm(null);
    }
  };

  const getPatientName = (patient: PatientProfileResponse) => {
    if (patient.userInfo?.userDetails) {
      return `${patient.userInfo.userDetails.firstName} ${patient.userInfo.userDetails.lastName}`;
    }
    return "Unknown Patient";
  };

  const getPatientEmail = (patient: PatientProfileResponse) => {
    return patient.userInfo?.email || "N/A";
  };

  const formatPatientId = (id: string) => {
    if (!id) return "--";
    return `#${id.slice(-6).toUpperCase()}`;
  };

  const formatBloodGroup = (bloodGroup: string) => {
    if (!bloodGroup) return "--";
    const bloodGroupMap: Record<string, string> = {
      "O_POSITIVE": "O+",
      "O_NEGATIVE": "O-",
      "A_POSITIVE": "A+",
      "A_NEGATIVE": "A-",
      "B_POSITIVE": "B+",
      "B_NEGATIVE": "B-",
      "AB_POSITIVE": "AB+",
      "AB_NEGATIVE": "AB-",
    };
    return bloodGroupMap[bloodGroup] || bloodGroup;
  };

  return (
    <AdminPage
      eyebrow="Patients"
      title="Patients Management"
      description="Search, filter, and manage verified hospital patient records with quick operational actions."
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4 [grid-auto-flow:dense]">
        <GlassCard className="xl:col-span-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <SectionHeader
              title="Patient Directory"
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="h-11 rounded-2xl border border-slate-200 bg-white/70 pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-sky-300 dark:border-white/10 dark:bg-white/10"
                  placeholder="Search patient name or ID"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200/70 dark:border-white/10">
            <div className="hidden grid-cols-[1fr_0.8fr_1.2fr_0.8fr_0.6fr_0.8fr] gap-4 border-b border-slate-200/70 bg-slate-950/[0.03] px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:border-white/10 dark:bg-white/[0.04] lg:grid">
              <span>Name</span>
              <span>ID</span>
              <span>Email</span>
              <span>Blood Group</span>
              <span>Gender</span>
              <span className="text-right">Actions</span>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-slate-500 dark:text-slate-400">Loading patients...</p>
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-slate-500 dark:text-slate-400">
                  {searchTerm ? "No patients found" : "No patients yet"}
                </p>
              </div>
            ) : (
              filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="grid gap-3 border-b border-slate-200/70 px-4 py-4 last:border-b-0 dark:border-white/10 lg:grid-cols-[1fr_0.8fr_1.2fr_0.8fr_0.6fr_0.8fr] lg:items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
                      <UserRound className="h-5 w-5" />
                    </div>
                    <p className="font-bold">{getPatientName(patient)}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {formatPatientId(patient.id || "")}
                  </p>
                  <p className="break-all text-sm text-slate-500 dark:text-slate-400">
                    {getPatientEmail(patient)}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {formatBloodGroup(patient.bloodGroup || "")}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {patient.gender ? patient.gender.charAt(0) + patient.gender.slice(1).toLowerCase() : "--"}
                  </p>
                  <div className="flex flex-wrap justify-start gap-2 lg:justify-end">
                    <Button
                      onClick={() => {
                        setSelectedPatient(patient);
                        setModalMode("view");
                        setShowModal(true);
                      }}
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                    >
                      View
                    </Button>
                    <Button
                      onClick={() => setDeleteConfirm(patient.id || "")}
                      variant="ghost"
                      size="icon"
                      className="rounded-xl text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="rounded-3xl bg-white p-6 dark:bg-slate-900 max-w-sm mx-4">
            <h3 className="text-lg font-bold">Delete Patient</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Are you sure you want to delete this patient? This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                onClick={() => setDeleteConfirm(null)}
                variant="outline"
                className="flex-1 rounded-2xl"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const patient = patients.find((p) => p.id === deleteConfirm);
                  if (patient) {
                    handleDelete(patient.id || "", patient.userId);
                  }
                }}
                className="flex-1 rounded-2xl bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="rounded-3xl bg-white p-8 dark:bg-slate-900 max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {modalMode === "view"
                  ? "View Patient"
                  : modalMode === "edit"
                  ? "Edit Patient"
                  : "Add Patient"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            {selectedPatient && modalMode === "view" && (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Name
                  </label>
                  <p className="mt-1 text-lg font-bold">{getPatientName(selectedPatient)}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Email
                  </label>
                  <p className="mt-1 text-lg">{getPatientEmail(selectedPatient)}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Patient ID
                  </label>
                  <p className="mt-1 text-lg font-mono">{formatPatientId(selectedPatient.id || "")}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400">
                      Blood Group
                    </label>
                    <p className="mt-1 text-lg">{formatBloodGroup(selectedPatient.bloodGroup || "")}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400">
                      Gender
                    </label>
                    <p className="mt-1 text-lg">
                      {selectedPatient.gender
                        ? selectedPatient.gender.charAt(0) +
                          selectedPatient.gender.slice(1).toLowerCase()
                        : "--"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400">
                      Date of Birth
                    </label>
                    <p className="mt-1 text-lg">{selectedPatient.dateOfBirth || "--"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400">
                      Emergency Contact
                    </label>
                    <p className="mt-1 text-lg">{selectedPatient.emergencyContactName || "--"}</p>
                  </div>
                </div>
              </div>
            )}

            {modalMode !== "view" && (
              <div className="mt-6 space-y-4">
                <p className="text-slate-600 dark:text-slate-400">
                  Edit functionality coming soon. Please use the patient profile form on the patient dashboard.
                </p>
              </div>
            )}

            <div className="mt-8 flex gap-3">
              {modalMode !== "view" && (
                <Button
                  onClick={() => setShowModal(false)}
                  variant="outline"
                  className="flex-1 rounded-2xl"
                >
                  Cancel
                </Button>
              )}
              <Button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-2xl bg-sky-600 hover:bg-sky-700 dark:bg-sky-600 dark:hover:bg-sky-700 text-white"
              >
                {modalMode === "view" ? "Close" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
