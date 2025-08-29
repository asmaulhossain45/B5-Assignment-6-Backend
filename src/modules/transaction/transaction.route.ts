import { Router } from "express";
import { UserRole } from "../../constants/enums";
import checkAuth from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { ZodTransactionSchema } from "./transaction.validation";
import { transactionController } from "./transaction.controller";

const router = Router();

router.post(
  "/user/deposit",
  checkAuth(UserRole.USER),
  validateRequest(ZodTransactionSchema.transaction),
  transactionController.userDeposit
);

router.post(
  "/user/withdraw",
  checkAuth(UserRole.USER),
  validateRequest(ZodTransactionSchema.transaction),
  transactionController.userWithdraw
);

router.post(
  "/user/send-money",
  checkAuth(UserRole.USER),
  validateRequest(ZodTransactionSchema.transaction),
  transactionController.userSendMoney
);

router.post(
  "/agent/add-money",
  checkAuth(UserRole.AGENT),
  validateRequest(ZodTransactionSchema.transaction),
  transactionController.agentAddMoney
);

router.post(
  "/agent/withdraw",
  checkAuth(UserRole.AGENT),
  validateRequest(ZodTransactionSchema.transaction),
  transactionController.agentWithdraw
);

export const transactionRoutes = router;
