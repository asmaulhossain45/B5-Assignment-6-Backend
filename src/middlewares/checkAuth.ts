import AppError from "../utils/appError";
import { JwtPayload } from "../interfaces";
import { UserRole } from "../constants/enums";
import { verifyAccessToken } from "../utils/jwt";
import HTTP_STATUS from "../constants/httpStatus";
import { NextFunction, Request, Response } from "express";
import getAccount from "../shared/getAccount";

const checkAuth =
  (...allowedRoles: UserRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.accessToken;

      if (!token) {
        throw new AppError(
          HTTP_STATUS.UNAUTHORIZED,
          "Please logged in and try again."
        );
      }

      const decoded = verifyAccessToken(token);

      if (!decoded) {
        throw new AppError(
          HTTP_STATUS.UNAUTHORIZED,
          "Invalid access token. Please logged in and try again."
        );
      }
      const { id, role } = decoded as JwtPayload;

      await getAccount({ userId: id });

      if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        throw new AppError(
          HTTP_STATUS.UNAUTHORIZED,
          "You do not have permission"
        );
      }

      req.user = decoded as JwtPayload;

      next();
    } catch (error) {
      next(error);
    }
  };

export default checkAuth;
