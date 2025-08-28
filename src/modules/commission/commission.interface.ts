import { Types } from "mongoose";
import { TransactionType } from "../../constants/enums";

export interface ICommission {
  _id?: Types.ObjectId;
  charge: number;
  commission: number;
  type: TransactionType;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
