"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  CalendarCheck,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import { motion } from "framer-motion";

import {
  AuthInput,
  AuthShell,
  AuthSubmitButton,
  authFadeUp,
  authStagger,
} from "@/components/auth/PremiumAuth";
import { registerUser } from "@/service/userApi";
import { UserData } from "@/types/user/types";
import ToastUtils from "@/utils/toastUtils";

const Page = () => {
  const router = useRouter();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState<UserData>({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "USER",
  });

  const passwordMismatch =
    confirmPassword.length > 0 && userData.password !== confirmPassword;

  const handleSubmission = async (e: FormEvent) => {
    e.preventDefault();

    if (userData.password !== confirmPassword) {
      setErrorMessage("Password does not match");
      return;
    }

    setErrorMessage("");

    try {
      const response = await registerUser(userData);
      if (response.success) {
        ToastUtils.success("Registration successful! Please sign in.");
        await router.push("/signin");
      } else if (response.error) {
        setErrorMessage(response.error);
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <AuthShell
      badge="Start smarter care"
      title="Create Your Account"
      subtitle="Join the platform to book appointments and access digital healthcare services."
      reverse
      illustrationClassName="lg:min-h-[690px]"
      illustration={{
        src: "/illustrations/auth-signup-dashboard.svg",
        alt: "Animated transparent illustration of healthcare appointment booking and digital records",
        title: "Premium digital healthcare",
        subtitle: "Book visits, manage records, and connect with doctors securely.",
        cards: [
          {
            icon: CalendarCheck,
            label: "Fast Appointment Booking",
            detail: "Live clinic availability",
            className: "left-0 top-28",
          },
          {
            icon: UsersRound,
            label: "Trusted by Patients",
            detail: "Connected care journeys",
            className: "right-0 top-56",
          },
          {
            icon: ShieldCheck,
            label: "Secure Records",
            detail: "Private health access",
            className: "bottom-24 left-10",
          },
        ],
      }}
    >
      <motion.form
        variants={authStagger}
        initial="hidden"
        animate="show"
        className="grid gap-3"
        onSubmit={handleSubmission}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <AuthInput
            id="firstName"
            name="firstName"
            label="First name"
            icon={UserRound}
            type="text"
            value={userData.firstName}
            onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
            placeholder="Nadia"
            autoComplete="given-name"
            required
          />
          <AuthInput
            id="lastName"
            name="lastName"
            label="Last name"
            icon={UserRound}
            type="text"
            value={userData.lastName}
            onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
            placeholder="Perera"
            autoComplete="family-name"
            required
          />
        </div>

        <AuthInput
          id="username"
          name="username"
          label="Username"
          icon={UserRound}
          type="text"
          value={userData.username}
          onChange={(e) => setUserData({ ...userData, username: e.target.value })}
          placeholder="nadia.perera"
          autoComplete="username"
          required
        />

        <AuthInput
          id="email"
          name="email"
          label="Email"
          icon={Mail}
          type="email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          placeholder="name@healio.health"
          autoComplete="email"
          required
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <AuthInput
            id="password"
            name="password"
            label="Password"
            icon={LockKeyhole}
            type="password"
            value={userData.password}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            placeholder="Create password"
            autoComplete="new-password"
            required
          />
          <AuthInput
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm password"
            icon={LockKeyhole}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat password"
            autoComplete="new-password"
            required
          />
        </div>

        <motion.div variants={authFadeUp}>
          <label
            htmlFor="role"
            className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-200"
          >
            Role
          </label>
          <div className="relative">
            <UsersRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-500" />
            <select
              id="role"
              name="role"
              value={userData.role}
              onChange={(e) => setUserData({ ...userData, role: e.target.value })}
              className="h-11 w-full appearance-none rounded-xl border border-slate-200/80 bg-white/75 py-2.5 pl-10 pr-4 text-sm font-semibold text-slate-900 shadow-sm outline-none backdrop-blur-md transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-400/15 dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:focus:border-sky-300/60 dark:focus:bg-white/[0.09]"
            >
              <option value="USER">Patient</option>
              <option value="DOCTOR">Doctor</option>
            </select>
          </div>
        </motion.div>

        <motion.label
          variants={authFadeUp}
          className="flex items-start gap-3 text-xs font-semibold leading-5 text-slate-600 dark:text-slate-300"
        >
          <input
            type="checkbox"
            required
            className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-400"
          />
          I agree to the Terms & Conditions and secure healthcare access.
        </motion.label>

        {(passwordMismatch || errorMessage) && (
          <motion.p
            variants={authFadeUp}
            className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-2 text-xs font-semibold text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200"
          >
            {errorMessage || "Password does not match"}
          </motion.p>
        )}

        <AuthSubmitButton disabled={passwordMismatch}>Sign Up</AuthSubmitButton>
      </motion.form>

      <div className="mt-4 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
        <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
        <span>Already onboarded?</span>
        <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
      </div>
      <p className="mt-3 text-center text-sm font-semibold text-slate-600 dark:text-slate-300">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="text-sky-600 transition hover:text-emerald-500 dark:text-sky-300"
        >
          Login
        </Link>
      </p>
    </AuthShell>
  );
};

export default Page;
