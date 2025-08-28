import { Router } from "express";
import { commissionController } from "./commission.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ZodCommissionSchema } from "./commission.validation";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "../../constants/enums";

const router = Router();

router.post(
  "/",
  validateRequest(ZodCommissionSchema.create),
  checkAuth(UserRole.SUPER_ADMIN),
  commissionController.createCommission
);

router.get("/", commissionController.getAllCommissions);

router.get("/:type", commissionController.getSingleCommission);

router.patch(
  "/toggle-status/:type",
  commissionController.toggleCommissionStatus
);

router.patch(
  "/:type",
  validateRequest(ZodCommissionSchema.update),
  checkAuth(UserRole.SUPER_ADMIN),
  commissionController.updateCommission
);

router.delete("/:type", commissionController.deleteCommission);

export const commissionRoutes = router;
