/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose, { Types } from "mongoose";
import { User } from "../user/user.model";
import AppError from "../../utils/appError";
import { Admin } from "../admin/admin.model";
import { Agent } from "../agent/agent.model";
import { IUser } from "../user/user.interface";
import { Wallet } from "../wallet/wallet.model";
import { IAgent } from "../agent/agent.interface";
import { IAdmin } from "../admin/admin.interface";
import isEmailTaken from "../../utils/isEmailTaken";
import HTTP_STATUS from "../../constants/httpStatus";
import { WalletType } from "../../constants/enums";
import { JwtPayload } from "../../interfaces";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import { comparePassword } from "../../utils/bcrypt";
import getAccount from "../../shared/getAccount";
import { generateOtp, hashOtp, verifyOtp } from "../../utils/otp";
import sendMail from "../../utils/sendMail";
import { otpEmailTemplate } from "../../utils/emailTemplate";

const login = async (payload: Partial<IUser>) => {
  const account = await getAccount({
    email: payload.email as string,
    message: "Invalid credentials.",
  });

  const isPasswordMatch = await comparePassword(
    payload.password as string,
    account.password as string
  );

  if (!isPasswordMatch) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Invalid credentials.");
  }

  const JwtPayload = {
    id: account._id as Types.ObjectId,
    email: account.email,
    role: account.role,
  };

  const accessToken = generateAccessToken(JwtPayload);
  const refreshToken = generateRefreshToken(JwtPayload);

  return { account, accessToken, refreshToken };
};

const registerUser = async (payload: IUser) => {
  await isEmailTaken(payload.email);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [createdUser] = await User.create([payload], { session });
    const [createdWallet] = await Wallet.create(
      [
        {
          owner: createdUser._id,
          type: WalletType.PERSONAL,
        },
      ],
      { session }
    );

    createdUser.wallet = createdWallet._id;
    await createdUser.save({ session });

    await session.commitTransaction();
    await session.endSession();

    return createdUser;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Failed to create account");
  }
};

const registerAgent = async (payload: IAgent) => {
  await isEmailTaken(payload.email);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [createdAgent] = await Agent.create([payload], { session });
    const [createdWallet] = await Wallet.create(
      [
        {
          owner: createdAgent._id,
          type: WalletType.AGENT,
        },
      ],
      { session }
    );

    createdAgent.wallet = createdWallet._id;
    await createdAgent.save({ session });

    await session.commitTransaction();
    await session.endSession();

    return createdAgent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Failed to create account");
  }
};

const registerAdmin = async (payload: IAdmin) => {
  await isEmailTaken(payload.email);

  const createdAdmin = await Admin.create(payload);

  if (!createdAdmin) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Failed to create account");
  }

  return createdAdmin;
};

const setAccessToken = async (refreshToken: string) => {
  const decoded = verifyRefreshToken(refreshToken);

  if (!decoded) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Invalid refresh token.");
  }

  const { id, email, role } = decoded as JwtPayload;

  await getAccount({ userId: id });

  const accessToken = generateAccessToken({ id, email, role });

  return accessToken;
};

const changePassword = async (
  user: JwtPayload,
  oldPassword: string,
  newPassword: string
) => {
  const account = await getAccount({ userId: user.id });

  const isPasswordMatch = await comparePassword(
    oldPassword,
    account.password as string
  );

  if (!isPasswordMatch) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Invalid credentials.");
  }

  account.password = newPassword;
  const updatedAccount = await account.save();

  if (!updatedAccount) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Failed to change password.");
  }

  return updatedAccount;
};

const sendResetOtp = async (email: string) => {
  const account = await getAccount({ email });

  const otp = generateOtp();
  const hashedOtp = await hashOtp(otp);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  try {
    account.resetOtp = hashedOtp;
    account.resetOtpExpiryAt = expiresAt;
    const updatedAccount = await account.save();

    if (!updatedAccount) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, "Failed to send otp.");
    }

    await sendMail({
      to: account.email,
      subject: "Reset Password OTP",
      html: otpEmailTemplate({
        name: account.name,
        otp,
        action: "Reset Password",
      }),
    });

    return null;
  } catch (error) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Failed to send otp.");
  }
};

const verifyResetOtp = async (email: string, otp: string) => {
  const account = await getAccount({ email });

  if (!account.resetOtp || !account.resetOtpExpiryAt) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      "No OTP found. Please request a new one."
    );
  }

  if (account.resetOtpExpiryAt < new Date()) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      "OTP has expired. Please request a new one."
    );
  }

  const isMatch = await verifyOtp(otp, account.resetOtp);

  if (!isMatch) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Invalid OTP.");
  }

  return null;
};

const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  const account = await getAccount({ email });

  if (!account.resetOtp || !account.resetOtpExpiryAt) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      "No OTP found. Please request a new one."
    );
  }

  if (account.resetOtpExpiryAt < new Date()) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      "OTP has expired. Please request a new one."
    );
  }

  const isMatch = await verifyOtp(otp, account.resetOtp);

  if (!isMatch) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Invalid OTP.");
  }

  account.password = newPassword;
  account.resetOtp = undefined;
  account.resetOtpExpiryAt = undefined;
  const updatedAccount = await account.save();

  if (!updatedAccount) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Failed to reset password.");
  }

  return null;
};

const sendVerifyOtp = async (email: string) => {
  const account = await getAccount({ email });

  if (account.isVerified) {
    throw new AppError(HTTP_STATUS.CONFLICT, "Account is already verified.");
  }

  const otp = generateOtp();
  const hashedOtp = await hashOtp(otp);
  const expiryAt = new Date(Date.now() + 10 * 60 * 1000);

  account.verifyOtp = hashedOtp;
  account.verifyOtpExpiryAt = expiryAt;

  const updatedAccount = await account.save();

  if (!updatedAccount) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      "Failed to send verification code."
    );
  }

  await sendMail({
    to: account.email,
    subject: "Verify account OTP",
    html: otpEmailTemplate({
      name: account.name,
      otp,
      action: "Verify Account",
    }),
  });

  return null;
};

const verifyAccount = async (email: string, otp: string) => {
  const account = await getAccount({ email });

  if (!account.verifyOtp || !account.verifyOtpExpiryAt) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      "No OTP found. Please request a new one."
    );
  }

  if (account.verifyOtpExpiryAt < new Date()) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      "OTP has expired. Please request a new one."
    );
  }

  const isMatch = await verifyOtp(otp, account.verifyOtp);

  if (!isMatch) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Invalid OTP.");
  }

  account.isVerified = true;
  account.verifyOtp = undefined;
  account.verifyOtpExpiryAt = undefined;

  const updatedAccount = await account.save();

  if (!updatedAccount) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Failed to verify account.");
  }

  return null;
};

export const authService = {
  login,
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
