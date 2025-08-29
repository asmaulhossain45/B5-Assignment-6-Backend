import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { ZodLimitSchema } from "./limit.validation";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "../../constants/enums";
import { limitController } from "./limit.controller";

const router = Router();

router.post(
  "/",
  validateRequest(ZodLimitSchema.create),
  checkAuth(UserRole.SUPER_ADMIN),
  limitController.createLimit
);

router.get("/", limitController.getAllLimits);

router.get("/:type/:role", limitController.getSingleLimit);

router.patch("/toggle-status/:type/:role", limitController.toggleLimitStatus);

router.patch(
  "/:type/:role",
  validateRequest(ZodLimitSchema.update),
  checkAuth(UserRole.SUPER_ADMIN),
  limitController.updateLimit
);

router.delete(
  "/:type/:role",
  checkAuth(UserRole.SUPER_ADMIN),
  limitController.deleteLimit
);

export const limitRoutes = router;
