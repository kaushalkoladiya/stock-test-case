import * as yup from "yup";

/**
 * USER MODEL Validation Rules
 */

const email = yup
  .string()
  .required("Email is required.")
  .email("This is invalid email.");

const password = yup
  .string()
  .required("Password is required.")
  .min(8, "Password should have atleast 8 characters.")

  .matches(
    /^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,15}$/,
    "Password should contain at least one uppercase, one number, and one special character!"
  );

// User email and password Validation Schema
export const UserAuthRules = yup.object().shape({
  email,
  password,
});
