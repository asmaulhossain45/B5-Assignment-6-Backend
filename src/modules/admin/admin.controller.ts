import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { adminService } from "./admin.service";
import { JwtPayload } from "../../interfaces";
import sendResponse from "../../utils/sendResponse";
import HTTP_STATUS from "../../constants/httpStatus";
import { IAdmin } from "./admin.interface";
import { Types } from "mongoose";

const getAdminProfile = catchAsync(async (req: Request, res: Response) => {
  const user = await adminService.getAdminProfile(req.user as JwtPayload);

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Admin retrieved successfully",
    data: user,
  });
});

const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await adminService.getAllAdmins(
    query as Record<string, string>
  );

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Admins retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getAllAgents = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await adminService.getAllAgents(
    query as Record<string, string>
  );

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Agents retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await adminService.getAllUsers(
    query as Record<string, string>
  );

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Users retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getAllWallets = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await adminService.getAllWallets(
    query as Record<string, string>
  );

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Wallet retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getAllTransactions = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await adminService.getAllTransactions(
    query as Record<string, string>
  );

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Transactions retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const updateAdminProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const body = req.body as Partial<IAdmin>;

  const result = await adminService.updateAdminProfile(user, body);

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Admin profile updated successfully",
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.params;
  const { status } = req.body;

  const result = await adminService.updateUserStatus(email, status);

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "User status updated successfully",
    data: result,
  });
});

const updateWalletStatus = catchAsync(async (req: Request, res: Response) => {
  const { walletId } = req.params;
  const { status } = req.body;

  const result = await adminService.updateWalletStatus(walletId, status);

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Wallet status updated successfully",
    data: result,
  });
});

const updateAgentApprovalStatus = catchAsync(
  async (req: Request, res: Response) => {
    const admin = req.user as JwtPayload;
    const { email } = req.params;
    const { isApproved } = req.body;

    const result = await adminService.updateAgentApprovalStatus(
      admin,
      email,
      isApproved
    );

    sendResponse(res, {
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: "Agent approval status updated successfully",
      data: result,
    });
  }
);

export const adminController = {
  getAdminProfile,
  getAllAdmins,
  getAllAgents,
  getAllUsers,
  getAllWallets,
  getAllTransactions,
  updateAdminProfile,
  updateUserStatus,
  updateWalletStatus,
  updateAgentApprovalStatus,
};
