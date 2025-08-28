import { Request, Response } from "express";
import { userService } from "./user.service";
import { JwtPayload } from "../../interfaces";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import HTTP_STATUS from "../../constants/httpStatus";
import { IUser } from "./user.interface";

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getUserProfile(req.user as JwtPayload);

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "User retrieved successfully",
    data: user,
  });
});

const getUserWallet = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const result = await userService.getUserWallet(user);

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Your wallet retrieved successfully",
    data: result,
  });
});

const getTransactions = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const user = req.user as JwtPayload;
  const result = await userService.getTransactions(
    user,
    query as Record<string, string>
  );

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "transactions retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const body = req.body as Partial<IUser>;

  const result = await userService.updateProfile(user, body);

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "User profile updated successfully",
    data: result,
  });
});

export const userController = {
  getUserProfile,
  getUserWallet,
  getTransactions,
  updateProfile,
};
