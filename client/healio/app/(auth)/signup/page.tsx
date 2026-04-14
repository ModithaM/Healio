"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useCallback } from "react";
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
import { registerSchema } from "@/validation/registerValidation";
import { ValidationError } from "yup";

type FormErrors = {
  [key: string]: string;
};

type TouchedFields = {
  [key: string]: boolean;
};

const Page = () => {
  const router = useRouter();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touchedFields, setTouchedFields] = useState<TouchedFields>({});
  const [userData, setUserData] = useState<UserData>({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "USER",
  });

  const validateField = useCallback(
    async (fieldName: string, value: string | boolean) => {
      try {
        const testValue = {
          ...userData,
          confirmPassword,
          termsAccepted,
          [fieldName]: value,
        };
        await registerSchema.validateAt(fieldName, testValue);
        setFormErrors((prev) => {
          const next = { ...prev };
          delete next[fieldName];
          return next;
        });
      } catch (error) {
        if (error instanceof ValidationError) {
          setFormErrors((prev) => ({
            ...prev,
            [fieldName]: error.message,
          }));
        }
      }
    },
    [userData, confirmPassword, termsAccepted]
  );

  const handleInputChange = (field: string, value: string) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (touchedFields[field]) {
      validateField(field, value);
    }
  };

  const handleFieldBlur = async (fieldName: string) => {
    setTouchedFields((prev) => ({
      ...prev,
      [fieldName]: true,
    }));

    if (fieldName === "confirmPassword") {
      await validateField("confirmPassword", confirmPassword);
    } else if (fieldName === "password") {
      await validateField("password", userData.password);
      if (confirmPassword) {
        await validateField("confirmPassword", confirmPassword);
      }
    } else {
      await validateField(
        fieldName,
        fieldName === "email" ? userData.email : userData[fieldName as keyof UserData]
      );
    }
  };

  const handlePasswordConfirmChange = (value: string) => {
    setConfirmPassword(value);

    if (touchedFields.confirmPassword) {
      validateField("confirmPassword", value);
    }
  };

  const handlePasswordConfirmBlur = async () => {
    setTouchedFields((prev) => ({
      ...prev,
      confirmPassword: true,
    }));
    await validateField("confirmPassword", confirmPassword);
  };

  const handleTermsChange = async (checked: boolean) => {
    setTermsAccepted(checked);
    setTouchedFields((prev) => ({
      ...prev,
      termsAccepted: true,
    }));

    try {
      await registerSchema.validateAt("termsAccepted", {
        ...userData,
        confirmPassword,
        termsAccepted: checked,
      });
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next.termsAccepted;
        return next;
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        setFormErrors((prev) => ({
          ...prev,
          termsAccepted: error.message,
        }));
      }
    }
  };

  const handleSubmission = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const validationData = {
        ...userData,
        confirmPassword,
        termsAccepted,
      };

      await registerSchema.validate(validationData, { abortEarly: false });

      const response = await registerUser(userData);
      if (response.success) {
        ToastUtils.success("Registration successful! Please sign in.");
        await router.push("/signin");
      } else if (response.error) {
        setErrorMessage(response.error);
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        const errors: FormErrors = {};
        error.inner.forEach((err) => {
          if (err.path) {
            errors[err.path] = err.message;
          }
        });
        setFormErrors(errors);
      } else {
        console.error("Error registering user:", error);
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
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
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            onBlur={() => handleFieldBlur("firstName")}
            placeholder="Nadia"
            autoComplete="given-name"
            error={formErrors.firstName}
            touched={touchedFields.firstName}
          />
          <AuthInput
            id="lastName"
            name="lastName"
            label="Last name"
            icon={UserRound}
            type="text"
            value={userData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            onBlur={() => handleFieldBlur("lastName")}
            placeholder="Perera"
            autoComplete="family-name"
            error={formErrors.lastName}
            touched={touchedFields.lastName}
          />
        </div>

        <AuthInput
          id="username"
          name="username"
          label="Username"
          icon={UserRound}
          type="text"
          value={userData.username}
          onChange={(e) => handleInputChange("username", e.target.value)}
          onBlur={() => handleFieldBlur("username")}
          placeholder="nadia.perera"
          autoComplete="username"
          error={formErrors.username}
          touched={touchedFields.username}
        />

        <AuthInput
          id="email"
          name="email"
          label="Email"
          icon={Mail}
          type="email"
          value={userData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          onBlur={() => handleFieldBlur("email")}
          placeholder="name@healio.health"
          autoComplete="email"
          error={formErrors.email}
          touched={touchedFields.email}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <AuthInput
            id="password"
            name="password"
            label="Password"
            icon={LockKeyhole}
            type="password"
            value={userData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            onBlur={() => handleFieldBlur("password")}
            placeholder="Create password"
            autoComplete="new-password"
            error={formErrors.password}
            touched={touchedFields.password}
          />
          <AuthInput
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm password"
            icon={LockKeyhole}
            type="password"
            value={confirmPassword}
            onChange={(e) => handlePasswordConfirmChange(e.target.value)}
            onBlur={handlePasswordConfirmBlur}
            placeholder="Repeat password"
            autoComplete="new-password"
            error={formErrors.confirmPassword}
            touched={touchedFields.confirmPassword}
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
              onChange={(e) => handleInputChange("role", e.target.value)}
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
            checked={termsAccepted}
            onChange={(e) => handleTermsChange(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-400"
          />
          I agree to the Terms & Conditions and secure healthcare access.
        </motion.label>

        {formErrors.termsAccepted && touchedFields.termsAccepted && (
          <motion.p
            variants={authFadeUp}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-2 text-xs font-semibold text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200"
          >
            {formErrors.termsAccepted}
          </motion.p>
        )}

        {errorMessage && (
          <motion.p
            variants={authFadeUp}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-2 text-xs font-semibold text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200"
          >
            {errorMessage}
          </motion.p>
        )}

        <AuthSubmitButton disabled={isSubmitting || Object.keys(formErrors).length > 0}>
          {isSubmitting ? "Creating Account..." : "Sign Up"}
        </AuthSubmitButton>
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
