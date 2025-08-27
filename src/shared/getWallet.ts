import { Types } from "mongoose";
import getAccount from "./getAccount";
import AppError from "../utils/appError";
import { JwtPayload } from "../interfaces";
import HTTP_STATUS from "../constants/httpStatus";
import { Wallet } from "../modules/wallet/wallet.model";
import { IWallet } from "../modules/wallet/wallet.interface";

interface GetWalletPayload {
  walletId?: Types.ObjectId;
  ownerId?: Types.ObjectId;
  email?: string;
  jwtPayload?: JwtPayload;
}

const getWallet = async ({
  walletId,
  ownerId,
  email,
  jwtPayload,
}: GetWalletPayload): Promise<IWallet> => {
  let wallet: IWallet | null = null;

  if (jwtPayload) {
    const account = await getAccount({ jwtPayload });
    wallet = await Wallet.findOne({ owner: account._id });
  } else if (walletId) {
    wallet = await Wallet.findById(walletId);
  } else if (ownerId) {
    wallet = await Wallet.findOne({ owner: ownerId });
  } else if (email) {
    const account = await getAccount({ email });
    wallet = await Wallet.findOne({ owner: account._id });
  }

  if (!wallet) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Wallet not found.");
  }

  return wallet;
};

export default getWallet;
