import { NextFunction, Request, Response } from "express";
import { UserStatus } from "../constants/enums";
import { JwtPayload } from "../interfaces";
import getAccount from "../shared/getAccount";
import AppError from "../utils/appError";
import HTTP_STATUS from "../constants/httpStatus";

const checkStatus = (allowedStatus: UserStatus[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as JwtPayload;

      if (!user) {
        throw new AppError(HTTP_STATUS.UNAUTHORIZED, "User not Authenticated");
      }

      const account = await getAccount({ userId: user.id });

      if (!allowedStatus.includes(account.status)) {
        throw new AppError(
          HTTP_STATUS.FORBIDDEN,
          `Your account is ${account.status}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default checkStatus;
