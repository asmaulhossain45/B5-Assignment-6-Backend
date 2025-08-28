import { UserRole } from "../../constants/enums";
import { IUser } from "../user/user.interface";

export interface IAdmin extends Omit<IUser, "role" | "wallet"> {
  role: UserRole.ADMIN | UserRole.SUPER_ADMIN;
}
