import { Request, Response } from "express";
import AppError from "../../utils/appError";
import { authService } from "./auth.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { setCookies } from "../../utils/setCookies";
import HTTP_STATUS from "../../constants/httpStatus";
import { JwtPayload } from "../../interfaces";

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);

  setCookies({
    res,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: `Logged in successfully`,
    data: result.account,
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: `Logged out successfully`,
    data: null,
  });
});

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Account created successfully",
    data: result,
  });
});

const registerAgent = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.registerAgent(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Account created successfully",
    data: result,
  });
});

const registerAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.registerAdmin(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Admin created successfully",
    data: result,
  });
});

const setAccessToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Logged in and try again.");
  }

  const accessToken = await authService.setAccessToken(refreshToken);

  setCookies({ res, accessToken });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Access token updated successfully",
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const { oldPassword, newPassword } = req.body;
  const result = await authService.changePassword(
    user,
    oldPassword,
    newPassword
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Password changed successfully",
    data: result,
  });
});

const sendResetOtp = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await authService.sendResetOtp(email);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Reset password OTP sent successfully",
    data: result,
  });
});

const verifyResetOtp = catchAsync(async (req: Request, res: Response) => {
  const { otp, email } = req.body;
  const result = await authService.verifyResetOtp(email, otp);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Reset OTP verified successfully",
    data: result,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { otp, email, newPassword } = req.body;
  const result = await authService.resetPassword(email, otp, newPassword);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Password reset successfully",
    data: result,
  });
});

const sendVerifyOtp = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const result = await authService.sendVerifyOtp(user.email);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Verify account OTP sent successfully",
    data: result,
  });
});

const verifyAccount = catchAsync(async (req: Request, res: Response) => {
  const { otp } = req.body;
  const { email } = req.user as JwtPayload;
  const result = await authService.verifyAccount(email, otp);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Account verified successfully",
    data: result,
  });
});

export const authController = {
  login,
  logout,
  registerUser,
  registerAgent,
  registerAdmin,
  setAccessToken,
  changePassword,
  sendResetOtp,
  verifyResetOtp,
  resetPassword,
  sendVerifyOtp,
  verifyAccount,
};
