import { TransactionType, UserRole } from "../constants/enums";
import HTTP_STATUS from "../constants/httpStatus";
import getAccount from "../shared/getAccount";
import { IUser } from "../modules/user/user.interface";
import { IAgent } from "../modules/agent/agent.interface";
import AppError from "../utils/appError";

type Props = {
  senderEmail?: string;
  receiverEmail?: string;
  transactionType: TransactionType;
};

export const validateTransaction = async ({
  senderEmail,
  receiverEmail,
  transactionType,
}: Props) => {
  const senderAccount = await getAccount({ email: senderEmail });

  if (!senderAccount) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Sender account not found");
  }

  let receiverAccount = null;

  if (receiverEmail) {
    receiverAccount = await getAccount({ email: receiverEmail });
  }

  if (
    senderAccount.role === UserRole.ADMIN ||
    senderAccount.role === UserRole.SUPER_ADMIN ||
    receiverAccount?.role === UserRole.ADMIN ||
    receiverAccount?.role === UserRole.SUPER_ADMIN
  ) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      "Admins cannot send or receive money."
    );
  }

  const senderWithWallet = senderAccount as IUser | IAgent;
  if (!senderWithWallet.wallet) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Sender wallet not found");
  }

  let receiverWithWallet = receiverAccount as IUser | IAgent;
  if (receiverWithWallet && !receiverWithWallet.wallet) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Receiver wallet not found");
  }

  return {
    sender: {
      account: senderAccount,
      wallet: senderWithWallet.wallet,
    },
    receiver: {
      account: receiverAccount,
      wallet: receiverWithWallet?.wallet,
    },
  };
};
