import { Types } from "mongoose";
import { Limit } from "../modules/limit/limit.model";
import { Transaction } from "../modules/transaction/transaction.model";
import { UserRole } from "../constants/enums";

export const checkTransactionLimit = async ({
  role,
  type,
  userId,
  amount,
}: {
  role: UserRole.USER | UserRole.AGENT;
  type: string;
  userId: Types.ObjectId;
  amount: number;
}) => {
  // 1. Find the relevant limit for this role + type
  const limit = await Limit.findOne({ role, type });
  if (!limit) throw new Error("Transaction limit not configured");

  // 2. Check min & max
  if (amount < limit.minAmount) {
    throw new Error(`Minimum transaction amount is ${limit.minAmount}`);
  }
  if (amount > limit.maxAmount) {
    throw new Error(`Maximum transaction amount is ${limit.maxAmount}`);
  }

  // 3. Time boundaries
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // 4. Aggregate sums
  const dailySum = await Transaction.aggregate([
    { $match: { from: userId, type } },
    { $match: { createdAt: { $gte: startOfDay } } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const weeklySum = await Transaction.aggregate([
    { $match: { from: userId, type } },
    { $match: { createdAt: { $gte: startOfWeek } } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const monthlySum = await Transaction.aggregate([
    { $match: { from: userId, type } },
    { $match: { createdAt: { $gte: startOfMonth } } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  // 5. Check against limits
  if (limit.dailyLimit && (dailySum[0]?.total || 0) + amount > limit.dailyLimit) {
    throw new Error("Daily transaction limit exceeded");
  }
  if (limit.weeklyLimit && (weeklySum[0]?.total || 0) + amount > limit.weeklyLimit) {
    throw new Error("Weekly transaction limit exceeded");
  }
  if ( limit.monthlyLimit && (monthlySum[0]?.total || 0) + amount > limit.monthlyLimit) {
    throw new Error("Monthly transaction limit exceeded");
  }

  return true;
};
