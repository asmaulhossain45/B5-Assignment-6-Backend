import z from "zod";

const register = z.object({
  name: z.string("Name is required").min(3, "Name must be at least 3 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const login = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const changePassword = z.object({
  oldPassword: z.string().min(8, "Password must be at least 8 characters"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

const sendResetOtp = z.object({
  email: z.email("Invalid email address"),
});

const verifyResetOtp = z.object({
  email: z.email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

const resetPassword = z.object({
  email: z.email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

const verifyAccount = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const ZodAuthSchema = {
  login,
  register,
  changePassword,
  sendResetOtp,
  verifyResetOtp,
  resetPassword,
  verifyAccount,
};
