import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import HTTP_STATUS from "../../constants/httpStatus";
import { commissionService } from "./commission.service";
import { TransactionType } from "../../constants/enums";

const createCommission = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await commissionService.createCommission(payload);

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Commission created successfully",
    data: result,
  });
});

const getAllCommissions = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await commissionService.getAllCommissions(query as Record<string, string>);

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Commissions retrieved successfully",
    data: result,
  });
});

const getSingleCommission = catchAsync(async (req: Request, res: Response) => {
  const { type } = req.params;
  const result = await commissionService.getSingleCommission(
    type as TransactionType
  );

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Commission retrieved successfully",
    data: result,
  });
});

const toggleCommissionStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { type } = req.params;
    const result = await commissionService.toggleCommissionStatus(type as TransactionType);

    sendResponse(res, {
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: "Commission status updated successfully",
      data: result,
    });
  }
);

const updateCommission = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const { type } = req.params;
  const result = await commissionService.updateCommission(type as TransactionType, payload);

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Commission updated successfully",
    data: result,
  });
});

const deleteCommission = catchAsync(async (req: Request, res: Response) => {
  const { type } = req.params;
  const result = await commissionService.deleteCommission(type as TransactionType);

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Commission deleted successfully",
    data: result,
  });
});

export const commissionController = {
  createCommission,
  getAllCommissions,
  getSingleCommission,
  toggleCommissionStatus,
  updateCommission,
  deleteCommission,
};
