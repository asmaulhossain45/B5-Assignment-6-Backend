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
  const account = await getAccount({ email: payload.email as string });

  if (!account) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Invalid credentials.");
  }

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
  const isTaken = await isEmailTaken(payload.email);

  if (isTaken) {
    throw new AppError(
      HTTP_STATUS.CONFLICT,
      "An account with this email already exists."
    );
  }

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
    return createdUser;
  } catch (error) {
    await session.abortTransaction();
    throw new AppError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Failed to create account"
    );
  } finally {
    await session.endSession();
  }
};

const registerAgent = async (payload: IAgent) => {
  const isTaken = await isEmailTaken(payload.email);

  if (isTaken) {
    throw new AppError(
      HTTP_STATUS.CONFLICT,
      "An account with this email already exists."
    );
  }

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
    return createdAgent;
  } catch (error) {
    await session.abortTransaction();
    throw new AppError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Failed to register account"
    );
  } finally {
    await session.endSession();
  }
};

const registerAdmin = async (payload: IAdmin) => {
  const isTaken = await isEmailTaken(payload.email);

  if (isTaken) {
    throw new AppError(
      HTTP_STATUS.CONFLICT,
      "An account with this email already exists."
    );
  }

  const createdAdmin = await Admin.create(payload);

  return createdAdmin;
};

const setAccessToken = async (refreshToken: string) => {
  const decoded = verifyRefreshToken(refreshToken);

  if (!decoded) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Invalid refresh token.");
  }

  const { id, email, role } = decoded as JwtPayload;

  const account = await getAccount({ jwtPayload: { id, email, role } });

  if (!account) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Invalid refresh token.");
  }

  const accessToken = generateAccessToken({ id, email, role });

  return accessToken;
};

const changePassword = async (
  user: JwtPayload,
  oldPassword: string,
  newPassword: string
) => {
  const account = await getAccount({ jwtPayload: user });

  const isPasswordMatch = await comparePassword(
    oldPassword,
    account.password as string
  );

  if (!isPasswordMatch) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Invalid credentials.");
  }

  account.password = newPassword;
  await account.save();
};

const sendResetOtp = async (email: string) => {
  const account = await getAccount({ email });

  if (!account) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Account not found.");
  }

  if (account.isVerified) {
    throw new AppError(HTTP_STATUS.CONFLICT, "Account is already verified.");
  }

  const otp = generateOtp();
  const hashedOtp = await hashOtp(otp);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  try {
    account.resetOtp = hashedOtp;
    account.resetOtpExpiryAt = expiresAt;
    const updatedAccount = await account.save();

    await sendMail({
      to: account.email,
      subject: "Verify your account",
      html: otpEmailTemplate({
        name: account.name,
        otp,
        action: "Verify Account",
      }),
    });

    return updatedAccount;
  } catch (error) {
    throw new AppError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Failed to send otp."
    );
  }
};

const verifyResetOtp = async (email: string, otp: string) => {
  const account = await getAccount({ email });

  if (!account) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Account not found.");
  }

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

  return isMatch;
};

const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  const account = await getAccount({ email });

  if (!account) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Account not found.");
  }

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

  return updatedAccount;
};

const sendVerifyOtp = async (email: string) => {
  const account = await getAccount({ email });

  if (!account) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Account not found.");
  }

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
    // to: account.email,
    to: "asmaulhosen33@gmail.com",
    subject: "Verify your account",
    html: otpEmailTemplate({
      name: account.name,
      otp,
      action: "Verify Account",
    }),
  });

  return updatedAccount;
};

const verifyAccount = async (email: string, otp: string) => {
  const account = await getAccount({ email });
  if (account.isVerified) {
    throw new AppError(HTTP_STATUS.CONFLICT, "Account is already verified.");
  }

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

  return updatedAccount;
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
