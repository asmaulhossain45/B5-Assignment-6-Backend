import { User } from "./user.model";
import AppError from "../../utils/appError";
import { JwtPayload } from "../../interfaces";
import HTTP_STATUS from "../../constants/httpStatus";
import { QueryBuilder } from "../../utils/queryBuilder";
import getAccount from "../../shared/getAccount";
import getWallet from "../../shared/getWallet";
import { Transaction } from "../transaction/transaction.model";
import { IUser } from "./user.interface";

const getUserProfile = async (payload: JwtPayload) => {
  const account = await getAccount({ userId: payload.id });

  return account;
};

const getUserWallet = async (payload: JwtPayload) => {
  const wallet = await getWallet({ userId: payload.id });

  return wallet;
};

const getTransactions = async (
  user: JwtPayload,
  query: Record<string, string>
) => {
  const wallet = await getWallet({ userId: user.id });
  const searchableFields = ["type", "status"];

  const baseQuery = Transaction.find({
    $or: [{ from: user.id }, { to: user.id }],
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

const updateProfile = async (user: JwtPayload, payload: Partial<IUser>) => {
  const userId = user.id;
  await getAccount({ userId });

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
  updateProfile,
};
