import { model, Schema } from "mongoose";
import { ICommission } from "./commission.interface";
import { TransactionType } from "../../constants/enums";

const commissionSchema = new Schema<ICommission>(
  {
    charge: {
      type: Number,
      required: true,
    },
    commission: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
      unique: true,
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

export const Commission = model<ICommission>(
  "Commission",
  commissionSchema
);
