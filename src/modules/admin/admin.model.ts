import { model, Schema } from "mongoose";
import { IAdmin } from "./admin.interface";
import { hashPassword } from "../../utils/bcrypt";
import { UserRole } from "../../constants/enums";
import { baseModelFields } from "../../shared/baseModelFields";

const adminSchema = new Schema<IAdmin>(
  {
    ...baseModelFields,
    role: {
      type: String,
      enum: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
      default: UserRole.ADMIN,
      immutable: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hashPassword(this.password);
  }
  next();
});

export const Admin = model<IAdmin>("Admin", adminSchema);
