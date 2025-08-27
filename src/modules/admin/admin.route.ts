import { Router } from "express";
import { adminController } from "./admin.controller";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "../../constants/enums";
import validateRequest from "../../middlewares/validateRequest";
import { ZodAdminSchema } from "./admin.validation";

const router = Router();

// Logged in Admin Prfile
router.get(
  "/me",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminController.getAdminProfile
);

router.patch(
  "/me",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminController.updateAdminProfile
);

// Admin, Agent, User, wallet, transaction List
router.get(
  "/users",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminController.getAllUsers
);

router.get(
  "/agents",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminController.getAllAgents
);

router.get("/", checkAuth(UserRole.SUPER_ADMIN), adminController.getAllAdmins);

router.get(
  "/wallets",
  checkAuth(UserRole.SUPER_ADMIN),
  adminController.getAllWallets
);

router.get(
  "/transactions",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminController.getAllTransactions
);

// Status Update
router.patch(
  "/users/:userId/status",
  validateRequest(ZodAdminSchema.updateUserStatus),
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminController.updateUserStatus
);

// Wallets
router.patch(
  "/wallets/:walletId/status",
  validateRequest(ZodAdminSchema.updateWalletStatus),
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminController.updateWalletStatus
);

router.patch(
  "/agents/:agentId/approval",
  validateRequest(ZodAdminSchema.updateAgentApprovalStatus),
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminController.updateAgentApprovalStatus
);

export const adminRoutes = router;
