"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  HeartPulse,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  type LucideIcon,
} from "lucide-react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export const authFadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

export const authStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
};

type FloatingCard = {
  icon: LucideIcon;
  label: string;
  detail: string;
  className?: string;
};

type AuthShellProps = {
  badge: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  illustration: {
    src: string;
    alt: string;
    title: string;
    subtitle: string;
    cards: FloatingCard[];
  };
  reverse?: boolean;
  illustrationClassName?: string;
};

export function AuthShell({
  badge,
  title,
  subtitle,
  children,
  footer,
  illustration,
  reverse,
  illustrationClassName,
}: AuthShellProps) {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={cn(isDark && "dark")}>
      <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_left,rgba(14,165,233,0.16),transparent_34%),linear-gradient(135deg,#f9fdff_0%,#eaf8ff_46%,#f6fff9_100%)] px-4 py-4 text-slate-950 transition-colors duration-500 dark:bg-[radial-gradient(ellipse_at_top_left,rgba(14,165,233,0.24),transparent_34%),linear-gradient(135deg,#020617_0%,#07111f_50%,#03130e_100%)] dark:text-white sm:px-6 lg:px-8 lg:py-3">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-500/20" />
        <div className="absolute -right-28 bottom-10 h-96 w-96 rounded-full bg-emerald-300/25 blur-3xl dark:bg-emerald-500/15" />
        <div className="absolute left-1/2 top-32 h-px w-[90rem] -translate-x-1/2 bg-gradient-to-r from-transparent via-sky-300/70 to-transparent" />

        <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-sky-500 to-emerald-500 text-white shadow-lg shadow-sky-500/25">
              <HeartPulse className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-lg font-bold leading-none">Healio</span>
              <span className="text-xs font-semibold uppercase text-sky-600 dark:text-sky-300">
                Hospital SaaS
              </span>
            </span>
          </Link>

          <Button
            variant="outline"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setIsDark((value) => !value)}
            className="bg-white/60 backdrop-blur-md dark:bg-white/5"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </header>

        <section
          className={cn(
            "relative z-10 mx-auto grid max-w-7xl items-center gap-6 pb-6 pt-6 lg:min-h-[calc(100vh-72px)] lg:grid-cols-2 lg:pt-4",
            reverse && "lg:grid-cols-2"
          )}
        >
          <motion.div
            variants={authStagger}
            initial="hidden"
            animate="show"
            className={cn("order-2 lg:order-1", reverse && "lg:order-2")}
          >
            <motion.div
              variants={authFadeUp}
              className="rounded-[28px] border border-white/70 bg-white/62 p-5 shadow-2xl shadow-sky-950/10 backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.08] dark:shadow-black/30 lg:p-6"
            >
              <div className="mb-5">
                <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-sky-200/80 bg-white/70 px-3 py-1.5 text-xs font-bold text-sky-700 shadow-sm backdrop-blur-md dark:border-sky-300/20 dark:bg-white/10 dark:text-sky-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  {badge}
                </div>
                <h1 className="text-3xl font-bold leading-tight text-slate-950 sm:text-4xl dark:text-white">
                  {title}
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {subtitle}
                </p>
              </div>
              {children}
              {footer && <div className="mt-7">{footer}</div>}
            </motion.div>
          </motion.div>

          <AuthIllustrationPanel
            illustration={illustration}
            className={cn("order-1 hidden lg:order-2 lg:block", reverse && "lg:order-1", illustrationClassName)}
          />
        </section>
      </main>
    </div>
  );
}

function AuthIllustrationPanel({
  illustration,
  className,
}: {
  illustration: AuthShellProps["illustration"];
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 42, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.85, ease }}
      className={cn("relative min-h-[390px] px-3 sm:px-5 lg:min-h-[540px] lg:px-4", className)}
    >
      <div className="absolute inset-x-8 inset-y-6 rounded-[42px] bg-gradient-to-br from-sky-300/35 via-indigo-300/20 to-emerald-300/35 blur-3xl dark:from-sky-500/20 dark:via-indigo-500/15 dark:to-emerald-500/20" />
      <div className="relative mx-auto min-h-[520px] overflow-hidden rounded-[34px] border border-white/70 bg-white/42 p-6 shadow-2xl shadow-sky-950/15 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.07] lg:min-h-[520px] lg:p-7">
        <div className="absolute right-10 top-10 h-28 w-28 rounded-full bg-sky-300/25 blur-2xl" />
        <div className="absolute bottom-20 left-8 h-36 w-36 rounded-full bg-emerald-300/20 blur-2xl" />
        <motion.div
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
          className="relative mx-auto aspect-square max-w-[300px] lg:max-w-[360px]"
        >
          <Image
            src={illustration.src}
            alt={illustration.alt}
            fill
            priority
            className="object-contain drop-shadow-2xl"
            sizes="(max-width: 1024px) 90vw, 560px"
          />
        </motion.div>

        <div className="relative mx-auto mt-2 max-w-xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">
            {illustration.title}
          </p>
          <h2 className="mt-3 text-2xl font-bold leading-tight text-slate-950 dark:text-white lg:text-[1.7rem]">
            {illustration.subtitle}
          </h2>
        </div>
        {illustration.cards.map((card, index) => (
          <FloatingAuthCard key={card.label} {...card} delay={index * 0.2} />
        ))}
      </div>
    </motion.div>
  );
}

function FloatingAuthCard({
  icon: Icon,
  label,
  detail,
  className,
  delay,
}: FloatingCard & { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: [0, -10, 0] }}
      transition={{
        opacity: { duration: 0.6, ease, delay: 0.3 + delay },
        y: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay },
      }}
      className={cn(
        "absolute z-20 hidden rounded-2xl border border-white/70 bg-white/72 p-4 shadow-2xl shadow-sky-950/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/68 sm:block",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 text-white shadow-lg shadow-sky-500/20">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-950 dark:text-white">{label}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{detail}</p>
        </div>
      </div>
    </motion.div>
  );
}

type AuthInputProps = {
  id: string;
  label: string;
  icon: LucideIcon;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function AuthInput({
  id,
  label,
  icon: Icon,
  className,
  ...props
}: AuthInputProps) {
  return (
    <motion.div variants={authFadeUp} className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-200"
      >
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-500" />
        <input
          id={id}
          className="h-11 w-full rounded-xl border border-slate-200/80 bg-white/75 py-2.5 pl-10 pr-4 text-sm font-semibold text-slate-900 shadow-sm outline-none backdrop-blur-md transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-400/15 dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-300/60 dark:focus:bg-white/[0.09]"
          {...props}
        />
      </div>
    </motion.div>
  );
}

export function AuthSubmitButton({
  children,
  disabled,
}: {
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <motion.div variants={authFadeUp}>
      <Button
        type="submit"
        disabled={disabled}
        className="h-11 w-full rounded-xl bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 text-sm text-white shadow-xl shadow-sky-500/25 transition hover:scale-[1.01] hover:shadow-sky-500/35 active:scale-[0.99]"
      >
        {children}
        <ArrowRight className="h-5 w-5" />
      </Button>
    </motion.div>
  );
}

export function SecurityNote() {
  return (
    <motion.div
      variants={authFadeUp}
      className="flex items-center gap-3 rounded-xl border border-emerald-200/70 bg-emerald-50/75 p-3 text-xs font-semibold text-emerald-800 backdrop-blur-md dark:border-emerald-300/15 dark:bg-emerald-400/10 dark:text-emerald-200"
    >
      <ShieldCheck className="h-5 w-5 shrink-0" />
      Your access is protected for appointments, records, and online care.
    </motion.div>
  );
}
