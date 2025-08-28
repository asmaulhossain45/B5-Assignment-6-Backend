import { model, Schema } from "mongoose";
import { hashPassword } from "../../utils/bcrypt";
import { UserRole } from "../../constants/enums";
import { IAgent } from "./agent.interface";
import { baseModelFields } from "../../shared/baseModelFields";

const agentSchema = new Schema<IAgent>(
  {
    ...baseModelFields,

    role: {
      type: String,
      enum: [UserRole.AGENT],
      default: UserRole.AGENT,
      immutable: true,
      lowercase: true,
    },

    businessName: {
      type: String,
      maxlength: 50,
    },

    wallet: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      index: true,
    },

    isApproved: {
      type: Boolean,
      default: false,
      index: true,
    },

    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
    approvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

agentSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hashPassword(this.password);
  }
  next();
});

export const Agent = model<IAgent>("Agent", agentSchema);
