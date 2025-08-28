import { ObjectId, Types } from "mongoose";
import {
  TransactionReference,
  TransactionStatus,
  TransactionType,
  UserRole,
} from "../../constants/enums";

export interface ITransaction {
  _id?: Types.ObjectId;
  from?: Types.ObjectId;
  fromModel?: UserRole.USER | UserRole.AGENT;

  to?: Types.ObjectId;
  toModel?: UserRole.USER | UserRole.AGENT;

  type: TransactionType;

  amount: number;
  charge: number;
  commission: number;

  transactionId: string;
  agent?: Types.ObjectId;
  status: TransactionStatus;

  reference?: TransactionReference;
  notes?: string;

  createdAt?: Date;
  updatedAt?: Date;
}
