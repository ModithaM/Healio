"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  CalendarCheck,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Video,
} from "lucide-react";
import { motion } from "framer-motion";

import {
  AuthInput,
  AuthShell,
  AuthSubmitButton,
  SecurityNote,
  authFadeUp,
  authStagger,
} from "@/components/auth/PremiumAuth";
import { loginUser } from "@/service/userApi";
import { useAuthStore } from "@/store/authStore";

interface FormData {
  username: string;
  password: string;
}

const Page = () => {
  const login = useAuthStore((s) => s.login);
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const result = await loginUser(formData);

      if (result?.success && result.data) {
        const { token, ...userData } = result.data;
        login(token, userData);
        router.push("/");
      } else {
        setMessage("Invalid email or password.");
      }
    } catch (err) {
      setMessage("Something went wrong.");
      console.error(err);
    }
  };

  return (
    <AuthShell
      badge="Secure care access"
      title="Welcome Back"
      subtitle="Sign in to manage appointments, records, and telemedicine sessions."
      illustration={{
        src: "/illustrations/auth-login-telemedicine.svg",
        alt: "Animated transparent illustration of a doctor supporting telemedicine access",
        title: "Connected clinical workspace",
        subtitle: "Everything your care team needs, ready after sign in.",
        cards: [
          {
            icon: ShieldCheck,
            label: "Secure Access",
            detail: "Protected health records",
            className: "left-4 top-20",
          },
          {
            icon: Video,
            label: "Telemedicine Ready",
            detail: "Join visits instantly",
            className: "right-4 top-52",
          },
          {
            icon: CalendarCheck,
            label: "Fast Booking",
            detail: "Live appointment slots",
            className: "bottom-20 left-10",
          },
        ],
      }}
    >
      <motion.form
        variants={authStagger}
        initial="hidden"
        animate="show"
        className="grid gap-3.5"
        onSubmit={handleSubmit}
      >
        <AuthInput
          id="username"
          name="username"
          label="Email or username"
          icon={Mail}
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          placeholder="name@healio.health"
          autoComplete="username"
          required
        />

        <AuthInput
          id="password"
          name="password"
          label="Password"
          icon={LockKeyhole}
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />

        <motion.div
          variants={authFadeUp}
          className="flex flex-col gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between"
        >
          <label className="inline-flex items-center gap-3">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-400"
            />
            Remember me
          </label>
          <Link
            href="#"
            className="text-sky-600 transition hover:text-emerald-500 dark:text-sky-300"
          >
            Forgot password?
          </Link>
        </motion.div>

        {message && (
          <motion.p
            variants={authFadeUp}
            className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-2 text-xs font-semibold text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200"
          >
            {message}
          </motion.p>
        )}

        <AuthSubmitButton>Login</AuthSubmitButton>
        <SecurityNote />
      </motion.form>

      <div className="mt-4 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
        <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
        <span>New to Healio?</span>
        <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
      </div>
      <p className="mt-3 text-center text-sm font-semibold text-slate-600 dark:text-slate-300">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-sky-600 transition hover:text-emerald-500 dark:text-sky-300"
        >
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
};

export default Page;
