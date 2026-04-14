import * as yup from 'yup';

export const registerSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .trim(),
  lastName: yup
    .string()
    .required('Last name is required')
    .trim(),
  username: yup
    .string()
    .required('Username is required')
    .min(6, 'Username must be at least 6 characters')
    .trim(),
  email: yup
    .string()
    .required('Email is required')
    .email('Email should be valid'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)/,
      'Password must contain at least one letter and one number'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  termsAccepted: yup
    .boolean()
    .oneOf([true], 'You must accept the Terms & Conditions'),
  role: yup
    .string()
    .required('Role is required'),
});

export type RegisterFormData = yup.InferType<typeof registerSchema>;
