import { Agent } from "./agent.model";
import { IAgent } from "./agent.interface";
import AppError from "../../utils/appError";
import { JwtPayload } from "../../interfaces";
import getWallet from "../../shared/getWallet";
import getAccount from "../../shared/getAccount";
import HTTP_STATUS from "../../constants/httpStatus";
import { QueryBuilder } from "../../utils/queryBuilder";
import { Transaction } from "../transaction/transaction.model";
import mongoose, { Types } from "mongoose";

const getAgentProfile = async (payload: JwtPayload) => {
  const account = await getAccount({ userId: payload.id });
  return account;
};

const getAgentWallet = async (payload: JwtPayload) => {
  const wallet = await getWallet({ userId: payload.id });
  return wallet;
};

const getAgentTransactions = async (
  user: JwtPayload,
  query: Record<string, string>
) => {
  const wallet = await getWallet({ userId: user.id });
  const walletId = wallet._id;

  const searchableFields = ["type", "status"];

  const baseQuery = Transaction.find({
    $or: [{ from: walletId }, { to: walletId }],
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
  user: JwtPayload,
  query: Record<string, string>
) => {
  const objectId = new mongoose.Types.ObjectId(user.id);
  const baseQuery = Transaction.find({
    agent: objectId,
    commission: { $gt: 0 },
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

const updateAgentProfile = async (
  user: JwtPayload,
  payload: Partial<IAgent>
) => {
  const userId = user.id;
  await getAccount({ userId });

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
  getAgentProfile,
  getAgentWallet,
  getAgentTransactions,
  getCommisionHistory,
  updateAgentProfile,
};
