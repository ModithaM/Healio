import type { SessionStatus, TelemedicineSession } from "@/types/telemedicine/types";

export const getSessionStatusClass = (status: SessionStatus) => {
  const classes: Record<SessionStatus, string> = {
    SCHEDULED: "bg-sky-500/12 text-sky-700 dark:text-sky-300",
    WAITING: "bg-amber-500/12 text-amber-700 dark:text-amber-300",
    ONGOING: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
    COMPLETED: "bg-slate-500/12 text-slate-600 dark:text-slate-300",
    CANCELLED: "bg-rose-500/12 text-rose-700 dark:text-rose-300",
  };

  return classes[status];
};

export const canJoinSession = (session: TelemedicineSession) =>
  session.status === "SCHEDULED" || session.status === "WAITING" || session.status === "ONGOING";

export const formatSessionDateTime = (value: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

export const toLocalInputDateTime = (date: Date) => {
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
};
