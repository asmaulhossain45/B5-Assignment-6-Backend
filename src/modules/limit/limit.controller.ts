import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { limitService } from "./limit.service";
import sendResponse from "../../utils/sendResponse";
import { TransactionType, UserRole } from "../../constants/enums";

const createLimit = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await limitService.createLimit(payload);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Limit created successfully",
    data: result,
  });
});

const getAllLimits = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await limitService.getAllLimits(
    query as Record<string, string>
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Limits retrieved successfully",
    data: result,
  });
});

const getSingleLimit = catchAsync(async (req: Request, res: Response) => {
  const params = req.params as { type: TransactionType; role: UserRole };
  const result = await limitService.getSingleLimit(params);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Limit retrieved successfully",
    data: result,
  });
});

const toggleLimitStatus = catchAsync(async (req: Request, res: Response) => {
  const params = req.params as { type: TransactionType; role: UserRole };
  const result = await limitService.toggleLimitStatus(params);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Limit status updated successfully",
    data: result,
  });
});

const updateLimit = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const params = req.params as { type: TransactionType; role: UserRole };
  const result = await limitService.updateLimit(params, payload);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Limit updated successfully",
    data: result,
  });
});

const deleteLimit = catchAsync(async (req: Request, res: Response) => {
  const params = req.params as { type: TransactionType; role: UserRole };
  const result = await limitService.deleteLimit(params);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Limit deleted successfully",
    data: result,
  });
});

export const limitController = {
  createLimit,
  getAllLimits,
  getSingleLimit,
  toggleLimitStatus,
  updateLimit,
  deleteLimit,
};
