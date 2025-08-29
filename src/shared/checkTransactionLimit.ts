import { Types } from "mongoose";
import { Limit } from "../modules/limit/limit.model";
import { Transaction } from "../modules/transaction/transaction.model";
import { UserRole } from "../constants/enums";
import AppError from "../utils/appError";
import HTTP_STATUS from "../constants/httpStatus";

interface CheckTransactionLimitProps {
  role: UserRole.USER | UserRole.AGENT;
  type: string;
  userId: Types.ObjectId;
  amount: number;
}

export const checkTransactionLimit = async ({
  role,
  type,
  userId,
  amount,
}: CheckTransactionLimitProps) => {
  const limit = await Limit.findOne({ role, type });

  if (!limit) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Limit not configured.");
  }

  if (amount < limit.minAmount) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      `Minimum transaction amount is ${limit.minAmount}`
    );
  }
  if (amount > limit.maxAmount) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      `Maximum transaction amount is ${limit.maxAmount}`
    );
  }

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const getTransactionSum = async (startDate: Date) => {
    const result = await Transaction.aggregate([
      {
        $match: {
          from: userId,
          type,
          createdAt: { $gte: startDate },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    return result[0]?.total || 0;
  };

  if (limit.dailyLimit) {
    const dailySum = await getTransactionSum(startOfDay);
    if (dailySum + amount > limit.dailyLimit) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        "Daily transaction limit exceeded"
      );
    }
  }

  if (limit.weeklyLimit) {
    const weeklySum = await getTransactionSum(startOfWeek);
    if (weeklySum + amount > limit.weeklyLimit) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        "Weekly transaction limit exceeded"
      );
    }
  }

  if (limit.monthlyLimit) {
    const monthlySum = await getTransactionSum(startOfMonth);
    if (monthlySum + amount > limit.monthlyLimit) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        "Monthly transaction limit exceeded"
      );
    }
  }
};
