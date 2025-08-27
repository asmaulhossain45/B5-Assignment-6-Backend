import {
  TransactionDirection,
  TransactionType,
  UserRole,
} from "../../constants/enums";
import { Agent } from "./agent.model";
import { IAgent } from "./agent.interface";
import AppError from "../../utils/appError";
import { JwtPayload } from "../../interfaces";
import getWallet from "../../shared/getWallet";
import getAccount from "../../shared/getAccount";
import HTTP_STATUS from "../../constants/httpStatus";
import { QueryBuilder } from "../../utils/queryBuilder";
import { Transaction } from "../transaction/transaction.model";
import executeTransaction from "../../shared/executeTransaction";
import { ITransactionPayload } from "../transaction/transaction.interface";
import mongoose, { Types } from "mongoose";
import { validateTransaction } from "../../utils/validateTransaction";

const getAgentProfile = async (payload: JwtPayload) => {
  const account = await getAccount({ jwtPayload: payload });
  return account;
};

const getAgentWallet = async (payload: JwtPayload) => {
  const wallet = await getWallet({ jwtPayload: payload });
  return wallet;
};

const getAgentTransactions = async (
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

const getCommisionHistory = async (
  id: string | Types.ObjectId,
  query: Record<string, string>
) => {
  const objectId = new mongoose.Types.ObjectId(id);
  const baseQuery = Transaction.find({
    "agent.id": objectId,
    "agent.commission": { $gt: 0 },
  });

  const querybuilder = new QueryBuilder(baseQuery, query)
    .filter()
    .sort()
    .fields()
    .paginate();

  const history = await querybuilder.build();
  const meta = await querybuilder.getMeta();

  return { data: history, meta };
};

const cashIn = async (amount: number, user: JwtPayload, receiverEmail: string) => {
  const { sender, receiver } = await validateTransaction({
    senderEmail: user.email,
    receiverEmail: receiverEmail,
    transactionType: TransactionType.CASH_IN,
  });

  const transactionPayload: ITransactionPayload = {
    senderWallet: sender.wallet,
    receiverWallet: receiver.wallet,
    amount: amount,
    isCharge: false,
    type: TransactionType.CASH_IN,
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

const cashOut = async (amount: number, user: JwtPayload, senderEmail: string) => {

  const {sender, receiver} = await validateTransaction({
    senderEmail,
    receiverEmail: user.email,
    transactionType: TransactionType.CASH_OUT
  })

  const transactionPayload: ITransactionPayload = {
    senderWallet: sender.wallet,
    receiverWallet: receiver.wallet,
    amount: amount,
    isCharge: true,
    agentId: receiver.account?._id,
    type: TransactionType.CASH_OUT,
    directionForSender: TransactionDirection.DEBIT,
    directionForReceiver: TransactionDirection.CREDIT,
    initiator: {
      id: receiver.account?._id as Types.ObjectId,
      role: receiver.account?.role as UserRole,
    },
  };
  const transaction = await executeTransaction(transactionPayload);
  return transaction;
};

const updateAgentProfile = async (
  user: JwtPayload,
  payload: Partial<IAgent>
) => {
  const userId = user.id;

  const account = await getAccount({ jwtPayload: user });

  if (!account) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Account not found.");
  }

  const updatedAgent = await Agent.findByIdAndUpdate(
    userId,
    {
      $set: payload,
    },
    { new: true, runValidators: true }
  );

  if (!updatedAgent) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Account update failed.");
  }

  return updatedAgent;
};

export const agentService = {
  cashIn,
  cashOut,
  getAgentProfile,
  getAgentWallet,
  getAgentTransactions,
  getCommisionHistory,
  updateAgentProfile,
};
