import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { agentRoutes } from "../modules/agent/agent.route";
import { adminRoutes } from "../modules/admin/admin.route";
import { commissionRoutes } from "../modules/commission/commission.route";
import { limitRoutes } from "../modules/limit/limit.route";
import { transactionRoutes } from "../modules/transaction/transaction.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/agents", agentRoutes);
router.use("/admins", adminRoutes);
router.use("/limits", limitRoutes)
router.use("/commissions", commissionRoutes)
router.use("/transactions", transactionRoutes);

export default router;
