import { Router } from "express";
import { UserRole, UserStatus } from "../../constants/enums";
import checkAuth from "../../middlewares/checkAuth";
import { agentController } from "./agent.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ZodTransactionSchema } from "../transaction/transaction.validation";
import { ZodAgentSchema } from "./agent.validation";
import checkStatus from "../../middlewares/checkStatus";

const router = Router();

router.get(
  "/me",
  checkAuth(UserRole.AGENT),
  agentController.getAgentProfile
);

router.get(
  "/wallet",
  checkAuth(UserRole.AGENT),
  agentController.getAgentWallet
);

router.get(
  "/transactions",
  checkAuth(UserRole.AGENT),
  agentController.getAgentTransactions
);

router.get(
  "/commission",
  checkAuth(UserRole.AGENT),
  agentController.getCommisionHistory
);

router.patch(
  "/me",
  validateRequest(ZodAgentSchema.update),
  checkAuth(UserRole.AGENT),
  agentController.updateAgentProfile
);

router.post(
  "/cash-in",
  validateRequest(ZodTransactionSchema.cashIn),
  checkStatus([UserStatus.ACTIVE]),
  checkAuth(UserRole.AGENT),
  agentController.cashIn
);

router.post(
  "/cash-out",
  validateRequest(ZodTransactionSchema.cashOut),
  checkStatus([UserStatus.ACTIVE]),
  checkAuth(UserRole.AGENT),
  agentController.cashOut
);

export const agentRoutes = router;
