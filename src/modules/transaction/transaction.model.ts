import { model, Schema } from "mongoose";
import { ITransaction } from "./transaction.interface";
import {
  TransactionReference,
  TransactionStatus,
  TransactionType,
  UserRole,
} from "../../constants/enums";

const transactionSchema = new Schema<ITransaction>(
  {
    from: {
      type: Schema.Types.ObjectId,
      refPath: "fromModel",
      required: false,
    },

    fromModel: {
      type: String,
      enum: [UserRole.USER, UserRole.AGENT],
      required: false,
    },

    to: {
      type: Schema.Types.ObjectId,
      refPath: "toModel",
      required: false,
    },

    toModel: {
      type: String,
      enum: [UserRole.USER, UserRole.AGENT],
      required: false,
    },

    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    charge: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    commission: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    transactionId: {
      type: String,
      required: true,
      unique: true,
    },

    agent: {
      type: Schema.Types.ObjectId,
      ref: "Agent",
      required: false,
    },

    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
      required: true,
    },

    reference: {
      type: String,
      enum: Object.values(TransactionReference),
      required: false,
    },

    notes: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema
);
