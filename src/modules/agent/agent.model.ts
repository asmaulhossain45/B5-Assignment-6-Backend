import { model, Schema } from "mongoose";
import { hashPassword } from "../../utils/bcrypt";
import { Gender, UserRole, UserStatus } from "../../constants/enums";
import { IAgent } from "./agent.interface";

const agentSchema = new Schema<IAgent>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      immutable: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    dob: { type: Date },

    phone: { type: String, unique: true, sparse: true },

    gender: {
      type: String,
      enum: Object.values(Gender),
      lowercase: true,
    },

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

    location: {
      division: { type: String },
      district: { type: String },
      address: { type: String },
    },

    wallet: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.PENDING,
      index: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    resetOtp: { type: String },
    verifyOtp: { type: String },
    resetOtpExpiryAt: { type: Date },
    verifyOtpExpiryAt: { type: Date },

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
