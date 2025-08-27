import { Router } from "express";
import { UserRole, UserStatus } from "../../constants/enums";
import { ZodUserSchema } from "./user.validation";
import { userController } from "./user.controller";
import checkAuth from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { ZodTransactionSchema } from "../transaction/transaction.validation";
import checkStatus from "../../middlewares/checkStatus";

const router = Router();

router.get(
  "/me",
  checkAuth(UserRole.USER),
  checkStatus([UserStatus.ACTIVE, UserStatus.INACTIVE]),
  userController.getUserProfile
);

router.get(
  "/wallet",
  checkAuth(UserRole.USER),
  userController.getUserWallet
);

router.get(
  "/transactions",
  checkAuth(UserRole.USER),
  userController.getTransactions
);

router.post(
  "/add-money",
  validateRequest(ZodTransactionSchema.addMoney),
  checkAuth(UserRole.USER),
  checkStatus([UserStatus.ACTIVE]),
  userController.addMoney
);

router.post(
  "/withdraw",
  validateRequest(ZodTransactionSchema.withdraw),
  checkAuth(UserRole.USER),
  checkStatus([UserStatus.ACTIVE]),
  userController.withdraw
);

router.post(
  "/send-money",
  validateRequest(ZodTransactionSchema.sendMoney),
  checkAuth(UserRole.USER),
  checkStatus([UserStatus.ACTIVE]),
  userController.sendMoney
);

router.patch(
  "/me",
  validateRequest(ZodUserSchema.update),
  checkAuth(UserRole.USER),
  userController.updateProfile
);

export const userRoutes = router;
