import { model, Schema } from "mongoose";
import { ILimit } from "./limit.interface";
import { TransactionType, UserRole } from "../../constants/enums";

const limitSchema = new Schema<ILimit>(
  {
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: [UserRole.USER, UserRole.AGENT],
      required: true,
      index: true,
    },

    minAmount: {
      type: Number,
      required: true,
    },

    maxAmount: {
      type: Number,
      required: true,
    },

    dailyLimit: {
      type: Number,
    },

    weeklyLimit: {
      type: Number,
    },

    monthlyLimit: {
      type: Number,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Limit = model<ILimit>("Limit", limitSchema);
