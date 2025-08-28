import { Router } from "express";
import { UserRole, UserStatus } from "../../constants/enums";
import { ZodUserSchema } from "./user.validation";
import { userController } from "./user.controller";
import checkAuth from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
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


router.patch(
  "/me",
  validateRequest(ZodUserSchema.update),
  checkAuth(UserRole.USER),
  userController.updateProfile
);

export const userRoutes = router;
