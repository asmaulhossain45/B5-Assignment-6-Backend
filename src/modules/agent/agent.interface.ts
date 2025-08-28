import { Types } from "mongoose";
import { UserRole } from "../../constants/enums";
import { IUser } from "../user/user.interface";

export interface IAgent extends Omit<IUser, "role"> {
  role: UserRole.AGENT;

  businessName?: string;

  isApproved: boolean;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
}
