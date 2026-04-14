import * as yup from "yup";

export const doctorProfileCreateSchema = yup.object().shape({
  specialization: yup
    .string()
    .min(2, "Specialization must be at least 2 characters")
    .max(100, "Specialization must not exceed 100 characters")
    .required("Specialization is required"),
  licenseNumber: yup
    .string()
    .min(3, "License number must be at least 3 characters")
    .max(50, "License number must not exceed 50 characters")
    .required("License number is required"),
  qualifications: yup
    .string()
    .max(500, "Qualifications must not exceed 500 characters")
    .optional(),
  experienceYears: yup
    .number()
    .typeError("Experience years must be a number")
    .min(0, "Experience years cannot be negative")
    .integer("Experience years must be a whole number")
    .required("Experience years is required"),
  consultationFee: yup
    .number()
    .typeError("Consultation fee must be a number")
    .min(0.01, "Consultation fee must be greater than 0")
    .required("Consultation fee is required"),
});

export const doctorProfileUpdateSchema = yup.object().shape({
  specialization: yup
    .string()
    .min(2, "Specialization must be at least 2 characters")
    .max(100, "Specialization must not exceed 100 characters")
    .optional(),
  qualifications: yup
    .string()
    .max(500, "Qualifications must not exceed 500 characters")
    .optional(),
  experienceYears: yup
    .number()
    .typeError("Experience years must be a number")
    .min(0, "Experience years cannot be negative")
    .integer("Experience years must be a whole number")
    .optional(),
  consultationFee: yup
    .number()
    .typeError("Consultation fee must be a number")
    .min(0.01, "Consultation fee must be greater than 0")
    .optional(),
});

export const doctorAvailabilitySchema = yup.object().shape({
  dayOfWeek: yup
    .string()
    .oneOf(
      ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"],
      "Please select a valid day"
    )
    .required("Day of week is required"),
  startTime: yup
    .string()
    .required("Start time is required")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter a valid time"),
  endTime: yup
    .string()
    .required("End time is required")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter a valid time")
    .test("is-after-start", "End time must be after start time", function (value) {
      const { startTime } = this.parent;
      if (!startTime || !value) return true;
      return value > startTime;
    }),
  isActive: yup.boolean().optional(),
});

export type DoctorProfileCreateFormData = yup.InferType<typeof doctorProfileCreateSchema>;
export type DoctorProfileUpdateFormData = yup.InferType<typeof doctorProfileUpdateSchema>;
export type DoctorAvailabilityFormData = yup.InferType<typeof doctorAvailabilitySchema>;
