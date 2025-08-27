import { Router } from "express";
import { authController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ZodAuthSchema } from "./auth.validation";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "../../constants/enums";

const router = Router();

router.post(
  "/login",
  validateRequest(ZodAuthSchema.login),
  authController.login
);

router.post("/logout", authController.logout);

router.post(
  "/register/user",
  validateRequest(ZodAuthSchema.register),
  authController.registerUser
);

router.post(
  "/register/agent",
  validateRequest(ZodAuthSchema.register),
  authController.registerAgent
);

router.post(
  "/register/admin",
  validateRequest(ZodAuthSchema.register),
  checkAuth(UserRole.SUPER_ADMIN),
  authController.registerAdmin
);

router.post("/refresh-token", authController.setAccessToken);

router.post(
  "/change-password",
  validateRequest(ZodAuthSchema.changePassword),
  checkAuth(...Object.values(UserRole)),
  authController.changePassword
);

router.post(
  "/send-reset-otp",
  validateRequest(ZodAuthSchema.sendResetOtp),
  authController.sendResetOtp
);

router.post(
  "/verify-reset-otp",
  validateRequest(ZodAuthSchema.verifyResetOtp),
  authController.verifyResetOtp
);

router.post(
  "/reset-password",
  validateRequest(ZodAuthSchema.resetPassword),
  authController.resetPassword
);

router.post(
  "/send-verify-otp",
  checkAuth(...Object.values(UserRole)),
  authController.sendVerifyOtp
);

router.post(
  "/verify-account",
  validateRequest(ZodAuthSchema.verifyAccount),
  checkAuth(...Object.values(UserRole)),
  authController.verifyAccount
);

export const authRoutes = router;
