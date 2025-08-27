import { User } from "./user.model";
import AppError from "../../utils/appError";
import { JwtPayload } from "../../interfaces";
import HTTP_STATUS from "../../constants/httpStatus";
import { ITransactionPayload } from "../transaction/transaction.interface";
import executeTransaction from "../../shared/executeTransaction";
import {
  TransactionDirection,
  TransactionReference,
  TransactionType,
} from "../../constants/enums";
import { QueryBuilder } from "../../utils/queryBuilder";
import getAccount from "../../shared/getAccount";
import getWallet from "../../shared/getWallet";
import { Transaction } from "../transaction/transaction.model";
import { IUser } from "./user.interface";
import { Types } from "mongoose";
import { validateTransaction } from "../../utils/validateTransaction";

const getUserProfile = async (payload: JwtPayload) => {
  const account = await getAccount({ jwtPayload: payload });

  return account;
};

const getUserWallet = async (payload: JwtPayload) => {
  const wallet = await getWallet({ jwtPayload: payload });

  return wallet;
};

const getTransactions = async (
  user: JwtPayload,
  query: Record<string, string>
) => {
  const wallet = await getWallet({ jwtPayload: user });
  const walletId = wallet._id;

  const searchableFields = ["type", "status"];

  const baseQuery = Transaction.find({
    $or: [{ senderWallet: walletId }, { receiverWallet: walletId }],
  });

  const queryBuilder = new QueryBuilder(baseQuery, query)
    .filter()
    .search(searchableFields)
    .sort()
    .fields()
    .paginate();

  const transactions = await queryBuilder.build();
  const meta = await queryBuilder.getMeta();

  return { data: transactions, meta };
};

const addMoney = async (
  amount: number,
  reference: TransactionReference,
  user: JwtPayload
) => {
  const { sender } = await validateTransaction({
    senderEmail: user.email,
    transactionType: TransactionType.ADD_MONEY,
  });

  const transactionPayload: ITransactionPayload = {
    receiverWallet: sender.wallet,
    amount: amount,
    isCharge: false,
    type: TransactionType.ADD_MONEY,
    directionForSender: TransactionDirection.NONE,
    directionForReceiver: TransactionDirection.CREDIT,
    initiator: {
      id: sender.account._id as Types.ObjectId,
      role: sender.account.role,
    },
    reference: reference,
  };

  const transaction = await executeTransaction(transactionPayload);

  return transaction;
};

const withdraw = async (
  amount: number,
  reference: TransactionReference,
  user: JwtPayload
) => {
  const { sender } = await validateTransaction({
    senderEmail: user.email,
    transactionType: TransactionType.WITHDRAW,
  });
  
  const transactionPayload: ITransactionPayload = {
    senderWallet: sender.wallet,
    amount: amount,
    isCharge: false,
    type: TransactionType.WITHDRAW,
    directionForSender: TransactionDirection.DEBIT,
    directionForReceiver: TransactionDirection.CREDIT,
    initiator: {
      id: sender.account._id as Types.ObjectId,
      role: sender.account.role,
    },
    reference: reference,
  };

  const transaction = await executeTransaction(transactionPayload);

  return transaction;
};

const sendMoney = async (
  amount: number,
  user: JwtPayload,
  receiverEmail: string
) => {
  const { sender, receiver } = await validateTransaction({
    senderEmail: user.email,
    receiverEmail,
    transactionType: TransactionType.SEND_MONEY,
  });

  const transactionPayload: ITransactionPayload = {
    senderWallet: sender.wallet,
    receiverWallet: receiver.wallet,
    amount: amount,
    isCharge: true,
    type: TransactionType.SEND_MONEY,
    directionForSender: TransactionDirection.DEBIT,
    directionForReceiver: TransactionDirection.CREDIT,
    initiator: {
      id: sender.account._id as Types.ObjectId,
      role: sender.account.role,
    },
  };

  const transaction = await executeTransaction(transactionPayload);

  return transaction;
};

const updateProfile = async (user: JwtPayload, payload: Partial<IUser>) => {
  const userId = user.id;

  const account = await getAccount({ jwtPayload: user });

  if (!account) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "User not found.");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: payload,
    },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "User update failed.");
  }

  return updatedUser;
};

export const userService = {
  getUserProfile,
  getUserWallet,
  getTransactions,
  addMoney,
  withdraw,
  sendMoney,
  updateProfile,
};
