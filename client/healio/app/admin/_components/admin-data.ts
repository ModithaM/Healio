import {
  Activity,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  Database,
  FileBarChart,
  HeartPulse,
  LayoutDashboard,
  Pill,
  Server,
  Stethoscope,
  UserCheck,
  UserRound,
  UsersRound,
  Video,
} from "lucide-react";

export const adminUser = {
  name: "Hasindu Admin",
  role: "Super Admin",
  avatar: "/illustrations/testimonial-avatar-care.svg",
};

export const adminNavItems = [
  { label: "Overview", href: "/admin/overview", icon: LayoutDashboard },
  { label: "Patients", href: "/admin/patients", icon: UsersRound },
  { label: "Doctors", href: "/admin/doctors", icon: Stethoscope },
  { label: "Appointments", href: "/admin/appointments", icon: CalendarClock },
  { label: "Prescriptions", href: "/admin/prescriptions", icon: Pill },
  { label: "Telemedicine", href: "/admin/telemedicine", icon: Video },
  { label: "Analytics", href: "/admin/analytics", icon: FileBarChart },
  { label: "System Health", href: "/admin/system-health", icon: Server },
];

export const overviewStats = [
  { label: "Total Patients", value: "12,486", helper: "+8.4% this month", icon: UsersRound, accent: "from-sky-500 to-cyan-400" },
  { label: "Total Doctors", value: "642", helper: "38 active specialties", icon: Stethoscope, accent: "from-emerald-500 to-teal-400" },
  { label: "Total Appointments", value: "31,208", helper: "1,284 booked today", icon: CalendarClock, accent: "from-indigo-500 to-sky-400" },
  { label: "Active Telemedicine", value: "212", helper: "42 live rooms now", icon: Video, accent: "from-violet-500 to-indigo-400" },
];

export const quickActions = [
  { label: "Add Patient", helper: "Create a verified patient record", icon: UserRound, href: "/admin/patients" },
  { label: "Add Doctor", helper: "Invite a clinician to the network", icon: Stethoscope, href: "/admin/doctors" },
  { label: "Schedule Appointment", helper: "Book clinic or video care", icon: CalendarClock, href: "/admin/appointments" },
];

export const patients = [
  { name: "Hasindu Chanuka", id: "HL-PAT-2048", email: "hasindu.chanuka@email.com", phone: "+94 77 248 9031", status: "Active" },
  { name: "Nadia Perera", id: "HL-PAT-1942", email: "nadia.perera@email.com", phone: "+94 71 505 3341", status: "Active" },
  { name: "Maya Chen", id: "HL-PAT-2210", email: "maya.chen@email.com", phone: "+94 76 441 9088", status: "Review" },
  { name: "Aaron Silva", id: "HL-PAT-1864", email: "aaron.silva@email.com", phone: "+94 77 902 1184", status: "Inactive" },
];

export const doctors = [
  { name: "Dr. Kavish Silva", specialty: "Cardiology", availability: "Available today", status: "Verified", rating: "4.9", experience: "12 yrs", avatar: "/illustrations/testimonial-avatar-doctor.svg" },
  { name: "Dr. Amelia Fernando", specialty: "Dermatology", availability: "Clinic only", status: "Verified", rating: "4.8", experience: "9 yrs", avatar: "/illustrations/testimonial-avatar-care.svg" },
  { name: "Dr. Maya Chen", specialty: "Neurology", availability: "Pending schedule", status: "Review", rating: "4.7", experience: "11 yrs", avatar: "/illustrations/testimonial-avatar-doctor.svg" },
  { name: "Dr. Aaron Silva", specialty: "Orthopedics", availability: "Video slots open", status: "Verified", rating: "4.9", experience: "15 yrs", avatar: "/illustrations/testimonial-avatar-care.svg" },
];

export const appointments = [
  { patient: "Hasindu Chanuka", doctor: "Dr. Kavish Silva", date: "Apr 12, 2026", time: "09:30 AM", status: "Scheduled", type: "Online" },
  { patient: "Nadia Perera", doctor: "Dr. Amelia Fernando", date: "Apr 12, 2026", time: "10:15 AM", status: "Completed", type: "Offline" },
  { patient: "Maya Chen", doctor: "Dr. Aaron Silva", date: "Apr 12, 2026", time: "11:45 AM", status: "Cancelled", type: "Offline" },
  { patient: "Aaron Silva", doctor: "Dr. Maya Chen", date: "Apr 13, 2026", time: "03:00 PM", status: "Scheduled", type: "Online" },
];

export const telemedicineSessions = [
  { title: "Live Consultation Now", patient: "Hasindu Chanuka", doctor: "Dr. Kavish Silva", time: "09:30 AM", status: "Live" },
  { title: "Medication Follow-up", patient: "Aaron Silva", doctor: "Dr. Maya Chen", time: "12:30 PM", status: "Upcoming" },
  { title: "Report Explanation", patient: "Nadia Perera", doctor: "Dr. Amelia Fernando", time: "04:00 PM", status: "Upcoming" },
  { title: "Completed Cardiology Review", patient: "Maya Chen", doctor: "Dr. Kavish Silva", time: "Yesterday", status: "Completed" },
];

export const activityFeed = [
  { title: "New patient registered", detail: "Hasindu Chanuka completed account verification", time: "9 min ago", icon: UserRound },
  { title: "Doctor verified", detail: "Dr. Kavish Silva approved for Cardiology", time: "32 min ago", icon: UserCheck },
  { title: "Appointment cancelled", detail: "Clinic slot released and patient notified", time: "1 hr ago", icon: CalendarClock },
  { title: "Session completed", detail: "Telemedicine notes and prescription archived", time: "2 hrs ago", icon: CheckCircle2 },
];

export const chartData = [
  { label: "Mon", value: 58, secondary: 72 },
  { label: "Tue", value: 76, secondary: 84 },
  { label: "Wed", value: 64, secondary: 69 },
  { label: "Thu", value: 92, secondary: 88 },
  { label: "Fri", value: 81, secondary: 93 },
  { label: "Sat", value: 54, secondary: 62 },
  { label: "Sun", value: 68, secondary: 74 },
];

export const analyticsKpis = [
  { label: "Appointments per day", value: "704", helper: "+18%", icon: BarChart3 },
  { label: "Telemedicine usage", value: "68%", helper: "+7%", icon: Video },
  { label: "Patient growth", value: "1.9K", helper: "+12%", icon: UsersRound },
  { label: "Doctor activity", value: "82%", helper: "stable", icon: Activity },
];

export const systemServices = [
  { label: "API Gateway", value: "Healthy", icon: Server, status: "healthy" },
  { label: "Database", value: "Healthy", icon: Database, status: "healthy" },
  { label: "Telemedicine Service", value: "Warning", icon: Video, status: "warning" },
  { label: "Notification Service", value: "Healthy", icon: HeartPulse, status: "healthy" },
];

export const systemLogs = [
  "09:12 API Gateway latency normalized to 118ms",
  "08:54 Video relay scaled to 7 active nodes",
  "08:31 Database backup completed successfully",
  "08:10 Notification queue processed 4,218 reminders",
];
