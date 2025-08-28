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
};

const getAccount = async ({
  userId,
  walletId,
  email,
  phone,
  message,
}: Props) => {
  if (userId) {
    const userAccount = await User.findById(userId);
    if (userAccount) return userAccount;

    const agentAccount = await Agent.findById(userId);
    if (agentAccount) return agentAccount;

    const adminAccount = await Admin.findById(userId);
    if (adminAccount) return adminAccount;
  }

  if (walletId) {
    const userAccount = await User.findOne({ wallet: walletId });
    if (userAccount) return userAccount;

    const agentAccount = await Agent.findOne({ wallet: walletId });
    if (agentAccount) return agentAccount;
  }

  if (email) {
    const account =
      (await User.findOne({ email: email.toLowerCase() })) ||
      (await Agent.findOne({ email: email.toLowerCase() })) ||
      (await Admin.findOne({ email: email.toLowerCase() }));
    if (account) return account;
  }

  if (phone) {
    const account =
      (await User.findOne({ phone })) ||
      (await Agent.findOne({ phone })) ||
      (await Admin.findOne({ phone }));
    if (account) return account;
  }

  throw new AppError(HTTP_STATUS.NOT_FOUND, message || "Account not found.");
};

export default getAccount;
