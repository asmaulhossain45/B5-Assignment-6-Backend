import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";
import { hashPassword } from "../../utils/bcrypt";
import { UserRole } from "../../constants/enums";
import { baseModelFields } from "../../shared/baseModelFields";

export const userSchema = new Schema<IUser>(
  {
    ...baseModelFields,
    role: {
      type: String,
      enum: [UserRole.USER],
      default: UserRole.USER,
      immutable: true,
      lowercase: true,
    },

    wallet: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await hashPassword(this.password);
  }
  next();
});

export const User = model<IUser>("User", userSchema);
