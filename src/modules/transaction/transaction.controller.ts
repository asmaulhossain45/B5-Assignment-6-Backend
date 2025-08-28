import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { transactionService } from "./transaction.service";
import sendResponse from "../../utils/sendResponse";
import { JwtPayload } from "../../interfaces";

const userDeposit = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const payload = req.body;
  const result = await transactionService.userDeposit(
    user as JwtPayload,
    payload
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Deposit successful",
    data: result,
  });
});

const userWithdraw = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const payload = req.body;
  const result = await transactionService.userWithdraw(
    user as JwtPayload,
    payload
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Withdraw successful",
    data: result,
  });
});

const userSendMoney = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const payload = req.body;
  const result = await transactionService.userSendMoney(
    user as JwtPayload,
    payload
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Money sent successfully",
    data: result,
  });
});

const agentAddMoney = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const payload = req.body;
  const result = await transactionService.agentAddMoney(
    user as JwtPayload,
    payload
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Money added successfully",
    data: result,
  });
});

const agentWithdraw = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const payload = req.body;
  const result = await transactionService.agentWithdraw(
    user as JwtPayload,
    payload
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Money withdraw successfully",
    data: result,
  });
});

export const transactionController = {
  userDeposit,
  userWithdraw,
  userSendMoney,
  agentAddMoney,
  agentWithdraw,
};
