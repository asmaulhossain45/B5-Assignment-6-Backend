import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { agentRoutes } from "../modules/agent/agent.route";
import { adminRoutes } from "../modules/admin/admin.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admins", adminRoutes);
router.use("/users", userRoutes);
router.use("/agents", agentRoutes);

export default router;
