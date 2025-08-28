import { Types } from "mongoose";
import { TransactionType, UserRole } from "../../constants/enums";

export interface ILimit {
  _id?: Types.ObjectId;
  type: TransactionType;
  role: UserRole.USER | UserRole.AGENT;
  minAmount: number;
  maxAmount: number;
  dailyLimit?: number;
  weeklyLimit?: number;
  monthlyLimit?: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
