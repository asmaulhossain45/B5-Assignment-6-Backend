import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { JwtPayload } from "../../interfaces";
import HTTP_STATUS from "../../constants/httpStatus";
import sendResponse from "../../utils/sendResponse";
import { agentService } from "./agent.service";
import { IAgent } from "./agent.interface";

const getAgentProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await agentService.getAgentProfile(req.user as JwtPayload);

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Agent profile retrieved successfully",
    data: result,
  });
});

const getAgentWallet = catchAsync(async (req: Request, res: Response) => {
  const result = await agentService.getAgentWallet(req.user as JwtPayload);

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Agent wallet retrieved successfully",
    data: result,
  });
});

const getAgentTransactions = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await agentService.getAgentTransactions(
    req.user as JwtPayload,
    query as Record<string, string>
  );

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Agent Transactions retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getCommisionHistory = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const query = req.query as Record<string, string>;

  const result = await agentService.getCommisionHistory(user, query);

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Commision history retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const updateAgentProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const body = req.body as Partial<IAgent>;

  const result = await agentService.updateAgentProfile(user, body);

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Agent profile updated successfully",
    data: result,
  });
});

export const agentController = {
  getAgentProfile,
  getAgentWallet,
  getAgentTransactions,
  getCommisionHistory,
  updateAgentProfile,
};
