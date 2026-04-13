import * as yup from "yup";

export const patientProfileValidationSchema = yup.object().shape({
  userId: yup.string().uuid("Invalid user ID").required("User ID is required"),
  gender: yup
    .string()
    .oneOf(["MALE", "FEMALE", "OTHER"], "Please select a valid gender")
    .required("Gender is required"),
  bloodGroup: yup
    .string()
    .oneOf(
      [
        "O_POSITIVE",
        "O_NEGATIVE",
        "A_POSITIVE",
        "A_NEGATIVE",
        "B_POSITIVE",
        "B_NEGATIVE",
        "AB_POSITIVE",
        "AB_NEGATIVE",
      ],
      "Please select a valid blood group"
    )
    .required("Blood group is required"),
  dateOfBirth: yup
    .string()
    .required("Date of birth is required")
    .typeError("Date of birth must be a valid date")
    .test("is-valid-date", "Please enter a valid date", function (value) {
      if (!value) return false;
      const date = new Date(value);
      return date instanceof Date && !isNaN(date.getTime());
    })
    .test("is-past-date", "Date of birth must be in the past", function (value) {
      if (!value) return false;
      const date = new Date(value);
      return date < new Date();
    })
    .test("is-not-too-young", "Patient must be at least 1 year old", function (value) {
      if (!value) return false;
      const date = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      return age >= 1;
    }),
  emergencyContactName: yup
    .string()
    .min(2, "Emergency contact name must be at least 2 characters")
    .max(100, "Emergency contact name must not exceed 100 characters")
    .required("Emergency contact name is required")
    .trim()
    .matches(/^[a-zA-Z\s]+$/, "Emergency contact name can only contain letters and spaces"),
  emergencyContactPhone: yup
    .string()
    .required("Emergency contact phone is required")
    .matches(
      /^(\+?94)?([0-9]{9,10}|[0-9]{3}[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})$/,
      "Please enter a valid phone number"
    ),
});

export type PatientProfileFormData = yup.InferType<typeof patientProfileValidationSchema>;
