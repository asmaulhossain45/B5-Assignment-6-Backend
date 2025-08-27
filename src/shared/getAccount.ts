import { Types } from "mongoose";
import { JwtPayload } from "../interfaces";
import { UserRole, WalletType } from "../constants/enums";
import { User } from "../modules/user/user.model";
import { Admin } from "../modules/admin/admin.model";
import { Agent } from "../modules/agent/agent.model";
import { Wallet } from "../modules/wallet/wallet.model";
import AppError from "../utils/appError";
import HTTP_STATUS from "../constants/httpStatus";

interface GetAccountPayload {
  userId?: Types.ObjectId;
  walletId?: Types.ObjectId;
  email?: string;
  jwtPayload?: JwtPayload;
}

const getAccount = async ({
  userId,
  walletId,
  email,
  jwtPayload,
}: GetAccountPayload) => {
  let account = null;

  if (jwtPayload) {
    const { id, email, role } = jwtPayload;

    switch (role) {
      case UserRole.USER:
        account = await User.findOne({ _id: id, email });
        break;

      case UserRole.AGENT:
        account = await Agent.findOne({ _id: id, email });
        break;

      case UserRole.ADMIN:
      case UserRole.SUPER_ADMIN:
        account = await Admin.findOne({ _id: id, email });
        break;
    }
  } else if (walletId) {
    const wallet = await Wallet.findById(walletId);

    if (!wallet || !wallet?.owner) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, "Wallet or Owner not found.");
    }

    switch (wallet.type as WalletType) {
      case WalletType.PERSONAL:
        account = await User.findById(wallet.owner);
        break;

      case WalletType.AGENT:
        account = await Agent.findById(wallet.owner);
        break;

      case WalletType.SYSTEM:
        account = await Admin.findById(wallet.owner);
        break;
    }
  } else if (email || userId) {
    const query =
      userId && email
        ? { _id: userId, email }
        : userId
        ? { _id: userId }
        : { email };

    account =
      (await User.findOne(query)) ||
      (await Agent.findOne(query)) ||
      (await Admin.findOne(query));
  }

  if (!account) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Account not found.");
  }

  return account;
};

export default getAccount;
