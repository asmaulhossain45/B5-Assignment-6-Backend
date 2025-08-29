import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import checkStatus from "../../middlewares/checkStatus";
import { UserRole, UserStatus } from "../../constants/enums";
import validateRequest from "../../middlewares/validateRequest";
import { ZodTransactionSchema } from "./transaction.validation";
import { transactionController } from "./transaction.controller";

const router = Router();

router.post(
  "/user/deposit",
  validateRequest(ZodTransactionSchema.transaction),
  checkAuth(UserRole.USER),
  checkStatus([UserStatus.ACTIVE]),
  transactionController.userDeposit
);

router.post(
  "/user/withdraw",
  validateRequest(ZodTransactionSchema.transaction),
  checkAuth(UserRole.USER),
  checkStatus([UserStatus.ACTIVE]),
  transactionController.userWithdraw
);

router.post(
  "/user/send-money",
  validateRequest(ZodTransactionSchema.transaction),
  checkAuth(UserRole.USER),
  checkStatus([UserStatus.ACTIVE]),
  transactionController.userSendMoney
);

router.post(
  "/agent/add-money",
  validateRequest(ZodTransactionSchema.transaction),
  checkAuth(UserRole.AGENT),
  checkStatus([UserStatus.ACTIVE]),
  transactionController.agentAddMoney
);

router.post(
  "/agent/withdraw",
  validateRequest(ZodTransactionSchema.transaction),
  checkAuth(UserRole.AGENT),
  checkStatus([UserStatus.ACTIVE]),
  transactionController.agentWithdraw
);

export const transactionRoutes = router;
