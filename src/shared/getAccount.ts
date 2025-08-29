import { Types } from "mongoose";
import HTTP_STATUS from "../constants/httpStatus";
import { Admin } from "../modules/admin/admin.model";
import { Agent } from "../modules/agent/agent.model";
import { User } from "../modules/user/user.model";
import AppError from "../utils/appError";

type Props = {
  userId?: Types.ObjectId;
  walletId?: Types.ObjectId;
  email?: string;
  phone?: string;
  message?: string;
  includePassword?: boolean;
};

const getAccount = async ({
  userId,
  walletId,
  email,
  phone,
  message,
  includePassword,
}: Props) => {
  const projection: string = includePassword ? "+password" : "-password";

  if (userId) {
    const userAccount = await User.findById(userId).select(projection);
    if (userAccount) return userAccount;

    const agentAccount = await Agent.findById(userId).select(projection);
    if (agentAccount) return agentAccount;

    const adminAccount = await Admin.findById(userId).select(projection);
    if (adminAccount) return adminAccount;
  }

  if (walletId) {
    const userAccount = await User.findOne({ wallet: walletId }).select(
      projection
    );
    if (userAccount) return userAccount;

    const agentAccount = await Agent.findOne({ wallet: walletId }).select(
      projection
    );
    if (agentAccount) return agentAccount;
  }

  if (email) {
    const account =
      (await User.findOne({ email: email.toLowerCase() }).select(projection)) ||
      (await Agent.findOne({ email: email.toLowerCase() }).select(
        projection
      )) ||
      (await Admin.findOne({ email: email.toLowerCase() }).select(projection));
    if (account) return account;
  }

  if (phone) {
    const account =
      (await User.findOne({ phone }).select(projection)) ||
      (await Agent.findOne({ phone }).select(projection)) ||
      (await Admin.findOne({ phone }).select(projection));
    if (account) return account;
  }

  throw new AppError(HTTP_STATUS.NOT_FOUND, message || "Account not found.");
};

export default getAccount;
