import { Router } from "express";
import { transactionController } from "./transaction.controller";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "../../constants/enums";

const router = Router();

router.post(
  "/user/deposit",
  checkAuth(UserRole.USER),
  transactionController.userDeposit
);

router.post(
  "/user/withdraw",
  checkAuth(UserRole.USER),
  transactionController.userWithdraw
);

router.post(
  "/user/send-money",
  checkAuth(UserRole.USER),
  transactionController.userSendMoney
);

router.post(
  "/agent/add-money",
  checkAuth(UserRole.AGENT),
  transactionController.agentAddMoney
);

router.post(
  "/agent/withdraw",
  checkAuth(UserRole.AGENT),
  transactionController.agentWithdraw
);

export const transactionRoutes = router;
