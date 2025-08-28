import { Types } from "mongoose";
import { IWallet } from "../modules/wallet/wallet.interface";
import getAccount from "./getAccount";
import { Wallet } from "../modules/wallet/wallet.model";
import AppError from "../utils/appError";
import HTTP_STATUS from "../constants/httpStatus";

interface Props {
  userId?: Types.ObjectId;
  walletId?: Types.ObjectId;
  phone?: string;
  email?: string;
  message?: string;
}

const getWallet = async ({
  walletId,
  userId,
  email,
  phone,
  message,
}: Props): Promise<IWallet> => {
  let wallet: IWallet | null = null;

  if (walletId) {
    wallet = await Wallet.findById(walletId);
    if (wallet) return wallet;
  }

  if (userId) {
    wallet = await Wallet.findOne({ owner: userId });
    if (wallet) return wallet;
  }

  if (email || phone) {
    const account = await getAccount({ email, phone });

    if (account && account.wallet) {
      wallet = await Wallet.findById(account.wallet);
      if (wallet) return wallet;
    }
  }

  throw new AppError(HTTP_STATUS.NOT_FOUND, message || "Wallet not found.");
};

export default getWallet;
